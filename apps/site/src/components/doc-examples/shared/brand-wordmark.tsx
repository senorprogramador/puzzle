

export const BrandWordmark = ({
  name,
  mark,
  color,
  markForeground = "var(--puzzle-color-background)",
}: {
  name: string;
  mark: string;
  color: string;
  markForeground?: string;
}) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--puzzle-space-2, 0.5rem)",
      color: "var(--puzzle-color-text)",
      fontWeight: 700,
      letterSpacing: "0.02em",
      whiteSpace: "nowrap",
    }}
  >
    <span
      aria-hidden="true"
      style={{
        display: "grid",
        width: "1.5rem",
        aspectRatio: "1",
        placeItems: "center",
        borderRadius: "var(--puzzle-radius-sm, 0.25rem)",
        background: color,
        color: markForeground,
        fontSize: "var(--puzzle-font-size-xs, 0.75rem)",
      }}
    >
      {mark}
    </span>
    {name}
  </span>
);
