import { ALL_IWWA_ICONS } from "./iwwa.constants";
import { IwwaIcon } from "./iwwa";
type IwwaIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "iwwa" as const;

const IwwaIconPage = ({ filter = "", size = 42, color = "#302f41" }: IwwaIconPageProps) => {
  const icons = filter === "" ? ALL_IWWA_ICONS.slice(0, 100) : ALL_IWWA_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Iwwa Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <IwwaIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { IwwaIconPage, type IwwaIconPageProps };
