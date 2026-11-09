import {
  StorageConflictError,
  StorageDuplicateError,
  type StorageAdapter,
  type StorageBatchOperation,
} from "@puzzle-ui/storage";

import type { SessionManager, SessionRecord } from "@puzzle-ui/session";

import type {
  EmailMessage,
  EmailProvider,
  PasswordHash,
  PasswordHasher,
  RateLimitProvider,
} from "./providers/provider.types";

import {
  AuthAccountConflictError,
  AuthConfigurationError,
  AuthProviderError,
  AuthRateLimitError,
  AuthSessionError,
  AuthTokenError,
  AuthValidationError,
} from "./errors/auth.errors";

import {
  AUTH_ACTION_TOKEN_COLLECTION,
  AUTH_AUDIT_COLLECTION,
  AUTH_CREDENTIAL_COLLECTION,
  AUTH_RATE_LIMIT_COLLECTION,
  AUTH_USER_COLLECTION,
  initializeAuthStorage,
  type AuthUserStorageRecord,
} from "./auth.storage";

import type {
  AuthActionTokenStorageRecord,
  AuthAuditAction,
  AuthAuditEventStorageRecord,
  AuthLifecycleManagerOptions,
  AuthLifecycleRateLimitAction,
} from "./types/auth-lifecycle.types";

import type { PasswordCredentialStorageRecord } from "./types/credential.types";
import type { AuthUser } from "./types/user.types";

import {
  generateAuthId,
  generateSecureAuthToken,
  hashAuthToken,
  createRateLimitKey,
} from "./utils/auth-crypto.utils";

import { normalizeDisplayName, normalizeEmail } from "./utils/email.utils";

import { StorageRateLimitProvider } from "./auth.rate-limit";

export type StorageAuthLifecycleManagerDependencies = {
  readonly storage: StorageAdapter;
  readonly passwordHasher: PasswordHasher;
  readonly emailProvider: EmailProvider;
  readonly sessions: SessionManager;
  readonly rateLimitProvider?: RateLimitProvider;
};

export type RequestEmailVerificationInput = {
  readonly userId: string;
  readonly verificationUrl: string;
  readonly ipAddress: string;
};

export type RequestPasswordResetInput = {
  readonly email: string;
  readonly resetUrl: string;
  readonly ipAddress: string;
};

export type ResetPasswordInput = {
  readonly token: string;
  readonly newPassword: string;
};

export type ChangePasswordInput = {
  readonly sessionToken: string;
  readonly currentPassword: string;
  readonly newPassword: string;
};

export type UpdateAuthProfileInput = {
  readonly sessionToken: string;
  readonly name?: string | null;
  readonly image?: string | null;
};

export type RequestEmailChangeInput = {
  readonly sessionToken: string;
  readonly email: string;
  readonly verificationUrl: string;
  readonly ipAddress: string;
};

export type DeleteAuthAccountInput = {
  readonly sessionToken: string;
  readonly password: string;
};

type LifecycleRecord =
  | AuthActionTokenStorageRecord
  | AuthAuditEventStorageRecord
  | AuthUserStorageRecord
  | PasswordCredentialStorageRecord;

type LifecycleBatchOperation = StorageBatchOperation<LifecycleRecord>;

type AuthLifecycleUserContext = {
  readonly session: SessionRecord;
  readonly user: AuthUserStorageRecord;
};

type AuthActionTokenResult = {
  readonly token: string;
  readonly record: AuthActionTokenStorageRecord;
};

type RateLimitRule = {
  readonly limit: number;
  readonly windowSeconds: number;
};

const DEFAULT_TOKEN_LIFETIMES = {
  emailVerification: 60 * 60,
  passwordReset: 60 * 60,
  emailChange: 60 * 60,
} as const;

const DEFAULT_RATE_LIMITS = {
  emailVerification: {
    email: { limit: 3, windowSeconds: 60 * 60 },
    ip: { limit: 10, windowSeconds: 60 * 60 },
  },
  passwordReset: {
    email: { limit: 3, windowSeconds: 60 * 60 },
    ip: { limit: 10, windowSeconds: 60 * 60 },
  },
  emailChange: {
    email: { limit: 3, windowSeconds: 60 * 60 },
    ip: { limit: 10, windowSeconds: 60 * 60 },
  },
} satisfies Record<
  AuthLifecycleRateLimitAction,
  { readonly email: RateLimitRule; readonly ip: RateLimitRule }
>;

const toPublicUser = (record: AuthUserStorageRecord): AuthUser => ({
  id: record.id,
  email: record.email,
  emailVerifiedAt: record.emailVerifiedAt,
  name: record.name,
  image: record.image,
  createdAt: record.createdAt,
  updatedAt: record.updatedAt,
});

const validateIpAddress = (ipAddress: string): string => {
  if (
    typeof ipAddress !== "string" ||
    ipAddress.trim().length === 0 ||
    ipAddress.trim().length > 128
  ) {
    throw new AuthValidationError("A valid client IP address is required.");
  }

  return ipAddress.trim();
};

const validatePassword = (
  password: string,
  minimumLength: number,
  maximumLength: number,
): void => {
  if (typeof password !== "string") {
    throw new AuthValidationError("A password is required.");
  }

  const length = Array.from(password).length;
  const byteLength = new TextEncoder().encode(password).byteLength;

  if (length < minimumLength) {
    throw new AuthValidationError(
      `Password must contain at least ${minimumLength} characters.`,
    );
  }

  if (length > maximumLength || byteLength > 4096) {
    throw new AuthValidationError(
      `Password must contain no more than ${maximumLength} characters.`,
    );
  }
};

const validateImageUrl = (image: string | null | undefined): string | null => {
  if (image === undefined || image === null || image === "") {
    return null;
  }

  if (typeof image !== "string" || image.length > 2048) {
    throw new AuthValidationError("The profile image URL is invalid.");
  }

  let url: URL;

  try {
    url = new URL(image);
  } catch {
    throw new AuthValidationError("The profile image URL is invalid.");
  }

  if (url.protocol !== "https:" || url.username || url.password) {
    throw new AuthValidationError(
      "Profile image URLs must use HTTPS and cannot contain credentials.",
    );
  }

  return url.toString();
};

const createTokenUrl = (baseUrl: string, token: string): string => {
  let url: URL;

  try {
    url = new URL(baseUrl);
  } catch {
    throw new AuthValidationError(
      "The configured authentication callback URL is invalid.",
    );
  }

  const isLocalhost =
    url.hostname === "localhost" ||
    url.hostname === "127.0.0.1" ||
    url.hostname === "[::1]";

  if (
    (url.protocol !== "https:" && !(isLocalhost && url.protocol === "http:")) ||
    url.username ||
    url.password
  ) {
    throw new AuthValidationError(
      "Authentication callback URLs must use HTTPS.",
    );
  }

  url.searchParams.set("token", token);

  return url.toString();
};

const validateRateLimitRule = (
  name: string,
  rule: RateLimitRule | undefined,
): void => {
  if (
    !rule ||
    !Number.isInteger(rule.limit) ||
    rule.limit < 1 ||
    !Number.isFinite(rule.windowSeconds) ||
    rule.windowSeconds <= 0
  ) {
    throw new AuthConfigurationError(
      `${name} must have a positive integer limit and a positive window.`,
    );
  }
};

export class StorageAuthLifecycleManager {
  private readonly storage: StorageAdapter;
  private readonly passwordHasher: PasswordHasher;
  private readonly emailProvider: EmailProvider;
  private readonly sessions: SessionManager;
  private readonly rateLimitProvider: RateLimitProvider;

  private readonly rateLimitKeySecret: string;
  private readonly usersCollection: string;
  private readonly credentialsCollection: string;
  private readonly actionTokensCollection: string;
  private readonly auditCollection: string;

  private readonly emailTemplates: {
    readonly emailVerification: string;
    readonly passwordReset: string;
    readonly emailChange: string;
  };

  private readonly emailSubjects: {
    readonly emailVerification: string;
    readonly passwordReset: string;
    readonly emailChange: string;
  };

  private initialized = false;
  private readonly rateLimitsCollection: string;

  private readonly minimumPasswordLength: number;
  private readonly maximumPasswordLength: number;
  private readonly tokenLifetimes: typeof DEFAULT_TOKEN_LIFETIMES;
  private readonly rateLimits: typeof DEFAULT_RATE_LIMITS;
  private readonly clock: () => Date;
  private readonly onEmailDeliveryError?: (error: unknown) => void;

  private initializationPromise: Promise<void> | null = null;

  constructor(
    dependencies: StorageAuthLifecycleManagerDependencies,
    options: AuthLifecycleManagerOptions,
  ) {
    this.storage = dependencies.storage;
    this.passwordHasher = dependencies.passwordHasher;
    this.emailProvider = dependencies.emailProvider;
    this.emailTemplates = {
      emailVerification:
        options.emailTemplates?.emailVerification ?? "auth/email-verification",
      passwordReset:
        options.emailTemplates?.passwordReset ?? "auth/password-reset",
      emailChange:
        options.emailTemplates?.emailChange ?? "auth/email-change-verification",
    };

    this.emailSubjects = {
      emailVerification:
        options.emailSubjects?.emailVerification ?? "Verify your email address",
      passwordReset:
        options.emailSubjects?.passwordReset ?? "Reset your password",
      emailChange:
        options.emailSubjects?.emailChange ?? "Confirm your new email address",
    };

    this.sessions = dependencies.sessions;

    this.usersCollection = options.usersCollection ?? AUTH_USER_COLLECTION;
    this.credentialsCollection =
      options.credentialsCollection ?? AUTH_CREDENTIAL_COLLECTION;
    this.actionTokensCollection =
      options.actionTokensCollection ?? AUTH_ACTION_TOKEN_COLLECTION;
    this.auditCollection = options.auditCollection ?? AUTH_AUDIT_COLLECTION;

    if (
      typeof options.rateLimitKeySecret !== "string" ||
      options.rateLimitKeySecret.length < 32
    ) {
      throw new AuthConfigurationError(
        "rateLimitKeySecret must contain at least 32 characters.",
      );
    }
    this.rateLimitsCollection =
      options.rateLimitsCollection ?? AUTH_RATE_LIMIT_COLLECTION;
    this.rateLimitKeySecret = options.rateLimitKeySecret;
    this.rateLimits = {
      emailVerification: {
        email:
          options.rateLimits?.emailVerification?.email ??
          DEFAULT_RATE_LIMITS.emailVerification.email,
        ip:
          options.rateLimits?.emailVerification?.ip ??
          DEFAULT_RATE_LIMITS.emailVerification.ip,
      },
      passwordReset: {
        email:
          options.rateLimits?.passwordReset?.email ??
          DEFAULT_RATE_LIMITS.passwordReset.email,
        ip:
          options.rateLimits?.passwordReset?.ip ??
          DEFAULT_RATE_LIMITS.passwordReset.ip,
      },
      emailChange: {
        email:
          options.rateLimits?.emailChange?.email ??
          DEFAULT_RATE_LIMITS.emailChange.email,
        ip:
          options.rateLimits?.emailChange?.ip ??
          DEFAULT_RATE_LIMITS.emailChange.ip,
      },
    };

    this.minimumPasswordLength = options.minimumPasswordLength ?? 8;
    this.maximumPasswordLength = options.maximumPasswordLength ?? 1024;

    if (
      !Number.isInteger(this.minimumPasswordLength) ||
      !Number.isInteger(this.maximumPasswordLength) ||
      this.minimumPasswordLength < 1 ||
      this.maximumPasswordLength < this.minimumPasswordLength
    ) {
      throw new AuthConfigurationError(
        "Password length configuration is invalid.",
      );
    }

    this.tokenLifetimes = {
      emailVerification:
        options.emailVerificationTokenLifetimeSeconds ??
        DEFAULT_TOKEN_LIFETIMES.emailVerification,
      passwordReset:
        options.passwordResetTokenLifetimeSeconds ??
        DEFAULT_TOKEN_LIFETIMES.passwordReset,
      emailChange:
        options.emailChangeTokenLifetimeSeconds ??
        DEFAULT_TOKEN_LIFETIMES.emailChange,
    };

    for (const [name, lifetime] of Object.entries(this.tokenLifetimes)) {
      if (!Number.isFinite(lifetime) || lifetime <= 0) {
        throw new AuthConfigurationError(
          `${name} token lifetime must be positive.`,
        );
      }
    }

    this.rateLimits = {
      emailVerification: {
        ...DEFAULT_RATE_LIMITS.emailVerification,
        ...options.rateLimits?.emailVerification,
      },
      passwordReset: {
        ...DEFAULT_RATE_LIMITS.passwordReset,
        ...options.rateLimits?.passwordReset,
      },
      emailChange: {
        ...DEFAULT_RATE_LIMITS.emailChange,
        ...options.rateLimits?.emailChange,
      },
    };

    for (const [action, policy] of Object.entries(this.rateLimits)) {
      validateRateLimitRule(`${action} email rate limit`, policy.email);
      validateRateLimitRule(`${action} IP rate limit`, policy.ip);
    }

    this.clock = options.clock ?? (() => new Date());
    this.onEmailDeliveryError = options.onEmailDeliveryError;

    if (
      !this.storage.capabilities.conditionalWrites ||
      !this.storage.capabilities.atomicBatch ||
      !this.storage.capabilities.uniqueConstraints
    ) {
      throw new AuthConfigurationError(
        "Auth lifecycle workflows require conditional writes, unique constraints and atomic batches.",
      );
    }

    this.rateLimitProvider =
      dependencies.rateLimitProvider ??
      new StorageRateLimitProvider(this.storage, {
        collectionName: options.rateLimitsCollection,
        clock: this.clock,
      });
  }

  async initialize(): Promise<void> {
    if (!this.initializationPromise) {
      const initialization = (async () => {
        await initializeAuthStorage(this.storage, {
          usersCollection: this.usersCollection,
          credentialsCollection: this.credentialsCollection,
          actionTokensCollection: this.actionTokensCollection,
          auditCollection: this.auditCollection,
          rateLimitsCollection: this.rateLimitsCollection,
        });

        if (this.rateLimitProvider instanceof StorageRateLimitProvider) {
          await this.rateLimitProvider.initialize();
        }

        this.initialized = true;
      })();

      this.initializationPromise = initialization.catch((error) => {
        this.initializationPromise = null;
        throw error;
      });
    }

    return this.initializationPromise;
  }

  private assertInitialized(): void {
    if (!this.initialized) {
      throw new AuthConfigurationError(
        "Auth lifecycle manager must be initialized before use.",
      );
    }
  }

  private now(): Date {
    const now = this.clock();

    if (!(now instanceof Date) || !Number.isFinite(now.getTime())) {
      throw new AuthConfigurationError(
        "The configured clock returned an invalid date.",
      );
    }

    return now;
  }

  private async consumeRateLimit(
    action: AuthLifecycleRateLimitAction,
    scope: "email" | "ip",
    identifier: string,
  ): Promise<void> {
    const rule = this.rateLimits[action][scope];

    const key = await createRateLimitKey(
      this.rateLimitKeySecret,
      `auth:${action}:${scope}:${identifier}`,
    );

    let decision: Awaited<ReturnType<RateLimitProvider["consume"]>>;

    try {
      decision = await this.rateLimitProvider.consume({
        key,
        limit: rule.limit,
        windowSeconds: rule.windowSeconds,
      });
    } catch (error) {
      throw new AuthProviderError(
        "The authentication rate limiter is unavailable.",
        { cause: error },
      );
    }

    if (
      !decision ||
      typeof decision.allowed !== "boolean" ||
      !(decision.resetAt instanceof Date) ||
      !Number.isFinite(decision.resetAt.getTime())
    ) {
      throw new AuthProviderError(
        "The rate limiter returned an invalid response.",
      );
    }

    if (!decision.allowed) {
      throw new AuthRateLimitError(decision.resetAt);
    }
  }

  private async enforceRateLimits(
    action: AuthLifecycleRateLimitAction,
    email: string,
    ipAddress: string,
  ): Promise<void> {
    await this.consumeRateLimit(action, "email", email);
    await this.consumeRateLimit(action, "ip", ipAddress);
  }

  private async createActionToken(input: {
    readonly userId: string;
    readonly purpose: AuthActionTokenStorageRecord["purpose"];
    readonly lifetimeSeconds: number;
    readonly targetEmail?: string | null;
  }): Promise<AuthActionTokenResult> {
    const now = this.now();
    const token = generateSecureAuthToken();

    const record: AuthActionTokenStorageRecord = {
      id: generateAuthId("action-token"),
      userId: input.userId,
      purpose: input.purpose,
      tokenHash: await hashAuthToken(token),
      expiresAt: new Date(now.getTime() + input.lifetimeSeconds * 1000),
      consumedAt: null,
      targetEmail: input.targetEmail ?? null,
      createdAt: now,
      updatedAt: now,
      revision: 1,
      revokedAt: null,
    };

    return { token, record };
  }

  private createAuditRecord(
    action: AuthAuditAction,
    userId: string | null,
    sessionId: string | null = null,
    metadata?: AuthAuditEventStorageRecord["metadata"],
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

  private async atomic(
    operations: readonly LifecycleBatchOperation[],
  ): Promise<void> {
    try {
      await this.storage.atomicBatch<LifecycleRecord>(operations);
    } catch (error) {
      if (error instanceof StorageDuplicateError) {
        throw new AuthAccountConflictError({ cause: error });
      }

      throw error;
    }
  }

  private async deliverEmail(
    message: EmailMessage,
    suppressFailure: boolean,
  ): Promise<void> {
    try {
      await this.emailProvider.send(message);
    } catch (error) {
      try {
        this.onEmailDeliveryError?.(error);
      } catch {
        // Operational logging must not change the public auth response.
      }

      if (!suppressFailure) {
        throw new AuthProviderError("Authentication email delivery failed.", {
          cause: error,
        });
      }
    }
  }

  private async getSessionContext(
    token: string,
  ): Promise<AuthLifecycleUserContext> {
    if (typeof token !== "string" || token.length === 0) {
      throw new AuthSessionError("An authenticated session is required.");
    }

    let session: SessionRecord | null;

    try {
      session = await this.sessions.validate(token);
    } catch (error) {
      throw new AuthSessionError(
        "Could not validate the authentication session.",
        { cause: error },
      );
    }

    if (!session || session.kind !== "authenticated" || !session.userId) {
      throw new AuthSessionError("An authenticated session is required.");
    }

    const user = await this.storage.findById<AuthUserStorageRecord>(
      this.usersCollection,
      session.userId,
    );

    if (!user) {
      throw new AuthSessionError("The authenticated account no longer exists.");
    }

    return { session, user };
  }

  private async findActionToken(
    token: string,
    purpose: AuthActionTokenStorageRecord["purpose"],
  ): Promise<AuthActionTokenStorageRecord> {
    if (typeof token !== "string" || token.length < 32 || token.length > 256) {
      throw new AuthTokenError();
    }

    const tokenHash = await hashAuthToken(token);

    const record = await this.storage.findOne<AuthActionTokenStorageRecord>(
      this.actionTokensCollection,
      {
        where: {
          tokenHash: { operator: "eq", value: tokenHash },
        },
      },
    );

    const now = this.now();

    if (
      !record ||
      record.purpose !== purpose ||
      record.consumedAt !== null ||
      record.revokedAt != null ||
      record.expiresAt.getTime() <= now.getTime()
    ) {
      throw new AuthTokenError();
    }

    return record;
  }

  private async findCredential(
    userId: string,
  ): Promise<PasswordCredentialStorageRecord | null> {
    return this.storage.findOne<PasswordCredentialStorageRecord>(
      this.credentialsCollection,
      {
        where: {
          userId: { operator: "eq", value: userId },
          kind: { operator: "eq", value: "password" },
        },
      },
    );
  }

  private async verifyPassword(
    password: string,
    stored: PasswordHash,
  ): Promise<boolean> {
    try {
      return await this.passwordHasher.verify(password, stored);
    } catch (error) {
      throw new AuthProviderError("Password verification failed.", {
        cause: error,
      });
    }
  }

  private async hashPassword(password: string): Promise<PasswordHash> {
    try {
      const result = await this.passwordHasher.hash(password);

      if (
        !result ||
        result.algorithm !== "argon2id" ||
        typeof result.hash !== "string" ||
        result.hash.length === 0
      ) {
        throw new Error("PasswordHasher returned an invalid Argon2id hash.");
      }

      return result;
    } catch (error) {
      throw new AuthProviderError("Password hashing failed.", {
        cause: error,
      });
    }
  }

  private async revokeAllSessions(userId: string): Promise<void> {
    try {
      await this.sessions.revokeAll(userId);
    } catch (error) {
      throw new AuthSessionError(
        "Could not revoke all sessions for the account.",
        { cause: error },
      );
    }
  }

  async sendEmailVerification(
    input: RequestEmailVerificationInput,
  ): Promise<void> {
    this.assertInitialized();

    const ipAddress = validateIpAddress(input.ipAddress);
    const user = await this.storage.findById<AuthUserStorageRecord>(
      this.usersCollection,
      input.userId,
    );

    if (!user) {
      throw new AuthValidationError("The account does not exist.");
    }

    if (user.emailVerifiedAt) {
      return;
    }

    await this.enforceRateLimits(
      "emailVerification",
      user.normalizedEmail,
      ipAddress,
    );

    const created = await this.createActionToken({
      userId: user.id,
      purpose: "email-verification",
      lifetimeSeconds: this.tokenLifetimes.emailVerification,
    });

    const audit = this.createAuditRecord(
      "email-verification-requested",
      user.id,
    );

    await this.atomic([
      {
        type: "insert",
        collection: this.actionTokensCollection,
        record: created.record,
      },
      {
        type: "insert",
        collection: this.auditCollection,
        record: audit,
      },
    ]);

    const verificationUrl = createTokenUrl(
      input.verificationUrl,
      created.token,
    );

    await this.deliverEmail(
      {
        to: user.email,
        subject: this.emailSubjects.emailVerification,
        template: this.emailTemplates.emailVerification,
        variables: {
          url: verificationUrl,
          expiresAt: created.record.expiresAt.toISOString(),
        },
      },
      false,
    );
  }

  async verifyEmail(token: string): Promise<AuthUser> {
    this.assertInitialized();

    const actionToken = await this.findActionToken(token, "email-verification");

    const user = await this.storage.findById<AuthUserStorageRecord>(
      this.usersCollection,
      actionToken.userId,
    );

    if (!user) {
      throw new AuthTokenError();
    }

    const now = this.now();

    await this.atomic([
      {
        type: "update",
        collection: this.actionTokensCollection,
        id: actionToken.id,
        condition: { expectedRevision: actionToken.revision },
        changes: { consumedAt: now },
      },
      {
        type: "update",
        collection: this.usersCollection,
        id: user.id,
        condition: { expectedRevision: user.revision },
        changes: {
          emailVerifiedAt: now,
          updatedAt: now,
        },
      },
      {
        type: "insert",
        collection: this.auditCollection,
        record: this.createAuditRecord("email-verified", user.id),
      },
    ]);

    const updated = await this.storage.findById<AuthUserStorageRecord>(
      this.usersCollection,
      user.id,
    );

    if (!updated) {
      throw new AuthProviderError(
        "The verified account could not be retrieved.",
      );
    }

    return toPublicUser(updated);
  }

  /**
   * Always resolves with the same public result, whether or not the email
   * address belongs to an account. Delivery errors are reported only through
   * onEmailDeliveryError.
   */
  async requestPasswordReset(input: RequestPasswordResetInput): Promise<void> {
    this.assertInitialized();

    const email = normalizeEmail(input.email);
    const ipAddress = validateIpAddress(input.ipAddress);

    await this.enforceRateLimits("passwordReset", email, ipAddress);

    const user = await this.storage.findOne<AuthUserStorageRecord>(
      this.usersCollection,
      {
        where: {
          normalizedEmail: { operator: "eq", value: email },
        },
      },
    );

    if (!user) {
      await this.storage.insert<AuthAuditEventStorageRecord>(
        this.auditCollection,
        this.createAuditRecord("password-reset-requested", null),
      );

      return;
    }

    const created = await this.createActionToken({
      userId: user.id,
      purpose: "password-reset",
      lifetimeSeconds: this.tokenLifetimes.passwordReset,
    });

    await this.atomic([
      {
        type: "insert",
        collection: this.actionTokensCollection,
        record: created.record,
      },
      {
        type: "insert",
        collection: this.auditCollection,
        record: this.createAuditRecord("password-reset-requested", user.id),
      },
    ]);

    const resetUrl = createTokenUrl(input.resetUrl, created.token);

    await this.deliverEmail(
      {
        to: user.email,
        subject: this.emailSubjects.passwordReset,
        template: this.emailTemplates.passwordReset,
        variables: {
          url: resetUrl,
          expiresAt: created.record.expiresAt.toISOString(),
        },
      },
      true,
    );
  }

  async resetPassword(input: ResetPasswordInput): Promise<void> {
    this.assertInitialized();

    validatePassword(
      input.newPassword,
      this.minimumPasswordLength,
      this.maximumPasswordLength,
    );

    const actionToken = await this.findActionToken(
      input.token,
      "password-reset",
    );

    const credential = await this.findCredential(actionToken.userId);

    if (!credential || credential.revokedAt !== null) {
      throw new AuthTokenError();
    }

    const passwordHash = await this.hashPassword(input.newPassword);
    const now = this.now();

    const otherTokens =
      await this.storage.findMany<AuthActionTokenStorageRecord>(
        this.actionTokensCollection,
        {
          where: {
            userId: { operator: "eq", value: actionToken.userId },
            purpose: { operator: "eq", value: "password-reset" },
            consumedAt: { operator: "eq", value: null },
          },
        },
      );

    await this.revokeAllSessions(actionToken.userId);

    const operations: LifecycleBatchOperation[] = [
      {
        type: "update",
        collection: this.actionTokensCollection,
        id: actionToken.id,
        condition: { expectedRevision: actionToken.revision },
        changes: { consumedAt: now },
      },
      {
        type: "update",
        collection: this.credentialsCollection,
        id: credential.id,
        condition: { expectedRevision: credential.revision },
        changes: {
          passwordHash,
          passwordUpdatedAt: now,
          updatedAt: now,
          revokedAt: null,
        },
      },
      {
        type: "insert",
        collection: this.auditCollection,
        record: this.createAuditRecord(
          "password-reset-completed",
          actionToken.userId,
        ),
      },
    ];

    for (const other of otherTokens) {
      if (other.id === actionToken.id || other.revokedAt != null) {
        continue;
      }

      operations.push({
        type: "update",
        collection: this.actionTokensCollection,
        id: other.id,
        condition: { expectedRevision: other.revision },
        changes: { revokedAt: now },
      });
    }

    try {
      await this.atomic(operations);
    } catch (error) {
      if (
        error instanceof StorageConflictError ||
        error instanceof AuthAccountConflictError
      ) {
        throw new AuthTokenError();
      }

      throw error;
    }
  }

  async changePassword(input: ChangePasswordInput): Promise<void> {
    this.assertInitialized();

    validatePassword(
      input.newPassword,
      this.minimumPasswordLength,
      this.maximumPasswordLength,
    );

    const { session, user } = await this.getSessionContext(input.sessionToken);

    const credential = await this.findCredential(user.id);

    if (
      !credential ||
      credential.revokedAt !== null ||
      !(await this.verifyPassword(
        input.currentPassword,
        credential.passwordHash,
      ))
    ) {
      throw new AuthValidationError("The current password is incorrect.");
    }

    const passwordHash = await this.hashPassword(input.newPassword);
    const now = this.now();

    const resetTokens =
      await this.storage.findMany<AuthActionTokenStorageRecord>(
        this.actionTokensCollection,
        {
          where: {
            userId: { operator: "eq", value: user.id },
            purpose: { operator: "eq", value: "password-reset" },
            consumedAt: { operator: "eq", value: null },
          },
        },
      );

    await this.revokeAllSessions(user.id);

    const operations: LifecycleBatchOperation[] = [
      {
        type: "update",
        collection: this.credentialsCollection,
        id: credential.id,
        condition: { expectedRevision: credential.revision },
        changes: {
          passwordHash,
          passwordUpdatedAt: now,
          updatedAt: now,
        },
      },
      {
        type: "insert",
        collection: this.auditCollection,
        record: this.createAuditRecord("password-changed", user.id, session.id),
      },
    ];

    for (const token of resetTokens) {
      if (token.revokedAt != null) continue;

      operations.push({
        type: "update",
        collection: this.actionTokensCollection,
        id: token.id,
        condition: { expectedRevision: token.revision },
        changes: { revokedAt: now },
      });
    }

    await this.atomic(operations);
  }

  async updateProfile(input: UpdateAuthProfileInput): Promise<AuthUser> {
    this.assertInitialized();

    const { session, user } = await this.getSessionContext(input.sessionToken);

    const changes: {
      name?: string | null;
      image?: string | null;
      updatedAt: Date;
    } = {
      updatedAt: this.now(),
    };

    if (input.name !== undefined) {
      changes.name = normalizeDisplayName(input.name);
    }

    if (input.image !== undefined) {
      changes.image = validateImageUrl(input.image);
    }

    const operations: LifecycleBatchOperation[] = [
      {
        type: "update",
        collection: this.usersCollection,
        id: user.id,
        condition: { expectedRevision: user.revision },
        changes,
      },
      {
        type: "insert",
        collection: this.auditCollection,
        record: this.createAuditRecord("profile-updated", user.id, session.id),
      },
    ];

    await this.atomic(operations);

    const updated = await this.storage.findById<AuthUserStorageRecord>(
      this.usersCollection,
      user.id,
    );

    if (!updated) {
      throw new AuthProviderError(
        "The updated account could not be retrieved.",
      );
    }

    return toPublicUser(updated);
  }

  async requestEmailChange(input: RequestEmailChangeInput): Promise<void> {
    this.assertInitialized();

    const { session, user } = await this.getSessionContext(input.sessionToken);

    const newEmail = normalizeEmail(input.email);

    if (newEmail === user.normalizedEmail) {
      throw new AuthValidationError(
        "The new email address is already the current email address.",
      );
    }

    const ipAddress = validateIpAddress(input.ipAddress);

    await this.enforceRateLimits("emailChange", newEmail, ipAddress);

    const existing = await this.storage.findOne<AuthUserStorageRecord>(
      this.usersCollection,
      {
        where: {
          normalizedEmail: { operator: "eq", value: newEmail },
        },
      },
    );

    if (existing) {
      throw new AuthAccountConflictError();
    }

    const created = await this.createActionToken({
      userId: user.id,
      purpose: "email-change",
      targetEmail: newEmail,
      lifetimeSeconds: this.tokenLifetimes.emailChange,
    });

    await this.atomic([
      {
        type: "insert",
        collection: this.actionTokensCollection,
        record: created.record,
      },
      {
        type: "insert",
        collection: this.auditCollection,
        record: this.createAuditRecord(
          "email-change-requested",
          user.id,
          session.id,
        ),
      },
    ]);

    const verificationUrl = createTokenUrl(
      input.verificationUrl,
      created.token,
    );

    await this.deliverEmail(
      {
        to: newEmail,
        subject: this.emailSubjects.emailChange,
        template: this.emailTemplates.emailChange,
        variables: {
          url: verificationUrl,
          expiresAt: created.record.expiresAt.toISOString(),
        },
      },
      false,
    );
  }

  async verifyEmailChange(token: string): Promise<AuthUser> {
    this.assertInitialized();

    const actionToken = await this.findActionToken(token, "email-change");

    if (!actionToken.targetEmail) {
      throw new AuthTokenError();
    }

    const user = await this.storage.findById<AuthUserStorageRecord>(
      this.usersCollection,
      actionToken.userId,
    );

    if (!user) {
      throw new AuthTokenError();
    }

    const newEmail = normalizeEmail(actionToken.targetEmail);
    const now = this.now();

    await this.revokeAllSessions(user.id);

    const operations: LifecycleBatchOperation[] = [
      {
        type: "update",
        collection: this.actionTokensCollection,
        id: actionToken.id,
        condition: { expectedRevision: actionToken.revision },
        changes: { consumedAt: now },
      },
      {
        type: "update",
        collection: this.usersCollection,
        id: user.id,
        condition: { expectedRevision: user.revision },
        changes: {
          email: newEmail,
          normalizedEmail: newEmail,
          emailVerifiedAt: now,
          updatedAt: now,
        },
      },
      {
        type: "insert",
        collection: this.auditCollection,
        record: this.createAuditRecord("email-changed", user.id),
      },
    ];

    try {
      await this.atomic(operations);
    } catch (error) {
      if (
        error instanceof StorageDuplicateError ||
        error instanceof AuthAccountConflictError
      ) {
        throw new AuthAccountConflictError({ cause: error });
      }

      if (error instanceof StorageConflictError) {
        throw new AuthTokenError();
      }

      throw error;
    }

    const updated = await this.storage.findById<AuthUserStorageRecord>(
      this.usersCollection,
      user.id,
    );

    if (!updated) {
      throw new AuthProviderError(
        "The updated account could not be retrieved.",
      );
    }

    return toPublicUser(updated);
  }

  async deleteAccount(input: DeleteAuthAccountInput): Promise<void> {
    this.assertInitialized();

    const { session, user } = await this.getSessionContext(input.sessionToken);

    const credential = await this.findCredential(user.id);

    if (
      !credential ||
      credential.revokedAt !== null ||
      !(await this.verifyPassword(input.password, credential.passwordHash))
    ) {
      throw new AuthValidationError("The password confirmation is incorrect.");
    }

    const credentials =
      await this.storage.findMany<PasswordCredentialStorageRecord>(
        this.credentialsCollection,
        {
          where: {
            userId: { operator: "eq", value: user.id },
          },
        },
      );

    const actionTokens =
      await this.storage.findMany<AuthActionTokenStorageRecord>(
        this.actionTokensCollection,
        {
          where: {
            userId: { operator: "eq", value: user.id },
          },
        },
      );

    await this.revokeAllSessions(user.id);

    const operations: LifecycleBatchOperation[] = [
      {
        type: "delete",
        collection: this.usersCollection,
        id: user.id,
        condition: { expectedRevision: user.revision },
      },
      {
        type: "insert",
        collection: this.auditCollection,
        record: this.createAuditRecord("account-deleted", user.id, session.id),
      },
    ];

    for (const item of credentials) {
      operations.push({
        type: "delete",
        collection: this.credentialsCollection,
        id: item.id,
        condition: { expectedRevision: item.revision },
      });
    }

    for (const item of actionTokens) {
      operations.push({
        type: "delete",
        collection: this.actionTokensCollection,
        id: item.id,
        condition: { expectedRevision: item.revision },
      });
    }

    await this.atomic(operations);
  }
}
