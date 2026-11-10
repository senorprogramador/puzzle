import {
  AuthConfigurationError,
  AuthValidationError,
} from "../errors/auth.errors";

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

const getCrypto = (): Crypto => {
  const cryptoApi = globalThis.crypto;

  if (!cryptoApi?.getRandomValues || !cryptoApi.subtle) {
    throw new AuthConfigurationError(
      "This runtime does not provide the required Web Crypto APIs.",
    );
  }

  return cryptoApi;
};

const validateTotpOptions = (options: {
  readonly digits: number;
  readonly periodSeconds: number;
}): void => {
  if (
    !Number.isInteger(options.digits) ||
    options.digits < 6 ||
    options.digits > 8
  ) {
    throw new AuthValidationError("TOTP digits must be between 6 and 8.");
  }

  if (
    !Number.isInteger(options.periodSeconds) ||
    options.periodSeconds < 15 ||
    options.periodSeconds > 120
  ) {
    throw new AuthValidationError(
      "The TOTP period must be between 15 and 120 seconds.",
    );
  }
};

const constantTimeEqual = (left: string, right: string): boolean => {
  if (left.length !== right.length) return false;

  let difference = 0;

  for (let index = 0; index < left.length; index++) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return difference === 0;
};

export const encodeBase32 = (input: Uint8Array): string => {
  let output = "";
  let buffer = 0;
  let bits = 0;

  for (const byte of input) {
    buffer = (buffer << 8) | byte;
    bits += 8;

    while (bits >= 5) {
      bits -= 5;
      output += BASE32_ALPHABET[(buffer >>> bits) & 31];
    }
  }

  if (bits > 0) {
    output += BASE32_ALPHABET[(buffer << (5 - bits)) & 31];
  }

  return output;
};

export const decodeBase32 = (input: string): Uint8Array => {
  if (typeof input !== "string" || input.length === 0) {
    throw new AuthValidationError("A valid TOTP secret is required.");
  }

  const normalized = input.toUpperCase().replace(/[\s=-]/g, "");

  const output: number[] = [];
  let buffer = 0;
  let bits = 0;

  for (const character of normalized) {
    const value = BASE32_ALPHABET.indexOf(character);

    if (value < 0) {
      throw new AuthValidationError("The TOTP secret is invalid.");
    }

    buffer = (buffer << 5) | value;
    bits += 5;

    if (bits >= 8) {
      bits -= 8;
      output.push((buffer >>> bits) & 255);
    }
  }

  if (output.length === 0) {
    throw new AuthValidationError("The TOTP secret is invalid.");
  }

  return new Uint8Array(output);
};

export const generateTotpSecret = (): string => {
  const bytes = new Uint8Array(20);

  getCrypto().getRandomValues(bytes);

  return encodeBase32(bytes);
};

export const generateTotpCode = async (
  secret: string,
  timestamp: number,
  options: { readonly digits: number; readonly periodSeconds: number },
): Promise<string> => {
  validateTotpOptions(options);

  if (!Number.isFinite(timestamp) || timestamp < 0) {
    throw new AuthValidationError("A valid TOTP timestamp is required.");
  }

  const counter = BigInt(Math.floor(timestamp / 1000 / options.periodSeconds));

  const counterBytes = new Uint8Array(8);

  let remaining = counter;

  for (let index = 7; index >= 0; index--) {
    counterBytes[index] = Number(remaining & 255n);
    remaining >>= 8n;
  }

  const cryptoApi = getCrypto();

  const key = await cryptoApi.subtle.importKey(
    "raw",
    decodeBase32(secret),
    {
      name: "HMAC",
      hash: "SHA-1",
    },
    false,
    ["sign"],
  );

  const signature = await cryptoApi.subtle.sign("HMAC", key, counterBytes);

  const hash = new Uint8Array(signature);
  const offset = hash[hash.length - 1]! & 0x0f;

  const binary =
    ((hash[offset]! & 0x7f) << 24) |
    (hash[offset + 1]! << 16) |
    (hash[offset + 2]! << 8) |
    hash[offset + 3]!;

  const modulus = 10 ** options.digits;

  return String((binary >>> 0) % modulus).padStart(options.digits, "0");
};

/**
 * Returns the matching time step, or null.
 *
 * The caller must persist the accepted step and reject a step that
 * has already been consumed.
 */
export const verifyTotpCode = async (
  secret: string,
  code: string,
  timestamp: number,
  options: {
    readonly digits: number;
    readonly periodSeconds: number;
    readonly window: number;
  },
): Promise<number | null> => {
  validateTotpOptions(options);

  if (
    !Number.isInteger(options.window) ||
    options.window < 0 ||
    options.window > 2
  ) {
    throw new AuthValidationError(
      "The TOTP validation window must be between 0 and 2.",
    );
  }

  if (
    typeof code !== "string" ||
    !new RegExp(`^\\d{${options.digits}}$`).test(code)
  ) {
    return null;
  }

  const currentStep = Math.floor(timestamp / 1000 / options.periodSeconds);

  let matchedStep: number | null = null;

  for (
    let step = currentStep - options.window;
    step <= currentStep + options.window;
    step++
  ) {
    if (step < 0) continue;

    const expected = await generateTotpCode(
      secret,
      step * options.periodSeconds * 1000,
      options,
    );

    if (constantTimeEqual(expected, code)) {
      matchedStep = step;
    }
  }

  return matchedStep;
};

export const createTotpUri = (input: {
  readonly issuer: string;
  readonly account: string;
  readonly secret: string;
  readonly digits: number;
  readonly periodSeconds: number;
}): string => {
  const label = encodeURIComponent(`${input.issuer}:${input.account}`);

  const parameters = new URLSearchParams({
    secret: input.secret,
    issuer: input.issuer,
    algorithm: "SHA1",
    digits: String(input.digits),
    period: String(input.periodSeconds),
  });

  return `otpauth://totp/${label}?${parameters.toString()}`;
};
