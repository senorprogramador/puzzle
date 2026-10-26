import { ALL_CIL_ICONS } from "./cil.constants";
import { CilIcon } from "./cil";
type CilIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "cil" as const;

const CilIconPage = ({ filter = "", size = 42, color = "#302f41" }: CilIconPageProps) => {
  const icons = filter === "" ? ALL_CIL_ICONS.slice(0, 100) : ALL_CIL_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Cil Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <CilIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { CilIconPage, type CilIconPageProps };
