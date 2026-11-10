import test from "node:test";
import assert from "node:assert/strict";

import {
  AuthAccountConflictError,
  AuthInvalidCredentialsError,
  AuthTokenError,
  AuthValidationError,
  StorageAuthLifecycleManager,
} from "../dist/index.js";

import {
  createAuthHarness,
  FakeEmailProvider,
} from "./fixtures/auth-harness.mjs";

const registrationInput = {
  email: "user@example.com",
  password: "a-secure-password",
  name: "Example User",
  ipAddress: "192.0.2.10",
};

const resetUrl = "https://example.com/auth/reset-password";
const verificationUrl = "https://example.com/auth/verify-email";
const emailChangeUrl = "https://example.com/auth/verify-email-change";

const extractToken = (message) =>
  new URL(message.variables.url).searchParams.get("token");

const createLifecycleHarness = async (options = {}) => {
  const base = await createAuthHarness();
  const emailProvider = new FakeEmailProvider();

  const lifecycle = new StorageAuthLifecycleManager(
    {
      storage: base.storage,
      passwordHasher: base.passwordHasher,
      emailProvider,
      sessions: base.sessions,
      rateLimitProvider: base.rateLimitProvider,
    },
    {
      rateLimitKeySecret: "test-only-auth-rate-limit-secret-000000",
      ...options,
    },
  );

  await lifecycle.initialize();

  return {
    ...base,
    lifecycle,
    emailProvider,
  };
};

const registerUser = async (auth) => auth.register(registrationInput);

const getAuditActions = async (storage, userId) => {
  const events = await storage.findMany("auth_audit_events", {
    where: {
      userId: {
        operator: "eq",
        value: userId,
      },
    },
  });

  return events.map((event) => event.action);
};

test("sends and verifies an email verification token", async () => {
  const { auth, lifecycle, storage, emailProvider } =
    await createLifecycleHarness();

  const registered = await registerUser(auth);

  await lifecycle.sendEmailVerification({
    userId: registered.user.id,
    verificationUrl,
    ipAddress: registrationInput.ipAddress,
  });

  assert.equal(emailProvider.messages.length, 1);

  const message = emailProvider.messages[0];
  const token = extractToken(message);

  assert.equal(message.to, registrationInput.email);
  assert.equal(message.template, "auth/email-verification");
  assert.ok(token);

  const actionTokens = await storage.findMany("auth_action_tokens");

  assert.equal(actionTokens.length, 1);
  assert.equal(actionTokens[0].purpose, "email-verification");
  assert.equal(actionTokens[0].consumedAt, null);
  assert.notEqual(actionTokens[0].tokenHash, token);

  const verifiedUser = await lifecycle.verifyEmail(token);

  assert.equal(verifiedUser.id, registered.user.id);
  assert.ok(verifiedUser.emailVerifiedAt instanceof Date);

  const storedUser = await storage.findById("auth_users", registered.user.id);

  assert.ok(storedUser.emailVerifiedAt instanceof Date);
  assert.ok(
    (await getAuditActions(storage, registered.user.id)).includes(
      "email-verified",
    ),
  );
});

test("email verification tokens can only be used once", async () => {
  const { auth, lifecycle, emailProvider } = await createLifecycleHarness();

  const registered = await registerUser(auth);

  await lifecycle.sendEmailVerification({
    userId: registered.user.id,
    verificationUrl,
    ipAddress: registrationInput.ipAddress,
  });

  const token = extractToken(emailProvider.messages[0]);

  await lifecycle.verifyEmail(token);

  await assert.rejects(() => lifecycle.verifyEmail(token), AuthTokenError);
});

test("does not accept an action token for the wrong purpose", async () => {
  const { auth, lifecycle, emailProvider } = await createLifecycleHarness();

  await registerUser(auth);

  await lifecycle.requestPasswordReset({
    email: registrationInput.email,
    resetUrl,
    ipAddress: registrationInput.ipAddress,
  });

  const token = extractToken(emailProvider.messages[0]);

  await assert.rejects(() => lifecycle.verifyEmail(token), AuthTokenError);
});

test("does not disclose whether an account exists during password reset", async () => {
  const { auth, lifecycle, emailProvider, storage } =
    await createLifecycleHarness();

  await registerUser(auth);

  await assert.doesNotReject(() =>
    lifecycle.requestPasswordReset({
      email: "unknown@example.com",
      resetUrl,
      ipAddress: registrationInput.ipAddress,
    }),
  );

  assert.equal(emailProvider.messages.length, 0);

  await assert.doesNotReject(() =>
    lifecycle.requestPasswordReset({
      email: registrationInput.email,
      resetUrl,
      ipAddress: registrationInput.ipAddress,
    }),
  );

  assert.equal(emailProvider.messages.length, 1);

  const events = await storage.findMany("auth_audit_events", {
    where: {
      action: {
        operator: "eq",
        value: "password-reset-requested",
      },
    },
  });

  assert.equal(events.length, 2);

  assert.equal(events.filter((event) => event.userId === null).length, 1);

  assert.equal(events.filter((event) => event.userId !== null).length, 1);
});

test("resets a password and revokes existing sessions", async () => {
  const { auth, lifecycle, sessions, emailProvider, storage } =
    await createLifecycleHarness();

  const registered = await registerUser(auth);

  await lifecycle.requestPasswordReset({
    email: registrationInput.email,
    resetUrl,
    ipAddress: registrationInput.ipAddress,
  });

  const token = extractToken(emailProvider.messages[0]);

  await lifecycle.resetPassword({
    token,
    newPassword: "a-new-secure-password",
  });

  assert.equal(await sessions.validate(registered.token), null);

  await assert.rejects(
    () =>
      auth.signIn({
        ...registrationInput,
        ipAddress: registrationInput.ipAddress,
      }),
    AuthInvalidCredentialsError,
  );

  const signedIn = await auth.signIn({
    email: registrationInput.email,
    password: "a-new-secure-password",
    ipAddress: registrationInput.ipAddress,
  });

  assert.equal(signedIn.user.id, registered.user.id);

  const actionToken = await storage.findOne("auth_action_tokens", {
    where: {
      tokenHash: {
        operator: "eq",
        value: (await import("../dist/index.js")).hashAuthToken
          ? await (await import("../dist/index.js")).hashAuthToken(token)
          : "",
      },
    },
  });

  assert.ok(actionToken);
  assert.ok(actionToken.consumedAt instanceof Date);

  await assert.rejects(
    () =>
      lifecycle.resetPassword({
        token,
        newPassword: "another-new-password",
      }),
    AuthTokenError,
  );
});

test("does not revoke sessions or consume a reset token when the batch fails", async () => {
  const { auth, lifecycle, storage, sessions, emailProvider } =
    await createLifecycleHarness();

  const registered = await registerUser(auth);

  await lifecycle.requestPasswordReset({
    email: registrationInput.email,
    resetUrl,
    ipAddress: registrationInput.ipAddress,
  });

  const token = extractToken(emailProvider.messages[0]);

  storage.failNextBatch = true;

  await assert.rejects(
    () =>
      lifecycle.resetPassword({
        token,
        newPassword: "a-new-secure-password",
      }),
    /Simulated atomic batch failure/,
  );

  assert.ok(await sessions.validate(registered.token));

  const resetAction = await storage.findOne("auth_action_tokens", {
    where: {
      purpose: {
        operator: "eq",
        value: "password-reset",
      },
    },
  });

  assert.equal(resetAction.consumedAt, null);

  await assert.rejects(
    () =>
      auth.signIn({
        email: registrationInput.email,
        password: "a-new-secure-password",
        ipAddress: registrationInput.ipAddress,
      }),
    AuthInvalidCredentialsError,
  );

  assert.ok(
    await auth.signIn({
      email: registrationInput.email,
      password: registrationInput.password,
      ipAddress: registrationInput.ipAddress,
    }),
  );
});

test("password changes require the current password", async () => {
  const { auth, lifecycle, sessions } = await createLifecycleHarness();

  const registered = await registerUser(auth);

  await assert.rejects(
    () =>
      lifecycle.changePassword({
        sessionToken: registered.token,
        currentPassword: "incorrect-password",
        newPassword: "a-new-secure-password",
      }),
    AuthValidationError,
  );

  assert.ok(await sessions.validate(registered.token));
});

test("changes a password, revokes sessions and invalidates reset tokens", async () => {
  const { auth, lifecycle, sessions, emailProvider } =
    await createLifecycleHarness();

  const registered = await registerUser(auth);

  await lifecycle.requestPasswordReset({
    email: registrationInput.email,
    resetUrl,
    ipAddress: registrationInput.ipAddress,
  });

  const resetToken = extractToken(emailProvider.messages[0]);

  const secondSession = await auth.signIn({
    email: registrationInput.email,
    password: registrationInput.password,
    ipAddress: registrationInput.ipAddress,
  });

  await lifecycle.changePassword({
    sessionToken: registered.token,
    currentPassword: registrationInput.password,
    newPassword: "a-new-secure-password",
  });

  assert.equal(await sessions.validate(registered.token), null);
  assert.equal(await sessions.validate(secondSession.token), null);

  await assert.rejects(
    () =>
      auth.signIn({
        email: registrationInput.email,
        password: registrationInput.password,
        ipAddress: registrationInput.ipAddress,
      }),
    AuthInvalidCredentialsError,
  );

  await assert.rejects(
    () =>
      lifecycle.resetPassword({
        token: resetToken,
        newPassword: "another-new-password",
      }),
    AuthTokenError,
  );

  const signedIn = await auth.signIn({
    email: registrationInput.email,
    password: "a-new-secure-password",
    ipAddress: registrationInput.ipAddress,
  });

  assert.equal(signedIn.user.id, registered.user.id);
});

test("updates a user's profile", async () => {
  const { auth, lifecycle, storage } = await createLifecycleHarness();

  const registered = await registerUser(auth);

  const updated = await lifecycle.updateProfile({
    sessionToken: registered.token,
    name: "Updated Example",
    image: "https://example.com/avatar.webp",
  });

  assert.equal(updated.name, "Updated Example");
  assert.equal(updated.image, "https://example.com/avatar.webp");

  const stored = await storage.findById("auth_users", registered.user.id);

  assert.equal(stored.name, "Updated Example");
  assert.equal(stored.image, "https://example.com/avatar.webp");

  assert.ok(
    (await getAuditActions(storage, registered.user.id)).includes(
      "profile-updated",
    ),
  );
});

test("rejects insecure profile image URLs", async () => {
  const { auth, lifecycle } = await createLifecycleHarness();

  const registered = await registerUser(auth);

  await assert.rejects(
    () =>
      lifecycle.updateProfile({
        sessionToken: registered.token,
        image: "http://example.com/avatar.webp",
      }),
    AuthValidationError,
  );

  await assert.rejects(
    () =>
      lifecycle.updateProfile({
        sessionToken: registered.token,
        image: "https://user:password@example.com/avatar.webp",
      }),
    AuthValidationError,
  );
});

test("email changes require the current password", async () => {
  const { auth, lifecycle, emailProvider, sessions } =
    await createLifecycleHarness();

  const registered = await registerUser(auth);

  await assert.rejects(
    () =>
      lifecycle.requestEmailChange({
        sessionToken: registered.token,
        currentPassword: "incorrect-password",
        email: "new@example.com",
        verificationUrl: emailChangeUrl,
        ipAddress: registrationInput.ipAddress,
      }),
    AuthValidationError,
  );

  assert.equal(emailProvider.messages.length, 0);
  assert.ok(await sessions.validate(registered.token));
});

test("verifies an email change and revokes existing sessions", async () => {
  const { auth, lifecycle, sessions, emailProvider, storage } =
    await createLifecycleHarness();

  const registered = await registerUser(auth);

  const secondSession = await auth.signIn({
    email: registrationInput.email,
    password: registrationInput.password,
    ipAddress: registrationInput.ipAddress,
  });

  await lifecycle.requestEmailChange({
    sessionToken: registered.token,
    currentPassword: registrationInput.password,
    email: "new@example.com",
    verificationUrl: emailChangeUrl,
    ipAddress: registrationInput.ipAddress,
  });

  assert.equal(emailProvider.messages.length, 1);
  assert.equal(emailProvider.messages[0].to, "new@example.com");

  const token = extractToken(emailProvider.messages[0]);

  const updated = await lifecycle.verifyEmailChange(token);

  assert.equal(updated.email, "new@example.com");
  assert.ok(updated.emailVerifiedAt instanceof Date);

  assert.equal(await sessions.validate(registered.token), null);
  assert.equal(await sessions.validate(secondSession.token), null);

  await assert.rejects(
    () =>
      auth.signIn({
        email: registrationInput.email,
        password: registrationInput.password,
        ipAddress: registrationInput.ipAddress,
      }),
    AuthInvalidCredentialsError,
  );

  const signedIn = await auth.signIn({
    email: "new@example.com",
    password: registrationInput.password,
    ipAddress: registrationInput.ipAddress,
  });

  assert.equal(signedIn.user.id, registered.user.id);

  assert.ok(
    (await getAuditActions(storage, registered.user.id)).includes(
      "email-changed",
    ),
  );

  await assert.rejects(
    () => lifecycle.verifyEmailChange(token),
    AuthTokenError,
  );
});

test("rejects an email change to an address already in use", async () => {
  const { auth, lifecycle, emailProvider } = await createLifecycleHarness();

  const first = await registerUser(auth);

  await auth.register({
    email: "other@example.com",
    password: "another-secure-password",
    name: "Other User",
    ipAddress: registrationInput.ipAddress,
  });

  await assert.rejects(
    () =>
      lifecycle.requestEmailChange({
        sessionToken: first.token,
        currentPassword: registrationInput.password,
        email: "other@example.com",
        verificationUrl: emailChangeUrl,
        ipAddress: registrationInput.ipAddress,
      }),
    AuthAccountConflictError,
  );

  assert.equal(emailProvider.messages.length, 0);
});

test("rejects password confirmation when deleting an account", async () => {
  const { auth, lifecycle, sessions } = await createLifecycleHarness();

  const registered = await registerUser(auth);

  await assert.rejects(
    () =>
      lifecycle.deleteAccount({
        sessionToken: registered.token,
        password: "incorrect-password",
      }),
    AuthValidationError,
  );

  assert.ok(await sessions.validate(registered.token));
});

test("deletes the account, credentials and action tokens", async () => {
  const { auth, lifecycle, storage, sessions, emailProvider } =
    await createLifecycleHarness();

  const registered = await registerUser(auth);

  await lifecycle.sendEmailVerification({
    userId: registered.user.id,
    verificationUrl,
    ipAddress: registrationInput.ipAddress,
  });

  assert.equal(emailProvider.messages.length, 1);

  await lifecycle.deleteAccount({
    sessionToken: registered.token,
    password: registrationInput.password,
  });

  assert.equal(await storage.findById("auth_users", registered.user.id), null);

  assert.equal(await storage.count("auth_credentials"), 0);

  assert.equal(await storage.count("auth_action_tokens"), 0);

  assert.equal(await sessions.validate(registered.token), null);

  const auditEvents = await storage.findMany("auth_audit_events", {
    where: {
      userId: {
        operator: "eq",
        value: registered.user.id,
      },
      action: {
        operator: "eq",
        value: "account-deleted",
      },
    },
  });

  assert.equal(auditEvents.length, 1);
});

test("does not revoke sessions or partially delete an account when the batch fails", async () => {
  const { auth, lifecycle, storage, sessions } = await createLifecycleHarness();

  const registered = await registerUser(auth);

  storage.failNextBatch = true;

  await assert.rejects(
    () =>
      lifecycle.deleteAccount({
        sessionToken: registered.token,
        password: registrationInput.password,
      }),
    /Simulated atomic batch failure/,
  );

  assert.ok(await storage.findById("auth_users", registered.user.id));
  assert.equal(await storage.count("auth_credentials"), 1);
  assert.ok(await sessions.validate(registered.token));
});

test("records lifecycle audit events", async () => {
  const { auth, lifecycle, storage, emailProvider } =
    await createLifecycleHarness();

  const registered = await registerUser(auth);

  await lifecycle.sendEmailVerification({
    userId: registered.user.id,
    verificationUrl,
    ipAddress: registrationInput.ipAddress,
  });

  await lifecycle.verifyEmail(extractToken(emailProvider.messages[0]));

  await lifecycle.requestPasswordReset({
    email: registrationInput.email,
    resetUrl,
    ipAddress: registrationInput.ipAddress,
  });

  const events = await getAuditActions(storage, registered.user.id);

  assert.ok(events.includes("account-registered"));
  assert.ok(events.includes("email-verification-requested"));
  assert.ok(events.includes("email-verified"));
  assert.ok(events.includes("password-reset-requested"));
});
