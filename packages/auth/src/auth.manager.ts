import {
  StorageDuplicateError,
  type StorageAdapter,
  type StorageBatchOperation,
} from "@puzzle-ui/storage";

import type { SessionRecord, SessionManager } from "@puzzle-ui/session";

import type {
  PasswordHash,
  PasswordHasher,
  RateLimitProvider,
} from "./providers/provider.types";

import type {
  AuthManager,
  AuthManagerOptions,
  AuthResult,
  AuthRegisterInput,
  AuthSignInInput,
  AuthSession,
  AuthRateLimitPolicies,
  AuthRateLimitRule,
} from "./types/auth-manager.types";

import type { AuthState } from "./types/state.types";
import type { AuthUser } from "./types/user.types";
import type { PasswordCredentialStorageRecord } from "./types/credential.types";

import {
  AUTH_CREDENTIAL_COLLECTION,
  AUTH_USER_COLLECTION,
  initializeAuthStorage,
  type AuthUserStorageRecord,
} from "./auth.storage";

import {
  AuthAccountConflictError,
  AuthConfigurationError,
  AuthInvalidCredentialsError,
  AuthProviderError,
  AuthRateLimitError,
  AuthSessionError,
  AuthValidationError,
} from "./errors/auth.errors";

import { normalizeDisplayName, normalizeEmail } from "./utils/email.utils";

import { createRateLimitKey, generateAuthId } from "./utils/auth-crypto.utils";

export type StorageAuthManagerDependencies = {
  readonly storage: StorageAdapter;
  readonly passwordHasher: PasswordHasher;
  readonly rateLimitProvider: RateLimitProvider;
  readonly sessions: SessionManager;
};

const DEFAULT_RATE_LIMITS: AuthRateLimitPolicies = {
  registration: {
    email: { limit: 5, windowSeconds: 3600 },
    ip: { limit: 10, windowSeconds: 3600 },
  },
  signIn: {
    email: { limit: 10, windowSeconds: 900 },
    ip: { limit: 30, windowSeconds: 900 },
  },
};

const DEFAULT_MINIMUM_PASSWORD_LENGTH = 8;
const DEFAULT_MAXIMUM_PASSWORD_LENGTH = 1024;

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

const validateRateLimitRule = (name: string, rule: AuthRateLimitRule): void => {
  if (
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

const validateSignInPassword = (
  password: string,
  maximumLength: number,
): void => {
  if (typeof password !== "string" || password.length === 0) {
    throw new AuthValidationError("A password is required.");
  }

  if (
    Array.from(password).length > maximumLength ||
    new TextEncoder().encode(password).byteLength > 4096
  ) {
    throw new AuthValidationError("The supplied password is too long.");
  }
};

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

export class StorageAuthManager implements AuthManager {
  private readonly storage: StorageAdapter;
  private readonly passwordHasher: PasswordHasher;
  private readonly rateLimitProvider: RateLimitProvider;
  private readonly sessions: SessionManager;

  private readonly usersCollection: string;
  private readonly credentialsCollection: string;

  private readonly minimumPasswordLength: number;
  private readonly maximumPasswordLength: number;

  private readonly rateLimitPolicies: AuthRateLimitPolicies;
  private readonly rateLimitKeySecret: string;
  private readonly clock: () => Date;

  private initializationPromise: Promise<void> | null = null;
  private dummyPasswordHash: PasswordHash | null = null;

  constructor(
    dependencies: StorageAuthManagerDependencies,
    options: AuthManagerOptions,
  ) {
    this.storage = dependencies.storage;
    this.passwordHasher = dependencies.passwordHasher;
    this.rateLimitProvider = dependencies.rateLimitProvider;
    this.sessions = dependencies.sessions;

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

    this.minimumPasswordLength =
      options.minimumPasswordLength ?? DEFAULT_MINIMUM_PASSWORD_LENGTH;

    this.maximumPasswordLength =
      options.maximumPasswordLength ?? DEFAULT_MAXIMUM_PASSWORD_LENGTH;

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

    this.rateLimitPolicies = {
      registration: {
        ...DEFAULT_RATE_LIMITS.registration,
        ...options.rateLimits?.registration,
      },
      signIn: {
        ...DEFAULT_RATE_LIMITS.signIn,
        ...options.rateLimits?.signIn,
      },
    };

    validateRateLimitRule(
      "Registration email rate limit",
      this.rateLimitPolicies.registration.email,
    );

    validateRateLimitRule(
      "Registration IP rate limit",
      this.rateLimitPolicies.registration.ip,
    );

    validateRateLimitRule(
      "Sign-in email rate limit",
      this.rateLimitPolicies.signIn.email,
    );

    validateRateLimitRule(
      "Sign-in IP rate limit",
      this.rateLimitPolicies.signIn.ip,
    );

    this.clock = options.clock ?? (() => new Date());
  }

  /**
   * Initializes auth storage and creates a dummy password hash.
   *
   * Unknown accounts also execute password verification to reduce
   * timing differences during sign-in.
   */
  async initialize(): Promise<void> {
    if (!this.initializationPromise) {
      const initialization = (async () => {
        await initializeAuthStorage(this.storage, {
          usersCollection: this.usersCollection,
          credentialsCollection: this.credentialsCollection,
        });

        this.dummyPasswordHash = await this.hashPassword(
          generateAuthId("auth-dummy"),
        );
      })();

      this.initializationPromise = initialization.catch((error) => {
        this.initializationPromise = null;
        throw error;
      });
    }

    return this.initializationPromise;
  }

  private assertInitialized(): void {
    if (!this.dummyPasswordHash) {
      throw new AuthConfigurationError(
        "AuthManager must be initialized before it can be used.",
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
      throw new AuthProviderError("Password hashing failed.", { cause: error });
    }
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

  private async enforceRateLimits(
    action: "registration" | "signIn",
    email: string,
    ipAddress: string,
  ): Promise<void> {
    const policy = this.rateLimitPolicies[action];

    const checks = [
      {
        scope: "email",
        identifier: email,
        rule: policy.email,
      },
      {
        scope: "ip",
        identifier: ipAddress,
        rule: policy.ip,
      },
    ] as const;

    for (const check of checks) {
      const key = await createRateLimitKey(
        this.rateLimitKeySecret,
        `auth:${action}:${check.scope}:${check.identifier}`,
      );

      let decision: Awaited<ReturnType<RateLimitProvider["consume"]>>;

      try {
        decision = await this.rateLimitProvider.consume({
          key,
          limit: check.rule.limit,
          windowSeconds: check.rule.windowSeconds,
        });
      } catch (error) {
        // Never silently bypass a failed rate limiter.
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
  }

  private async findUserByEmail(
    normalizedEmail: string,
  ): Promise<AuthUserStorageRecord | null> {
    return this.storage.findOne<AuthUserStorageRecord>(this.usersCollection, {
      where: {
        normalizedEmail: {
          operator: "eq",
          value: normalizedEmail,
        },
      },
    });
  }

  private async createAuthenticatedSession(
    userId: string,
    metadata?: Readonly<Record<string, unknown>>,
  ): Promise<{
    readonly session: AuthSession;
    readonly token: string;
  }> {
    try {
      const result = await this.sessions.create({
        userId,
        kind: "authenticated",
        metadata,
      });

      if (
        !result.token ||
        result.session.userId !== userId ||
        result.session.kind !== "authenticated"
      ) {
        throw new Error(
          "SessionManager returned an invalid authenticated session.",
        );
      }

      return {
        session: toPublicSession(result.session),
        token: result.token,
      };
    } catch (error) {
      if (error instanceof AuthSessionError) {
        throw error;
      }

      throw new AuthSessionError("Could not create an authenticated session.", {
        cause: error,
      });
    }
  }

  async register(input: AuthRegisterInput): Promise<AuthResult> {
    this.assertInitialized();

    const normalizedEmail = normalizeEmail(input.email);
    const name = normalizeDisplayName(input.name);
    const ipAddress = validateIpAddress(input.ipAddress);

    validatePassword(
      input.password,
      this.minimumPasswordLength,
      this.maximumPasswordLength,
    );

    await this.enforceRateLimits("registration", normalizedEmail, ipAddress);

    const passwordHash = await this.hashPassword(input.password);
    const now = this.now();

    const userId = generateAuthId("user");
    const credentialId = generateAuthId("credential");

    const userRecord: AuthUserStorageRecord = {
      id: userId,
      email: normalizedEmail,
      normalizedEmail,
      emailVerifiedAt: null,
      name,
      image: null,
      createdAt: now,
      updatedAt: now,
      revision: 1,
    };

    const credentialRecord: PasswordCredentialStorageRecord = {
      id: credentialId,
      userId,
      kind: "password",
      passwordHash,
      passwordUpdatedAt: now,
      createdAt: now,
      updatedAt: now,
      revokedAt: null,
      revision: 1,
    };

    const operations: StorageBatchOperation<
      AuthUserStorageRecord | PasswordCredentialStorageRecord
    >[] = [
      {
        type: "insert",
        collection: this.usersCollection,
        record: userRecord,
      },
      {
        type: "insert",
        collection: this.credentialsCollection,
        record: credentialRecord,
      },
    ];

    try {
      await this.storage.atomicBatch<
        AuthUserStorageRecord | PasswordCredentialStorageRecord
      >(operations);
    } catch (error) {
      if (error instanceof StorageDuplicateError) {
        throw new AuthAccountConflictError({ cause: error });
      }

      throw error;
    }

    // A session failure does not roll back an already-created account.
    // The account can still authenticate through signIn().
    const authenticated = await this.createAuthenticatedSession(
      userId,
      input.sessionMetadata,
    );

    return {
      user: toPublicUser(userRecord),
      session: authenticated.session,
      token: authenticated.token,
    };
  }

  async signIn(input: AuthSignInInput): Promise<AuthResult> {
    this.assertInitialized();

    const normalizedEmail = normalizeEmail(input.email);
    const ipAddress = validateIpAddress(input.ipAddress);

    validateSignInPassword(input.password, this.maximumPasswordLength);

    await this.enforceRateLimits("signIn", normalizedEmail, ipAddress);

    const userRecord = await this.findUserByEmail(normalizedEmail);

    const credential = userRecord
      ? await this.storage.findOne<PasswordCredentialStorageRecord>(
          this.credentialsCollection,
          {
            where: {
              userId: {
                operator: "eq",
                value: userRecord.id,
              },
              kind: {
                operator: "eq",
                value: "password",
              },
            },
          },
        )
      : null;

    const activeCredential =
      credential && credential.revokedAt === null ? credential : null;

    // Always perform password verification, including for unknown users
    // and accounts without an active password credential.
    const passwordHash =
      activeCredential?.passwordHash ?? this.dummyPasswordHash!;

    const passwordMatches = await this.verifyPassword(
      input.password,
      passwordHash,
    );

    if (!userRecord || !activeCredential || !passwordMatches) {
      throw new AuthInvalidCredentialsError();
    }

    const authenticated = await this.createAuthenticatedSession(
      userRecord.id,
      input.sessionMetadata,
    );

    return {
      user: toPublicUser(userRecord),
      session: authenticated.session,
      token: authenticated.token,
    };
  }

  private async validateSession(token: string): Promise<SessionRecord | null> {
    if (typeof token !== "string" || token.length === 0) {
      return null;
    }

    try {
      return await this.sessions.validate(token);
    } catch (error) {
      throw new AuthSessionError(
        "Could not validate the authentication session.",
        { cause: error },
      );
    }
  }

  async getCurrentUser(token: string): Promise<AuthUser | null> {
    this.assertInitialized();

    const session = await this.validateSession(token);

    if (!session || session.kind !== "authenticated" || !session.userId) {
      return null;
    }

    const user = await this.storage.findById<AuthUserStorageRecord>(
      this.usersCollection,
      session.userId,
    );

    return user ? toPublicUser(user) : null;
  }

  async getAuthState(token: string): Promise<AuthState> {
    this.assertInitialized();

    const session = await this.validateSession(token);

    if (!session || session.kind !== "authenticated" || !session.userId) {
      return { status: "unauthenticated" };
    }

    const user = await this.storage.findById<AuthUserStorageRecord>(
      this.usersCollection,
      session.userId,
    );

    if (!user) {
      return { status: "unauthenticated" };
    }

    return {
      status: "authenticated",
      userId: user.id,
      sessionId: session.id,
    };
  }

  async signOut(token: string): Promise<void> {
    this.assertInitialized();

    const session = await this.validateSession(token);

    if (!session) {
      return;
    }

    try {
      await this.sessions.revoke(session.id);
    } catch (error) {
      throw new AuthSessionError(
        "Could not revoke the authentication session.",
        { cause: error },
      );
    }
  }

  async signOutEverywhere(userId: string): Promise<void> {
    this.assertInitialized();

    if (typeof userId !== "string" || userId.trim().length === 0) {
      throw new AuthValidationError("A valid user ID is required.");
    }

    try {
      await this.sessions.revokeAll(userId);
    } catch (error) {
      throw new AuthSessionError("Could not revoke the user's sessions.", {
        cause: error,
      });
    }
  }
}
