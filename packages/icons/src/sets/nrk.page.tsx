import { ALL_NRK_ICONS } from "./nrk.constants";
import { NrkIcon } from "./nrk";
type NrkIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "nrk" as const;

const NrkIconPage = ({ filter = "", size = 42, color = "#302f41" }: NrkIconPageProps) => {
  const icons = filter === "" ? ALL_NRK_ICONS.slice(0, 100) : ALL_NRK_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Nrk Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <NrkIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { NrkIconPage, type NrkIconPageProps };
