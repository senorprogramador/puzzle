export type AuthLocale = "en";

export type AuthMessages = {
  readonly signIn: string;
  readonly signUp: string;
  readonly email: string;
  readonly password: string;
  readonly name: string;
  readonly confirmPassword: string;
  readonly submit: string;
  readonly signingIn: string;
  readonly signingUp: string;
  readonly forgotPassword: string;
  readonly createAccount: string;
  readonly existingAccount: string;
  readonly noAccount: string;
  readonly mfaTitle: string;
  readonly mfaDescription: string;
  readonly verificationCode: string;
  readonly recoveryCode: string;
  readonly verify: string;
  readonly verifying: string;
  readonly useRecoveryCode: string;
  readonly useAuthenticator: string;
  readonly usePasskey: string;
  readonly passkeyUnavailable: string;
  readonly loading: string;
  readonly signOut: string;
  readonly unexpectedError: string;
  readonly invalidCredentials: string;
  readonly passwordMismatch: string;
  readonly passwordRequired: string;
  readonly requestPasswordReset: string;
  readonly resetPassword: string;
  readonly newPassword: string;
  readonly sendResetLink: string;
  readonly passwordResetSent: string;
  readonly verificationSent: string;
  readonly verifyEmail: string;
  readonly changePassword: string;
  readonly passwordChanged: string;
  readonly emailRequired: string;
  readonly nameRequired: string;
  readonly authenticated: string;
  readonly mfaSettings: string;
  readonly addTotp: string;
  readonly addPasskey: string;
  readonly removeFactor: string;
  readonly recoveryCodes: string;
  readonly saveRecoveryCodes: string;
  readonly currentPassword: string;
  readonly totpSecret: string;
  readonly verifyTotp: string;
  readonly cancel: string;
};

export type AuthMessageOverrides = Partial<AuthMessages>;

const messages: Record<AuthLocale, AuthMessages> = {
  en: {
    signIn: "Sign in",
    signUp: "Create account",
    email: "Email address",
    password: "Password",
    requestPasswordReset: "Request password reset",
    resetPassword: "Reset password",
    newPassword: "New password",
    sendResetLink: "Send reset link",
    passwordResetSent: "Password reset link sent",
    verificationSent: "Verification email sent",
    verifyEmail: "Verify email",
    changePassword: "Change password",
    passwordChanged: "Password changed",
    name: "Name",
    confirmPassword: "Confirm password",
    submit: "Continue",
    signingIn: "Signing in...",
    signingUp: "Creating account...",
    forgotPassword: "Forgot password?",
    createAccount: "Create an account",
    existingAccount: "Already have an account?",
    noAccount: "Don't have an account?",
    mfaTitle: "Verify your identity",
    mfaDescription: "Enter your authentication code to continue.",
    verificationCode: "Authentication code",
    recoveryCode: "Recovery code",
    verify: "Verify",
    verifying: "Verifying...",
    useRecoveryCode: "Use a recovery code",
    useAuthenticator: "Use authenticator app",
    usePasskey: "Continue with passkey",
    passkeyUnavailable: "Passkeys are unavailable in this browser.",
    loading: "Loading...",
    signOut: "Sign out",
    unexpectedError: "Something went wrong. Please try again.",
    invalidCredentials: "The email or password is incorrect.",
    passwordMismatch: "Passwords do not match.",
    passwordRequired: "A password is required.",
    emailRequired: "An email address is required.",
    nameRequired: "A name is required.",
    authenticated: "You are signed in.",
    mfaSettings: "Security settings",
    addTotp: "Add authenticator",
    addPasskey: "Add passkey",
    removeFactor: "Remove",
    recoveryCodes: "Recovery codes",
    saveRecoveryCodes: "Save these codes somewhere safe.",
    currentPassword: "Current password",
    totpSecret: "Authenticator secret",
    verifyTotp: "Verify authenticator",
    cancel: "Cancel",
  },
};

export const resolveAuthMessages = (
  locale: AuthLocale = "en",
  overrides?: AuthMessageOverrides,
): AuthMessages => ({
  ...messages[locale],
  ...overrides,
});

export const getAuthLocale = (locale?: string): AuthLocale => {
  return "en";
};
