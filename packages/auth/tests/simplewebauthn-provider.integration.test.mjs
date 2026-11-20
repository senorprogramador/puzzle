import test from "node:test";
import assert from "node:assert/strict";

import { COSEALG } from "@simplewebauthn/server/helpers";

import { SimpleWebAuthnProvider } from "../dist/index.js";

const provider = new SimpleWebAuthnProvider();

const challenge = "A".repeat(43);

const baseInput = {
  challenge,
  rpId: "example.com",
  rpName: "Puzzle Test",
};

test("generates registration options with the supplied challenge", async () => {
  const options = await provider.generateRegistrationOptions({
    ...baseInput,
    userId: "user-1",
    userName: "user@example.com",
    excludeCredentialIds: [],
  });

  assert.equal(options.challenge, challenge);
  assert.equal(options.rp.id, "example.com");
  assert.equal(options.rp.name, "Puzzle Test");
  assert.equal(options.user.name, "user@example.com");
  assert.equal(options.authenticatorSelection.userVerification, "required");
  assert.equal(options.authenticatorSelection.residentKey, "required");
  assert.deepEqual(
    options.pubKeyCredParams.map(({ alg }) => alg),
    [COSEALG.EdDSA, COSEALG.ES256, COSEALG.RS256],
  );
});

test("supports a configured WebAuthn algorithm allowlist", async () => {
  const configuredProvider = new SimpleWebAuthnProvider({
    supportedAlgorithmIDs: [COSEALG.ES256],
  });

  const options = await configuredProvider.generateRegistrationOptions({
    ...baseInput,
    userId: "user-1",
    userName: "user@example.com",
    excludeCredentialIds: [],
  });

  assert.deepEqual(
    options.pubKeyCredParams.map(({ alg }) => alg),
    [COSEALG.ES256],
  );
});

test("rejects an empty WebAuthn algorithm allowlist", () => {
  assert.throws(
    () => new SimpleWebAuthnProvider({ supportedAlgorithmIDs: [] }),
    /non-empty list/,
  );
});

test("excludes previously registered credentials", async () => {
  const options = await provider.generateRegistrationOptions({
    ...baseInput,
    userId: "user-1",
    userName: "user@example.com",
    excludeCredentialIds: ["credential-id-1"],
  });

  assert.deepEqual(
    options.excludeCredentials.map((credential) => credential.id),
    ["credential-id-1"],
  );
});

test("generates discoverable authentication options", async () => {
  const options = await provider.generateAuthenticationOptions({
    ...baseInput,
    userVerification: "required",
  });

  assert.equal(options.challenge, challenge);
  assert.equal(options.rpId, "example.com");
  assert.equal(options.userVerification, "required");
  assert.equal(options.allowCredentials, undefined);
});

test("generates authentication options for selected credentials", async () => {
  const options = await provider.generateAuthenticationOptions({
    ...baseInput,
    userVerification: "required",
    allowCredentialIds: ["credential-id-1", "credential-id-2"],
  });

  assert.deepEqual(
    options.allowCredentials.map((credential) => credential.id),
    ["credential-id-1", "credential-id-2"],
  );
});

test("preserves base64url challenge bytes in both option generators", async () => {
  for (const length of [32, 48, 64]) {
    const challenge = Buffer.alloc(length, 251).toString("base64url");

    const registration = await provider.generateRegistrationOptions({
      ...baseInput,
      challenge,
      userId: "user-1",
      userName: "user@example.com",
      excludeCredentialIds: [],
    });

    const authentication = await provider.generateAuthenticationOptions({
      ...baseInput,
      challenge,
      userVerification: "required",
    });

    assert.equal(registration.challenge, challenge);
    assert.equal(authentication.challenge, challenge);
    assert.deepEqual(
      Buffer.from(registration.challenge, "base64url"),
      Buffer.alloc(length, 251),
    );
  }
});

test("rejects malformed registration responses before cryptographic verification", async () => {
  await assert.rejects(
    () =>
      provider.verifyRegistrationResponse({
        response: {},
        expectedChallenge: challenge,
        expectedOrigin: "https://example.com",
        expectedRpId: "example.com",
      }),
    /registration response is invalid/,
  );
});

test("rejects malformed authentication responses before cryptographic verification", async () => {
  await assert.rejects(
    () =>
      provider.verifyAuthenticationResponse({
        response: {},
        expectedChallenge: challenge,
        expectedOrigin: "https://example.com",
        expectedRpId: "example.com",
        credential: {
          credentialId: "credential-id",
          publicKey: "AQID",
          counter: 0,
        },
      }),
    /authentication response is invalid/,
  );
});

test("rejects a mismatched relying-party origin configuration", async () => {
  await assert.rejects(
    () =>
      provider.generateAuthenticationOptions({
        challenge,
        rpId: "example.com/path",
        userVerification: "required",
      }),
    /RP ID is invalid/,
  );
});
