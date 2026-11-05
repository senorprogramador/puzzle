const PROGRESS_MIN = 0;
const PROGRESS_MAX = 100;

/** Clamps a progress value to 0-100. Missing or non-finite values are indeterminate. */
const normalizeProgressValue = (value: number | undefined) =>
  value === undefined || !Number.isFinite(value)
    ? undefined
    : Math.min(PROGRESS_MAX, Math.max(PROGRESS_MIN, value));

/** Shared progressbar semantics; aria-valuenow is omitted while indeterminate. */
const getProgressAriaProps = (value: number | undefined) => ({
  role: "progressbar" as const,
  "aria-valuemin": PROGRESS_MIN,
  "aria-valuemax": PROGRESS_MAX,
  "aria-valuenow": value,
});

export { normalizeProgressValue, getProgressAriaProps };
