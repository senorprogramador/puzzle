import { ALL_IL_ICONS } from "./il.constants";
import { IlIcon } from "./il";
type IlIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "il" as const;

const IlIconPage = ({ filter = "", size = 42, color = "#302f41" }: IlIconPageProps) => {
  const icons = filter === "" ? ALL_IL_ICONS.slice(0, 100) : ALL_IL_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Il Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <IlIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { IlIconPage, type IlIconPageProps };
