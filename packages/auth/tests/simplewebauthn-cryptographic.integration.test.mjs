import test from "node:test";
import assert from "node:assert/strict";

import { SimpleWebAuthnProvider } from "../dist/index.js";

import { createWebAuthnCredentialFixture } from "./fixtures/webauthn-cryptographic-fixture.mjs";

const provider = new SimpleWebAuthnProvider();

const origin = "https://example.com";
const rpId = "example.com";

const createChallenge = () =>
  Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString("base64url");

const verifyRegistration = async ({
  challenge,
  response,
  expectedChallenge = challenge,
  expectedOrigin = origin,
  expectedRpId = rpId,
}) =>
  provider.verifyRegistrationResponse({
    response,
    expectedChallenge,
    expectedOrigin,
    expectedRpId,
  });

test("verifies a real cryptographic WebAuthn registration", async () => {
  const challenge = createChallenge();

  const fixture = createWebAuthnCredentialFixture({
    challenge,
    origin,
    rpId,
  });

  const result = await verifyRegistration({
    challenge,
    response: fixture.registrationResponse,
  });

  assert.equal(result.verified, true);
  assert.equal(result.userVerified, true);

  assert.ok(result.credential);
  assert.equal(result.credential.credentialId, fixture.credentialId);

  assert.equal(result.credential.counter, 0);
  assert.ok(result.credential.publicKey.length > 0);
  assert.deepEqual(result.credential.transports, ["internal"]);
});

test("verifies a real cryptographic WebAuthn authentication", async () => {
  const registrationChallenge = createChallenge();

  const fixture = createWebAuthnCredentialFixture({
    challenge: registrationChallenge,
    origin,
    rpId,
  });

  const registration = await verifyRegistration({
    challenge: registrationChallenge,
    response: fixture.registrationResponse,
  });

  assert.equal(registration.verified, true);

  const authenticationChallenge = createChallenge();

  const response = fixture.createAuthenticationResponse({
    challenge: authenticationChallenge,
    counter: 1,
  });

  const result = await provider.verifyAuthenticationResponse({
    response,
    expectedChallenge: authenticationChallenge,
    expectedOrigin: origin,
    expectedRpId: rpId,
    credential: registration.credential,
  });

  assert.equal(result.verified, true);
  assert.equal(result.userVerified, true);
  assert.equal(result.credentialId, fixture.credentialId);
  assert.equal(result.newCounter, 1);
});

test("rejects registration with a mismatched challenge", async () => {
  const challenge = createChallenge();

  const fixture = createWebAuthnCredentialFixture({
    challenge,
    origin,
    rpId,
  });

  await assert.rejects(() =>
    verifyRegistration({
      challenge,
      expectedChallenge: createChallenge(),
      response: fixture.registrationResponse,
    }),
  );
});

test("rejects registration with an unexpected origin", async () => {
  const challenge = createChallenge();

  const fixture = createWebAuthnCredentialFixture({
    challenge,
    origin,
    rpId,
  });

  await assert.rejects(() =>
    verifyRegistration({
      challenge,
      expectedOrigin: "https://attacker.example",
      response: fixture.registrationResponse,
    }),
  );
});

test("rejects registration with an unexpected relying party ID", async () => {
  const challenge = createChallenge();

  const fixture = createWebAuthnCredentialFixture({
    challenge,
    origin,
    rpId,
  });

  await assert.rejects(() =>
    verifyRegistration({
      challenge,
      expectedRpId: "attacker.example",
      response: fixture.registrationResponse,
    }),
  );
});

test("rejects authentication with a mismatched challenge", async () => {
  const registrationChallenge = createChallenge();

  const fixture = createWebAuthnCredentialFixture({
    challenge: registrationChallenge,
    origin,
    rpId,
  });

  const registration = await verifyRegistration({
    challenge: registrationChallenge,
    response: fixture.registrationResponse,
  });

  const response = fixture.createAuthenticationResponse({
    challenge: createChallenge(),
    counter: 1,
  });

  await assert.rejects(() =>
    provider.verifyAuthenticationResponse({
      response,
      expectedChallenge: createChallenge(),
      expectedOrigin: origin,
      expectedRpId: rpId,
      credential: registration.credential,
    }),
  );
});

test("rejects authentication with an invalid signature", async () => {
  const registrationChallenge = createChallenge();

  const fixture = createWebAuthnCredentialFixture({
    challenge: registrationChallenge,
    origin,
    rpId,
  });

  const registration = await verifyRegistration({
    challenge: registrationChallenge,
    response: fixture.registrationResponse,
  });

  const authenticationChallenge = createChallenge();

  const response = fixture.createAuthenticationResponse({
    challenge: authenticationChallenge,
    counter: 1,
  });

  const signature = Buffer.from(response.response.signature, "base64url");

  signature[0] ^= 0xff;

  const tamperedResponse = {
    ...response,
    response: {
      ...response.response,
      signature: signature.toString("base64url"),
    },
  };

  const result = await provider
    .verifyAuthenticationResponse({
      response: tamperedResponse,
      expectedChallenge: authenticationChallenge,
      expectedOrigin: origin,
      expectedRpId: rpId,
      credential: registration.credential,
    })
    .catch(() => ({
      verified: false,
      userVerified: false,
    }));

  assert.equal(result.verified, false);
  assert.equal(result.userVerified, false);
});
