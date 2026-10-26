import { ALL_CBI_ICONS } from "./cbi.constants";
import { CbiIcon } from "./cbi";
type CbiIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "cbi" as const;

const CbiIconPage = ({ filter = "", size = 42, color = "#302f41" }: CbiIconPageProps) => {
  const icons = filter === "" ? ALL_CBI_ICONS.slice(0, 100) : ALL_CBI_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Cbi Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <CbiIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { CbiIconPage, type CbiIconPageProps };
