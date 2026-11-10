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

    const verified = await verify(input.challengeToken);

    if (verified.user.id !== context.challenge.userId) {
      try {
        await this.sessions.revoke(verified.session.id);
      } catch {
        // The result is never returned when the account does not match.
      }

      throw new AuthMfaChallengeError();
    }

    const now = this.now();

    try {
      const consumed =
        await this.storage.update<AuthStepUpChallengeStorageRecord>(
          this.collectionName,
          context.challenge.id,
          {
            consumedAt: now,
            updatedAt: now,
          },
          {
            expectedRevision: context.challenge.revision,
          },
        );

      if (!consumed) {
        throw new StorageConflictError(
          "The step-up challenge was already consumed.",
        );
      }
    } catch (error) {
      try {
        await this.sessions.revoke(verified.session.id);
      } catch (revokeError) {
        throw new AuthSessionError(
          "Could not revoke a temporary step-up session.",
          { cause: revokeError },
        );
      }

      throw new AuthMfaChallengeError({ cause: error });
    }

    let replacement: Awaited<ReturnType<SessionManager["create"]>>;

    try {
      replacement = await this.sessions.create({
        userId: context.challenge.userId,
        kind: "authenticated",
        metadata: {
          authenticationMethod: input.method,
          mfaVerifiedAt: now.toISOString(),
          stepUpVerifiedAt: now.toISOString(),
          stepUpOfSessionId: context.session.id,
        },
      });
    } catch (error) {
      try {
        await this.sessions.revoke(verified.session.id);
      } catch {
        // The temporary token remains server-only and is never returned.
      }

      throw new AuthSessionError(
        "Could not create the upgraded authentication session.",
        { cause: error },
      );
    }

    try {
      await this.sessions.revoke(verified.session.id);
      await this.sessions.revoke(context.session.id);
    } catch (error) {
      try {
        await this.sessions.revoke(replacement.session.id);
      } catch (revokeError) {
        throw new AuthSessionError(
          "Could not revoke an incomplete step-up session.",
          { cause: revokeError },
        );
      }

      throw new AuthSessionError(
        "Could not replace the previous authentication session.",
        { cause: error },
      );
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
