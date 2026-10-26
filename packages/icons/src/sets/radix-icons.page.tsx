import { ALL_RADIX_ICONS_ICONS } from "./radix-icons.constants";
import { RadixIconsIcon } from "./radix-icons";
type RadixIconsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "radix-icons" as const;

const RadixIconsIconPage = ({ filter = "", size = 42, color = "#302f41" }: RadixIconsIconPageProps) => {
  const icons = filter === "" ? ALL_RADIX_ICONS_ICONS.slice(0, 100) : ALL_RADIX_ICONS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Radix icons Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <RadixIconsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { RadixIconsIconPage, type RadixIconsIconPageProps };
