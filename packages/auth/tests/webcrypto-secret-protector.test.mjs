import test from "node:test";
import assert from "node:assert/strict";

import {
  AuthConfigurationError,
  WebCryptoAuthSecretProtector,
} from "../dist/index.js";

const key = (byte) => new Uint8Array(32).fill(byte);

const createProtector = (secret = key(7)) =>
  new WebCryptoAuthSecretProtector({
    currentKeyId: "primary",
    keys: { primary: secret },
  });

test("encrypts and decrypts a secret with authenticated ciphertext", async () => {
  const protector = createProtector();
  const encrypted = await protector.encrypt("totp-shared-secret");

  assert.equal(encrypted.keyId, "primary");
  assert.match(encrypted.ciphertext, /^[A-Za-z0-9_-]+$/);
  assert.match(encrypted.iv, /^[A-Za-z0-9_-]+$/);
  assert.equal(await protector.decrypt(encrypted), "totp-shared-secret");

  const second = await protector.encrypt("totp-shared-secret");
  assert.notEqual(second.iv, encrypted.iv);
  assert.notEqual(second.ciphertext, encrypted.ciphertext);
});

test("rejects ciphertext or IV tampering and decryption with the wrong secret", async () => {
  const encrypted = await createProtector().encrypt("totp-shared-secret");

  const changedCiphertext = {
    ...encrypted,
    ciphertext: `${encrypted.ciphertext[0] === "A" ? "B" : "A"}${encrypted.ciphertext.slice(1)}`,
  };
  await assert.rejects(
    () => createProtector().decrypt(changedCiphertext),
    AuthConfigurationError,
  );

  const changedIv = {
    ...encrypted,
    iv: `${encrypted.iv[0] === "A" ? "B" : "A"}${encrypted.iv.slice(1)}`,
  };
  await assert.rejects(
    () => createProtector().decrypt(changedIv),
    AuthConfigurationError,
  );

  await assert.rejects(
    () => createProtector(key(8)).decrypt(encrypted),
    AuthConfigurationError,
  );
});

test("rejects incomplete and malformed encrypted values", async () => {
  const protector = createProtector();

  await assert.rejects(
    () => protector.decrypt(null),
    AuthConfigurationError,
  );
  await assert.rejects(
    () => protector.decrypt({ keyId: "primary", ciphertext: "!", iv: "iv" }),
    AuthConfigurationError,
  );

  const encrypted = await protector.encrypt("secret");
  await assert.rejects(
    () => protector.decrypt({ ...encrypted, iv: "AA" }),
    AuthConfigurationError,
  );
  await assert.rejects(
    () => protector.decrypt({ ...encrypted, ciphertext: "AA" }),
    AuthConfigurationError,
  );
});
