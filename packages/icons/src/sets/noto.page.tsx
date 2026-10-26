import { ALL_NOTO_ICONS } from "./noto.constants";
import { NotoIcon } from "./noto";
type NotoIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "noto" as const;

const NotoIconPage = ({ filter = "", size = 42, color = "#302f41" }: NotoIconPageProps) => {
  const icons = filter === "" ? ALL_NOTO_ICONS.slice(0, 100) : ALL_NOTO_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Noto Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <NotoIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { NotoIconPage, type NotoIconPageProps };
