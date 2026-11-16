export function createWebAuthnCredentialFixture(input: {
  challenge: string;
  origin?: string;
  rpId?: string;
}): {
  credentialId: string;
  registrationResponse: Record<string, unknown>;
  createAuthenticationResponse(input: {
    challenge: string;
    counter?: number;
    responseOrigin?: string;
    responseRpId?: string;
  }): Record<string, unknown>;
};
