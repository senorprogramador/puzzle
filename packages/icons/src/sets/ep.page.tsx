import { ALL_EP_ICONS } from "./ep.constants";
import { EpIcon } from "./ep";
type EpIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "ep" as const;

const EpIconPage = ({ filter = "", size = 42, color = "#302f41" }: EpIconPageProps) => {
  const icons = filter === "" ? ALL_EP_ICONS.slice(0, 100) : ALL_EP_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Ep Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <EpIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { EpIconPage, type EpIconPageProps };
