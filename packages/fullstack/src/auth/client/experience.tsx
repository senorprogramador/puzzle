"use client";

import {
  useEffect,
  useId,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";

import {
  Alert,
  Button,
  Checkbox,
  FormField,
  Heading,
  Select,
  Text,
  TextAreaInput,
  TextInput,
} from "@puzzle-ui/ui";

import type { AuthClient, AuthClientSnapshot } from "./index";
import { SignInForm, useAuth } from "./react";

export type AuthFieldValue = string | boolean;

export type AuthFieldValues = Readonly<Record<string, AuthFieldValue>>;

export type AuthFieldOption = {
  readonly label: string;
  readonly value: string;
};

export type AuthCustomField = {
  readonly name: string;
  readonly label: string;
  readonly type:
    | "text"
    | "email"
    | "tel"
    | "url"
    | "number"
    | "checkbox"
    | "select"
    | "textarea";
  readonly description?: string;
  readonly placeholder?: string;
  readonly autoComplete?: string;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly defaultValue?: AuthFieldValue;
  readonly options?: readonly AuthFieldOption[];
  readonly validate?: (
    value: AuthFieldValue,
    values: AuthFieldValues,
  ) => string | null | undefined | Promise<string | null | undefined>;
};

export type AuthRegistrationInput = {
  readonly name: string | null;
  readonly email: string;
  readonly password: string;
};

export type AuthExperienceSubmitInput = {
  readonly registration: AuthRegistrationInput;
  readonly fields: AuthFieldValues;
  readonly signUp: AuthClient["register"];
};

export type AuthExperienceBranding = {
  readonly logo?: ReactNode;
  readonly title?: ReactNode;
  readonly description?: ReactNode;
};

export type AuthExperienceLayout = {
  readonly className?: string;
  readonly contentClassName?: string;
  readonly header?: ReactNode;
  readonly footer?: ReactNode;
  readonly width?: "sm" | "md" | "lg" | "full";
  readonly align?: "left" | "center";
};

export type AuthExperienceRedirects = {
  readonly afterSignIn?: string;
  readonly afterSignUp?: string;
};

export type AuthExperienceConfig = {
  readonly branding?: AuthExperienceBranding;
  readonly layout?: AuthExperienceLayout;
  readonly redirects?: AuthExperienceRedirects;
  readonly fields?: readonly AuthCustomField[];
};

export type AuthExperienceProps = {
  readonly mode?: "sign-in" | "sign-up";
  readonly config?: AuthExperienceConfig;
  readonly className?: string;
  readonly onSubmit?: (
    input: AuthExperienceSubmitInput,
  ) => Promise<AuthClientSnapshot>;
  readonly onSuccess?: () => void;
  readonly onSignIn?: () => void;
  readonly onSignUp?: () => void;
  readonly onForgotPassword?: () => void;
};

type FieldErrors = Readonly<Record<string, string>>;

const EMPTY_FIELDS: readonly AuthCustomField[] = [];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidEmail = (value: string): boolean => {
  const email = value.trim();

  return email.length <= 254 && EMAIL_PATTERN.test(email);
};

const getEmailError = (
  value: string,
  messages: ReturnType<typeof useAuth>["messages"],
): string | null => {
  const email = value.trim();

  if (!email) {
    return messages.emailRequired;
  }

  if (!isValidEmail(email)) {
    return "Enter a valid email address.";
  }

  return null;
};

const isSafeRedirect = (value: string | undefined): value is string =>
  Boolean(
    value &&
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.includes("\\") &&
    !/[\u0000-\u001f\u007f]/.test(value),
  );

const redirectAfterSuccess = (value: string | undefined) => {
  if (!isSafeRedirect(value) || typeof window === "undefined") {
    return;
  }

  window.location.assign(value);
};

const getInitialValues = (
  fields: readonly AuthCustomField[],
): Record<string, AuthFieldValue> =>
  Object.fromEntries(
    fields.map((field) => [
      field.name,
      field.defaultValue ?? (field.type === "checkbox" ? false : ""),
    ]),
  );

const validateFieldDefinition = (fields: readonly AuthCustomField[]): void => {
  const names = new Set<string>();

  for (const field of fields) {
    if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(field.name)) {
      throw new Error(`Invalid custom auth field name: "${field.name}".`);
    }

    if (["name", "email", "password", "confirmPassword"].includes(field.name)) {
      throw new Error(`Custom auth field name "${field.name}" is reserved.`);
    }

    if (names.has(field.name)) {
      throw new Error(`Duplicate custom auth field name: "${field.name}".`);
    }

    if (
      field.type === "select" &&
      (!field.options || field.options.length === 0)
    ) {
      throw new Error(
        `Select field "${field.name}" requires at least one option.`,
      );
    }

    names.add(field.name);
  }
};

const validateFields = async (
  fields: readonly AuthCustomField[],
  values: AuthFieldValues,
): Promise<FieldErrors> => {
  const errors: Record<string, string> = {};

  for (const field of fields) {
    const value = values[field.name];

    if (
      field.required &&
      (value === undefined ||
        value === "" ||
        (typeof value === "boolean" && !value))
    ) {
      errors[field.name] = `${field.label} is required.`;
      continue;
    }

    if (!field.validate) continue;

    const message = await field.validate(value ?? "", values);

    if (message) {
      errors[field.name] = message;
    }
  }

  return errors;
};

const AuthCustomFields = ({
  fields,
  values,
  errors,
  disabled,
  onChange,
}: {
  readonly fields: readonly AuthCustomField[];
  readonly values: AuthFieldValues;
  readonly errors: FieldErrors;
  readonly disabled: boolean;
  readonly onChange: (name: string, value: AuthFieldValue) => void;
}) => {
  const generatedId = useId();

  return (
    <>
      {fields.map((field) => {
        const id = `${generatedId}-${field.name}`;
        const value = values[field.name] ?? "";
        const error = errors[field.name];

        const commonProps = {
          name: field.name,
          disabled: disabled || field.disabled,
          required: field.required,
        };

        return (
          <FormField
            key={field.name}
            controlId={id}
            label={field.label}
            description={field.description}
            error={error}
            required={field.required}
            disabled={commonProps.disabled}
            className={
              field.type === "url" || field.type === "number"
                ? "puzzle-auth__custom-field"
                : undefined
            }
          >
            {field.type === "textarea" ? (
              <TextAreaInput
                {...commonProps}
                value={String(value)}
                placeholder={field.placeholder}
                resizable
                onChange={(event) =>
                  onChange(field.name, event.currentTarget.value)
                }
              />
            ) : field.type === "select" ? (
              <Select
                {...commonProps}
                fullWidth
                value={String(value)}
                placeholder={field.placeholder ?? "Select an option"}
                options={field.options ?? []}
                onChange={(value) => onChange(field.name, value ?? "")}
              />
            ) : field.type === "checkbox" ? (
              <Checkbox
                {...commonProps}
                checked={Boolean(value)}
                onChange={(event) =>
                  onChange(field.name, event.currentTarget.checked)
                }
              />
            ) : field.type === "url" || field.type === "number" ? (
              <input
                {...commonProps}
                type={field.type}
                value={String(value)}
                placeholder={field.placeholder}
                autoComplete={field.autoComplete}
                onChange={(event) =>
                  onChange(field.name, event.currentTarget.value)
                }
              />
            ) : (
              <TextInput
                {...commonProps}
                type={field.type === "tel" ? "phone" : field.type}
                value={String(value)}
                placeholder={field.placeholder}
                autoComplete={field.autoComplete}
                onChange={(event) =>
                  onChange(field.name, event.currentTarget.value)
                }
              />
            )}
          </FormField>
        );
      })}
    </>
  );
};

const AuthExperience = ({
  mode = "sign-in",
  config = {},
  className,
  onSubmit,
  onSuccess,
  onSignIn,
  onSignUp,
  onForgotPassword,
}: AuthExperienceProps) => {
  const { signUp, messages } = useAuth();

  const fields = config.fields ?? EMPTY_FIELDS;
  const branding = config.branding;
  const layout = config.layout;
  const redirects = config.redirects;

  validateFieldDefinition(fields);

  const [values, setValues] = useState<Record<string, AuthFieldValue>>(() =>
    getInitialValues(fields),
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");

  useEffect(() => {
    setValues((current) => {
      const next: Record<string, AuthFieldValue> = {};

      for (const field of fields) {
        const currentValue = Object.prototype.hasOwnProperty.call(
          current,
          field.name,
        )
          ? current[field.name]
          : undefined;

        next[field.name] =
          currentValue ??
          field.defaultValue ??
          (field.type === "checkbox" ? false : "");
      }

      const currentNames = Object.keys(current);
      const nextNames = Object.keys(next);

      const unchanged =
        currentNames.length === nextNames.length &&
        nextNames.every((fieldName) => current[fieldName] === next[fieldName]);

      return unchanged ? current : next;
    });

    setErrors((current) => {
      const activeNames = new Set(fields.map((field) => field.name));

      const next = Object.fromEntries(
        Object.entries(current).filter(([fieldName]) =>
          activeNames.has(fieldName),
        ),
      );

      return Object.keys(next).length === Object.keys(current).length
        ? current
        : next;
    });
  }, [fields]);

  const updateField = (fieldName: string, value: AuthFieldValue) => {
    setValues((current) => ({
      ...current,
      [fieldName]: value,
    }));

    setErrors((current) => {
      if (!(fieldName in current)) return current;

      const next = { ...current };
      delete next[fieldName];
      return next;
    });
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);

    if (emailError) {
      setEmailError(getEmailError(value, messages));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setErrors({});

    const nextEmailError = getEmailError(email, messages);

    setEmailError(nextEmailError);

    if (nextEmailError) {
      return;
    }

    if (password !== confirmation) {
      setFormError(messages.passwordMismatch);
      return;
    }

    if (!password) {
      setFormError(messages.passwordRequired);
      return;
    }

    setLoading(true);

    try {
      const nextErrors = await validateFields(fields, values);

      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors);
        return;
      }

      const registration: AuthRegistrationInput = {
        name: name.trim() || null,
        email: email.trim(),
        password,
      };

      const result = onSubmit
        ? await onSubmit({
            registration,
            fields: { ...values },
            signUp,
          })
        : await signUp(registration);

      if (result.status === "authenticated") {
        onSuccess?.();
        redirectAfterSuccess(redirects?.afterSignUp);
      }
    } catch (cause) {
      setFormError(
        cause instanceof Error ? cause.message : messages.unexpectedError,
      );
    } finally {
      setLoading(false);
    }
  };

  const wrapperClassName = [
    "puzzle-auth",
    "puzzle-auth-experience",
    layout?.className,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const contentClassName = [
    "puzzle-auth-experience__content",
    layout?.contentClassName,
  ]
    .filter(Boolean)
    .join(" ");

  const style = {
    "--puzzle-auth-experience-width":
      layout?.width === "sm"
        ? "24rem"
        : layout?.width === "lg"
          ? "48rem"
          : layout?.width === "full"
            ? "100%"
            : "32rem",
    "--puzzle-auth-experience-align":
      layout?.align === "left" ? "flex-start" : "center",
  } as CSSProperties;

  return (
    <section className={wrapperClassName} style={style}>
      {layout?.header}

      <div className="puzzle-auth-experience__branding">
        {branding?.logo}
        {branding?.title ? (
          <Heading as="h1" level="headline2">
            {branding.title}
          </Heading>
        ) : null}
        {branding?.description ? <Text as="p">{branding.description}</Text> : null}
      </div>

      <div className={contentClassName}>
        {mode === "sign-in" ? (
          <SignInForm
            redirectTo={redirects?.afterSignIn}
            onSuccess={onSuccess}
            onForgotPassword={onForgotPassword}
            onSignUp={onSignUp}
          />
        ) : (
          <>
            {formError ? (
              <div role="alert" aria-live="assertive">
                <Alert severity="error">{formError}</Alert>
              </div>
            ) : null}

            <form
              className="puzzle-auth__form"
              onSubmit={(event) => void handleSubmit(event)}
              noValidate
            >
              <FormField
                label={messages.name}
                controlId="puzzle-auth-experience-name"
              >
                <TextInput
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  disabled={loading}
                  onChange={(event) => setName(event.currentTarget.value)}
                />
              </FormField>

              <FormField
                label={messages.email}
                controlId="puzzle-auth-experience-email"
                required
                error={emailError}
              >
                <TextInput
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  disabled={loading}
                  onChange={(event) =>
                    handleEmailChange(event.currentTarget.value)
                  }
                />

              </FormField>

              <FormField
                label={messages.password}
                controlId="puzzle-auth-experience-password"
                required
              >
                <TextInput
                  name="new-password"
                  type="password"
                  suffix={null}
                  autoComplete="new-password"
                  required
                  value={password}
                  disabled={loading}
                  onChange={(event) => setPassword(event.currentTarget.value)}
                />
              </FormField>

              <FormField
                label={messages.confirmPassword}
                controlId="puzzle-auth-experience-confirm"
                required
              >
                <TextInput
                  name="confirm-password"
                  type="password"
                  suffix={null}
                  autoComplete="new-password"
                  required
                  value={confirmation}
                  disabled={loading}
                  onChange={(event) =>
                    setConfirmation(event.currentTarget.value)
                  }
                />
              </FormField>

              <AuthCustomFields
                fields={fields}
                values={values}
                errors={errors}
                disabled={loading}
                onChange={updateField}
              />

              <Button
                type="submit"
                fullWidth
                loading={loading}
                disabled={
                  loading || !email.trim() || !password || !confirmation
                }
              >
                {loading ? messages.signingUp : messages.createAccount}
              </Button>
            </form>

            {onSignIn ? (
              <footer className="puzzle-auth__footer">
                <Text>{messages.existingAccount}</Text>
                <Button
                  type="button"
                  variant="link"
                  onClick={onSignIn}
                >
                  {messages.signIn}
                </Button>
              </footer>
            ) : null}
          </>
        )}
      </div>

      {layout?.footer}
    </section>
  );
};

export { AuthExperience };
