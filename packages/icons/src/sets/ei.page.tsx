import { ALL_EI_ICONS } from "./ei.constants";
import { EiIcon } from "./ei";
type EiIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "ei" as const;

const EiIconPage = ({ filter = "", size = 42, color = "#302f41" }: EiIconPageProps) => {
  const icons = filter === "" ? ALL_EI_ICONS.slice(0, 100) : ALL_EI_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Ei Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <EiIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { EiIconPage, type EiIconPageProps };
