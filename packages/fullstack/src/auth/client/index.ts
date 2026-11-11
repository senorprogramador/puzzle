"use client";

import type {
  AuthClientOptions,
  AuthClientSnapshot,
  AuthClientSignInInput,
  AuthClientTotpEnrollment,
  AuthClientEnrollmentResult,
  AuthClientRecoveryCodesResult,
  AuthClientFactorList,
  AuthClientRegisterInput,
  AuthClientLifecycleResult,
} from "../shared";

import {
  createPasskeyBrowserHelpers,
  type PasskeyBrowserHelpers,
} from "./passkeys";

export type {
  AuthClientStatus,
  AuthClientUser,
  AuthClientOptions,
  AuthClientSnapshot,
  AuthClientMfaState,
  AuthClientSignInInput,
  AuthClientRegisterInput,
  AuthClientMfaFactor,
  AuthClientTotpEnrollment,
  AuthClientEnrollmentResult,
  AuthClientRecoveryCodesResult,
  AuthClientFactorList,
} from "../shared";

export {
  createPasskeyBrowserHelpers,
  isPasskeySupported,
  startPasskeyRegistration,
  startPasskeyAuthentication,
  type PasskeyBrowserAdapter,
  type PasskeyBrowserHelpers,
} from "./passkeys";

export class AuthClientError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(input: {
    readonly status: number;
    readonly code: string;
    readonly message: string;
  }) {
    super(input.message);

    this.name = "AuthClientError";
    this.status = input.status;
    this.code = input.code;
  }
}

export type AuthClient = {
  register(input: AuthClientRegisterInput): Promise<AuthClientSnapshot>;

  beginRequiredTotpEnrollment(
    label?: string,
  ): Promise<AuthClientTotpEnrollment>;

  verifyRequiredTotpEnrollment(
    factorId: string,
    code: string,
  ): Promise<AuthClientEnrollmentResult>;

  registerRequiredPasskey(label?: string): Promise<AuthClientEnrollmentResult>;

  getSnapshot(): Promise<AuthClientSnapshot>;

  signIn(input: AuthClientSignInInput): Promise<AuthClientSnapshot>;
  signOut(): Promise<void>;

  verifyMfaTotp(code: string): Promise<AuthClientSnapshot>;
  verifyMfaRecoveryCode(code: string): Promise<AuthClientSnapshot>;

  signInWithPasskey(): Promise<AuthClientSnapshot>;
  verifyMfaWithPasskey(): Promise<AuthClientSnapshot>;

  beginTotpEnrollment(
    currentPassword: string,
    label?: string,
  ): Promise<AuthClientTotpEnrollment>;

  verifyTotpEnrollment(
    factorId: string,
    code: string,
  ): Promise<AuthClientEnrollmentResult>;

  registerPasskey(
    currentPassword: string,
    label?: string,
  ): Promise<AuthClientEnrollmentResult>;

  listMfaFactors(): Promise<AuthClientFactorList>;

  removeMfaFactor(factorId: string, currentPassword: string): Promise<void>;

  regenerateRecoveryCodes(
    currentPassword: string,
  ): Promise<AuthClientRecoveryCodesResult>;

  beginStepUp(): Promise<AuthClientSnapshot>;
  verifyStepUpTotp(code: string): Promise<AuthClientSnapshot>;
  verifyStepUpRecoveryCode(code: string): Promise<AuthClientSnapshot>;
  verifyStepUpWithPasskey(): Promise<AuthClientSnapshot>;

  isPasskeySupported(): boolean;

  requestEmailVerification(): Promise<AuthClientLifecycleResult>;

  verifyEmail(token: string): Promise<AuthClientLifecycleResult>;

  requestPasswordReset(email: string): Promise<AuthClientLifecycleResult>;

  resetPassword(
    token: string,
    newPassword: string,
  ): Promise<AuthClientLifecycleResult>;

  changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<AuthClientLifecycleResult>;
};

type AuthApiErrorResponse = {
  readonly error?: {
    readonly code?: string;
    readonly message?: string;
  };
};

type AuthApiSnapshotResponse = {
  readonly status: AuthClientSnapshot["status"];
  readonly user?: AuthClientSnapshot["user"];
  readonly mfa?: AuthClientSnapshot["mfa"];
};

type PasskeyOptionsResponse = {
  readonly options: Readonly<Record<string, unknown>>;
};

type AuthClientFactoryOptions = AuthClientOptions & {
  readonly passkeys?: PasskeyBrowserHelpers;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const normalizeBasePath = (value: string | undefined): string => {
  const basePath = value ?? "/api/auth";

  if (
    !basePath.startsWith("/") ||
    basePath.startsWith("//") ||
    basePath.includes("?") ||
    basePath.includes("#")
  ) {
    throw new TypeError("AuthClient basePath must be an absolute path.");
  }

  return basePath.replace(/\/+$/, "");
};

const getError = (response: Response, payload: unknown): AuthClientError => {
  const value = isRecord(payload)
    ? (payload as AuthApiErrorResponse).error
    : undefined;

  return new AuthClientError({
    status: response.status,
    code: value?.code ?? "AUTH_REQUEST_FAILED",
    message: value?.message ?? "The authentication request failed.",
  });
};

const parseJson = async (response: Response): Promise<unknown> => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

export const createAuthClient = (
  options: AuthClientFactoryOptions = {},
): AuthClient => {
  const basePath = normalizeBasePath(options.basePath);
  const fetcher = options.fetcher ?? fetch;
  const credentials = options.credentials ?? "same-origin";

  const passkeys = options.passkeys ?? createPasskeyBrowserHelpers();

  let snapshot: AuthClientSnapshot = {
    status: "loading",
    user: null,
  };

  const request = async <T>(
    path: string,
    input?: {
      readonly method?: "GET" | "POST";
      readonly body?: unknown;
    },
  ): Promise<T> => {
    const method = input?.method ?? "POST";
    const headers = new Headers();

    if (input?.body !== undefined) {
      headers.set("Content-Type", "application/json");
    }

    const response = await fetcher(`${basePath}${path}`, {
      method,
      credentials,
      headers,
      ...(input?.body === undefined
        ? {}
        : {
            body: JSON.stringify(input.body),
          }),
    });

    const payload = await parseJson(response);

    if (!response.ok) {
      throw getError(response, payload);
    }

    return payload as T;
  };

  const post = <T>(path: string, body?: unknown): Promise<T> =>
    request<T>(path, {
      method: "POST",
      body,
    });

  const get = <T>(path: string): Promise<T> =>
    request<T>(path, {
      method: "GET",
    });

  const getSnapshot = async (): Promise<AuthClientSnapshot> => {
    const result = await get<AuthApiSnapshotResponse>("/state");

    snapshot = {
      status: result.status,
      user: result.user ?? null,
      ...(result.mfa
        ? {
            mfa: result.mfa,
          }
        : {}),
    };

    return snapshot;
  };

  const refreshSnapshot = async (): Promise<AuthClientSnapshot> =>
    getSnapshot();

  const signIn = async (
    input: AuthClientSignInInput,
  ): Promise<AuthClientSnapshot> => {
    await post("/sign-in", input);

    return refreshSnapshot();
  };

  const register = async (
    input: AuthClientRegisterInput,
  ): Promise<AuthClientSnapshot> => {
    await post("/register", input);

    return refreshSnapshot();
  };

  const signOut = async (): Promise<void> => {
    await post("/sign-out");

    snapshot = {
      status: "unauthenticated",
      user: null,
    };
  };

  const verifyMfaTotp = async (code: string): Promise<AuthClientSnapshot> => {
    await post("/mfa/sign-in/totp", { code });

    return refreshSnapshot();
  };

  const verifyMfaRecoveryCode = async (
    code: string,
  ): Promise<AuthClientSnapshot> => {
    await post("/mfa/sign-in/recovery-code", { code });

    return refreshSnapshot();
  };

  const signInWithPasskey = async (): Promise<AuthClientSnapshot> => {
    const started = await post<PasskeyOptionsResponse>(
      "/mfa/passkey/sign-in/start",
    );

    const response = await passkeys.startAuthentication(started.options);

    await post("/mfa/passkey/sign-in/finish", {
      response,
    });

    return refreshSnapshot();
  };

  const verifyMfaWithPasskey = async (): Promise<AuthClientSnapshot> => {
    const started = await post<PasskeyOptionsResponse>(
      "/mfa/passkey/challenge/start",
    );

    const response = await passkeys.startAuthentication(started.options);

    await post("/mfa/passkey/challenge/finish", {
      response,
    });

    return refreshSnapshot();
  };

  const beginTotpEnrollment = async (
    currentPassword: string,
    label?: string,
  ): Promise<AuthClientTotpEnrollment> =>
    post<AuthClientTotpEnrollment>("/mfa/totp/enrollment/start", {
      currentPassword,
      ...(label === undefined ? {} : { label }),
    });

  const verifyTotpEnrollment = async (
    factorId: string,
    code: string,
  ): Promise<AuthClientEnrollmentResult> =>
    post<AuthClientEnrollmentResult>("/mfa/totp/enrollment/finish", {
      factorId,
      code,
    });

  const registerPasskey = async (
    currentPassword: string,
    label?: string,
  ): Promise<AuthClientEnrollmentResult> => {
    const started = await post<PasskeyOptionsResponse>(
      "/mfa/passkey/enrollment/start",
      {
        currentPassword,
        ...(label === undefined ? {} : { label }),
      },
    );

    const response = await passkeys.startRegistration(started.options);

    return post<AuthClientEnrollmentResult>("/mfa/passkey/enrollment/finish", {
      response,
    });
  };

  const beginRequiredTotpEnrollment = async (
    label?: string,
  ): Promise<AuthClientTotpEnrollment> =>
    post<AuthClientTotpEnrollment>("/mfa/enrollment/required/totp/start", {
      ...(label === undefined ? {} : { label }),
    });

  const verifyRequiredTotpEnrollment = async (
    factorId: string,
    code: string,
  ): Promise<AuthClientEnrollmentResult> => {
    const result = await post<AuthClientEnrollmentResult>(
      "/mfa/enrollment/required/totp/finish",
      {
        factorId,
        code,
      },
    );

    // The server only creates the authenticated session after the
    // TOTP factor, recovery codes and challenge have been committed.
    await refreshSnapshot();

    return result;
  };

  const registerRequiredPasskey = async (
    label?: string,
  ): Promise<AuthClientEnrollmentResult> => {
    const started = await post<PasskeyOptionsResponse>(
      "/mfa/enrollment/required/passkey/start",
      {
        ...(label === undefined ? {} : { label }),
      },
    );

    const response = await passkeys.startRegistration(started.options);

    const completed = await post<AuthClientEnrollmentResult>(
      "/mfa/enrollment/required/passkey/finish",
      {
        response,
      },
    );

    await refreshSnapshot();

    return completed;
  };

  const listMfaFactors = (): Promise<AuthClientFactorList> =>
    get<AuthClientFactorList>("/mfa/factors");

  const removeMfaFactor = async (
    factorId: string,
    currentPassword: string,
  ): Promise<void> => {
    await post("/mfa/factors/remove", {
      factorId,
      currentPassword,
    });
  };

  const regenerateRecoveryCodes = (
    currentPassword: string,
  ): Promise<AuthClientRecoveryCodesResult> =>
    post<AuthClientRecoveryCodesResult>("/mfa/recovery-codes/regenerate", {
      currentPassword,
    });

  const beginStepUp = async (): Promise<AuthClientSnapshot> => {
    await post("/mfa/step-up/start");

    return refreshSnapshot();
  };

  const verifyStepUpTotp = async (
    code: string,
  ): Promise<AuthClientSnapshot> => {
    await post("/mfa/step-up/totp", { code });

    return refreshSnapshot();
  };

  const verifyStepUpRecoveryCode = async (
    code: string,
  ): Promise<AuthClientSnapshot> => {
    await post("/mfa/step-up/recovery-code", { code });

    return refreshSnapshot();
  };

  const verifyStepUpWithPasskey = async (): Promise<AuthClientSnapshot> => {
    const started = await post<PasskeyOptionsResponse>(
      "/mfa/step-up/passkey/start",
    );

    const response = await passkeys.startAuthentication(started.options);

    await post("/mfa/step-up/passkey/finish", {
      response,
    });

    return refreshSnapshot();
  };

  const requestEmailVerification = () =>
    post<AuthClientLifecycleResult>("/email/verification/request");

  const verifyEmail = (token: string) =>
    post<AuthClientLifecycleResult>("/email/verification/verify", {
      token,
    });

  const requestPasswordReset = (email: string) =>
    post<AuthClientLifecycleResult>("/password/reset/request", {
      email,
    });

  const resetPassword = (token: string, newPassword: string) =>
    post<AuthClientLifecycleResult>("/password/reset/finish", {
      token,
      newPassword,
    });

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    const result = await post<AuthClientLifecycleResult>("/password/change", {
      currentPassword,
      newPassword,
    });

    // Password changes invalidate existing sessions.
    // The server remains authoritative about the resulting state.
    await refreshSnapshot();

    return result;
  };

  return {
    register,
    getSnapshot,
    signIn,
    signOut,

    verifyMfaTotp,
    verifyMfaRecoveryCode,

    signInWithPasskey,
    verifyMfaWithPasskey,

    beginTotpEnrollment,
    verifyTotpEnrollment,
    beginRequiredTotpEnrollment,
    verifyRequiredTotpEnrollment,
    registerPasskey,
    registerRequiredPasskey,

    listMfaFactors,
    removeMfaFactor,
    regenerateRecoveryCodes,

    beginStepUp,
    verifyStepUpTotp,
    verifyStepUpRecoveryCode,
    verifyStepUpWithPasskey,

    isPasskeySupported: passkeys.isSupported,

    requestEmailVerification,
    verifyEmail,
    requestPasswordReset,
    resetPassword,
    changePassword,
  };
};

export {
  AuthProvider,
  useAuth,
  useSession,
  useUser,
  SignInForm,
  SignUpForm,
  MfaChallengeForm,
  AuthScreen,
  MfaSettings,
  type AuthProviderProps,
  type AuthContextValue,
  type AuthFormProps,
  type SignInFormProps,
  type SignUpFormProps,
  type MfaChallengeFormProps,
  type AuthScreenProps,
  type MfaSettingsProps,
} from "./react";

export {
  AuthExperience,
  type AuthExperienceProps,
  type AuthExperienceConfig,
  type AuthExperienceBranding,
  type AuthExperienceLayout,
  type AuthExperienceRedirects,
  type AuthCustomField,
  type AuthFieldOption,
  type AuthFieldValue,
  type AuthFieldValues,
  type AuthRegistrationInput,
  type AuthExperienceSubmitInput,
} from "./experience";

export {
  getAuthLocale,
  resolveAuthMessages,
  type AuthLocale,
  type AuthMessages,
  type AuthMessageOverrides,
} from "./messages";
