import { ALL_VSCODE_ICONS_ICONS } from "./vscode-icons.constants";
import { VscodeIconsIcon } from "./vscode-icons";
type VscodeIconsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "vscode-icons" as const;

const VscodeIconsIconPage = ({ filter = "", size = 42, color = "#302f41" }: VscodeIconsIconPageProps) => {
  const icons = filter === "" ? ALL_VSCODE_ICONS_ICONS.slice(0, 100) : ALL_VSCODE_ICONS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Vscode icons Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <VscodeIconsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { VscodeIconsIconPage, type VscodeIconsIconPageProps };
