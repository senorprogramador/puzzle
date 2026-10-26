import { ALL_CIB_ICONS } from "./cib.constants";
import { CibIcon } from "./cib";
type CibIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "cib" as const;

const CibIconPage = ({ filter = "", size = 42, color = "#302f41" }: CibIconPageProps) => {
  const icons = filter === "" ? ALL_CIB_ICONS.slice(0, 100) : ALL_CIB_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Cib Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <CibIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { CibIconPage, type CibIconPageProps };
