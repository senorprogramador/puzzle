export type ProtectedAuthSecret = {
  readonly ciphertext: string;
  readonly iv: string;
  readonly keyId: string;
};

export interface AuthSecretProtector {
  encrypt(plaintext: string): Promise<ProtectedAuthSecret>;
  decrypt(secret: ProtectedAuthSecret): Promise<string>;
}

export type WebAuthnOptionsJSON = Readonly<Record<string, unknown>>;

export type WebAuthnRegistrationCredential = {
  readonly credentialId: string;
  readonly publicKey: string;
  readonly counter: number;
  readonly transports?: readonly string[];
};

export type WebAuthnRegistrationVerification = {
  readonly verified: boolean;
  readonly userVerified: boolean;
  readonly credential?: WebAuthnRegistrationCredential;
};

export type WebAuthnAuthenticationVerification = {
  readonly verified: boolean;
  readonly userVerified: boolean;
  readonly credentialId: string;
  readonly newCounter: number;
};

/**
 * Server-side WebAuthn adapter.
 *
 * Implement this with a maintained WebAuthn server implementation.
 * The adapter is responsible for cryptographic verification, including
 * signatures, challenge binding, origin, RP ID and authenticator data.
 *
 * All challenges must be supplied by Puzzle Auth rather than generated
 * independently by the provider.
 */
export interface WebAuthnProvider {
  generateRegistrationOptions(input: {
    readonly challenge: string;
    readonly rpId: string;
    readonly rpName: string;
    readonly userId: string;
    readonly userName: string;
    readonly excludeCredentialIds: readonly string[];
  }): Promise<WebAuthnOptionsJSON>;

  verifyRegistrationResponse(input: {
    readonly response: unknown;
    readonly expectedChallenge: string;
    readonly expectedOrigin: string;
    readonly expectedRpId: string;
  }): Promise<WebAuthnRegistrationVerification>;

  generateAuthenticationOptions(input: {
    readonly challenge: string;
    readonly rpId: string;
    readonly allowCredentialIds?: readonly string[];
    readonly userVerification: "required";
  }): Promise<WebAuthnOptionsJSON>;

  verifyAuthenticationResponse(input: {
    readonly response: unknown;
    readonly expectedChallenge: string;
    readonly expectedOrigin: string;
    readonly expectedRpId: string;
    readonly credential: WebAuthnRegistrationCredential;
  }): Promise<WebAuthnAuthenticationVerification>;
}
