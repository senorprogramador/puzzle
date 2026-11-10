export type AuthState =
  | { readonly status: "unauthenticated" }
  | { readonly status: "primary-authenticated"; readonly userId: string }
  | {
      readonly status: "mfa-pending";
      readonly userId: string;
      readonly challengeId: string;
      readonly expiresAt: Date;
    }
  | {
      readonly status: "mfa-enrollment-pending";
      readonly userId: string;
      readonly challengeId: string;
      readonly expiresAt: Date;
      readonly availableFactors: readonly ("totp" | "passkey")[];
    }
  | {
      readonly status: "authenticated";
      readonly userId: string;
      readonly sessionId: string;
    };
