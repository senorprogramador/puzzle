import { ALL_KEYLINE_ICONS_ICONS } from "./keyline-icons.constants";
import { KeylineIconsIcon } from "./keyline-icons";
type KeylineIconsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "keyline-icons" as const;

const KeylineIconsIconPage = ({ filter = "", size = 42, color = "#302f41" }: KeylineIconsIconPageProps) => {
  const icons = filter === "" ? ALL_KEYLINE_ICONS_ICONS.slice(0, 100) : ALL_KEYLINE_ICONS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Keyline icons Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <KeylineIconsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { KeylineIconsIconPage, type KeylineIconsIconPageProps };
