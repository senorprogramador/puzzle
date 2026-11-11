"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

import { Alert, Button, FormField, TextInput } from "@puzzle-ui/ui";

import {
  createAuthClient,
  type AuthClient,
  type AuthClientOptions,
  type AuthClientSnapshot,
  type AuthClientTotpEnrollment,
} from "./index";

import {
  getAuthLocale,
  resolveAuthMessages,
  type AuthLocale,
  type AuthMessageOverrides,
  type AuthMessages,
} from "./messages";

import "./auth.css";

export type AuthProviderProps = {
  readonly children: ReactNode;
  readonly client?: AuthClient;
  readonly options?: AuthClientOptions;
  readonly initialSnapshot?: AuthClientSnapshot;
  readonly locale?: string;
  readonly messages?: AuthMessageOverrides;
  readonly onAuthStateChange?: (snapshot: AuthClientSnapshot) => void;
};

export type AuthContextValue = {
  readonly client: AuthClient;
  readonly snapshot: AuthClientSnapshot;
  readonly messages: AuthMessages;
  readonly locale: AuthLocale;
  readonly error: Error | null;
  readonly isLoading: boolean;
  readonly isAuthenticated: boolean;
  readonly isPendingMfa: boolean;
  refresh: () => Promise<AuthClientSnapshot>;
  signIn: AuthClient["signIn"];
  signUp: AuthClient["register"];
  signOut: AuthClient["signOut"];
  verifyMfaTotp: AuthClient["verifyMfaTotp"];
  verifyMfaRecoveryCode: AuthClient["verifyMfaRecoveryCode"];
  signInWithPasskey: AuthClient["signInWithPasskey"];
  verifyMfaWithPasskey: AuthClient["verifyMfaWithPasskey"];
  requestEmailVerification: AuthClient["requestEmailVerification"];
  verifyEmail: AuthClient["verifyEmail"];
  requestPasswordReset: AuthClient["requestPasswordReset"];
  resetPassword: AuthClient["resetPassword"];
  changePassword: AuthClient["changePassword"];
};

export type RequiredMfaEnrollmentProps = {
  readonly className?: string;
};

const RequiredMfaEnrollment = ({ className }: RequiredMfaEnrollmentProps) => {
  const { client, snapshot, messages, refresh } = useAuth();

  const [enrollment, setEnrollment] = useState<AuthClientTotpEnrollment | null>(
    null,
  );

  const [code, setCode] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<readonly string[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (
    snapshot.status !== "mfa-enrollment-required" &&
    snapshot.status !== "mfa-enrollment-pending"
  ) {
    return null;
  }

  const handleTotpStart = async () => {
    setError(null);
    setLoading(true);

    try {
      setEnrollment(await client.beginRequiredTotpEnrollment());
    } catch (cause) {
      setError(getErrorMessage(cause, messages));
    } finally {
      setLoading(false);
    }
  };

  const handleTotpFinish = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!enrollment) return;

    setError(null);
    setLoading(true);

    try {
      const result = await client.verifyRequiredTotpEnrollment(
        enrollment.factorId,
        code,
      );

      setRecoveryCodes(result.recoveryCodes);
      setEnrollment(null);

      await refresh();
    } catch (cause) {
      setError(getErrorMessage(cause, messages));
    } finally {
      setLoading(false);
    }
  };

  const handlePasskey = async () => {
    setError(null);
    setLoading(true);

    try {
      const result = await client.registerRequiredPasskey();

      setRecoveryCodes(result.recoveryCodes);

      await refresh();
    } catch (cause) {
      setError(getErrorMessage(cause, messages));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`puzzle-auth ${className ?? ""}`}>
      <header className="puzzle-auth__header">
        <h1>{messages.mfaTitle}</h1>
        <p>
          Additional authentication setup is required before you can continue.
        </p>
      </header>

      {error && <Alert severity="error">{error}</Alert>}

      {recoveryCodes.length > 0 ? (
        <div className="puzzle-auth__recovery-codes">
          <Alert severity="success">{messages.saveRecoveryCodes}</Alert>

          <ul>
            {recoveryCodes.map((value) => (
              <li key={value}>
                <code>{value}</code>
              </li>
            ))}
          </ul>
        </div>
      ) : enrollment ? (
        <form className="puzzle-auth__form" onSubmit={handleTotpFinish}>
          <FormField label={messages.totpSecret}>
            <TextInput
              value={enrollment.secret}
              readOnly
              aria-label={messages.totpSecret}
            />
          </FormField>

          <p>
            <a href={enrollment.otpauthUrl}>Open authenticator application</a>
          </p>

          <FormField
            label={messages.verificationCode}
            required
            controlId="puzzle-auth-required-totp"
          >
            <TextInput
              value={code}
              autoComplete="one-time-code"
              onChange={(event) => setCode(event.currentTarget.value)}
              required
            />
          </FormField>

          <Button type="submit" loading={loading} disabled={!code.trim()}>
            {messages.verifyTotp}
          </Button>
        </form>
      ) : (
        <div className="puzzle-auth__actions">
          <Button
            disabled={loading}
            loading={loading}
            onClick={() => void handleTotpStart()}
          >
            {messages.addTotp}
          </Button>

          {client.isPasskeySupported() && (
            <Button
              variant="outline"
              disabled={loading}
              onClick={() => void handlePasskey()}
            >
              {messages.addPasskey}
            </Button>
          )}
        </div>
      )}
    </section>
  );
};

export type EmailVerificationFormProps = {
  readonly token: string;
  readonly className?: string;
};

const EmailVerificationForm = ({
  token,
  className,
}: EmailVerificationFormProps) => {
  const { verifyEmail, messages } = useAuth();

  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    setLoading(true);
    setError(null);

    try {
      await verifyEmail(token);
      setCompleted(true);
    } catch (cause) {
      setError(getErrorMessage(cause, messages));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`puzzle-auth ${className ?? ""}`}>
      <h1>{messages.verifyEmail}</h1>

      {error && <Alert severity="error">{error}</Alert>}

      {completed ? (
        <Alert severity="success">Email verified successfully.</Alert>
      ) : (
        <Button
          loading={loading}
          disabled={!token || loading}
          onClick={() => void handleVerify()}
        >
          {messages.verifyEmail}
        </Button>
      )}
    </section>
  );
};

const loadingSnapshot: AuthClientSnapshot = {
  status: "loading",
  user: null,
};

const AuthContext = createContext<AuthContextValue | null>(null);

const AuthProvider = ({
  children,
  client: suppliedClient,
  options,
  initialSnapshot = loadingSnapshot,
  locale: localeInput,
  messages: messageOverrides,
  onAuthStateChange,
}: AuthProviderProps) => {
  const [createdClient] = useState(() => createAuthClient(options));
  const client = suppliedClient ?? createdClient;

  const locale = getAuthLocale(localeInput);

  const resolvedMessages = useMemo(
    () => resolveAuthMessages(locale, messageOverrides),
    [locale, messageOverrides],
  );

  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [error, setError] = useState<Error | null>(null);

  const publish = useCallback(
    (next: AuthClientSnapshot) => {
      setSnapshot(next);
      setError(null);
      onAuthStateChange?.(next);
    },
    [onAuthStateChange],
  );

  const refresh = useCallback(async () => {
    try {
      const next = await client.getSnapshot();
      publish(next);
      return next;
    } catch (cause) {
      const nextError =
        cause instanceof Error
          ? cause
          : new Error(resolvedMessages.unexpectedError);

      setError(nextError);
      throw nextError;
    }
  }, [client, publish, resolvedMessages.unexpectedError]);

  useEffect(() => {
    let active = true;

    client.getSnapshot().then(
      (next) => {
        if (active) publish(next);
      },
      (cause: unknown) => {
        if (active) {
          setError(
            cause instanceof Error
              ? cause
              : new Error(resolvedMessages.unexpectedError),
          );
        }
      },
    );

    return () => {
      active = false;
    };
  }, [client, publish, resolvedMessages.unexpectedError]);

  const signIn = useCallback<AuthClient["signIn"]>(
    async (input) => {
      const next = await client.signIn(input);
      publish(next);
      return next;
    },
    [client, publish],
  );

  const signUp = useCallback<AuthClient["register"]>(
    async (input) => {
      const next = await client.register(input);
      publish(next);
      return next;
    },
    [client, publish],
  );

  const signOut = useCallback(async () => {
    await client.signOut();

    publish({
      status: "unauthenticated",
      user: null,
    });
  }, [client, publish]);

  const verifyMfaTotp = useCallback<AuthClient["verifyMfaTotp"]>(
    async (code) => {
      const next = await client.verifyMfaTotp(code);
      publish(next);
      return next;
    },
    [client, publish],
  );

  const verifyMfaRecoveryCode = useCallback<
    AuthClient["verifyMfaRecoveryCode"]
  >(
    async (code) => {
      const next = await client.verifyMfaRecoveryCode(code);
      publish(next);
      return next;
    },
    [client, publish],
  );

  const signInWithPasskey = useCallback<
    AuthClient["signInWithPasskey"]
  >(async () => {
    const next = await client.signInWithPasskey();
    publish(next);
    return next;
  }, [client, publish]);

  const verifyMfaWithPasskey = useCallback<
    AuthClient["verifyMfaWithPasskey"]
  >(async () => {
    const next = await client.verifyMfaWithPasskey();
    publish(next);
    return next;
  }, [client, publish]);

  const requestEmailVerification = useCallback(
    () => client.requestEmailVerification(),
    [client],
  );

  const verifyEmail = useCallback(
    async (token: string) => {
      const result = await client.verifyEmail(token);
      publish(await client.getSnapshot());
      return result;
    },
    [client, publish],
  );

  const requestPasswordReset = useCallback(
    (email: string) => client.requestPasswordReset(email),
    [client],
  );

  const resetPassword = useCallback(
    (token: string, newPassword: string) =>
      client.resetPassword(token, newPassword),
    [client],
  );

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      const result = await client.changePassword(currentPassword, newPassword);

      publish(await client.getSnapshot());

      return result;
    },
    [client, publish],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      client,
      snapshot,
      messages: resolvedMessages,
      locale,
      error,
      isLoading: snapshot.status === "loading",
      isAuthenticated: snapshot.status === "authenticated",
      isPendingMfa:
        snapshot.status === "mfa-pending" ||
        snapshot.status === "step-up-pending",
      refresh,
      signIn,
      signUp,
      signOut,
      verifyMfaTotp,
      verifyMfaRecoveryCode,
      signInWithPasskey,
      verifyMfaWithPasskey,
      requestEmailVerification,
      verifyEmail,
      requestPasswordReset,
      resetPassword,
      changePassword,
    }),
    [
      client,
      snapshot,
      resolvedMessages,
      locale,
      error,
      refresh,
      signIn,
      signUp,
      signOut,
      verifyMfaTotp,
      verifyMfaRecoveryCode,
      signInWithPasskey,
      verifyMfaWithPasskey,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider.");
  }

  return context;
};

const useSession = () => {
  const { snapshot, isLoading, isAuthenticated } = useAuth();

  return {
    status: snapshot.status,
    mfa: snapshot.mfa,
    isLoading,
    isAuthenticated,
  };
};

const useUser = () => useAuth().snapshot.user;

const getErrorMessage = (error: unknown, messages: AuthMessages): string => {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = (error as { code?: string }).code;

    if (code === "INVALID_CREDENTIALS") {
      return messages.invalidCredentials;
    }
  }

  return error instanceof Error ? error.message : messages.unexpectedError;
};

const redirectAfterSuccess = (redirectTo?: string) => {
  if (
    !redirectTo ||
    typeof window === "undefined" ||
    !redirectTo.startsWith("/") ||
    redirectTo.startsWith("//")
  ) {
    return;
  }

  window.location.assign(redirectTo);
};

export type PasswordResetRequestFormProps = AuthFormProps & {
  readonly defaultEmail?: string;
};

const PasswordResetRequestForm = ({
  className,
  defaultEmail = "",
  onSuccess,
}: PasswordResetRequestFormProps) => {
  const { requestPasswordReset, messages } = useAuth();

  const [email, setEmail] = useState(defaultEmail);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await requestPasswordReset(email);
      setSent(true);
      onSuccess?.();
    } catch (cause) {
      setError(getErrorMessage(cause, messages));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`puzzle-auth ${className ?? ""}`}>
      <header className="puzzle-auth__header">
        <h1>{messages.requestPasswordReset}</h1>
      </header>

      {error && <Alert severity="error">{error}</Alert>}

      {sent ? (
        <Alert severity="success">{messages.passwordResetSent}</Alert>
      ) : (
        <form className="puzzle-auth__form" onSubmit={handleSubmit}>
          <FormField
            label={messages.email}
            required
            controlId="puzzle-auth-reset-email"
          >
            <TextInput
              type="email"
              value={email}
              autoComplete="email"
              onChange={(event) => setEmail(event.currentTarget.value)}
              required
              disabled={loading}
            />
          </FormField>

          <Button
            type="submit"
            fullWidth
            loading={loading}
            disabled={!email.trim()}
          >
            {messages.sendResetLink}
          </Button>
        </form>
      )}
    </section>
  );
};

export type PasswordResetFormProps = AuthFormProps & {
  readonly token: string;
};

const PasswordResetForm = ({
  className,
  token,
  onSuccess,
}: PasswordResetFormProps) => {
  const { resetPassword, messages } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmation) {
      setError(messages.passwordMismatch);
      return;
    }

    setLoading(true);

    try {
      await resetPassword(token, password);
      setCompleted(true);
      onSuccess?.();
    } catch (cause) {
      setError(getErrorMessage(cause, messages));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`puzzle-auth ${className ?? ""}`}>
      <header className="puzzle-auth__header">
        <h1>{messages.resetPassword}</h1>
      </header>

      {error && <Alert severity="error">{error}</Alert>}

      {completed ? (
        <Alert severity="success">{messages.passwordChanged}</Alert>
      ) : (
        <form className="puzzle-auth__form" onSubmit={handleSubmit}>
          <FormField
            label={messages.newPassword}
            required
            controlId="puzzle-auth-new-password"
          >
            <TextInput
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
              required
              disabled={loading}
            />
          </FormField>

          <FormField
            label={messages.confirmPassword}
            required
            controlId="puzzle-auth-new-password-confirm"
          >
            <TextInput
              type="password"
              autoComplete="new-password"
              value={confirmation}
              onChange={(event) => setConfirmation(event.currentTarget.value)}
              required
              disabled={loading}
            />
          </FormField>

          <Button
            type="submit"
            fullWidth
            loading={loading}
            disabled={!token || !password || !confirmation}
          >
            {messages.resetPassword}
          </Button>
        </form>
      )}
    </section>
  );
};

export type EmailVerificationNoticeProps = {
  readonly className?: string;
};

const EmailVerificationNotice = ({
  className,
}: EmailVerificationNoticeProps) => {
  const { snapshot, requestEmailVerification, messages } = useAuth();

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!snapshot.user || snapshot.user.emailVerified) {
    return null;
  }

  const handleRequest = async () => {
    setLoading(true);
    setError(null);

    try {
      await requestEmailVerification();
      setSent(true);
    } catch (cause) {
      setError(getErrorMessage(cause, messages));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`puzzle-auth ${className ?? ""}`}>
      <Alert severity="warning">
        {sent ? messages.verificationSent : messages.verifyEmail}
      </Alert>

      {error && <Alert severity="error">{error}</Alert>}

      {!sent && (
        <Button loading={loading} disabled={loading} onClick={handleRequest}>
          {messages.verifyEmail}
        </Button>
      )}
    </section>
  );
};

export type ChangePasswordFormProps = AuthFormProps;

const ChangePasswordForm = ({
  className,
  onSuccess,
}: ChangePasswordFormProps) => {
  const { changePassword, messages } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (newPassword !== confirmation) {
      setError(messages.passwordMismatch);
      return;
    }

    setLoading(true);

    try {
      await changePassword(currentPassword, newPassword);
      setCompleted(true);
      onSuccess?.();
    } catch (cause) {
      setError(getErrorMessage(cause, messages));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`puzzle-auth ${className ?? ""}`}>
      <h2>{messages.changePassword}</h2>

      {error && <Alert severity="error">{error}</Alert>}

      {completed ? (
        <Alert severity="success">{messages.passwordChanged}</Alert>
      ) : (
        <form className="puzzle-auth__form" onSubmit={handleSubmit}>
          <FormField
            label={messages.currentPassword}
            required
            controlId="puzzle-auth-current-password"
          >
            <TextInput
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(event) =>
                setCurrentPassword(event.currentTarget.value)
              }
              required
              disabled={loading}
            />
          </FormField>

          <FormField
            label={messages.newPassword}
            required
            controlId="puzzle-auth-change-password"
          >
            <TextInput
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.currentTarget.value)}
              required
              disabled={loading}
            />
          </FormField>

          <FormField
            label={messages.confirmPassword}
            required
            controlId="puzzle-auth-change-password-confirm"
          >
            <TextInput
              type="password"
              autoComplete="new-password"
              value={confirmation}
              onChange={(event) => setConfirmation(event.currentTarget.value)}
              required
              disabled={loading}
            />
          </FormField>

          <Button
            type="submit"
            loading={loading}
            disabled={!currentPassword || !newPassword || !confirmation}
          >
            {messages.changePassword}
          </Button>
        </form>
      )}
    </section>
  );
};

export type AuthFormProps = {
  readonly className?: string;
  readonly redirectTo?: string;
  readonly onSuccess?: () => void;
};

export type SignInFormProps = AuthFormProps & {
  readonly onForgotPassword?: () => void;
  readonly onSignUp?: () => void;
};

const SignInForm = ({
  className,
  redirectTo,
  onSuccess,
  onForgotPassword,
  onSignUp,
}: SignInFormProps) => {
  const { signIn, signInWithPasskey, messages, client } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn({ email, password });

      if (result.status === "authenticated") {
        onSuccess?.();
        redirectAfterSuccess(redirectTo);
      }
    } catch (cause) {
      setError(getErrorMessage(cause, messages));
    } finally {
      setLoading(false);
    }
  };

  const handlePasskey = async () => {
    setError(null);
    setLoading(true);

    try {
      const result = await signInWithPasskey();

      if (result.status === "authenticated") {
        onSuccess?.();
        redirectAfterSuccess(redirectTo);
      }
    } catch (cause) {
      setError(getErrorMessage(cause, messages));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`puzzle-auth ${className ?? ""}`}>
      <header className="puzzle-auth__header">
        <h1>{messages.signIn}</h1>
      </header>

      {error && <Alert severity="error">{error}</Alert>}

      <form className="puzzle-auth__form" onSubmit={handleSubmit} noValidate>
        <FormField
          label={messages.email}
          required
          controlId="puzzle-auth-email"
        >
          <TextInput
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            required
            disabled={loading}
          />
        </FormField>

        <FormField
          label={messages.password}
          required
          controlId="puzzle-auth-password"
        >
          <TextInput
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            required
            disabled={loading}
          />
        </FormField>

        {onForgotPassword && (
          <button
            className="puzzle-auth__text-button"
            type="button"
            onClick={onForgotPassword}
          >
            {messages.forgotPassword}
          </button>
        )}

        <Button
          type="submit"
          fullWidth
          loading={loading}
          disabled={!email.trim() || !password}
        >
          {loading ? messages.signingIn : messages.submit}
        </Button>
      </form>

      {client.isPasskeySupported() && (
        <Button
          variant="outline"
          fullWidth
          disabled={loading}
          onClick={handlePasskey}
        >
          {messages.usePasskey}
        </Button>
      )}

      {onSignUp && (
        <footer className="puzzle-auth__footer">
          <span>{messages.noAccount}</span>
          <button
            type="button"
            className="puzzle-auth__text-button"
            onClick={onSignUp}
          >
            {messages.createAccount}
          </button>
        </footer>
      )}
    </section>
  );
};

export type SignUpFormProps = AuthFormProps & {
  readonly onSignIn?: () => void;
};

const SignUpForm = ({
  className,
  redirectTo,
  onSuccess,
  onSignIn,
}: SignUpFormProps) => {
  const { signUp, messages } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmation) {
      setError(messages.passwordMismatch);
      return;
    }

    if (!password) {
      setError(messages.passwordRequired);
      return;
    }

    setLoading(true);

    try {
      const result = await signUp({
        name: name.trim() || null,
        email,
        password,
      });

      if (result.status === "authenticated") {
        onSuccess?.();
        redirectAfterSuccess(redirectTo);
      }
    } catch (cause) {
      setError(getErrorMessage(cause, messages));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`puzzle-auth ${className ?? ""}`}>
      <header className="puzzle-auth__header">
        <h1>{messages.signUp}</h1>
      </header>

      {error && <Alert severity="error">{error}</Alert>}

      <form className="puzzle-auth__form" onSubmit={handleSubmit} noValidate>
        <FormField label={messages.name} controlId="puzzle-auth-name">
          <TextInput
            name="name"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
            disabled={loading}
          />
        </FormField>

        <FormField
          label={messages.email}
          required
          controlId="puzzle-auth-signup-email"
        >
          <TextInput
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            required
            disabled={loading}
          />
        </FormField>

        <FormField
          label={messages.password}
          required
          controlId="puzzle-auth-signup-password"
        >
          <TextInput
            type="password"
            name="new-password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            required
            disabled={loading}
          />
        </FormField>

        <FormField
          label={messages.confirmPassword}
          required
          controlId="puzzle-auth-confirm-password"
        >
          <TextInput
            type="password"
            name="confirm-password"
            autoComplete="new-password"
            value={confirmation}
            onChange={(event) => setConfirmation(event.currentTarget.value)}
            required
            disabled={loading}
          />
        </FormField>

        <Button
          type="submit"
          fullWidth
          loading={loading}
          disabled={!email.trim() || !password || !confirmation}
        >
          {loading ? messages.signingUp : messages.createAccount}
        </Button>
      </form>

      {onSignIn && (
        <footer className="puzzle-auth__footer">
          <span>{messages.existingAccount}</span>
          <button
            type="button"
            className="puzzle-auth__text-button"
            onClick={onSignIn}
          >
            {messages.signIn}
          </button>
        </footer>
      )}
    </section>
  );
};

export type MfaChallengeFormProps = AuthFormProps;

const MfaChallengeForm = ({
  className,
  redirectTo,
  onSuccess,
}: MfaChallengeFormProps) => {
  const {
    snapshot,
    verifyMfaTotp,
    verifyMfaRecoveryCode,
    verifyMfaWithPasskey,
    client,
    messages,
  } = useAuth();

  const [code, setCode] = useState("");
  const [recoveryMode, setRecoveryMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const finish = (result: AuthClientSnapshot) => {
    if (result.status === "authenticated") {
      onSuccess?.();
      redirectAfterSuccess(redirectTo);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = recoveryMode
        ? await verifyMfaRecoveryCode(code)
        : await verifyMfaTotp(code);

      finish(result);
    } catch (cause) {
      setError(getErrorMessage(cause, messages));
    } finally {
      setLoading(false);
    }
  };

  const handlePasskey = async () => {
    setError(null);
    setLoading(true);

    try {
      finish(await verifyMfaWithPasskey());
    } catch (cause) {
      setError(getErrorMessage(cause, messages));
    } finally {
      setLoading(false);
    }
  };

  if (
    snapshot.status !== "mfa-pending" &&
    snapshot.status !== "step-up-pending"
  ) {
    return null;
  }

  const availableFactors = snapshot.mfa?.availableFactors;

  return (
    <section className={`puzzle-auth ${className ?? ""}`}>
      <header className="puzzle-auth__header">
        <h1>{messages.mfaTitle}</h1>
        <p>{messages.mfaDescription}</p>
      </header>

      {error && <Alert severity="error">{error}</Alert>}

      <form className="puzzle-auth__form" onSubmit={handleSubmit} noValidate>
        <FormField
          label={
            recoveryMode ? messages.recoveryCode : messages.verificationCode
          }
          required
          controlId="puzzle-auth-mfa-code"
        >
          <TextInput
            name="code"
            type="text"
            autoComplete="one-time-code"
            value={code}
            onChange={(event) => setCode(event.currentTarget.value)}
            required
            disabled={loading}
          />
        </FormField>

        <Button
          type="submit"
          fullWidth
          loading={loading}
          disabled={!code.trim()}
        >
          {loading ? messages.verifying : messages.verify}
        </Button>
      </form>

      <div className="puzzle-auth__actions">
        {availableFactors?.includes("recovery-code") && (
          <button
            type="button"
            className="puzzle-auth__text-button"
            onClick={() => {
              setRecoveryMode((current) => !current);
              setCode("");
              setError(null);
            }}
          >
            {recoveryMode
              ? messages.useAuthenticator
              : messages.useRecoveryCode}
          </button>
        )}

        {availableFactors?.includes("passkey") &&
          client.isPasskeySupported() && (
            <Button
              variant="outline"
              fullWidth
              disabled={loading}
              onClick={handlePasskey}
            >
              {messages.usePasskey}
            </Button>
          )}
      </div>
    </section>
  );
};

export type AuthScreenProps = AuthFormProps & {
  readonly mode?: "sign-in" | "sign-up";
  readonly children?: ReactNode;
  readonly onForgotPassword?: () => void;
};

const AuthScreen = ({
  mode = "sign-in",
  className,
  redirectTo,
  onSuccess,
  onForgotPassword,
  children,
}: AuthScreenProps) => {
  const { snapshot, messages, signOut } = useAuth();

  if (snapshot.status === "loading") {
    return (
      <div
        className={`puzzle-auth ${className ?? ""}`}
        role="status"
        aria-live="polite"
      >
        {messages.loading}
      </div>
    );
  }

  if (
    snapshot.status === "mfa-pending" ||
    snapshot.status === "step-up-pending"
  ) {
    return (
      <MfaChallengeForm
        className={className}
        redirectTo={redirectTo}
        onSuccess={onSuccess}
      />
    );
  }

  if (snapshot.status === "authenticated") {
    return (
      <section className={`puzzle-auth ${className ?? ""}`}>
        {children ?? (
          <>
            <p>{messages.authenticated}</p>
            {snapshot.user && <p>{snapshot.user.email}</p>}
          </>
        )}
        <Button variant="outline" onClick={() => void signOut()}>
          {messages.signOut}
        </Button>
      </section>
    );
  }

  if (
    snapshot.status === "mfa-enrollment-required" ||
    snapshot.status === "mfa-enrollment-pending"
  ) {
    return <RequiredMfaEnrollment className={className} />;
  }

  return mode === "sign-up" ? (
    <SignUpForm
      className={className}
      redirectTo={redirectTo}
      onSuccess={onSuccess}
    />
  ) : (
    <SignInForm
      className={className}
      redirectTo={redirectTo}
      onSuccess={onSuccess}
      onForgotPassword={onForgotPassword}
    />
  );
};

export type MfaSettingsProps = {
  readonly className?: string;
};

const MfaSettings = ({ className }: MfaSettingsProps) => {
  const { client, messages } = useAuth();

  const [factors, setFactors] = useState<Awaited<
    ReturnType<AuthClient["listMfaFactors"]>
  > | null>(null);

  const [enrollment, setEnrollment] = useState<AuthClientTotpEnrollment | null>(
    null,
  );

  const [recoveryCodes, setRecoveryCodes] = useState<readonly string[]>([]);

  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadFactors = useCallback(async () => {
    setFactors(await client.listMfaFactors());
  }, [client]);

  useEffect(() => {
    void loadFactors().catch((cause: unknown) => {
      setError(
        cause instanceof Error ? cause.message : messages.unexpectedError,
      );
    });
  }, [loadFactors, messages.unexpectedError]);

  const beginTotp = async () => {
    setError(null);
    setLoading(true);

    try {
      setEnrollment(await client.beginTotpEnrollment(password));
      setPassword("");
    } catch (cause) {
      setError(getErrorMessage(cause, messages));
    } finally {
      setLoading(false);
    }
  };

  const finishTotp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!enrollment) return;

    setError(null);
    setLoading(true);

    try {
      const result = await client.verifyTotpEnrollment(
        enrollment.factorId,
        code,
      );

      setRecoveryCodes(result.recoveryCodes);
      setEnrollment(null);
      setCode("");
      await loadFactors();
    } catch (cause) {
      setError(getErrorMessage(cause, messages));
    } finally {
      setLoading(false);
    }
  };

  const addPasskey = async () => {
    setError(null);
    setLoading(true);

    try {
      const result = await client.registerPasskey(password);
      setRecoveryCodes(result.recoveryCodes);
      setPassword("");
      await loadFactors();
    } catch (cause) {
      setError(getErrorMessage(cause, messages));
    } finally {
      setLoading(false);
    }
  };

  const removeFactor = async (factorId: string) => {
    setError(null);
    setLoading(true);

    try {
      await client.removeMfaFactor(factorId, password);
      setPassword("");
      await loadFactors();
    } catch (cause) {
      setError(getErrorMessage(cause, messages));
    } finally {
      setLoading(false);
    }
  };

  const regenerateCodes = async () => {
    setError(null);
    setLoading(true);

    try {
      const result = await client.regenerateRecoveryCodes(password);
      setRecoveryCodes(result.recoveryCodes);
      setPassword("");
      await loadFactors();
    } catch (cause) {
      setError(getErrorMessage(cause, messages));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`puzzle-auth puzzle-auth--settings ${className ?? ""}`}>
      <h2>{messages.mfaSettings}</h2>

      {error && <Alert severity="error">{error}</Alert>}

      {factors && (
        <ul className="puzzle-auth__factor-list">
          {factors.factors.map((factor) => (
            <li key={factor.id}>
              <div>
                <strong>{factor.label}</strong>
                <span>{factor.type}</span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                disabled={loading}
                onClick={() => void removeFactor(factor.id)}
              >
                {messages.removeFactor}
              </Button>
            </li>
          ))}
        </ul>
      )}

      {!enrollment && (
        <FormField
          label={messages.currentPassword}
          controlId="puzzle-auth-settings-password"
        >
          <TextInput
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
            disabled={loading}
          />
        </FormField>
      )}

      {enrollment ? (
        <form className="puzzle-auth__form" onSubmit={finishTotp}>
          <FormField label={messages.totpSecret}>
            <TextInput
              readOnly
              value={enrollment.secret}
              aria-label={messages.totpSecret}
            />
          </FormField>

          <p>
            <a href={enrollment.otpauthUrl}>Open authenticator application</a>
          </p>

          <FormField
            label={messages.verificationCode}
            controlId="puzzle-auth-enrollment-code"
          >
            <TextInput
              value={code}
              autoComplete="one-time-code"
              onChange={(event) => setCode(event.currentTarget.value)}
              required
            />
          </FormField>

          <Button type="submit" loading={loading} disabled={!code.trim()}>
            {messages.verifyTotp}
          </Button>

          <Button
            variant="ghost"
            disabled={loading}
            onClick={() => setEnrollment(null)}
          >
            {messages.cancel}
          </Button>
        </form>
      ) : (
        <div className="puzzle-auth__actions">
          <Button
            variant="outline"
            disabled={loading || !password}
            onClick={() => void beginTotp()}
          >
            {messages.addTotp}
          </Button>

          {client.isPasskeySupported() && (
            <Button
              variant="outline"
              disabled={loading || !password}
              onClick={() => void addPasskey()}
            >
              {messages.addPasskey}
            </Button>
          )}

          <Button
            variant="ghost"
            disabled={loading || !password}
            onClick={() => void regenerateCodes()}
          >
            {messages.recoveryCodes}
          </Button>
        </div>
      )}

      {recoveryCodes.length > 0 && (
        <div className="puzzle-auth__recovery-codes">
          <Alert severity="warning" title={messages.recoveryCodes}>
            {messages.saveRecoveryCodes}
          </Alert>

          <ul>
            {recoveryCodes.map((recoveryCode) => (
              <li key={recoveryCode}>
                <code>{recoveryCode}</code>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
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
  PasswordResetRequestForm,
  PasswordResetForm,
  EmailVerificationNotice,
  ChangePasswordForm,
  RequiredMfaEnrollment,
  EmailVerificationForm,
};
