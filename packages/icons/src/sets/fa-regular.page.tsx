import { ALL_FA_REGULAR_ICONS } from "./fa-regular.constants";
import { FaRegularIcon } from "./fa-regular";
type FaRegularIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "fa-regular" as const;

const FaRegularIconPage = ({ filter = "", size = 42, color = "#302f41" }: FaRegularIconPageProps) => {
  const icons = filter === "" ? ALL_FA_REGULAR_ICONS.slice(0, 100) : ALL_FA_REGULAR_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Fa regular Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <FaRegularIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { FaRegularIconPage, type FaRegularIconPageProps };
