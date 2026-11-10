import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
  type AuthenticationResponseJSON,
  type RegistrationResponseJSON,
  type WebAuthnCredential,
} from "@simplewebauthn/server";

import {
  AuthConfigurationError,
  AuthValidationError,
} from "../errors/auth.errors";

import type {
  WebAuthnAuthenticationVerification,
  WebAuthnOptionsJSON,
  WebAuthnProvider,
  WebAuthnRegistrationVerification,
} from "./mfa-provider.types";

const BASE64URL_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const encodeBase64Url = (input: Uint8Array): string => {
  let output = "";
  let index = 0;

  while (index + 2 < input.length) {
    const first = input[index++]!;
    const second = input[index++]!;
    const third = input[index++]!;

    output += BASE64URL_ALPHABET.charAt(first >> 2);
    output += BASE64URL_ALPHABET.charAt(((first & 3) << 4) | (second >> 4));
    output += BASE64URL_ALPHABET.charAt(((second & 15) << 2) | (third >> 6));
    output += BASE64URL_ALPHABET.charAt(third & 63);
  }

  if (index < input.length) {
    const first = input[index++]!;

    output += BASE64URL_ALPHABET.charAt(first >> 2);

    if (index < input.length) {
      const second = input[index]!;

      output += BASE64URL_ALPHABET.charAt(((first & 3) << 4) | (second >> 4));
      output += BASE64URL_ALPHABET.charAt((second & 15) << 2);
    } else {
      output += BASE64URL_ALPHABET.charAt((first & 3) << 4);
    }
  }

  return output;
};

const decodeBase64Url = (
  value: string,
  errorMessage = "The stored passkey public key is invalid.",
): Uint8Array<ArrayBuffer> => {
  if (
    typeof value !== "string" ||
    value.length === 0 ||
    value.length % 4 === 1 ||
    !/^[A-Za-z0-9_-]+$/.test(value)
  ) {
    throw new AuthValidationError(errorMessage);
  }

  const output: number[] = [];
  let buffer = 0;
  let bits = 0;

  for (const character of value) {
    const decoded = BASE64URL_ALPHABET.indexOf(character);

    if (decoded < 0) {
      throw new AuthValidationError(errorMessage);
    }

    buffer = (buffer << 6) | decoded;
    bits += 6;

    if (bits >= 8) {
      bits -= 8;
      output.push((buffer >>> bits) & 255);
    }
  }

  return new Uint8Array(output);
};

const toArrayBuffer = (bytes: Uint8Array): ArrayBuffer => {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);

  return buffer;
};

const toRegistrationResponse = (value: unknown): RegistrationResponseJSON => {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.rawId !== "string" ||
    value.type !== "public-key" ||
    !isRecord(value.response)
  ) {
    throw new AuthValidationError(
      "The passkey registration response is invalid.",
    );
  }

  return value as unknown as RegistrationResponseJSON;
};

const toAuthenticationResponse = (
  value: unknown,
): AuthenticationResponseJSON => {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    typeof value.rawId !== "string" ||
    value.type !== "public-key" ||
    !isRecord(value.response)
  ) {
    throw new AuthValidationError(
      "The passkey authentication response is invalid.",
    );
  }

  return value as unknown as AuthenticationResponseJSON;
};

/**
 * Derives a stable, opaque WebAuthn user handle from the internal Puzzle user ID.
 *
 * WebAuthn user handles are bytes, not application IDs. Hashing also prevents
 * the internal user ID from being directly exposed in authenticator data.
 */
const deriveWebAuthnUserId = async (
  userId: string,
): Promise<Uint8Array<ArrayBuffer>> => {
  if (typeof userId !== "string" || userId.trim().length === 0) {
    throw new AuthValidationError("A valid WebAuthn user ID is required.");
  }

  const cryptoApi = globalThis.crypto;

  if (!cryptoApi?.subtle) {
    throw new AuthConfigurationError(
      "This runtime does not provide the required Web Crypto APIs.",
    );
  }

  const input = new TextEncoder().encode(`puzzle-webauthn-user:v1:${userId}`);

  const digest = await cryptoApi.subtle.digest("SHA-256", toArrayBuffer(input));

  return new Uint8Array(digest);
};

const validateChallenge = (challenge: string): void => {
  if (
    typeof challenge !== "string" ||
    challenge.length < 32 ||
    challenge.length > 256 ||
    !/^[A-Za-z0-9_-]+$/.test(challenge)
  ) {
    throw new AuthValidationError("A valid WebAuthn challenge is required.");
  }
};

const validateRpId = (rpId: string): void => {
  if (
    typeof rpId !== "string" ||
    rpId.trim().length === 0 ||
    rpId.length > 253 ||
    rpId.includes("/") ||
    rpId.includes(":")
  ) {
    throw new AuthConfigurationError("The WebAuthn RP ID is invalid.");
  }
};

export class SimpleWebAuthnProvider implements WebAuthnProvider {
  async generateRegistrationOptions(input: {
    readonly challenge: string;
    readonly rpId: string;
    readonly rpName: string;
    readonly userId: string;
    readonly userName: string;
    readonly excludeCredentialIds: readonly string[];
  }): Promise<WebAuthnOptionsJSON> {
    validateChallenge(input.challenge);
    validateRpId(input.rpId);

    if (
      typeof input.rpName !== "string" ||
      input.rpName.trim().length === 0 ||
      typeof input.userName !== "string" ||
      input.userName.trim().length === 0
    ) {
      throw new AuthValidationError(
        "A WebAuthn RP name and user name are required.",
      );
    }

    const excludeCredentials = input.excludeCredentialIds.map((id) => {
      if (!id || !/^[A-Za-z0-9_-]+$/.test(id)) {
        throw new AuthValidationError(
          "A stored passkey credential ID is invalid.",
        );
      }

      return { id };
    });

    const options = await generateRegistrationOptions({
      rpID: input.rpId,
      rpName: input.rpName.trim(),
      userID: await deriveWebAuthnUserId(input.userId),
      userName: input.userName.trim(),
      userDisplayName: input.userName.trim(),
      challenge: decodeBase64Url(
        input.challenge,
        "A valid WebAuthn challenge is required.",
      ),
      attestationType: "none",
      authenticatorSelection: {
        residentKey: "required",
        userVerification: "required",
      },
      excludeCredentials,
    });

    if (options.challenge !== input.challenge) {
      throw new AuthConfigurationError(
        "SimpleWebAuthn returned an unexpected registration challenge.",
      );
    }

    return options as unknown as WebAuthnOptionsJSON;
  }

  async verifyRegistrationResponse(input: {
    readonly response: unknown;
    readonly expectedChallenge: string;
    readonly expectedOrigin: string;
    readonly expectedRpId: string;
  }): Promise<WebAuthnRegistrationVerification> {
    validateChallenge(input.expectedChallenge);
    validateRpId(input.expectedRpId);

    if (
      typeof input.expectedOrigin !== "string" ||
      input.expectedOrigin.length === 0
    ) {
      throw new AuthConfigurationError(
        "A WebAuthn verification origin is required.",
      );
    }

    const response = toRegistrationResponse(input.response);

    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge: input.expectedChallenge,
      expectedOrigin: input.expectedOrigin,
      expectedRPID: input.expectedRpId,
      requireUserVerification: true,
    });

    if (!verification.verified) {
      return {
        verified: false,
        userVerified: false,
      };
    }

    const registration = verification.registrationInfo;
    const credential = registration.credential;

    return {
      verified: true,
      userVerified: registration.userVerified,
      credential: {
        credentialId: credential.id,
        publicKey: encodeBase64Url(credential.publicKey),
        counter: credential.counter,
        transports: credential.transports ?? [],
      },
    };
  }

  async generateAuthenticationOptions(input: {
    readonly challenge: string;
    readonly rpId: string;
    readonly allowCredentialIds?: readonly string[];
    readonly userVerification: "required";
  }): Promise<WebAuthnOptionsJSON> {
    validateChallenge(input.challenge);
    validateRpId(input.rpId);

    const allowCredentials = input.allowCredentialIds?.map((id) => {
      if (!id || !/^[A-Za-z0-9_-]+$/.test(id)) {
        throw new AuthValidationError(
          "A stored passkey credential ID is invalid.",
        );
      }

      return { id };
    });

    const options = await generateAuthenticationOptions({
      rpID: input.rpId,
      challenge: decodeBase64Url(
        input.challenge,
        "A valid WebAuthn challenge is required.",
      ),
      userVerification: "required",
      ...(allowCredentials
        ? {
            allowCredentials,
          }
        : {}),
    });

    if (options.challenge !== input.challenge) {
      throw new AuthConfigurationError(
        "SimpleWebAuthn returned an unexpected authentication challenge.",
      );
    }

    return options as unknown as WebAuthnOptionsJSON;
  }

  async verifyAuthenticationResponse(input: {
    readonly response: unknown;
    readonly expectedChallenge: string;
    readonly expectedOrigin: string;
    readonly expectedRpId: string;
    readonly credential: {
      readonly credentialId: string;
      readonly publicKey: string;
      readonly counter: number;
      readonly transports?: readonly string[];
    };
  }): Promise<WebAuthnAuthenticationVerification> {
    validateChallenge(input.expectedChallenge);
    validateRpId(input.expectedRpId);

    if (
      typeof input.expectedOrigin !== "string" ||
      input.expectedOrigin.length === 0
    ) {
      throw new AuthConfigurationError(
        "A WebAuthn verification origin is required.",
      );
    }

    const response = toAuthenticationResponse(input.response);

    if (response.id !== input.credential.credentialId) {
      return {
        verified: false,
        userVerified: false,
        credentialId: response.id,
        newCounter: input.credential.counter,
      };
    }

    if (
      !Number.isSafeInteger(input.credential.counter) ||
      input.credential.counter < 0
    ) {
      throw new AuthValidationError("The stored passkey counter is invalid.");
    }

    const credential: WebAuthnCredential = {
      id: input.credential.credentialId,
      publicKey: decodeBase64Url(input.credential.publicKey),
      counter: input.credential.counter,
    };

    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge: input.expectedChallenge,
      expectedOrigin: input.expectedOrigin,
      expectedRPID: input.expectedRpId,
      credential,
      requireUserVerification: true,
    });

    return {
      verified: verification.verified,
      userVerified:
        verification.verified && verification.authenticationInfo.userVerified,
      credentialId: verification.authenticationInfo.credentialID,
      newCounter: verification.authenticationInfo.newCounter,
    };
  }
}
