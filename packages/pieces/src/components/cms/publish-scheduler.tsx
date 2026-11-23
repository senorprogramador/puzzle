"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { toDateTimeInputValue, toInstantInTimeZone } from "./time-zone.utils";
import type { PublishSchedulerProps } from "./cms.types";
import { errorMessage } from "./cms.utils";

export const PublishScheduler = ({
  scheduledAt = null,
  timeZone: initialTimeZone,
  disabled = false,
  scheduling = false,
  onSchedule,
  onCancelSchedule,
  className,
}: PublishSchedulerProps) => {
  const defaultTimeZone =
    initialTimeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC";
  const scheduledDate = useMemo(
    () => (scheduledAt === null ? null : new Date(scheduledAt)),
    [scheduledAt],
  );
  const validScheduledDate = useMemo(
    () =>
      scheduledDate && !Number.isNaN(scheduledDate.getTime())
        ? scheduledDate
        : null,
    [scheduledDate],
  );
  const [timeZone, setTimeZone] = useState(defaultTimeZone);
  const [dateTime, setDateTime] = useState(
    validScheduledDate
      ? toDateTimeInputValue(validScheduledDate, defaultTimeZone)
      : "",
  );
  const [actionError, setActionError] = useState<string | null>(null);
  const hasScheduledTime = scheduledAt !== null;

  useEffect(() => {
    setTimeZone(defaultTimeZone);
    setDateTime(
      validScheduledDate
        ? toDateTimeInputValue(validScheduledDate, defaultTimeZone)
        : "",
    );
  }, [defaultTimeZone, validScheduledDate]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActionError(null);
    try {
      const instant = toInstantInTimeZone(dateTime, timeZone);
      if (instant.getTime() <= Date.now()) {
        setActionError("Choose a publication time in the future.");
        return;
      }
      await onSchedule(instant, timeZone);
    } catch (error) {
      setActionError(errorMessage(error));
    }
  };

  const cancel = async () => {
    if (!onCancelSchedule) return;
    setActionError(null);
    try {
      await onCancelSchedule();
    } catch (error) {
      setActionError(errorMessage(error));
    }
  };

  return (
    <form
      className={["puzzle-cms-publish-scheduler", className].filter(Boolean).join(" ")}
      onSubmit={(event) => void submit(event)}
    >
      <h2>Publishing</h2>
      <label className="puzzle-cms-field">
        <span>Publish date and time</span>
        <input
          required
          type="datetime-local"
          value={dateTime}
          disabled={disabled || scheduling}
          onChange={(event) => setDateTime(event.currentTarget.value)}
        />
      </label>
      <label className="puzzle-cms-field">
        <span>Time zone (IANA)</span>
        <input
          required
          value={timeZone}
          disabled={disabled || scheduling}
          onChange={(event) => setTimeZone(event.currentTarget.value)}
          placeholder="Europe/Amsterdam"
        />
      </label>
      {scheduledAt ? (
        <p>
          Currently scheduled for{" "}
          {validScheduledDate
            ? new Intl.DateTimeFormat(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
                timeZone: defaultTimeZone,
              }).format(validScheduledDate)
            : "an invalid date"}
          ({defaultTimeZone}).
        </p>
      ) : null}
      {actionError ? <p role="alert">{actionError}</p> : null}
      <div className="puzzle-cms-publish-scheduler__actions">
        <button type="submit" disabled={disabled || scheduling}>
          {scheduling ? "Scheduling…" : "Schedule"}
        </button>
        {hasScheduledTime && onCancelSchedule ? (
          <button
            type="button"
            disabled={disabled || scheduling}
            onClick={() => void cancel()}
          >
            Cancel schedule
          </button>
        ) : null}
      </div>
      <p className="puzzle-cms-publish-scheduler__note">
        The server scheduler is responsible for publishing at this time.
      </p>
    </form>
  );
};
