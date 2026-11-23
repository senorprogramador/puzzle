import { useId, type ReactNode } from "react";

import { Alert, Text } from "@puzzle-ui/ui";

import "./feedback.css";

export type NotificationItemProps = {
  id?: string;
  title: ReactNode;
  description?: ReactNode;
  timestamp?: ReactNode;
  dateTime?: string;
  href?: string;
  unread?: boolean;
  onDismiss?: () => void;
  dismissLabel?: string;
  className?: string;
};

export type NotificationListProps = {
  items: readonly (NotificationItemProps & { id: string })[];
  label?: string;
  emptyState?: ReactNode;
  className?: string;
};

export type ErrorStatePanelProps = {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export const NotificationItem = ({
  title,
  description,
  timestamp,
  dateTime,
  href,
  unread = false,
  onDismiss,
  dismissLabel = "Dismiss notification",
  className,
}: NotificationItemProps) => {
  const titleId = useId();
  const unreadId = useId();
  const dismissId = useId();

  return (
    <li
      className={["puzzle-notification-item", className]
        .filter(Boolean)
        .join(" ")}
      data-unread={unread || undefined}
    >
      <div className="puzzle-notification-item__content">
        <div className="puzzle-notification-item__title" id={titleId}>
          {href ? <a href={href}>{title}</a> : title}
        </div>
        {description && (
          <Text as="p" className="puzzle-notification-item__description">
            {description}
          </Text>
        )}
        {timestamp && (
          <time className="puzzle-notification-item__time" dateTime={dateTime}>
            {timestamp}
          </time>
        )}
      </div>
      {unread ? (
        <span
          id={unreadId}
          className="puzzle-notification-item__visually-hidden"
        >
          Unread
        </span>
      ) : null}
      {onDismiss && (
        <button
          className="puzzle-notification-item__dismiss"
          type="button"
          aria-labelledby={
            unread
              ? `${titleId} ${unreadId} ${dismissId}`
              : `${titleId} ${dismissId}`
          }
          onClick={onDismiss}
        >
          <span
            id={dismissId}
            className="puzzle-notification-item__visually-hidden"
          >
            {dismissLabel}
          </span>
          <span aria-hidden="true">&times;</span>
        </button>
      )}
    </li>
  );
};

export const NotificationList = ({
  items,
  label = "Notifications",
  emptyState = "No notifications.",
  className,
}: NotificationListProps) => (
  <section
    className={["puzzle-notification-list", className]
      .filter(Boolean)
      .join(" ")}
    aria-label={label}
  >
    {items.length === 0 ? (
      <div className="puzzle-notification-list__empty">{emptyState}</div>
    ) : (
      <ul className="puzzle-notification-list__items">
        {items.map((item) => (
          <NotificationItem {...item} key={item.id} />
        ))}
      </ul>
    )}
  </section>
);

export const ErrorStatePanel = ({
  title,
  description,
  action,
  className,
}: ErrorStatePanelProps) => (
  <section
    className={["puzzle-error-state-panel", className]
      .filter(Boolean)
      .join(" ")}
  >
    <Alert severity="error" title={title}>
      {description}
    </Alert>
    {action && (
      <div className="puzzle-error-state-panel__action">{action}</div>
    )}
  </section>
);
