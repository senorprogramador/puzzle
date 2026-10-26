import { ALL_BXL_ICONS } from "./bxl.constants";
import { BxlIcon } from "./bxl";
type BxlIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "bxl" as const;

const BxlIconPage = ({ filter = "", size = 42, color = "#302f41" }: BxlIconPageProps) => {
  const icons = filter === "" ? ALL_BXL_ICONS.slice(0, 100) : ALL_BXL_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Bxl Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <BxlIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { BxlIconPage, type BxlIconPageProps };
