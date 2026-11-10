import {
  StorageConflictError,
  StorageDuplicateError,
  type StorageAdapter,
  type StorageBatchOperation,
} from "@puzzle-ui/storage";

import type { SessionManager, SessionRecord } from "@puzzle-ui/session";

import type {
  PasswordHasher,
  RateLimitProvider,
} from "./providers/provider.types";

import type {
  AuthSecretProtector,
  ProtectedAuthSecret,
  WebAuthnProvider,
  WebAuthnRegistrationCredential,
  WebAuthnRegistrationVerification,
  WebAuthnAuthenticationVerification,
} from "./providers/mfa-provider.types";

import type {
  AuthMfaManagerOptions,
  AuthMfaFactor,
  AuthMfaFactorStorageRecord,
  AuthMfaChallengeStorageRecord,
  AuthRecoveryCodeStorageRecord,
  AuthMfaPendingResult,
  AuthMfaGateway,
  BeginTotpEnrollmentInput,
  TotpEnrollmentStarted,
  VerifyTotpEnrollmentInput,
  MfaEnrollmentCompleted,
  BeginPasskeyRegistrationInput,
  PasskeyRegistrationStarted,
  FinishPasskeyRegistrationInput,
  BeginPasskeySignInInput,
  PasskeySignInStarted,
  CompleteMfaSignInInput,
  PasskeyMfaStarted,
  PasskeyMfaCompletedInput,
  RemoveMfaFactorInput,
  RegenerateRecoveryCodesInput,
  AuthMfaAvailableFactor,
} from "./types/mfa.types";

import type { AuthSession, AuthResult } from "./types/auth-manager.types";

import type { AuthAuditEventStorageRecord } from "./types/auth-lifecycle.types";

import type { AuthUser } from "./types/user.types";

import {
  AUTH_AUDIT_COLLECTION,
  AUTH_CREDENTIAL_COLLECTION,
  AUTH_USER_COLLECTION,
  AUTH_MFA_FACTOR_COLLECTION,
  AUTH_MFA_CHALLENGE_COLLECTION,
  AUTH_RECOVERY_CODE_COLLECTION,
  initializeAuthStorage,
  type AuthUserStorageRecord,
} from "./auth.storage";

import {
  AuthConfigurationError,
  AuthEmailVerificationRequiredError,
  AuthInvalidCredentialsError,
  AuthMfaChallengeError,
  AuthMfaFactorError,
  AuthProviderError,
  AuthRateLimitError,
  AuthSessionError,
  AuthValidationError,
} from "./errors/auth.errors";

import {
  generateAuthId,
  generateSecureAuthToken,
  hashAuthToken,
  createRateLimitKey,
} from "./utils/auth-crypto.utils";

import {
  createTotpUri,
  generateTotpSecret,
  verifyTotpCode,
} from "./utils/totp.utils";

import type { PasswordCredentialStorageRecord } from "./types/credential.types";

type MfaStorageRecord =
  | AuthMfaFactorStorageRecord
  | AuthMfaChallengeStorageRecord
  | AuthRecoveryCodeStorageRecord
  | AuthAuditEventStorageRecord
  | AuthUserStorageRecord
  | PasswordCredentialStorageRecord;

type AuthenticatedContext = {
  readonly session: SessionRecord;
  readonly user: AuthUserStorageRecord;
};

type RecoveryCodeBundle = {
  readonly codes: readonly string[];
  readonly records: readonly AuthRecoveryCodeStorageRecord[];
};

type FactorUpdate = {
  readonly factor: AuthMfaFactorStorageRecord;
  readonly changes: {
    readonly lastUsedAt?: Date;
    readonly lastUsedStep?: number | null;
    readonly counter?: number;
    readonly updatedAt: Date;
  };
};

const DEFAULT_CHALLENGE_LIFETIME_SECONDS = 5 * 60;
const DEFAULT_RECOVERY_CODE_COUNT = 10;
const DEFAULT_MAXIMUM_CHALLENGE_ATTEMPTS = 5;

const DEFAULT_TOTP = {
  digits: 6,
  periodSeconds: 30,
  window: 1,
} as const;

const whereEquals = <const T>(value: T) => ({
  operator: "eq" as const,
  value,
});

const toPublicUser = (record: AuthUserStorageRecord): AuthUser => ({
  id: record.id,
  email: record.email,
  emailVerifiedAt: record.emailVerifiedAt,
  name: record.name,
  image: record.image,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
});

const toPublicSession = (record: SessionRecord): AuthSession => {
  if (record.kind !== "authenticated" || !record.userId) {
    throw new AuthSessionError(
      "An authenticated session must contain a user ID.",
    );
  }

  return {
    id: record.id,
    userId: record.userId,
    kind: "authenticated",
    createdAt: record.createdAt,
    lastSeenAt: record.lastSeenAt,
    expiresAt: record.expiresAt,
    revokedAt: record.revokedAt,
  };
};

const toPublicFactor = (record: AuthMfaFactorStorageRecord): AuthMfaFactor => ({
  id: record.id,
  type: record.type,
  status: record.status,
  label: record.label,
  createdAt: record.createdAt,
  lastUsedAt: record.lastUsedAt,
});

const normalizeRecoveryCode = (value: string): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.replace(/[\s-]/g, "").toUpperCase();

  return /^[A-F0-9]{32}$/.test(normalized) ? normalized : null;
};

const generateRecoveryCode = (): string => {
  const raw = generateSecureAuthToken().slice(0, 32).toUpperCase();

  return raw.match(/.{4}/g)!.join("-");
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const getCredentialId = (response: unknown): string => {
  if (
    !isRecord(response) ||
    typeof response.id !== "string" ||
    response.id.length === 0 ||
    response.id.length > 2048
  ) {
    throw new AuthMfaChallengeError();
  }

  return response.id;
};

/**
 * Encodes random bytes using unpadded base64url.
 * Does not depend on Node.js Buffer or browser btoa.
 */
const encodeBase64Url = (bytes: Uint8Array): string => {
  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

  let result = "";
  let index = 0;

  while (index + 2 < bytes.length) {
    const a = bytes[index++]!;
    const b = bytes[index++]!;
    const c = bytes[index++]!;

    result += alphabet.charAt(a >> 2);
    result += alphabet.charAt(((a & 3) << 4) | (b >> 4));
    result += alphabet.charAt(((b & 15) << 2) | (c >> 6));
    result += alphabet.charAt(c & 63);
  }

  if (index < bytes.length) {
    const a = bytes[index++]!;

    result += alphabet.charAt(a >> 2);

    if (index < bytes.length) {
      const b = bytes[index]!;

      result += alphabet.charAt(((a & 3) << 4) | (b >> 4));
      result += alphabet.charAt((b & 15) << 2);
    } else {
      result += alphabet.charAt((a & 3) << 4);
    }
  }

  return result;
};

const generateWebAuthnChallenge = (): string => {
  const cryptoApi = globalThis.crypto;

  if (!cryptoApi?.getRandomValues) {
    throw new AuthConfigurationError(
      "This runtime does not provide the required Web Crypto APIs.",
    );
  }

  const bytes = new Uint8Array(32);
  cryptoApi.getRandomValues(bytes);

  return encodeBase64Url(bytes);
};

const validateLabel = (label: string | undefined, fallback: string): string => {
  const value = label === undefined ? fallback : label.trim();

  if (typeof value !== "string" || value.length === 0 || value.length > 64) {
    throw new AuthValidationError(
      "The authentication factor label must contain between 1 and 64 characters.",
    );
  }

  return value;
};

export type StorageAuthMfaManagerDependencies = {
  readonly storage: StorageAdapter;
  readonly sessions: SessionManager;
  readonly passwordHasher: PasswordHasher;
  readonly rateLimitProvider: RateLimitProvider;
  readonly secretProtector: AuthSecretProtector;
  readonly webAuthnProvider?: WebAuthnProvider;
};

export class StorageAuthMfaManager implements AuthMfaGateway {
  private readonly storage: StorageAdapter;
  private readonly sessions: SessionManager;
  private readonly passwordHasher: PasswordHasher;
  private readonly rateLimitProvider: RateLimitProvider;
  private readonly secretProtector: AuthSecretProtector;
  private readonly webAuthnProvider: WebAuthnProvider | null;

  private readonly usersCollection: string;
  private readonly credentialsCollection: string;
  private readonly auditCollection: string;

  private readonly factorsCollection: string;
  private readonly challengesCollection: string;
  private readonly recoveryCodesCollection: string;

  private readonly rateLimitKeySecret: string;
  private readonly challengeLifetimeSeconds: number;
  private readonly recoveryCodeCount: number;
  private readonly issuer: string;

  private readonly totp: {
    readonly digits: number;
    readonly periodSeconds: number;
    readonly window: number;
  };

  private readonly webAuthn: {
    readonly rpId: string;
    readonly rpName: string;
    readonly origin: string;
  } | null;

  private readonly requireVerifiedEmail: boolean;
  private readonly clock: () => Date;

  private initialized = false;
  private initializationPromise: Promise<void> | null = null;

  constructor(
    dependencies: StorageAuthMfaManagerDependencies,
    options: AuthMfaManagerOptions,
  ) {
    this.storage = dependencies.storage;
    this.sessions = dependencies.sessions;
    this.passwordHasher = dependencies.passwordHasher;
    this.rateLimitProvider = dependencies.rateLimitProvider;
    this.secretProtector = dependencies.secretProtector;
    this.webAuthnProvider = dependencies.webAuthnProvider ?? null;

    if (
      typeof options.rateLimitKeySecret !== "string" ||
      options.rateLimitKeySecret.length < 32
    ) {
      throw new AuthConfigurationError(
        "rateLimitKeySecret must contain at least 32 characters.",
      );
    }

    this.rateLimitKeySecret = options.rateLimitKeySecret;

    this.usersCollection = options.usersCollection ?? AUTH_USER_COLLECTION;

    this.credentialsCollection =
      options.credentialsCollection ?? AUTH_CREDENTIAL_COLLECTION;

    this.auditCollection = options.auditCollection ?? AUTH_AUDIT_COLLECTION;

    this.factorsCollection =
      options.factorsCollection ?? AUTH_MFA_FACTOR_COLLECTION;

    this.challengesCollection =
      options.challengesCollection ?? AUTH_MFA_CHALLENGE_COLLECTION;

    this.recoveryCodesCollection =
      options.recoveryCodesCollection ?? AUTH_RECOVERY_CODE_COLLECTION;

    this.challengeLifetimeSeconds =
      options.challengeLifetimeSeconds ?? DEFAULT_CHALLENGE_LIFETIME_SECONDS;

    this.recoveryCodeCount =
      options.recoveryCodeCount ?? DEFAULT_RECOVERY_CODE_COUNT;

    this.issuer = options.issuer ?? "Puzzle Auth";

    this.totp = {
      ...DEFAULT_TOTP,
      ...options.totp,
    };

    this.webAuthn = options.webAuthn ?? null;

    this.requireVerifiedEmail = options.requireVerifiedEmail ?? false;

    this.clock = options.clock ?? (() => new Date());

    if (
      !Number.isInteger(this.challengeLifetimeSeconds) ||
      this.challengeLifetimeSeconds < 30 ||
      this.challengeLifetimeSeconds > 600
    ) {
      throw new AuthConfigurationError(
        "MFA challenge lifetime must be between 30 and 600 seconds.",
      );
    }

    if (
      !Number.isInteger(this.recoveryCodeCount) ||
      this.recoveryCodeCount < 5 ||
      this.recoveryCodeCount > 20
    ) {
      throw new AuthConfigurationError(
        "Recovery code count must be between 5 and 20.",
      );
    }

    if (
      !Number.isInteger(this.totp.digits) ||
      this.totp.digits < 6 ||
      this.totp.digits > 8 ||
      !Number.isInteger(this.totp.periodSeconds) ||
      this.totp.periodSeconds < 15 ||
      this.totp.periodSeconds > 120 ||
      !Number.isInteger(this.totp.window) ||
      this.totp.window < 0 ||
      this.totp.window > 2
    ) {
      throw new AuthConfigurationError("The TOTP configuration is invalid.");
    }

    if (Boolean(this.webAuthn) !== Boolean(this.webAuthnProvider)) {
      throw new AuthConfigurationError(
        "WebAuthn configuration and WebAuthnProvider must be supplied together.",
      );
    }

    if (this.webAuthn) {
      this.validateWebAuthnConfiguration(this.webAuthn);
    }
  }

  async revokeChallenges(userId: string): Promise<void> {
    this.assertInitialized();

    if (typeof userId !== "string" || userId.trim().length === 0) {
      throw new AuthValidationError("A valid user ID is required.");
    }

    const challenges =
      await this.storage.findMany<AuthMfaChallengeStorageRecord>(
        this.challengesCollection,
        {
          where: {
            userId: whereEquals(userId),
            purpose: whereEquals("sign-in"),
            consumedAt: whereEquals(null),
          },
        },
      );

    if (challenges.length === 0) {
      return;
    }

    const now = this.now();

    const operations: StorageBatchOperation<MfaStorageRecord>[] =
      challenges.map((challenge) => ({
        type: "update",
        collection: this.challengesCollection,
        id: challenge.id,
        condition: {
          expectedRevision: challenge.revision,
        },
        changes: {
          consumedAt: now,
          updatedAt: now,
        },
      }));

    try {
      await this.storage.atomicBatch<MfaStorageRecord>(operations);
    } catch (error) {
      throw new AuthProviderError("Could not revoke pending MFA challenges.", {
        cause: error,
      });
    }
  }

  private validateWebAuthnConfiguration(config: {
    readonly rpId: string;
    readonly rpName: string;
    readonly origin: string;
  }): void {
    let origin: URL;

    try {
      origin = new URL(config.origin);
    } catch {
      throw new AuthConfigurationError("WebAuthn origin must be a valid URL.");
    }

    const isLocalhost =
      origin.hostname === "localhost" ||
      origin.hostname === "127.0.0.1" ||
      origin.hostname === "[::1]";

    if (
      origin.origin !== config.origin ||
      (origin.protocol !== "https:" && !isLocalhost)
    ) {
      throw new AuthConfigurationError(
        "WebAuthn requires an exact HTTPS origin, except for localhost development.",
      );
    }

    if (
      origin.hostname !== config.rpId &&
      !origin.hostname.endsWith(`.${config.rpId}`)
    ) {
      throw new AuthConfigurationError(
        "The WebAuthn RP ID must be the origin hostname or a parent domain.",
      );
    }

    if (config.rpName.trim().length === 0 || config.rpId.trim().length === 0) {
      throw new AuthConfigurationError(
        "WebAuthn RP name and RP ID are required.",
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
            "MFA requires unique constraints, conditional writes and atomic batches.",
          );
        }

        await initializeAuthStorage(this.storage, {
          usersCollection: this.usersCollection,
          credentialsCollection: this.credentialsCollection,
          auditCollection: this.auditCollection,
          factorsCollection: this.factorsCollection,
          challengesCollection: this.challengesCollection,
          recoveryCodesCollection: this.recoveryCodesCollection,
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
        "MFA manager must be initialized before use.",
      );
    }
  }

  private now(): Date {
    const value = this.clock();

    if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
      throw new AuthConfigurationError(
        "The configured MFA clock returned an invalid date.",
      );
    }

    return value;
  }

  private async enforceRateLimit(
    action: string,
    ipAddress: string,
    userId?: string,
  ): Promise<void> {
    if (
      typeof ipAddress !== "string" ||
      ipAddress.trim().length === 0 ||
      ipAddress.trim().length > 128
    ) {
      throw new AuthValidationError("A valid client IP address is required.");
    }

    const sensitiveVerification = action.includes("verify");

    const rule = sensitiveVerification
      ? { limit: 5, windowSeconds: 300 }
      : { limit: 10, windowSeconds: 900 };

    const scopes: readonly {
      readonly type: "ip" | "user";
      readonly value: string;
    }[] = [
      {
        type: "ip",
        value: ipAddress.trim(),
      },
      ...(userId
        ? [
            {
              type: "user" as const,
              value: userId,
            },
          ]
        : []),
    ];

    for (const scope of scopes) {
      const key = await createRateLimitKey(
        this.rateLimitKeySecret,
        `auth:mfa:${action}:${scope.type}:${scope.value}`,
      );

      let result: Awaited<ReturnType<RateLimitProvider["consume"]>>;

      try {
        result = await this.rateLimitProvider.consume({
          key,
          limit: rule.limit,
          windowSeconds: rule.windowSeconds,
        });
      } catch (error) {
        throw new AuthProviderError("The MFA rate limiter is unavailable.", {
          cause: error,
        });
      }

      if (
        !result ||
        typeof result.allowed !== "boolean" ||
        !(result.resetAt instanceof Date) ||
        !Number.isFinite(result.resetAt.getTime())
      ) {
        throw new AuthProviderError(
          "The MFA rate limiter returned an invalid result.",
        );
      }

      if (!result.allowed) {
        throw new AuthRateLimitError(result.resetAt);
      }
    }
  }

  private createAuditRecord(
    action: AuthAuditEventStorageRecord["action"],
    userId: string | null,
    metadata?: AuthAuditEventStorageRecord["metadata"],
    sessionId: string | null = null,
  ): AuthAuditEventStorageRecord {
    const now = this.now();

    return {
      id: generateAuthId("auth-audit"),
      action,
      userId,
      sessionId,
      metadata,
      createdAt: now,
      updatedAt: now,
      revision: 1,
    };
  }

  private async getAuthenticatedContext(
    sessionToken: string,
  ): Promise<AuthenticatedContext> {
    if (typeof sessionToken !== "string" || sessionToken.length === 0) {
      throw new AuthSessionError("An authenticated session is required.");
    }

    let session: SessionRecord | null;

    try {
      session = await this.sessions.validate(sessionToken);
    } catch (error) {
      throw new AuthSessionError("Could not validate the session.", {
        cause: error,
      });
    }

    if (!session || session.kind !== "authenticated" || !session.userId) {
      throw new AuthSessionError("An authenticated session is required.");
    }

    const user = await this.storage.findById<AuthUserStorageRecord>(
      this.usersCollection,
      session.userId,
    );

    if (!user || user.deactivatedAt !== null) {
      throw new AuthSessionError("The authenticated account is unavailable.");
    }

    if (
      user.sessionsInvalidatedAt &&
      session.createdAt.getTime() <= user.sessionsInvalidatedAt.getTime()
    ) {
      throw new AuthSessionError("The session is no longer valid.");
    }

    if (this.requireVerifiedEmail && !user.emailVerifiedAt) {
      throw new AuthEmailVerificationRequiredError();
    }

    return { session, user };
  }

  private async verifyCurrentPassword(
    userId: string,
    password: string,
  ): Promise<void> {
    if (typeof password !== "string" || password.length === 0) {
      throw new AuthValidationError(
        "The current password is required for this operation.",
      );
    }

    const credential =
      await this.storage.findOne<PasswordCredentialStorageRecord>(
        this.credentialsCollection,
        {
          where: {
            userId: whereEquals(userId),
            kind: whereEquals("password"),
          },
        },
      );

    if (!credential || credential.revokedAt !== null) {
      throw new AuthInvalidCredentialsError();
    }

    let valid: boolean;

    try {
      valid = await this.passwordHasher.verify(
        password,
        credential.passwordHash,
      );
    } catch (error) {
      throw new AuthProviderError("Password verification failed.", {
        cause: error,
      });
    }

    if (!valid) {
      throw new AuthInvalidCredentialsError();
    }
  }

  private async findActiveFactors(
    userId: string,
  ): Promise<readonly AuthMfaFactorStorageRecord[]> {
    return this.storage.findMany<AuthMfaFactorStorageRecord>(
      this.factorsCollection,
      {
        where: {
          userId: whereEquals(userId),
          status: whereEquals("active"),
        },
      },
    );
  }

  private async getSignInSnapshot(
    challenge: AuthMfaChallengeStorageRecord,
  ): Promise<{
    readonly user: AuthUserStorageRecord;
    readonly credential: PasswordCredentialStorageRecord;
  } | null> {
    if (
      challenge.purpose !== "sign-in" ||
      !challenge.userId ||
      challenge.userRevision === null ||
      challenge.credentialRevision === null
    ) {
      return null;
    }

    const user = await this.storage.findById<AuthUserStorageRecord>(
      this.usersCollection,
      challenge.userId,
    );

    const credential =
      await this.storage.findOne<PasswordCredentialStorageRecord>(
        this.credentialsCollection,
        {
          where: {
            userId: whereEquals(challenge.userId),
            kind: whereEquals("password"),
          },
        },
      );

    if (
      !user ||
      user.deactivatedAt !== null ||
      user.revision !== challenge.userRevision ||
      !credential ||
      credential.revokedAt !== null ||
      credential.revision !== challenge.credentialRevision
    ) {
      return null;
    }

    return { user, credential };
  }

  private async createChallengeRecord(
    purpose: AuthMfaChallengeStorageRecord["purpose"],
    userId: string | null,
    factorIds: readonly string[],
    webAuthnChallenge: string | null = null,
    metadata: {
      readonly factorLabel?: string | null;
      readonly userRevision?: number | null;
      readonly credentialRevision?: number | null;
    } = {},
  ): Promise<{
    readonly record: AuthMfaChallengeStorageRecord;
    readonly token: string;
  }> {
    const now = this.now();
    const token = generateSecureAuthToken();

    const record: AuthMfaChallengeStorageRecord = {
      id: generateAuthId("mfa-challenge"),
      purpose,
      userId,
      tokenHash: await hashAuthToken(token),
      factorIds,
      webAuthnFactorIds: [],
      webAuthnChallenge,
      factorLabel: metadata.factorLabel ?? null,
      userRevision: metadata.userRevision ?? null,
      credentialRevision: metadata.credentialRevision ?? null,
      attemptCount: 0,
      maximumAttempts: DEFAULT_MAXIMUM_CHALLENGE_ATTEMPTS,
      expiresAt: new Date(now.getTime() + this.challengeLifetimeSeconds * 1000),
      consumedAt: null,
      createdAt: now,
      updatedAt: now,
      revision: 1,
    };

    return { record, token };
  }

  private async getChallenge(
    token: string,
    purpose: AuthMfaChallengeStorageRecord["purpose"],
  ): Promise<AuthMfaChallengeStorageRecord> {
    if (typeof token !== "string" || token.length === 0) {
      throw new AuthMfaChallengeError();
    }

    const tokenHash = await hashAuthToken(token);

    const record = await this.storage.findOne<AuthMfaChallengeStorageRecord>(
      this.challengesCollection,
      {
        where: {
          tokenHash: whereEquals(tokenHash),
        },
      },
    );

    if (
      !record ||
      record.purpose !== purpose ||
      record.consumedAt !== null ||
      record.expiresAt.getTime() <= this.now().getTime() ||
      record.attemptCount >= record.maximumAttempts
    ) {
      throw new AuthMfaChallengeError();
    }

    if (purpose === "sign-in" && !(await this.getSignInSnapshot(record))) {
      throw new AuthMfaChallengeError();
    }

    return record;
  }

  async createSignInChallenge(input: {
    readonly userId: string;
    readonly ipAddress: string;
  }): Promise<AuthMfaPendingResult | null> {
    this.assertInitialized();

    await this.enforceRateLimit("challenge", input.ipAddress, input.userId);

    const factors = await this.findActiveFactors(input.userId);

    if (factors.length === 0) {
      return null;
    }

    const recoveryCodeCount =
      await this.storage.count<AuthRecoveryCodeStorageRecord>(
        this.recoveryCodesCollection,
        {
          where: {
            userId: whereEquals(input.userId),
            consumedAt: whereEquals(null),
          },
        },
      );

    const availableFactors = new Set<"totp" | "passkey" | "recovery-code">();

    for (const factor of factors) {
      if (factor.type === "totp") {
        availableFactors.add("totp");
      }

      if (factor.type === "passkey") {
        availableFactors.add("passkey");
      }
    }

    if (recoveryCodeCount > 0) {
      availableFactors.add("recovery-code");
    }

    const user = await this.storage.findById<AuthUserStorageRecord>(
      this.usersCollection,
      input.userId,
    );

    const credential =
      await this.storage.findOne<PasswordCredentialStorageRecord>(
        this.credentialsCollection,
        {
          where: {
            userId: whereEquals(input.userId),
            kind: whereEquals("password"),
          },
        },
      );

    if (
      !user ||
      user.deactivatedAt !== null ||
      !credential ||
      credential.revokedAt !== null
    ) {
      throw new AuthMfaChallengeError();
    }

    const created = await this.createChallengeRecord(
      "sign-in",
      input.userId,
      factors.map((factor) => factor.id),
      null,
      {
        userRevision: user.revision,
        credentialRevision: credential.revision,
      },
    );

    const audit = this.createAuditRecord(
      "mfa-challenge-created",
      input.userId,
      {
        factors: factors.length,
      },
    );

    try {
      await this.storage.atomicBatch<MfaStorageRecord>([
        {
          type: "insert",
          collection: this.challengesCollection,
          record: created.record,
        },
        {
          type: "insert",
          collection: this.auditCollection,
          record: audit,
        },
      ]);
    } catch (error) {
      throw new AuthProviderError("Could not create the MFA challenge.", {
        cause: error,
      });
    }

    return {
      status: "mfa-pending",
      challengeId: created.record.id,
      challengeToken: created.token,
      expiresAt: created.record.expiresAt,
      availableFactors: [...availableFactors],
    };
  }

  async getPendingAuthState(token: string) {
    this.assertInitialized();

    if (typeof token !== "string" || token.length === 0) {
      return null;
    }

    const tokenHash = await hashAuthToken(token);

    const challenge = await this.storage.findOne<AuthMfaChallengeStorageRecord>(
      this.challengesCollection,
      {
        where: {
          tokenHash: whereEquals(tokenHash),
        },
      },
    );

    if (
      !challenge ||
      challenge.purpose !== "sign-in" ||
      !challenge.userId ||
      challenge.consumedAt !== null ||
      challenge.expiresAt.getTime() <= this.now().getTime() ||
      challenge.attemptCount >= challenge.maximumAttempts
    ) {
      return null;
    }

    if (!(await this.getSignInSnapshot(challenge))) {
      return null;
    }

    return {
      status: "mfa-pending" as const,
      userId: challenge.userId,
      challengeId: challenge.id,
      expiresAt: challenge.expiresAt,
    };
  }

  async getAvailableFactors(
    challengeToken: string,
  ): Promise<readonly AuthMfaAvailableFactor[]> {
    this.assertInitialized();

    const challenge = await this.getChallenge(challengeToken, "sign-in");

    if (!challenge.userId) {
      throw new AuthMfaChallengeError();
    }

    const factors = await this.findActiveFactors(challenge.userId);

    // A factor added after challenge creation cannot be used to complete
    // this challenge. Only the original factor snapshot is accepted.
    const challengeFactors = factors.filter((factor) =>
      challenge.factorIds.includes(factor.id),
    );

    const available = new Set<AuthMfaAvailableFactor>();

    for (const factor of challengeFactors) {
      available.add(factor.type);
    }

    const recoveryCodes =
      await this.storage.findMany<AuthRecoveryCodeStorageRecord>(
        this.recoveryCodesCollection,
        {
          where: {
            userId: whereEquals(challenge.userId),
            consumedAt: whereEquals(null),
          },
        },
      );

    if (
      recoveryCodes.some((record) =>
        challenge.factorIds.includes(record.factorId),
      )
    ) {
      available.add("recovery-code");
    }

    return [...available];
  }

  private async failChallenge(
    challenge: AuthMfaChallengeStorageRecord,
    method: string,
  ): Promise<never> {
    const now = this.now();
    const nextAttempt = challenge.attemptCount + 1;

    const operations: StorageBatchOperation<MfaStorageRecord>[] = [
      {
        type: "update",
        collection: this.challengesCollection,
        id: challenge.id,
        condition: {
          expectedRevision: challenge.revision,
        },
        changes: {
          attemptCount: nextAttempt,
          consumedAt: nextAttempt >= challenge.maximumAttempts ? now : null,
          updatedAt: now,
        },
      },
      {
        type: "insert",
        collection: this.auditCollection,
        record: this.createAuditRecord(
          "mfa-challenge-failed",
          challenge.userId,
          {
            method,
            attempt: nextAttempt,
          },
        ),
      },
    ];

    try {
      await this.storage.atomicBatch<MfaStorageRecord>(operations);
    } catch (error) {
      throw new AuthMfaChallengeError({ cause: error });
    }

    throw new AuthMfaChallengeError();
  }

  private async createRecoveryCodeBundle(
    userId: string,
    factorId: string,
    force = false,
  ): Promise<RecoveryCodeBundle> {
    if (!force) {
      const existing = await this.storage.count<AuthRecoveryCodeStorageRecord>(
        this.recoveryCodesCollection,
        {
          where: {
            userId: whereEquals(userId),
            consumedAt: whereEquals(null),
          },
        },
      );

      if (existing > 0) {
        return { codes: [], records: [] };
      }
    }

    const codes: string[] = [];
    const records: AuthRecoveryCodeStorageRecord[] = [];
    const now = this.now();

    for (let index = 0; index < this.recoveryCodeCount; index++) {
      const code = generateRecoveryCode();
      const normalized = normalizeRecoveryCode(code)!;

      codes.push(code);

      records.push({
        id: generateAuthId("recovery-code"),
        userId,
        factorId,
        codeHash: await hashAuthToken(normalized),
        consumedAt: null,
        createdAt: now,
        updatedAt: now,
        revision: 1,
      });
    }

    return { codes, records };
  }

  private async getRecoveryCodeRecord(
    userId: string,
    code: string,
  ): Promise<AuthRecoveryCodeStorageRecord | null> {
    const normalized = normalizeRecoveryCode(code);

    if (!normalized) {
      return null;
    }

    const codeHash = await hashAuthToken(normalized);

    return this.storage.findOne<AuthRecoveryCodeStorageRecord>(
      this.recoveryCodesCollection,
      {
        where: {
          userId: whereEquals(userId),
          codeHash: whereEquals(codeHash),
          consumedAt: whereEquals(null),
        },
      },
    );
  }

  private async createAuthenticatedResult(
    userId: string,
    metadata: Readonly<Record<string, unknown>>,
  ): Promise<{
    readonly result: AuthResult;
    readonly sessionId: string;
  }> {
    const user = await this.storage.findById<AuthUserStorageRecord>(
      this.usersCollection,
      userId,
    );

    if (!user || user.deactivatedAt !== null) {
      throw new AuthMfaChallengeError();
    }

    if (this.requireVerifiedEmail && !user.emailVerifiedAt) {
      throw new AuthEmailVerificationRequiredError();
    }

    try {
      const created = await this.sessions.create({
        userId,
        kind: "authenticated",
        metadata,
      });

      return {
        sessionId: created.session.id,
        result: {
          user: toPublicUser(user),
          session: toPublicSession(created.session),
          token: created.token,
        },
      };
    } catch (error) {
      throw new AuthSessionError(
        "Could not create a session after MFA verification.",
        { cause: error },
      );
    }
  }

  /**
   * Atomically consumes the challenge and the verified factor state.
   *
   * A session is created before the batch, but its raw token is never
   * returned until the batch has successfully committed.
   */
  private async completeChallenge(input: {
    readonly challenge: AuthMfaChallengeStorageRecord;
    readonly userId: string;
    readonly method: string;
    readonly factorUpdate?: FactorUpdate;
    readonly recoveryCode?: AuthRecoveryCodeStorageRecord;
    readonly auditAction?: AuthAuditEventStorageRecord["action"];
  }): Promise<AuthResult> {
    const now = this.now();

    const signInSnapshot =
      input.challenge.purpose === "sign-in"
        ? await this.getSignInSnapshot(input.challenge)
        : null;

    if (input.challenge.purpose === "sign-in" && !signInSnapshot) {
      throw new AuthMfaChallengeError();
    }

    const authenticated = await this.createAuthenticatedResult(input.userId, {
      authenticationMethod: input.method,
      mfaVerifiedAt: now.toISOString(),
    });

    const operations: StorageBatchOperation<MfaStorageRecord>[] = [
      {
        type: "update",
        collection: this.challengesCollection,
        id: input.challenge.id,
        condition: {
          expectedRevision: input.challenge.revision,
        },
        changes: {
          consumedAt: now,
          updatedAt: now,
        },
      },
    ];

    if (input.factorUpdate) {
      operations.push({
        type: "update",
        collection: this.factorsCollection,
        id: input.factorUpdate.factor.id,
        condition: {
          expectedRevision: input.factorUpdate.factor.revision,
        },
        changes: input.factorUpdate.changes,
      });
    }

    if (input.recoveryCode) {
      operations.push({
        type: "update",
        collection: this.recoveryCodesCollection,
        id: input.recoveryCode.id,
        condition: {
          expectedRevision: input.recoveryCode.revision,
        },
        changes: {
          consumedAt: now,
          updatedAt: now,
        },
      });
    }

    if (signInSnapshot) {
      operations.push(
        {
          type: "update",
          collection: this.usersCollection,
          id: signInSnapshot.user.id,
          condition: {
            expectedRevision: signInSnapshot.user.revision,
          },
          changes: {
            updatedAt: signInSnapshot.user.updatedAt,
          },
        },
        {
          type: "update",
          collection: this.credentialsCollection,
          id: signInSnapshot.credential.id,
          condition: {
            expectedRevision: signInSnapshot.credential.revision,
          },
          changes: {
            updatedAt: signInSnapshot.credential.updatedAt,
            passwordUpdatedAt: signInSnapshot.credential.passwordUpdatedAt,
          },
        },
      );
    }

    operations.push({
      type: "insert",
      collection: this.auditCollection,
      record: this.createAuditRecord(
        input.auditAction ??
          (input.method === "passkey"
            ? "passkey-authenticated"
            : "mfa-completed"),
        input.userId,
        {
          method: input.method,
        },
        authenticated.sessionId,
      ),
    });

    try {
      await this.storage.atomicBatch<MfaStorageRecord>(operations);
    } catch (error) {
      try {
        await this.sessions.revoke(authenticated.sessionId);
      } catch (revokeError) {
        throw new AuthSessionError(
          "Could not revoke an uncommitted MFA session.",
          { cause: revokeError },
        );
      }

      if (
        error instanceof StorageConflictError ||
        error instanceof StorageDuplicateError
      ) {
        throw new AuthMfaChallengeError({ cause: error });
      }

      throw new AuthProviderError("Could not complete MFA authentication.", {
        cause: error,
      });
    }

    return authenticated.result;
  }

  async beginTotpEnrollment(
    input: BeginTotpEnrollmentInput,
  ): Promise<TotpEnrollmentStarted> {
    this.assertInitialized();

    const context = await this.getAuthenticatedContext(input.sessionToken);

    await this.verifyCurrentPassword(context.user.id, input.currentPassword);

    await this.enforceRateLimit("enrollment", input.ipAddress, context.user.id);

    const secret = generateTotpSecret();

    let protectedSecret: ProtectedAuthSecret;

    try {
      protectedSecret = await this.secretProtector.encrypt(secret);
    } catch (error) {
      throw new AuthProviderError("Could not encrypt the TOTP secret.", {
        cause: error,
      });
    }

    if (
      !protectedSecret ||
      typeof protectedSecret.ciphertext !== "string" ||
      protectedSecret.ciphertext.length === 0 ||
      typeof protectedSecret.iv !== "string" ||
      protectedSecret.iv.length === 0 ||
      typeof protectedSecret.keyId !== "string" ||
      protectedSecret.keyId.length === 0
    ) {
      throw new AuthProviderError(
        "The secret protector returned an invalid encrypted secret.",
      );
    }

    const now = this.now();
    const factorId = generateAuthId("mfa-factor");
    const expiresAt = new Date(
      now.getTime() + this.challengeLifetimeSeconds * 1000,
    );

    const factor: AuthMfaFactorStorageRecord = {
      id: factorId,
      userId: context.user.id,
      factorKey: `totp:${factorId}`,
      type: "totp",
      status: "pending",
      label: validateLabel(input.label, "Authenticator app"),
      secret: protectedSecret,
      credentialId: null,
      publicKey: null,
      counter: 0,
      transports: [],
      lastUsedStep: null,
      lastUsedAt: null,
      expiresAt,
      createdAt: now,
      updatedAt: now,
      revision: 1,
    };

    const operations: StorageBatchOperation<MfaStorageRecord>[] = [
      {
        type: "insert",
        collection: this.factorsCollection,
        record: factor,
      },
      {
        type: "insert",
        collection: this.auditCollection,
        record: this.createAuditRecord(
          "mfa-factor-added",
          context.user.id,
          {
            type: "totp",
            status: "pending",
          },
          context.session.id,
        ),
      },
    ];

    try {
      await this.storage.atomicBatch<MfaStorageRecord>(operations);
    } catch (error) {
      throw new AuthProviderError("Could not create the pending TOTP factor.", {
        cause: error,
      });
    }

    return {
      factorId,
      secret,
      otpauthUrl: createTotpUri({
        issuer: this.issuer,
        account: context.user.email,
        secret,
        digits: this.totp.digits,
        periodSeconds: this.totp.periodSeconds,
      }),
      expiresAt,
    };
  }

  async verifyTotpEnrollment(
    input: VerifyTotpEnrollmentInput,
  ): Promise<MfaEnrollmentCompleted> {
    this.assertInitialized();

    const context = await this.getAuthenticatedContext(input.sessionToken);

    await this.enforceRateLimit(
      "verify-enrollment",
      input.ipAddress,
      context.user.id,
    );

    const factor = await this.storage.findById<AuthMfaFactorStorageRecord>(
      this.factorsCollection,
      input.factorId,
    );

    if (
      !factor ||
      factor.userId !== context.user.id ||
      factor.type !== "totp" ||
      factor.status !== "pending" ||
      !factor.secret ||
      !factor.expiresAt ||
      factor.expiresAt.getTime() <= this.now().getTime()
    ) {
      throw new AuthMfaFactorError(
        "The pending TOTP enrollment is invalid or expired.",
      );
    }

    let secret: string;

    try {
      secret = await this.secretProtector.decrypt(factor.secret);
    } catch (error) {
      throw new AuthProviderError("Could not decrypt the TOTP secret.", {
        cause: error,
      });
    }

    const now = this.now();

    const matchedStep = await verifyTotpCode(
      secret,
      input.code,
      now.getTime(),
      this.totp,
    );

    if (matchedStep === null) {
      throw new AuthMfaFactorError("The authenticator code is invalid.");
    }

    const recovery = await this.createRecoveryCodeBundle(
      context.user.id,
      factor.id,
    );

    const activatedFactor: AuthMfaFactorStorageRecord = {
      ...factor,
      status: "active",
      lastUsedStep: matchedStep,
      lastUsedAt: now,
      expiresAt: null,
      updatedAt: now,
      revision: factor.revision + 1,
    };

    const operations: StorageBatchOperation<MfaStorageRecord>[] = [
      {
        type: "update",
        collection: this.factorsCollection,
        id: factor.id,
        condition: {
          expectedRevision: factor.revision,
        },
        changes: {
          status: "active",
          lastUsedStep: matchedStep,
          lastUsedAt: now,
          expiresAt: null,
          updatedAt: now,
        },
      },
      ...recovery.records.map((record) => ({
        type: "insert" as const,
        collection: this.recoveryCodesCollection,
        record,
      })),
      {
        type: "insert",
        collection: this.auditCollection,
        record: this.createAuditRecord(
          "mfa-factor-added",
          context.user.id,
          {
            type: "totp",
            recoveryCodesGenerated: recovery.codes.length,
          },
          context.session.id,
        ),
      },
    ];

    try {
      await this.storage.atomicBatch<MfaStorageRecord>(operations);
    } catch (error) {
      if (error instanceof StorageConflictError) {
        throw new AuthMfaFactorError(
          "The TOTP enrollment has already been completed.",
          { cause: error },
        );
      }

      throw new AuthProviderError("Could not activate the TOTP factor.", {
        cause: error,
      });
    }

    return {
      factor: toPublicFactor(activatedFactor),
      recoveryCodes: recovery.codes,
    };
  }

  async verifySignInTotp(input: CompleteMfaSignInInput): Promise<AuthResult> {
    this.assertInitialized();

    const challenge = await this.getChallenge(input.challengeToken, "sign-in");

    if (!challenge.userId) {
      throw new AuthMfaChallengeError();
    }

    await this.enforceRateLimit(
      "verify-totp",
      input.ipAddress,
      challenge.userId,
    );

    for (const factorId of challenge.factorIds) {
      const factor = await this.storage.findById<AuthMfaFactorStorageRecord>(
        this.factorsCollection,
        factorId,
      );

      if (
        !factor ||
        factor.userId !== challenge.userId ||
        factor.status !== "active" ||
        factor.type !== "totp" ||
        !factor.secret
      ) {
        continue;
      }

      let secret: string;

      try {
        secret = await this.secretProtector.decrypt(factor.secret);
      } catch (error) {
        throw new AuthProviderError("Could not decrypt the TOTP secret.", {
          cause: error,
        });
      }

      const now = this.now();

      const matchedStep = await verifyTotpCode(
        secret,
        input.code,
        now.getTime(),
        this.totp,
      );

      if (
        matchedStep === null ||
        (factor.lastUsedStep !== null && matchedStep <= factor.lastUsedStep)
      ) {
        continue;
      }

      return this.completeChallenge({
        challenge,
        userId: challenge.userId,
        method: "totp",
        factorUpdate: {
          factor,
          changes: {
            lastUsedStep: matchedStep,
            lastUsedAt: now,
            updatedAt: now,
          },
        },
      });
    }

    return this.failChallenge(challenge, "totp");
  }

  async verifySignInRecoveryCode(
    input: CompleteMfaSignInInput,
  ): Promise<AuthResult> {
    this.assertInitialized();

    const challenge = await this.getChallenge(input.challengeToken, "sign-in");

    if (!challenge.userId) {
      throw new AuthMfaChallengeError();
    }

    await this.enforceRateLimit(
      "verify-recovery",
      input.ipAddress,
      challenge.userId,
    );

    const recoveryCode = await this.getRecoveryCodeRecord(
      challenge.userId,
      input.code,
    );

    if (!recoveryCode) {
      return this.failChallenge(challenge, "recovery-code");
    }

    if (!challenge.factorIds.length) {
      throw new AuthMfaChallengeError();
    }

    const factor = await this.storage.findById<AuthMfaFactorStorageRecord>(
      this.factorsCollection,
      recoveryCode.factorId,
    );

    if (
      !factor ||
      factor.userId !== challenge.userId ||
      factor.status !== "active" ||
      !challenge.factorIds.includes(factor.id)
    ) {
      return this.failChallenge(challenge, "recovery-code");
    }

    return this.completeChallenge({
      challenge,
      userId: challenge.userId,
      method: "recovery-code",
      recoveryCode,
    });
  }

  async listFactors(sessionToken: string): Promise<readonly AuthMfaFactor[]> {
    this.assertInitialized();

    const context = await this.getAuthenticatedContext(sessionToken);

    const factors = await this.storage.findMany<AuthMfaFactorStorageRecord>(
      this.factorsCollection,
      {
        where: {
          userId: whereEquals(context.user.id),
        },
        orderBy: [
          {
            field: "createdAt",
            direction: "asc",
          },
        ],
      },
    );

    return factors.map(toPublicFactor);
  }

  async getRecoveryCodeCount(sessionToken: string): Promise<number> {
    this.assertInitialized();

    const context = await this.getAuthenticatedContext(sessionToken);

    return this.storage.count<AuthRecoveryCodeStorageRecord>(
      this.recoveryCodesCollection,
      {
        where: {
          userId: whereEquals(context.user.id),
          consumedAt: whereEquals(null),
        },
      },
    );
  }

  async regenerateRecoveryCodes(
    input: RegenerateRecoveryCodesInput,
  ): Promise<readonly string[]> {
    this.assertInitialized();

    const context = await this.getAuthenticatedContext(input.sessionToken);

    await this.verifyCurrentPassword(context.user.id, input.currentPassword);

    await this.enforceRateLimit(
      "regenerate-recovery",
      input.ipAddress,
      context.user.id,
    );

    const factors = await this.findActiveFactors(context.user.id);

    if (factors.length === 0) {
      throw new AuthMfaFactorError(
        "An active MFA factor is required to generate recovery codes.",
      );
    }

    const existing = await this.storage.findMany<AuthRecoveryCodeStorageRecord>(
      this.recoveryCodesCollection,
      {
        where: {
          userId: whereEquals(context.user.id),
          consumedAt: whereEquals(null),
        },
      },
    );

    const firstFactor = factors[0];

    if (!firstFactor) {
      throw new AuthMfaFactorError(
        "An active MFA factor is required to generate recovery codes.",
      );
    }

    const bundle = await this.createRecoveryCodeBundle(
      context.user.id,
      firstFactor.id,
      true,
    );

    const operations: StorageBatchOperation<MfaStorageRecord>[] = [
      ...existing.map((record) => ({
        type: "delete" as const,
        collection: this.recoveryCodesCollection,
        id: record.id,
        condition: {
          expectedRevision: record.revision,
        },
      })),
      ...bundle.records.map((record) => ({
        type: "insert" as const,
        collection: this.recoveryCodesCollection,
        record,
      })),
      {
        type: "insert",
        collection: this.auditCollection,
        record: this.createAuditRecord(
          "mfa-recovery-codes-regenerated",
          context.user.id,
          {
            count: bundle.records.length,
          },
          context.session.id,
        ),
      },
    ];

    try {
      await this.storage.atomicBatch<MfaStorageRecord>(operations);
    } catch (error) {
      throw new AuthProviderError("Could not regenerate recovery codes.", {
        cause: error,
      });
    }

    return bundle.codes;
  }

  async removeFactor(input: RemoveMfaFactorInput): Promise<void> {
    this.assertInitialized();

    const context = await this.getAuthenticatedContext(input.sessionToken);

    await this.verifyCurrentPassword(context.user.id, input.currentPassword);

    await this.enforceRateLimit(
      "remove-factor",
      input.ipAddress,
      context.user.id,
    );

    const factor = await this.storage.findById<AuthMfaFactorStorageRecord>(
      this.factorsCollection,
      input.factorId,
    );

    if (!factor || factor.userId !== context.user.id) {
      throw new AuthMfaFactorError();
    }

    const recoveryCodes =
      await this.storage.findMany<AuthRecoveryCodeStorageRecord>(
        this.recoveryCodesCollection,
        {
          where: {
            factorId: whereEquals(factor.id),
          },
        },
      );

    const pendingChallenges =
      await this.storage.findMany<AuthMfaChallengeStorageRecord>(
        this.challengesCollection,
        {
          where: {
            userId: whereEquals(context.user.id),
            purpose: whereEquals("sign-in"),
            consumedAt: whereEquals(null),
          },
        },
      );

    const now = this.now();

    const operations: StorageBatchOperation<MfaStorageRecord>[] = [
      {
        type: "delete",
        collection: this.factorsCollection,
        id: factor.id,
        condition: {
          expectedRevision: factor.revision,
        },
      },
      ...recoveryCodes.map((record) => ({
        type: "delete" as const,
        collection: this.recoveryCodesCollection,
        id: record.id,
        condition: {
          expectedRevision: record.revision,
        },
      })),
      ...pendingChallenges.map((challenge) => ({
        type: "update" as const,
        collection: this.challengesCollection,
        id: challenge.id,
        condition: {
          expectedRevision: challenge.revision,
        },
        changes: {
          consumedAt: now,
          updatedAt: now,
        },
      })),
      {
        type: "insert",
        collection: this.auditCollection,
        record: this.createAuditRecord(
          "mfa-factor-removed",
          context.user.id,
          {
            type: factor.type,
          },
          context.session.id,
        ),
      },
    ];

    try {
      await this.storage.atomicBatch<MfaStorageRecord>(operations);
    } catch (error) {
      if (error instanceof StorageConflictError) {
        throw new AuthMfaFactorError("The factor changed during removal.", {
          cause: error,
        });
      }

      throw new AuthProviderError("Could not remove the MFA factor.", {
        cause: error,
      });
    }
  }

  private getWebAuthn(): {
    readonly provider: WebAuthnProvider;
    readonly config: NonNullable<AuthMfaManagerOptions["webAuthn"]>;
  } {
    if (!this.webAuthn || !this.webAuthnProvider) {
      throw new AuthConfigurationError(
        "WebAuthn is not configured for this application.",
      );
    }

    return {
      provider: this.webAuthnProvider,
      config: this.webAuthn,
    };
  }

  private assertWebAuthnOptions(
    options: Readonly<Record<string, unknown>>,
    expectedChallenge: string,
  ): void {
    if (options.challenge !== expectedChallenge) {
      throw new AuthProviderError(
        "The WebAuthn provider returned an unexpected challenge.",
      );
    }
  }

  async beginPasskeyRegistration(
    input: BeginPasskeyRegistrationInput,
  ): Promise<PasskeyRegistrationStarted> {
    this.assertInitialized();

    const context = await this.getAuthenticatedContext(input.sessionToken);

    await this.verifyCurrentPassword(context.user.id, input.currentPassword);

    await this.enforceRateLimit(
      "passkey-register",
      input.ipAddress,
      context.user.id,
    );

    const { provider, config } = this.getWebAuthn();

    const activeFactors = await this.findActiveFactors(context.user.id);

    const excludeCredentialIds = activeFactors
      .filter(
        (factor) => factor.type === "passkey" && factor.credentialId !== null,
      )
      .map((factor) => factor.credentialId!);

    const challenge = generateWebAuthnChallenge();

    let options: Readonly<Record<string, unknown>>;

    try {
      options = await provider.generateRegistrationOptions({
        challenge,
        rpId: config.rpId,
        rpName: config.rpName,
        userId: context.user.id,
        userName: context.user.email,
        excludeCredentialIds,
      });
    } catch (error) {
      throw new AuthProviderError(
        "Could not create WebAuthn registration options.",
        { cause: error },
      );
    }

    this.assertWebAuthnOptions(options, challenge);

    const created = await this.createChallengeRecord(
      "passkey-registration",
      context.user.id,
      activeFactors.map((factor) => factor.id),
      challenge,
      {
        factorLabel: validateLabel(input.label, "Passkey"),
      },
    );

    const audit = this.createAuditRecord(
      "mfa-challenge-created",
      context.user.id,
      {
        purpose: "passkey-registration",
      },
      context.session.id,
    );

    try {
      await this.storage.atomicBatch<MfaStorageRecord>([
        {
          type: "insert",
          collection: this.challengesCollection,
          record: created.record,
        },
        {
          type: "insert",
          collection: this.auditCollection,
          record: audit,
        },
      ]);
    } catch (error) {
      throw new AuthProviderError(
        "Could not persist the WebAuthn registration challenge.",
        { cause: error },
      );
    }

    return {
      challengeId: created.record.id,
      challengeToken: created.token,
      options,
      expiresAt: created.record.expiresAt,
    };
  }

  async finishPasskeyRegistration(
    input: FinishPasskeyRegistrationInput,
  ): Promise<MfaEnrollmentCompleted> {
    this.assertInitialized();

    const context = await this.getAuthenticatedContext(input.sessionToken);

    await this.enforceRateLimit(
      "verify-passkey-registration",
      input.ipAddress,
      context.user.id,
    );

    const challenge = await this.getChallenge(
      input.challengeToken,
      "passkey-registration",
    );

    if (challenge.userId !== context.user.id || !challenge.webAuthnChallenge) {
      throw new AuthMfaChallengeError();
    }

    const { provider, config } = this.getWebAuthn();

    let verification: WebAuthnRegistrationVerification;

    try {
      verification = await provider.verifyRegistrationResponse({
        response: input.response,
        expectedChallenge: challenge.webAuthnChallenge,
        expectedOrigin: config.origin,
        expectedRpId: config.rpId,
      });
    } catch (error) {
      throw new AuthProviderError(
        "WebAuthn registration verification failed.",
        { cause: error },
      );
    }

    if (
      !verification.verified ||
      !verification.userVerified ||
      !verification.credential
    ) {
      return this.failChallenge(challenge, "passkey-registration");
    }

    const credential: WebAuthnRegistrationCredential = verification.credential;

    const responseCredentialId = getCredentialId(input.response);

    if (
      responseCredentialId !== credential.credentialId ||
      !credential.publicKey ||
      !Number.isSafeInteger(credential.counter) ||
      credential.counter < 0
    ) {
      return this.failChallenge(challenge, "passkey-registration");
    }

    const now = this.now();
    const factorId = generateAuthId("mfa-factor");

    const factor: AuthMfaFactorStorageRecord = {
      id: factorId,
      userId: context.user.id,
      factorKey: `passkey:${credential.credentialId}`,
      type: "passkey",
      status: "active",
      label: challenge.factorLabel ?? "Passkey",
      secret: null,
      credentialId: credential.credentialId,
      publicKey: credential.publicKey,
      counter: credential.counter,
      transports: credential.transports ?? [],
      lastUsedStep: null,
      lastUsedAt: now,
      expiresAt: null,
      createdAt: now,
      updatedAt: now,
      revision: 1,
    };

    const recovery = await this.createRecoveryCodeBundle(
      context.user.id,
      factor.id,
    );

    const operations: StorageBatchOperation<MfaStorageRecord>[] = [
      {
        type: "insert",
        collection: this.factorsCollection,
        record: factor,
      },
      {
        type: "update",
        collection: this.challengesCollection,
        id: challenge.id,
        condition: {
          expectedRevision: challenge.revision,
        },
        changes: {
          consumedAt: now,
          updatedAt: now,
        },
      },
      ...recovery.records.map((record) => ({
        type: "insert" as const,
        collection: this.recoveryCodesCollection,
        record,
      })),
      {
        type: "insert",
        collection: this.auditCollection,
        record: this.createAuditRecord(
          "passkey-registered",
          context.user.id,
          {
            transports: factor.transports.length,
            recoveryCodesGenerated: recovery.codes.length,
          },
          context.session.id,
        ),
      },
    ];

    try {
      await this.storage.atomicBatch<MfaStorageRecord>(operations);
    } catch (error) {
      if (
        error instanceof StorageDuplicateError ||
        error instanceof StorageConflictError
      ) {
        throw new AuthMfaFactorError(
          "This passkey is already registered or the challenge was consumed.",
          { cause: error },
        );
      }

      throw new AuthProviderError("Could not store the passkey.", {
        cause: error,
      });
    }

    return {
      factor: toPublicFactor(factor),
      recoveryCodes: recovery.codes,
    };
  }

  async beginPasskeySignIn(
    input: BeginPasskeySignInInput,
  ): Promise<PasskeySignInStarted> {
    this.assertInitialized();

    await this.enforceRateLimit("passkey-sign-in", input.ipAddress);

    const { provider, config } = this.getWebAuthn();

    const challenge = generateWebAuthnChallenge();

    let options: Readonly<Record<string, unknown>>;

    try {
      options = await provider.generateAuthenticationOptions({
        challenge,
        rpId: config.rpId,
        userVerification: "required",
      });
    } catch (error) {
      throw new AuthProviderError(
        "Could not create passkey authentication options.",
        { cause: error },
      );
    }

    this.assertWebAuthnOptions(options, challenge);

    const created = await this.createChallengeRecord(
      "passkey-sign-in",
      null,
      [],
      challenge,
    );

    const audit = this.createAuditRecord("mfa-challenge-created", null, {
      purpose: "passkey-sign-in",
    });

    try {
      await this.storage.atomicBatch<MfaStorageRecord>([
        {
          type: "insert",
          collection: this.challengesCollection,
          record: created.record,
        },
        {
          type: "insert",
          collection: this.auditCollection,
          record: audit,
        },
      ]);
    } catch (error) {
      throw new AuthProviderError(
        "Could not persist the passkey sign-in challenge.",
        { cause: error },
      );
    }

    return {
      challengeId: created.record.id,
      challengeToken: created.token,
      options,
      expiresAt: created.record.expiresAt,
    };
  }

  private async verifyPasskeyAssertion(input: {
    readonly response: unknown;
    readonly challenge: AuthMfaChallengeStorageRecord;
    readonly factor: AuthMfaFactorStorageRecord;
  }): Promise<number> {
    if (!input.challenge.webAuthnChallenge) {
      throw new AuthMfaChallengeError();
    }

    if (!input.factor.credentialId || !input.factor.publicKey) {
      throw new AuthMfaFactorError();
    }

    const { provider, config } = this.getWebAuthn();

    let verification: WebAuthnAuthenticationVerification;

    try {
      verification = await provider.verifyAuthenticationResponse({
        response: input.response,
        expectedChallenge: input.challenge.webAuthnChallenge,
        expectedOrigin: config.origin,
        expectedRpId: config.rpId,
        credential: {
          credentialId: input.factor.credentialId,
          publicKey: input.factor.publicKey,
          counter: input.factor.counter,
        },
      });
    } catch (error) {
      throw new AuthProviderError(
        "WebAuthn authentication verification failed.",
        { cause: error },
      );
    }

    if (
      !verification.verified ||
      !verification.userVerified ||
      verification.credentialId !== input.factor.credentialId ||
      !Number.isSafeInteger(verification.newCounter) ||
      verification.newCounter < 0
    ) {
      return this.failChallenge(input.challenge, "passkey-authentication");
    }

    if (
      (input.factor.counter > 0 || verification.newCounter > 0) &&
      verification.newCounter <= input.factor.counter
    ) {
      return this.failChallenge(input.challenge, "passkey-counter-regression");
    }

    return verification.newCounter;
  }

  async finishPasskeySignIn(input: {
    readonly challengeToken: string;
    readonly response: unknown;
    readonly ipAddress: string;
  }): Promise<AuthResult> {
    this.assertInitialized();

    const challenge = await this.getChallenge(
      input.challengeToken,
      "passkey-sign-in",
    );

    await this.enforceRateLimit("verify-passkey-sign-in", input.ipAddress);

    const credentialId = getCredentialId(input.response);

    const factor = await this.storage.findOne<AuthMfaFactorStorageRecord>(
      this.factorsCollection,
      {
        where: {
          credentialId: whereEquals(credentialId),
          type: whereEquals("passkey"),
          status: whereEquals("active"),
        },
      },
    );

    if (!factor || !factor.userId) {
      return this.failChallenge(challenge, "passkey-sign-in");
    }

    const newCounter = await this.verifyPasskeyAssertion({
      response: input.response,
      challenge,
      factor,
    });

    return this.completeChallenge({
      challenge,
      userId: factor.userId,
      method: "passkey",
      auditAction: "passkey-authenticated",
      factorUpdate: {
        factor,
        changes: {
          counter: newCounter,
          lastUsedAt: this.now(),
          updatedAt: this.now(),
        },
      },
    });
  }

  async beginPasskeyMfa(
    challengeToken: string,
    ipAddress: string,
  ): Promise<PasskeyMfaStarted> {
    this.assertInitialized();

    const challenge = await this.getChallenge(challengeToken, "sign-in");

    if (!challenge.userId) {
      throw new AuthMfaChallengeError();
    }

    await this.enforceRateLimit("passkey-mfa", ipAddress, challenge.userId);

    const factors = await this.findActiveFactors(challenge.userId);

    const passkeys = factors.filter(
      (factor) =>
        factor.type === "passkey" &&
        factor.credentialId !== null &&
        challenge.factorIds.includes(factor.id),
    );

    if (passkeys.length === 0) {
      throw new AuthMfaFactorError(
        "No passkey is available for this challenge.",
      );
    }

    const { provider, config } = this.getWebAuthn();
    const webAuthnChallenge = generateWebAuthnChallenge();

    let options: Readonly<Record<string, unknown>>;

    try {
      options = await provider.generateAuthenticationOptions({
        challenge: webAuthnChallenge,
        rpId: config.rpId,
        allowCredentialIds: passkeys.map((factor) => factor.credentialId!),
        userVerification: "required",
      });
    } catch (error) {
      throw new AuthProviderError("Could not create passkey MFA options.", {
        cause: error,
      });
    }

    this.assertWebAuthnOptions(options, webAuthnChallenge);

    const updated = await this.storage.update<AuthMfaChallengeStorageRecord>(
      this.challengesCollection,
      challenge.id,
      {
        webAuthnChallenge,
        webAuthnFactorIds: passkeys.map((factor) => factor.id),
        updatedAt: this.now(),
      },
      {
        expectedRevision: challenge.revision,
      },
    );

    if (!updated) {
      throw new AuthMfaChallengeError();
    }

    return {
      options,
      expiresAt: challenge.expiresAt,
    };
  }

  async finishPasskeyMfa(input: PasskeyMfaCompletedInput): Promise<AuthResult> {
    this.assertInitialized();

    const challenge = await this.getChallenge(input.challengeToken, "sign-in");

    if (!challenge.userId || !challenge.webAuthnChallenge) {
      throw new AuthMfaChallengeError();
    }

    await this.enforceRateLimit(
      "verify-passkey-mfa",
      input.ipAddress,
      challenge.userId,
    );

    const credentialId = getCredentialId(input.response);

    const factor = await this.storage.findOne<AuthMfaFactorStorageRecord>(
      this.factorsCollection,
      {
        where: {
          credentialId: whereEquals(credentialId),
          type: whereEquals("passkey"),
          status: whereEquals("active"),
          userId: whereEquals(challenge.userId),
        },
      },
    );

    if (!factor || !challenge.webAuthnFactorIds.includes(factor.id)) {
      return this.failChallenge(challenge, "passkey-mfa");
    }

    const newCounter = await this.verifyPasskeyAssertion({
      response: input.response,
      challenge,
      factor,
    });

    return this.completeChallenge({
      challenge,
      userId: challenge.userId,
      method: "passkey",
      factorUpdate: {
        factor,
        changes: {
          counter: newCounter,
          lastUsedAt: this.now(),
          updatedAt: this.now(),
        },
      },
    });
  }
}
