import { Heading, Stack, Text } from "@puzzle-ui/ui";
import {
  cloneElement,
  isValidElement,
  useId,
  type ReactNode,
} from "react";

import "./settings.css";

export type SettingsSectionProps = {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  navigation?: ReactNode;
  navigationLabel?: string;
  variant?: SettingsSectionVariant;
  children: ReactNode;
  className?: string;
};

export type SettingsSectionVariant =
  | "list"
  | "grouped"
  | "cards"
  | "split"
  | "sidebar"
  | "tabs"
  | "accordion"
  | "profile"
  | "preferences"
  | "security"
  | "notifications"
  | "compact";

export type SettingsGroupProps = {
  title?: ReactNode;
  children: ReactNode;
  className?: string;
};

export type SettingsRowProps = {
  label: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  htmlFor?: string;
  control: ReactNode;
  className?: string;
};

export type FormActionsProps = {
  children: ReactNode;
  className?: string;
};

export type ProfileHeaderProps = {
  name: ReactNode;
  email?: ReactNode;
  avatar?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export type SecurityMethodCardProps = {
  title: ReactNode;
  description?: ReactNode;
  status?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export const SettingsSection = ({
  title,
  description,
  actions,
  navigation,
  navigationLabel = "Settings navigation",
  variant = "grouped",
  children,
  className,
}: SettingsSectionProps) => {
  const titleId = useId();

  return (
    <section
      className={["puzzle-settings-section", className]
        .filter(Boolean)
        .join(" ")}
      data-variant={variant}
      aria-labelledby={titleId}
    >
      <Stack
        as="header"
        className="puzzle-settings-section__header"
        direction={{ mobile: "col", tablet: "row" }}
        gap="md"
        wrap="nowrap"
        alignH={{ mobile: "start", tablet: "between" }}
        alignV={{ mobile: "start", tablet: "center" }}
      >
        <div>
          <Heading level="headline2" as="h2" id={titleId} className="puzzle-settings-section__title">
            {title}
          </Heading>
          {description && (
            <Text as="p" className="puzzle-settings-section__description">
              {description}
            </Text>
          )}
        </div>
        {actions}
      </Stack>
      <div className="puzzle-settings-section__layout">
        {navigation ? (
          <nav
            className="puzzle-settings-section__navigation"
            aria-label={navigationLabel}
          >
            {navigation}
          </nav>
        ) : null}
        <div className="puzzle-settings-section__content">{children}</div>
      </div>
    </section>
  );
};

export const SettingsGroup = ({
  title,
  children,
  className,
}: SettingsGroupProps) => {
  const titleId = useId();

  return (
    <Stack
      as="section"
      className={["puzzle-settings-group", className]
        .filter(Boolean)
        .join(" ")}
      aria-labelledby={title ? titleId : undefined}
      direction="col"
      gap="md"
      wrap="nowrap"
    >
      {title && (
        <Heading level="headline3" as="h3" id={titleId} className="puzzle-settings-group__title">
          {title}
        </Heading>
      )}
      <div className="puzzle-settings-group__content">{children}</div>
    </Stack>
  );
};

export const SettingsRow = ({
  label,
  description,
  error,
  htmlFor,
  control,
  className,
}: SettingsRowProps) => {
  const descriptionId = useId();
  const errorId = useId();
  const enhancedControl = isValidElement<{
    "aria-describedby"?: string;
    "aria-invalid"?: boolean | "grammar" | "spelling";
  }>(control)
    ? cloneElement(control, {
        "aria-describedby":
          [
            control.props["aria-describedby"],
            description ? descriptionId : undefined,
            error ? errorId : undefined,
          ]
            .filter(Boolean)
            .join(" ") || undefined,
        ...(error ? { "aria-invalid": true } : {}),
      })
    : control;

  return (
    <Stack
      className={["puzzle-settings-row", className]
        .filter(Boolean)
        .join(" ")}
      direction={{ mobile: "col", tablet: "row" }}
      gap="md"
      wrap="nowrap"
      alignH={{ mobile: "start", tablet: "between" }}
      alignV={{ mobile: "start", tablet: "center" }}
    >
      <div className="puzzle-settings-row__copy">
        {htmlFor ? (
          <label className="puzzle-settings-row__label" htmlFor={htmlFor}>
            {label}
          </label>
        ) : (
          <div className="puzzle-settings-row__label">{label}</div>
        )}
        {description && (
          <div id={descriptionId} className="puzzle-settings-row__description">
            {description}
          </div>
        )}
        {error ? (
          <div id={errorId} className="puzzle-settings-row__error" role="alert">
            {error}
          </div>
        ) : null}
      </div>
      <div className="puzzle-settings-row__control">
        {enhancedControl}
      </div>
    </Stack>
  );
};

export const FormActions = ({ children, className }: FormActionsProps) => (
  <Stack
    className={["puzzle-form-actions", className].filter(Boolean).join(" ")}
    role="group"
    aria-label="Form actions"
    direction="row"
    gap="sm"
    wrap="wrap"
    alignH="end"
  >
    {children}
  </Stack>
);

export const ProfileHeader = ({
  name,
  email,
  avatar,
  actions,
  className,
}: ProfileHeaderProps) => (
  <Stack
    as="header"
    className={["puzzle-profile-header", className]
      .filter(Boolean)
      .join(" ")}
    direction={{ mobile: "col", tablet: "row" }}
    gap="md"
    wrap="nowrap"
    alignH={{ mobile: "start", tablet: "between" }}
    alignV={{ mobile: "start", tablet: "center" }}
  >
    {avatar && (
      <div className="puzzle-profile-header__avatar">{avatar}</div>
    )}
    <div className="puzzle-profile-header__identity">
      <Heading level="headline2" as="h2" className="puzzle-profile-header__name">{name}</Heading>
      {email && <Text as="p" className="puzzle-profile-header__email">{email}</Text>}
    </div>
    {actions && (
      <div className="puzzle-profile-header__actions">{actions}</div>
    )}
  </Stack>
);

export const SecurityMethodCard = ({
  title,
  description,
  status,
  icon,
  action,
  className,
}: SecurityMethodCardProps) => (
  <Stack
    as="article"
    className={["puzzle-security-method-card", className]
      .filter(Boolean)
      .join(" ")}
    direction={{ mobile: "col", tablet: "row" }}
    gap="md"
    wrap="nowrap"
    alignH="start"
    alignV={{ mobile: "start", tablet: "center" }}
  >
    {icon && (
      <div className="puzzle-security-method-card__icon" aria-hidden="true">
        {icon}
      </div>
    )}
    <div className="puzzle-security-method-card__content">
      <Heading level="headline3" as="h3" className="puzzle-security-method-card__title">{title}</Heading>
      {description && (
        <Text as="p" className="puzzle-security-method-card__description">
          {description}
        </Text>
      )}
      {status && (
        <div className="puzzle-security-method-card__status">{status}</div>
      )}
    </div>
    {action && (
      <div className="puzzle-security-method-card__action">{action}</div>
    )}
  </Stack>
);
