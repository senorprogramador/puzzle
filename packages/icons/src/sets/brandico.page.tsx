import { ALL_BRANDICO_ICONS } from "./brandico.constants";
import { BrandicoIcon } from "./brandico";
type BrandicoIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "brandico" as const;

const BrandicoIconPage = ({ filter = "", size = 42, color = "#302f41" }: BrandicoIconPageProps) => {
  const icons = filter === "" ? ALL_BRANDICO_ICONS.slice(0, 100) : ALL_BRANDICO_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Brandico Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <BrandicoIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { BrandicoIconPage, type BrandicoIconPageProps };
