import {
  StorageConflictError,
  type StorageAdapter,
  type StorageCollection,
  type StorageRecord,
} from "@puzzle-ui/storage";

import type { SessionManager, SessionRecord } from "@puzzle-ui/session";

import {
  AuthConfigurationError,
  AuthMfaChallengeError,
  AuthMfaFactorError,
  AuthProviderError,
  AuthSessionError,
} from "./errors/auth.errors";

import type { AuthResult, AuthSession } from "./types/auth-manager.types";

import type {
  AuthMfaPendingResult,
  PasskeyMfaStarted,
} from "./types/mfa.types";

import { generateAuthId, hashAuthToken } from "./utils/auth-crypto.utils";

import type { StorageAuthMfaManager } from "./auth.mfa.manager";

export const AUTH_MFA_STEP_UP_COLLECTION = "auth_mfa_step_up_challenges";

export type AuthStepUpChallengeStorageRecord = StorageRecord & {
  readonly challengeId: string;
  readonly tokenHash: string;
  readonly userId: string;
  readonly sessionId: string;
  readonly expiresAt: Date;
  readonly consumedAt: Date | null;
};

export type AuthStepUpManagerOptions = {
  readonly collectionName?: string;
  readonly clock?: () => Date;
};

export type StorageAuthStepUpManagerDependencies = {
  readonly storage: StorageAdapter;
  readonly sessions: SessionManager;
  readonly mfa: StorageAuthMfaManager;
};

export type BeginStepUpInput = {
  readonly sessionToken: string;
  readonly ipAddress: string;
};

export type CompleteStepUpInput = {
  readonly challengeToken: string;
  readonly sessionToken: string;
  readonly code: string;
  readonly ipAddress: string;
};

export type BeginStepUpPasskeyInput = {
  readonly challengeToken: string;
  readonly sessionToken: string;
  readonly ipAddress: string;
};

export type FinishStepUpPasskeyInput = {
  readonly challengeToken: string;
  readonly sessionToken: string;
  readonly response: unknown;
  readonly ipAddress: string;
};

export type AuthStepUpPendingState = {
  readonly status: "step-up-pending";
  readonly challengeId: string;
  readonly expiresAt: Date;
};

type PendingContext = {
  readonly challenge: AuthStepUpChallengeStorageRecord;
  readonly session: SessionRecord;
};

type MfaVerification = (challengeToken: string) => Promise<AuthResult>;

const stepUpCollection: StorageCollection<AuthStepUpChallengeStorageRecord> = {
  name: AUTH_MFA_STEP_UP_COLLECTION,
  indexes: [
    {
      name: "step_up_token_hash_unique",
      fields: ["tokenHash"],
      unique: true,
    },
    {
      name: "step_up_session_expiration",
      fields: ["sessionId", "expiresAt"],
    },
    {
      name: "step_up_user_expiration",
      fields: ["userId", "expiresAt"],
    },
  ],
};

const toPublicSession = (session: SessionRecord): AuthSession => {
  if (session.kind !== "authenticated" || !session.userId) {
    throw new AuthSessionError("A step-up session must be authenticated.");
  }

  return {
    id: session.id,
    userId: session.userId,
    kind: "authenticated",
    createdAt: session.createdAt,
    lastSeenAt: session.lastSeenAt,
    expiresAt: session.expiresAt,
    revokedAt: session.revokedAt,
  };
};

export class StorageAuthStepUpManager {
  private readonly storage: StorageAdapter;
  private readonly sessions: SessionManager;
  private readonly mfa: StorageAuthMfaManager;

  private readonly collectionName: string;
  private readonly clock: () => Date;

  private initialized = false;
  private initializationPromise: Promise<void> | null = null;

  constructor(
    dependencies: StorageAuthStepUpManagerDependencies,
    options: AuthStepUpManagerOptions = {},
  ) {
    this.storage = dependencies.storage;
    this.sessions = dependencies.sessions;
    this.mfa = dependencies.mfa;

    this.collectionName = options.collectionName ?? AUTH_MFA_STEP_UP_COLLECTION;

    this.clock = options.clock ?? (() => new Date());

    if (!this.collectionName || this.collectionName.trim().length === 0) {
      throw new AuthConfigurationError(
        "A valid MFA step-up collection name is required.",
      );
    }
  }

  async initialize(): Promise<void> {
    if (!this.initializationPromise) {
      const initialization = (async () => {
        if (
          !this.storage.capabilities.uniqueConstraints ||
          !this.storage.capabilities.conditionalWrites ||
          !this.storage.capabilities.atomicBatch
        ) {
          throw new AuthConfigurationError(
            "MFA step-up requires unique constraints, conditional writes and atomic batches.",
          );
        }

        await this.storage.registerCollection({
          ...stepUpCollection,
          name: this.collectionName,
        });

        this.initialized = true;
      })();

      this.initializationPromise = initialization.catch((error) => {
        this.initializationPromise = null;
        this.initialized = false;
        throw error;
      });
    }

    return this.initializationPromise;
  }

  private assertInitialized(): void {
    if (!this.initialized) {
      throw new AuthConfigurationError(
        "The MFA step-up manager must be initialized before use.",
      );
    }
  }

  private now(): Date {
    const value = this.clock();

    if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
      throw new AuthConfigurationError(
        "The configured step-up clock returned an invalid date.",
      );
    }

    return value;
  }

  private async getAuthenticatedSession(
    sessionToken: string,
  ): Promise<SessionRecord> {
    if (typeof sessionToken !== "string" || sessionToken.length === 0) {
      throw new AuthSessionError("An authenticated session is required.");
    }

    let session: SessionRecord | null;

    try {
      session = await this.sessions.validate(sessionToken);
    } catch (error) {
      throw new AuthSessionError("Could not validate the step-up session.", {
        cause: error,
      });
    }

    if (
      !session ||
      session.kind !== "authenticated" ||
      !session.userId ||
      session.revokedAt !== null ||
      session.expiresAt.getTime() <= this.now().getTime()
    ) {
      throw new AuthSessionError("An authenticated session is required.");
    }

    return session;
  }

  private async findChallenge(
    challengeToken: string,
  ): Promise<AuthStepUpChallengeStorageRecord | null> {
    if (
      typeof challengeToken !== "string" ||
      !/^[a-f0-9]{64}$/i.test(challengeToken)
    ) {
      return null;
    }

    const tokenHash = await hashAuthToken(challengeToken);

    return this.storage.findOne<AuthStepUpChallengeStorageRecord>(
      this.collectionName,
      {
        where: {
          tokenHash: {
            operator: "eq",
            value: tokenHash,
          },
        },
      },
    );
  }

  private async getPendingContext(
    challengeToken: string,
    sessionToken: string,
  ): Promise<PendingContext> {
    const challenge = await this.findChallenge(challengeToken);

    if (
      !challenge ||
      challenge.consumedAt !== null ||
      challenge.expiresAt.getTime() <= this.now().getTime()
    ) {
      throw new AuthMfaChallengeError();
    }

    const session = await this.getAuthenticatedSession(sessionToken);

    if (
      session.id !== challenge.sessionId ||
      session.userId !== challenge.userId
    ) {
      throw new AuthMfaChallengeError();
    }

    return {
      challenge,
      session,
    };
  }

  async beginStepUp(input: BeginStepUpInput): Promise<AuthMfaPendingResult> {
    this.assertInitialized();

    const session = await this.getAuthenticatedSession(input.sessionToken);

    const challenge = await this.mfa.createSignInChallenge({
      userId: session.userId!,
      ipAddress: input.ipAddress,
    });

    if (!challenge) {
      throw new AuthMfaFactorError(
        "An active MFA factor is required for step-up authentication.",
      );
    }

    const now = this.now();

    const record: AuthStepUpChallengeStorageRecord = {
      id: generateAuthId("mfa-step-up"),
      challengeId: challenge.challengeId,
      tokenHash: await hashAuthToken(challenge.challengeToken),
      userId: session.userId!,
      sessionId: session.id,
      expiresAt: challenge.expiresAt,
      consumedAt: null,
      createdAt: now,
      updatedAt: now,
      revision: 1,
    };

    try {
      await this.storage.insert<AuthStepUpChallengeStorageRecord>(
        this.collectionName,
        record,
      );
    } catch (error) {
      throw new AuthProviderError("Could not persist the step-up challenge.", {
        cause: error,
      });
    }

    return challenge;
  }

  async getPendingAuthState(
    challengeToken: string,
    sessionToken: string,
  ): Promise<AuthStepUpPendingState | null> {
    this.assertInitialized();

    const challenge = await this.findChallenge(challengeToken);

    if (
      !challenge ||
      challenge.consumedAt !== null ||
      challenge.expiresAt.getTime() <= this.now().getTime()
    ) {
      return null;
    }

    let session: SessionRecord;

    try {
      session = await this.getAuthenticatedSession(sessionToken);
    } catch {
      return null;
    }

    if (
      session.id !== challenge.sessionId ||
      session.userId !== challenge.userId
    ) {
      return null;
    }

    const mfaState = await this.mfa.getPendingAuthState(challengeToken);

    if (
      !mfaState ||
      mfaState.status !== "mfa-pending" ||
      mfaState.challengeId !== challenge.challengeId
    ) {
      return null;
    }

    return {
      status: "step-up-pending",
      challengeId: challenge.challengeId,
      expiresAt: challenge.expiresAt,
    };
  }

  async beginPasskey(
    input: BeginStepUpPasskeyInput,
  ): Promise<PasskeyMfaStarted> {
    this.assertInitialized();

    await this.getPendingContext(input.challengeToken, input.sessionToken);

    return this.mfa.beginPasskeyMfa(input.challengeToken, input.ipAddress);
  }

  private async consumeChallenge(
    challenge: AuthStepUpChallengeStorageRecord,
  ): Promise<void> {
    const now = this.now();

    try {
      const consumed =
        await this.storage.update<AuthStepUpChallengeStorageRecord>(
          this.collectionName,
          challenge.id,
          {
            consumedAt: now,
            updatedAt: now,
          },
          {
            expectedRevision: challenge.revision,
          },
        );

      if (!consumed) {
        throw new StorageConflictError(
          "The step-up challenge was already consumed.",
        );
      }
    } catch (error) {
      throw new AuthMfaChallengeError({ cause: error });
    }
  }

  private async revokeTemporarySession(sessionId: string): Promise<void> {
    try {
      await this.sessions.revoke(sessionId);
    } catch (error) {
      throw new AuthSessionError(
        "Could not revoke the temporary MFA verification session.",
        { cause: error },
      );
    }
  }

  private async completeStepUp(
    input: {
      readonly challengeToken: string;
      readonly sessionToken: string;
      readonly method: string;
      readonly ipAddress: string;
    },
    verify: MfaVerification,
  ): Promise<AuthResult> {
    this.assertInitialized();

    const context = await this.getPendingContext(
      input.challengeToken,
      input.sessionToken,
    );

    // The MFA manager consumes its own challenge and creates a short-lived
    // internal session after successful factor verification. That token is
    // never returned to the caller.
    const verified = await verify(input.challengeToken);

    if (verified.user.id !== context.challenge.userId) {
      await this.revokeTemporarySession(verified.session.id);
      throw new AuthMfaChallengeError();
    }

    // Consume the step-up wrapper challenge before rotating the original
    // session. Conditional revision checking ensures that concurrent
    // requests cannot both proceed to session rotation.
    try {
      await this.consumeChallenge(context.challenge);
    } catch (error) {
      try {
        await this.revokeTemporarySession(verified.session.id);
      } catch (revokeError) {
        throw new AuthSessionError(
          "The step-up challenge failed and its temporary session could not be revoked.",
          { cause: revokeError },
        );
      }

      throw error;
    }

    const now = this.now();

    let replacement: Awaited<ReturnType<SessionManager["rotate"]>>;

    try {
      // SessionManager.rotate() atomically inserts the replacement session
      // and revokes the original session in a single storage batch.
      replacement = await this.sessions.rotate({
        sessionId: context.session.id,
        metadata: {
          ...(context.session.metadata ?? {}),
          authenticationMethod: input.method,
          mfaVerifiedAt: now.toISOString(),
          stepUpVerifiedAt: now.toISOString(),
          stepUpOfSessionId: context.session.id,
        },
      });
    } catch (error) {
      try {
        await this.revokeTemporarySession(verified.session.id);
      } catch (revokeError) {
        throw new AuthSessionError(
          "Session rotation failed and the temporary MFA session could not be revoked.",
          { cause: revokeError },
        );
      }

      throw new AuthSessionError(
        "Could not atomically rotate the session after step-up verification.",
        { cause: error },
      );
    }

    // The temporary session created by the MFA manager is not the session
    // returned to the application. Revoke it after the original session has
    // been atomically rotated.
    try {
      await this.revokeTemporarySession(verified.session.id);
    } catch (error) {
      try {
        await this.sessions.revoke(replacement.session.id);
      } catch (revokeError) {
        throw new AuthSessionError(
          "Could not revoke the replacement session after temporary-session cleanup failed.",
          { cause: revokeError },
        );
      }

      throw error;
    }

    return {
      user: verified.user,
      session: toPublicSession(replacement.session),
      token: replacement.token,
    };
  }

  async verifyTotp(input: CompleteStepUpInput): Promise<AuthResult> {
    return this.completeStepUp(
      {
        ...input,
        method: "totp",
      },
      (challengeToken) =>
        this.mfa.verifySignInTotp({
          challengeToken,
          code: input.code,
          ipAddress: input.ipAddress,
        }),
    );
  }

  async verifyRecoveryCode(input: CompleteStepUpInput): Promise<AuthResult> {
    return this.completeStepUp(
      {
        ...input,
        method: "recovery-code",
      },
      (challengeToken) =>
        this.mfa.verifySignInRecoveryCode({
          challengeToken,
          code: input.code,
          ipAddress: input.ipAddress,
        }),
    );
  }

  async finishPasskey(input: FinishStepUpPasskeyInput): Promise<AuthResult> {
    await this.getPendingContext(input.challengeToken, input.sessionToken);

    return this.completeStepUp(
      {
        challengeToken: input.challengeToken,
        sessionToken: input.sessionToken,
        ipAddress: input.ipAddress,
        method: "passkey",
      },
      (challengeToken) =>
        this.mfa.finishPasskeyMfa({
          challengeToken,
          response: input.response,
          ipAddress: input.ipAddress,
        }),
    );
  }
}
