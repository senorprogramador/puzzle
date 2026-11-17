

export const BrandWordmark = ({
  name,
  mark,
  color,
}: {
  name: string;
  mark: string;
  color: string;
}) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "var(--puzzle-space-2, 0.5rem)",
      color,
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
        background: "currentColor",
        color: "var(--puzzle-color-background)",
        fontSize: "var(--puzzle-font-size-xs, 0.75rem)",
      }}
    >
      {mark}
    </span>
    {name}
  </span>
);
