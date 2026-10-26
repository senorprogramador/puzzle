import { ALL_FILE_ICONS_ICONS } from "./file-icons.constants";
import { FileIconsIcon } from "./file-icons";
type FileIconsIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "file-icons" as const;

const FileIconsIconPage = ({ filter = "", size = 42, color = "#302f41" }: FileIconsIconPageProps) => {
  const icons = filter === "" ? ALL_FILE_ICONS_ICONS.slice(0, 100) : ALL_FILE_ICONS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>File icons Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <FileIconsIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { FileIconsIconPage, type FileIconsIconPageProps };
