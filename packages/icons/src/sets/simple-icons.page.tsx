import { ALL_SIMPLE_ICONS_ICONS } from "./simple-icons.constants";
import { SimpleIconsIcon } from "./simple-icons";
type SimpleIconsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "simple-icons" as const;

const SimpleIconsIconPage = ({ filter = "", size = 42, color = "#302f41" }: SimpleIconsIconPageProps) => {
  const icons = filter === "" ? ALL_SIMPLE_ICONS_ICONS.slice(0, 100) : ALL_SIMPLE_ICONS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Simple icons Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <SimpleIconsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { SimpleIconsIconPage, type SimpleIconsIconPageProps };
