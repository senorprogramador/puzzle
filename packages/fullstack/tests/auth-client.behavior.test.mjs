import test from "node:test";
import assert from "node:assert/strict";

import {
  createPasskeyBrowserHelpers,
  getAuthLocale,
  resolveAuthMessages,
} from "../dist/auth/client/index.js";

const withFakeNavigator = async (value, callback) => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "navigator");
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value,
  });

  try {
    await callback();
  } finally {
    if (original) {
      Object.defineProperty(globalThis, "navigator", original);
    } else {
      delete globalThis.navigator;
    }
  }
};

const supportedNavigator = () => ({
  credentials: {
    create() {},
    get() {},
  },
});

test("passkey helpers forward the complete options and preserve adapter results", async () => {
  await withFakeNavigator(supportedNavigator(), async () => {
    const registrationResult = { id: "registration" };
    const authenticationResult = { id: "authentication" };
    const calls = [];
    const helpers = createPasskeyBrowserHelpers({
      async startRegistration(input) {
        calls.push(["registration", input.optionsJSON]);
        return registrationResult;
      },
      async startAuthentication(input) {
        calls.push(["authentication", input.optionsJSON]);
        return authenticationResult;
      },
    });
    const registrationOptions = { challenge: "r".repeat(32), rp: { id: "example.com" } };
    const authenticationOptions = { challenge: "a".repeat(32), allowCredentials: [] };

    assert.equal(await helpers.startRegistration(registrationOptions), registrationResult);
    assert.equal(await helpers.startAuthentication(authenticationOptions), authenticationResult);
    assert.deepEqual(calls, [
      ["registration", registrationOptions],
      ["authentication", authenticationOptions],
    ]);
  });
});

test("passkey helpers reject unsupported browsers and malformed options before delegation", async () => {
  let delegated = false;
  const helpers = createPasskeyBrowserHelpers({
    async startRegistration() {
      delegated = true;
    },
    async startAuthentication() {
      delegated = true;
    },
  });

  await withFakeNavigator({ credentials: { create() {} } }, async () => {
    assert.equal(helpers.isSupported(), false);
    await assert.rejects(
      helpers.startRegistration({ challenge: "x".repeat(32) }),
      /not supported in this browser/,
    );
    await assert.rejects(
      helpers.startAuthentication({ challenge: "x".repeat(32) }),
      /not supported in this browser/,
    );
  });
  assert.equal(delegated, false);

  await withFakeNavigator(supportedNavigator(), async () => {
    await assert.rejects(
      helpers.startRegistration({ challenge: "short" }),
      /invalid WebAuthn options/,
    );
    await assert.rejects(
      helpers.startAuthentication({ challenge: 42 }),
      /invalid WebAuthn options/,
    );
  });
  assert.equal(delegated, false);
});

test("passkey adapter failures propagate without being rewritten", async () => {
  await withFakeNavigator(supportedNavigator(), async () => {
    const registrationError = new Error("registration was cancelled");
    const authenticationError = new Error("authenticator unavailable");
    const helpers = createPasskeyBrowserHelpers({
      async startRegistration() {
        throw registrationError;
      },
      async startAuthentication() {
        throw authenticationError;
      },
    });

    await assert.rejects(
      helpers.startRegistration({ challenge: "r".repeat(32) }),
      (error) => error === registrationError,
    );
    await assert.rejects(
      helpers.startAuthentication({ challenge: "a".repeat(32) }),
      (error) => error === authenticationError,
    );
  });
});

test("auth messages resolve built-in, custom-locale, validation and override strings", () => {
  const localized = {
    signIn: "Inloggen",
    emailRequired: "E-mailadres is verplicht.",
    unexpectedError: "Er ging iets mis.",
  };
  const localeMessages = {
    nl: {
      ...resolveAuthMessages(),
      ...localized,
    },
  };

  assert.equal(getAuthLocale("nl", localeMessages), "nl");
  assert.equal(getAuthLocale("fr", localeMessages), "en");
  assert.equal(getAuthLocale(null, localeMessages), "en");
  assert.equal(resolveAuthMessages().signIn, "Sign in");

  const messages = resolveAuthMessages("nl", localeMessages, {
    signIn: "Aanmelden",
    invalidCredentials: "Controleer je inloggegevens.",
  });
  assert.equal(messages.signIn, "Aanmelden");
  assert.equal(messages.emailRequired, "E-mailadres is verplicht.");
  assert.equal(messages.invalidCredentials, "Controleer je inloggegevens.");
  assert.equal(messages.unexpectedError, "Er ging iets mis.");

  const unknownFallback = resolveAuthMessages("nl", {});
  assert.equal(unknownFallback.signIn, "Sign in");
  assert.equal(unknownFallback.unexpectedError, "Something went wrong. Please try again.");
});
