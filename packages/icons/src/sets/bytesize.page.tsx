import { ALL_BYTESIZE_ICONS } from "./bytesize.constants";
import { BytesizeIcon } from "./bytesize";
type BytesizeIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "bytesize" as const;

const BytesizeIconPage = ({ filter = "", size = 42, color = "#302f41" }: BytesizeIconPageProps) => {
  const icons = filter === "" ? ALL_BYTESIZE_ICONS.slice(0, 100) : ALL_BYTESIZE_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Bytesize Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <BytesizeIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { BytesizeIconPage, type BytesizeIconPageProps };
