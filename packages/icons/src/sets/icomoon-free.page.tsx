import { ALL_ICOMOON_FREE_ICONS } from "./icomoon-free.constants";
import { IcomoonFreeIcon } from "./icomoon-free";
type IcomoonFreeIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "icomoon-free" as const;

const IcomoonFreeIconPage = ({ filter = "", size = 42, color = "#302f41" }: IcomoonFreeIconPageProps) => {
  const icons = filter === "" ? ALL_ICOMOON_FREE_ICONS.slice(0, 100) : ALL_ICOMOON_FREE_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Icomoon free Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <IcomoonFreeIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { IcomoonFreeIconPage, type IcomoonFreeIconPageProps };
