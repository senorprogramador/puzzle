import { ALL_IC_ICONS } from "./ic.constants";
import { IcIcon } from "./ic";
type IcIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "ic" as const;

const IcIconPage = ({ filter = "", size = 42, color = "#302f41" }: IcIconPageProps) => {
  const icons = filter === "" ? ALL_IC_ICONS.slice(0, 100) : ALL_IC_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Ic Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <IcIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { IcIconPage, type IcIconPageProps };
