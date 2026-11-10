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
      /**
       * The session is valid, but the current MFA policy requires an
       * active factor. This state is restricted: it is not authenticated
       * application access.
       *
       * The user may use the enrollment endpoints, which require password
       * confirmation, to add the first required factor.
       */
      readonly status: "mfa-enrollment-required";
      readonly userId: string;
      readonly sessionId: string;
    }
  | {
      readonly status: "authenticated";
      readonly userId: string;
      readonly sessionId: string;
    };
