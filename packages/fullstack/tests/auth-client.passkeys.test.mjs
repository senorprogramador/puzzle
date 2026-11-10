import test from "node:test";
import assert from "node:assert/strict";

import {
  createAuthClient,
  createPasskeyBrowserHelpers,
} from "../dist/auth/client/index.js";

const withFakeNavigator = async (callback) => {
  const original = Object.getOwnPropertyDescriptor(globalThis, "navigator");

  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: {
      credentials: {
        create() {},
        get() {},
      },
    },
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

test("browser registration helper passes server options to the WebAuthn adapter", async () => {
  await withFakeNavigator(async () => {
    let received;

    const helpers = createPasskeyBrowserHelpers({
      async startRegistration(input) {
        received = input.optionsJSON;

        return {
          id: "credential-id",
          type: "public-key",
        };
      },

      async startAuthentication() {
        throw new Error("Unexpected authentication call.");
      },
    });

    const result = await helpers.startRegistration({
      challenge: "A".repeat(43),
      rp: {
        id: "example.com",
        name: "Example",
      },
    });

    assert.equal(received.challenge, "A".repeat(43));
    assert.equal(result.id, "credential-id");
  });
});

test("browser authentication helper passes server options to the WebAuthn adapter", async () => {
  await withFakeNavigator(async () => {
    let received;

    const helpers = createPasskeyBrowserHelpers({
      async startRegistration() {
        throw new Error("Unexpected registration call.");
      },

      async startAuthentication(input) {
        received = input.optionsJSON;

        return {
          id: "credential-id",
          type: "public-key",
        };
      },
    });

    const result = await helpers.startAuthentication({
      challenge: "B".repeat(43),
      rpId: "example.com",
      userVerification: "required",
    });

    assert.equal(received.challenge, "B".repeat(43));
    assert.equal(result.id, "credential-id");
  });
});

test("browser helpers reject malformed options before invoking WebAuthn", async () => {
  await withFakeNavigator(async () => {
    let called = false;

    const helpers = createPasskeyBrowserHelpers({
      async startRegistration() {
        called = true;
        return {};
      },

      async startAuthentication() {
        called = true;
        return {};
      },
    });

    await assert.rejects(
      () =>
        helpers.startRegistration({
          challenge: "",
        }),
      /invalid WebAuthn options/,
    );

    await assert.rejects(
      () =>
        helpers.startAuthentication({
          challenge: "",
        }),
      /invalid WebAuthn options/,
    );

    assert.equal(called, false);
  });
});

test("auth client sends same-origin credentials and never persists a challenge token", async () => {
  const calls = [];

  const expiresAt = new Date(Date.now() + 300_000).toISOString();

  const fetcher = async (url, init) => {
    calls.push({
      url,
      init,
    });

    if (url.endsWith("/sign-in")) {
      return new Response(
        JSON.stringify({
          status: "mfa-pending",
          purpose: "sign-in",
          challengeId: "challenge-1",
          expiresAt,
          availableFactors: ["totp", "passkey"],
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    if (url.endsWith("/state")) {
      return new Response(
        JSON.stringify({
          status: "mfa-pending",
          user: null,
          mfa: {
            purpose: "sign-in",
            challengeId: "challenge-1",
            expiresAt,
            availableFactors: ["totp", "passkey"],
          },
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    throw new Error(`Unexpected test request: ${url}`);
  };

  const client = createAuthClient({
    fetcher,
  });

  const snapshot = await client.signIn({
    email: "user@example.com",
    password: "correct-password",
  });

  assert.equal(snapshot.status, "mfa-pending");
  assert.equal(snapshot.mfa.challengeId, "challenge-1");

  assert.equal(calls.length, 2);
  assert.equal(calls[0].init.credentials, "same-origin");

  const requestBody = JSON.parse(calls[0].init.body);

  assert.equal(Object.hasOwn(requestBody, "challengeToken"), false);

  assert.equal(Object.hasOwn(snapshot, "challengeToken"), false);

  assert.equal(Object.hasOwn(snapshot.mfa, "challengeToken"), false);
});
