export type AuthLocale<TCustomLocales extends string = never> =
  | "en"
  | TCustomLocales;

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

/**
 * A complete set of messages for every custom locale.
 *
 * English is optional because the built-in English messages are always
 * available as a fallback.
 *
 * Every custom locale must provide a complete AuthMessages object.
 */
export type AuthLocaleMessages<TCustomLocales extends string = never> = {
  readonly en?: AuthMessages;
} & {
  readonly [Locale in TCustomLocales]: AuthMessages;
};

/**
 * Partial overrides for the currently resolved locale.
 */
export type AuthMessageOverrides = Partial<AuthMessages>;

const englishMessages: AuthMessages = {
  signIn: "Sign in",
  signUp: "Create account",
  email: "Email address",
  password: "Password",
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
  requestPasswordReset: "Request password reset",
  resetPassword: "Reset password",
  newPassword: "New password",
  sendResetLink: "Send reset link",
  passwordResetSent: "Password reset link sent",
  verificationSent: "Verification email sent",
  verifyEmail: "Verify email",
  changePassword: "Change password",
  passwordChanged: "Password changed",
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
};

/**
 * Resolves a locale against the locales supplied by the application.
 *
 * The English locale is always supported.
 * Unknown locales and locales without a supplied message set fall back to
 * English.
 */
export const getAuthLocale = <TCustomLocales extends string = never>(
  locale?: string | null,
  availableMessages?: AuthLocaleMessages<TCustomLocales>,
): AuthLocale<TCustomLocales> => {
  if (!locale || locale === "en") {
    return "en";
  }

  if (
    availableMessages &&
    Object.prototype.hasOwnProperty.call(availableMessages, locale)
  ) {
    return locale as AuthLocale<TCustomLocales>;
  }

  return "en";
};

/**
 * Resolves the messages for the requested locale.
 *
 * Resolution order:
 * 1. Built-in English messages.
 * 2. Optional application-provided English messages.
 * 3. Messages for the requested custom locale.
 * 4. Optional per-message overrides.
 *
 * When custom locales are declared, their complete message sets are
 * required by the type system.
 */
export function resolveAuthMessages(): AuthMessages;

export function resolveAuthMessages(
  locale: "en",
  localeMessages?: AuthLocaleMessages,
  overrides?: AuthMessageOverrides,
): AuthMessages;

export function resolveAuthMessages<TCustomLocales extends string>(
  locale: AuthLocale<TCustomLocales>,
  localeMessages: AuthLocaleMessages<TCustomLocales>,
  overrides?: AuthMessageOverrides,
): AuthMessages;

export function resolveAuthMessages<TCustomLocales extends string>(
  locale: AuthLocale<TCustomLocales> = "en",
  localeMessages?: AuthLocaleMessages<TCustomLocales>,
  overrides?: AuthMessageOverrides,
): AuthMessages {
  const englishOverrides = localeMessages?.en;

  const localizedMessages =
    locale === "en" ? undefined : localeMessages?.[locale as TCustomLocales];

  return {
    ...englishMessages,
    ...englishOverrides,
    ...localizedMessages,
    ...overrides,
  };
}
