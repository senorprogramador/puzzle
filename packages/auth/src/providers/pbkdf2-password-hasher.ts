import { AuthConfigurationError } from "../errors/auth.errors";

import type { PasswordHash, PasswordHasher } from "./provider.types";

export type Pbkdf2PasswordHasherOptions = {
  /**
   * Secret key of at least 32 bytes that is mixed into every hash. Store it
   * outside the database (for example as a Worker secret) so a leaked database
   * cannot be cracked offline without it.
   */
  readonly pepper: Uint8Array;
  /**
   * PBKDF2-HMAC-SHA256 iterations. Defaults to 100,000, the maximum supported
   * by Cloudflare Workers. Use a higher count on runtimes that allow it.
   */
  readonly iterations?: number;
};

const ALGORITHM = "pbkdf2-sha256";
const DEFAULT_ITERATIONS = 100_000;
const MINIMUM_ITERATIONS = 100_000;
const MINIMUM_PEPPER_BYTES = 32;
const SALT_BYTES = 16;
const HASH_BITS = 256;

const getCrypto = (): Crypto => {
  const cryptoApi = globalThis.crypto;

  if (!cryptoApi?.getRandomValues || !cryptoApi.subtle) {
    throw new AuthConfigurationError(
      "This runtime does not provide the required Web Crypto APIs.",
    );
  }

  return cryptoApi;
};

const toBase64 = (bytes: Uint8Array): string =>
  btoa(String.fromCharCode(...bytes)).replace(/=+$/, "");

const fromBase64 = (value: string): Uint8Array<ArrayBuffer> => {
  if (!/^[A-Za-z0-9+/]+$/.test(value)) {
    throw new AuthConfigurationError("The stored password hash is malformed.");
  }

  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
};

const constantTimeEqual = (left: Uint8Array, right: Uint8Array): boolean => {
  if (left.length !== right.length) return false;

  let difference = 0;

  for (let index = 0; index < left.length; index++) {
    difference |= left[index]! ^ right[index]!;
  }

  return difference === 0;
};

const assertIterations = (iterations: number) => {
  if (!Number.isSafeInteger(iterations) || iterations < MINIMUM_ITERATIONS) {
    throw new AuthConfigurationError(
      `PBKDF2 requires at least ${MINIMUM_ITERATIONS} iterations.`,
    );
  }
};

const parseHash = (stored: PasswordHash) => {
  // Format: $pbkdf2-sha256$i=<iterations>$<salt>$<hash>
  const [empty, algorithm, iterationPart, salt, hash, ...rest] =
    stored.hash.split("$");
  const iterations = Number(iterationPart?.replace(/^i=/, ""));

  if (
    stored.algorithm !== ALGORITHM ||
    empty !== "" ||
    algorithm !== ALGORITHM ||
    !iterationPart?.startsWith("i=") ||
    !salt ||
    !hash ||
    rest.length > 0
  ) {
    throw new AuthConfigurationError(
      "The stored password hash is not a PBKDF2-SHA256 hash.",
    );
  }

  assertIterations(iterations);

  return { iterations, salt: fromBase64(salt), hash: fromBase64(hash) };
};

/**
 * PBKDF2-HMAC-SHA256 password hasher built on Web Crypto. It runs natively on
 * Node.js, Bun, Deno, and Cloudflare Workers without WebAssembly or native
 * modules. Prefer Argon2id where its CPU and memory cost is affordable; use
 * this hasher where it is not, such as on the Cloudflare Workers Free plan.
 */
export class Pbkdf2PasswordHasher implements PasswordHasher {
  private readonly iterations: number;
  private readonly pepperKey: Promise<CryptoKey>;

  constructor(options: Pbkdf2PasswordHasherOptions) {
    if (
      !(options.pepper instanceof Uint8Array) ||
      options.pepper.length < MINIMUM_PEPPER_BYTES
    ) {
      throw new AuthConfigurationError(
        `The password pepper must be at least ${MINIMUM_PEPPER_BYTES} bytes.`,
      );
    }

    this.iterations = options.iterations ?? DEFAULT_ITERATIONS;
    assertIterations(this.iterations);

    this.pepperKey = getCrypto().subtle.importKey(
      "raw",
      new Uint8Array(options.pepper),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
  }

  private async derive(
    password: string,
    salt: Uint8Array<ArrayBuffer>,
    iterations: number,
  ): Promise<Uint8Array> {
    const subtle = getCrypto().subtle;

    // Keying the password with the pepper first means the PBKDF2 input is
    // unknown to anyone who only has the database.
    const peppered = await subtle.sign(
      "HMAC",
      await this.pepperKey,
      new TextEncoder().encode(password),
    );

    const key = await subtle.importKey("raw", peppered, "PBKDF2", false, [
      "deriveBits",
    ]);

    return new Uint8Array(
      await subtle.deriveBits(
        { name: "PBKDF2", hash: "SHA-256", salt, iterations },
        key,
        HASH_BITS,
      ),
    );
  }

  async hash(password: string): Promise<PasswordHash> {
    const salt = getCrypto().getRandomValues(new Uint8Array(SALT_BYTES));
    const hash = await this.derive(password, salt, this.iterations);

    return {
      algorithm: ALGORITHM,
      hash: `$${ALGORITHM}$i=${this.iterations}$${toBase64(salt)}$${toBase64(hash)}`,
      parameters: { iterations: this.iterations, pepper: "hmac-sha256" },
    };
  }

  async verify(password: string, stored: PasswordHash): Promise<boolean> {
    const { iterations, salt, hash } = parseHash(stored);

    return constantTimeEqual(
      await this.derive(password, salt, iterations),
      hash,
    );
  }

  needsRehash(stored: PasswordHash): boolean {
    return (
      stored.algorithm !== ALGORITHM ||
      parseHash(stored).iterations < this.iterations
    );
  }
}
