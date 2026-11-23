"use client";

import { Button } from "@puzzle-ui/ui";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";
import { MarketingSection, type MarketingSectionBaseProps } from "../shared";
import type { AnnouncementItem, AnnouncementSectionProps } from "./announcement.types";
import "./announcement.css";

const Countdown = ({ target }: { target: Date | string }) => {
  const [now, setNow] = useState<number>();
  const targetTime = new Date(target).getTime();

  useEffect(() => {
    const currentTime = Date.now();
    setNow(currentTime);
    if (currentTime >= targetTime) return;

    const timer = window.setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= targetTime) window.clearInterval(timer);
    }, 1_000);
    return () => window.clearInterval(timer);
  }, [targetTime]);

  const remaining = Math.max(0, targetTime - (now ?? targetTime));
  const days = Math.floor(remaining / 86_400_000);
  const hours = Math.floor((remaining % 86_400_000) / 3_600_000);
  const minutes = Math.floor((remaining % 3_600_000) / 60_000);
  const seconds = Math.floor((remaining % 60_000) / 1_000);
  const label = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;

  return (
    <time
      className="puzzle-announcement__countdown"
      dateTime={new Date(targetTime).toISOString()}
      aria-label={label}
    >
      {days}d {hours}h {minutes}m {seconds}s
    </time>
  );
};

const AnnouncementContent = ({
  announcement,
  countdown,
  dismissible,
  onDismiss,
}: {
  announcement: AnnouncementItem;
  countdown?: ReactNode;
  dismissible: boolean;
  onDismiss: () => void;
}) => (
  <div className="puzzle-announcement__message">
    {announcement.icon ? (
      <span className="puzzle-announcement__icon" aria-hidden="true">
        {announcement.icon}
      </span>
    ) : null}
    <div className="puzzle-announcement__copy">{announcement.message}</div>
    {countdown}
    {announcement.action ? (
      <div className="puzzle-announcement__action">{announcement.action}</div>
    ) : null}
    {dismissible ? (
      <Button
        className="puzzle-announcement__dismiss"
        variant="ghost"
        size="sm"
        aria-label={announcement.dismissLabel ?? "Dismiss announcement"}
        onClick={onDismiss}
      >
        Dismiss
      </Button>
    ) : null}
  </div>
);

const AnnouncementSection = <C extends ElementType = "section">(
  props: AnnouncementSectionProps<C>,
) => {
  const variant = props.variant ?? "bar";
  const [dismissed, setDismissed] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const listRef = useRef<HTMLDivElement>(null);
  const nextDismissIndex = useRef<number | null>(null);
  const announcements =
    "announcements" in props && props.announcements
      ? props.announcements
      : undefined;
  const countdownTarget =
    "countdownTarget" in props ? props.countdownTarget : undefined;

  if (variant === "countdown") {
    if (countdownTarget === undefined) {
      throw new TypeError("countdownTarget is required for the countdown variant.");
    }
    const targetTime = new Date(countdownTarget).getTime();
    if (!Number.isFinite(targetTime)) {
      throw new RangeError("countdownTarget must be a valid date.");
    }
  }

  const canDismiss = props.dismissible ?? variant === "dismissible";
  const messages: readonly AnnouncementItem[] =
    variant === "multi-message"
      ? (announcements ?? [])
      : [
          {
            id: "announcement",
            message: props.message,
            icon: props.icon,
            action: props.action,
            dismissLabel: props.dismissLabel,
          },
        ];
  const visibleMessages = messages.filter(
    (announcement) =>
      announcement.message !== undefined &&
      announcement.message !== null &&
      announcement.message !== false &&
      !(variant === "multi-message" && dismissedIds.has(announcement.id)),
  );
  useLayoutEffect(() => {
    if (nextDismissIndex.current === null) {
      return;
    }

    const buttons =
      listRef.current?.querySelectorAll<HTMLButtonElement>(
        ".puzzle-announcement__dismiss",
      );
    const index = Math.min(nextDismissIndex.current, (buttons?.length ?? 0) - 1);
    nextDismissIndex.current = null;
    buttons?.[index]?.focus();
  }, [visibleMessages.length]);

  const tickerLabel =
    typeof props["aria-label"] === "string"
      ? props["aria-label"]
      : "Announcements";
  const sectionProps = { ...props };
  delete (sectionProps as Partial<AnnouncementSectionProps<C>>).variant;
  delete (sectionProps as Partial<AnnouncementSectionProps<C>>).message;
  delete (sectionProps as Partial<AnnouncementSectionProps<C>>).icon;
  delete (sectionProps as Partial<AnnouncementSectionProps<C>>).action;
  delete (sectionProps as Partial<AnnouncementSectionProps<C>>).dismissible;
  delete (sectionProps as Partial<AnnouncementSectionProps<C>>).dismissLabel;
  delete (sectionProps as Partial<AnnouncementSectionProps<C>>).countdownTarget;
  delete (sectionProps as Partial<AnnouncementSectionProps<C>>).announcements;

  if (dismissed && variant !== "multi-message") {
    return null;
  }

  return (
    <MarketingSection<C>
      {...(sectionProps as MarketingSectionBaseProps<C>)}
      className={`puzzle-announcement ${props.className ?? ""}`.trim()}
      family="announcement"
      variant={variant}
    >
      {visibleMessages.length ? (
        <div
          ref={listRef}
          className="puzzle-announcement__list"
          role={variant === "ticker" ? "group" : undefined}
          aria-label={variant === "ticker" ? tickerLabel : undefined}
          tabIndex={variant === "ticker" ? 0 : undefined}
        >
          {visibleMessages.map((announcement, index) => (
            <AnnouncementContent
              key={announcement.id}
              announcement={announcement}
              countdown={
                variant === "countdown" && countdownTarget !== undefined ? (
                  <Countdown target={countdownTarget} />
                ) : undefined
              }
              dismissible={canDismiss}
              onDismiss={() => {
                if (variant === "multi-message") {
                  nextDismissIndex.current = index;
                  setDismissedIds((current) => {
                    const next = new Set(current);
                    next.add(announcement.id);
                    return next;
                  });
                } else {
                  setDismissed(true);
                }
              }}
            />
          ))}
        </div>
      ) : null}
      {props.children}
    </MarketingSection>
  );
};

export { AnnouncementSection };
