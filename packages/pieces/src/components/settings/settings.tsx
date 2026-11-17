import { useId, type ReactNode } from "react";

import "./settings.css";

export type SettingsSectionProps = {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export type SettingsGroupProps = {
  title?: ReactNode;
  children: ReactNode;
  className?: string;
};

export type SettingsRowProps = {
  label: ReactNode;
  description?: ReactNode;
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
  children,
  className,
}: SettingsSectionProps) => {
  const titleId = useId();

  return (
    <section
      className={["puzzle-settings-section", className]
        .filter(Boolean)
        .join(" ")}
      aria-labelledby={titleId}
    >
      <header className="puzzle-settings-section__header">
        <div>
          <h2 id={titleId} className="puzzle-settings-section__title">
            {title}
          </h2>
          {description && (
            <p className="puzzle-settings-section__description">
              {description}
            </p>
          )}
        </div>
        {actions}
      </header>
      {children}
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
    <section
      className={["puzzle-settings-group", className]
        .filter(Boolean)
        .join(" ")}
      aria-labelledby={title ? titleId : undefined}
    >
      {title && (
        <h3 id={titleId} className="puzzle-settings-group__title">
          {title}
        </h3>
      )}
      <div className="puzzle-settings-group__content">{children}</div>
    </section>
  );
};

export const SettingsRow = ({
  label,
  description,
  htmlFor,
  control,
  className,
}: SettingsRowProps) => {
  return (
    <div
      className={["puzzle-settings-row", className]
        .filter(Boolean)
        .join(" ")}
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
          <div className="puzzle-settings-row__description">
            {description}
          </div>
        )}
      </div>
      <div className="puzzle-settings-row__control">
        {control}
      </div>
    </div>
  );
};

export const FormActions = ({ children, className }: FormActionsProps) => (
  <div
    className={["puzzle-form-actions", className].filter(Boolean).join(" ")}
    role="group"
    aria-label="Form actions"
  >
    {children}
  </div>
);

export const ProfileHeader = ({
  name,
  email,
  avatar,
  actions,
  className,
}: ProfileHeaderProps) => (
  <header
    className={["puzzle-profile-header", className]
      .filter(Boolean)
      .join(" ")}
  >
    {avatar && (
      <div className="puzzle-profile-header__avatar">{avatar}</div>
    )}
    <div className="puzzle-profile-header__identity">
      <h2 className="puzzle-profile-header__name">{name}</h2>
      {email && <p className="puzzle-profile-header__email">{email}</p>}
    </div>
    {actions && (
      <div className="puzzle-profile-header__actions">{actions}</div>
    )}
  </header>
);

export const SecurityMethodCard = ({
  title,
  description,
  status,
  icon,
  action,
  className,
}: SecurityMethodCardProps) => (
  <article
    className={["puzzle-security-method-card", className]
      .filter(Boolean)
      .join(" ")}
  >
    {icon && (
      <div className="puzzle-security-method-card__icon" aria-hidden="true">
        {icon}
      </div>
    )}
    <div className="puzzle-security-method-card__content">
      <h3 className="puzzle-security-method-card__title">{title}</h3>
      {description && (
        <p className="puzzle-security-method-card__description">
          {description}
        </p>
      )}
      {status && (
        <div className="puzzle-security-method-card__status">{status}</div>
      )}
    </div>
    {action && (
      <div className="puzzle-security-method-card__action">{action}</div>
    )}
  </article>
);
