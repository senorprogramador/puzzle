import { ALL_EOS_ICONS_ICONS } from "./eos-icons.constants";
import { EosIconsIcon } from "./eos-icons";
type EosIconsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "eos-icons" as const;

const EosIconsIconPage = ({ filter = "", size = 42, color = "#302f41" }: EosIconsIconPageProps) => {
  const icons = filter === "" ? ALL_EOS_ICONS_ICONS.slice(0, 100) : ALL_EOS_ICONS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Eos icons Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <EosIconsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { EosIconsIconPage, type EosIconsIconPageProps };
