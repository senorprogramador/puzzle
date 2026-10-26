import { ALL_ION_ICONS } from "./ion.constants";
import { IonIcon } from "./ion";
type IonIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "ion" as const;

const IonIconPage = ({ filter = "", size = 42, color = "#302f41" }: IonIconPageProps) => {
  const icons = filter === "" ? ALL_ION_ICONS.slice(0, 100) : ALL_ION_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Ion Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <IonIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { IonIconPage, type IonIconPageProps };
