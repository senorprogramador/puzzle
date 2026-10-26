import { ALL_EVA_ICONS } from "./eva.constants";
import { EvaIcon } from "./eva";
type EvaIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "eva" as const;

const EvaIconPage = ({ filter = "", size = 42, color = "#302f41" }: EvaIconPageProps) => {
  const icons = filter === "" ? ALL_EVA_ICONS.slice(0, 100) : ALL_EVA_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Eva Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <EvaIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { EvaIconPage, type EvaIconPageProps };
