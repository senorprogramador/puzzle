import test from "node:test";
import assert from "node:assert/strict";

import {
  AuthEmailVerificationRequiredError,
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

const signInInput = {
  email: "user@example.com",
  password: "a-secure-password",
  ipAddress: "192.0.2.10",
};

const extractToken = (message) =>
  new URL(message.variables.url).searchParams.get("token");

test("records registration, sign-in, failed sign-in and sign-out events", async () => {
  const { auth, storage } = await createAuthHarness();

  const registered = await auth.register(registrationInput);

  const signedIn = await auth.signIn(signInInput);

  await assert.rejects(
    () =>
      auth.signIn({
        ...signInInput,
        password: "incorrect-password",
      }),
    {
      code: "INVALID_CREDENTIALS",
    },
  );

  await auth.signOut(signedIn.token);

  const nextSession = await auth.signIn(signInInput);

  await auth.signOutEverywhere(nextSession.user.id);

  const events = await storage.findMany("auth_audit_events");

  assert.deepEqual(
    events.map((event) => event.action),
    [
      "account-registered",
      "sign-in",
      "sign-in-failed",
      "sign-out",
      "sign-in",
      "sign-out-everywhere",
    ],
  );

  assert.ok(
    events.every(
      (event) => event.userId === registered.user.id || event.userId === null,
    ),
  );

  assert.equal(
    events.some((event) =>
      JSON.stringify(event).includes(registrationInput.email),
    ),
    false,
  );
});

test("requires email verification before sign-in when configured", async () => {
  const harness = await createAuthHarness({
    requireVerifiedEmail: true,
  });

  const { auth, storage, passwordHasher, rateLimitProvider, sessions } =
    harness;

  const registered = await auth.register(registrationInput);

  assert.equal(await auth.getCurrentUser(registered.token), null);

  assert.deepEqual(await auth.getAuthState(registered.token), {
    status: "unauthenticated",
  });

  await assert.rejects(
    () => auth.signIn(signInInput),
    AuthEmailVerificationRequiredError,
  );

  const emailProvider = new FakeEmailProvider();

  const lifecycle = new StorageAuthLifecycleManager(
    {
      storage,
      passwordHasher,
      rateLimitProvider,
      sessions,
      emailProvider,
    },
    {
      rateLimitKeySecret: "test-only-auth-rate-limit-secret-000000",
    },
  );

  await lifecycle.initialize();

  await lifecycle.sendEmailVerification({
    userId: registered.user.id,
    verificationUrl: "https://example.com/auth/verify-email",
    ipAddress: registrationInput.ipAddress,
  });

  const token = extractToken(emailProvider.messages[0]);

  assert.ok(token);

  const verifiedUser = await lifecycle.verifyEmail(token);

  assert.ok(verifiedUser.emailVerifiedAt instanceof Date);

  const signedIn = await auth.signIn(signInInput);

  assert.equal(signedIn.user.id, registered.user.id);
  assert.ok(await auth.getCurrentUser(signedIn.token));
});
