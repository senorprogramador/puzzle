import { ALL_NIMBUS_ICONS } from "./nimbus.constants";
import { NimbusIcon } from "./nimbus";
type NimbusIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "nimbus" as const;

const NimbusIconPage = ({ filter = "", size = 42, color = "#302f41" }: NimbusIconPageProps) => {
  const icons = filter === "" ? ALL_NIMBUS_ICONS.slice(0, 100) : ALL_NIMBUS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Nimbus Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <NimbusIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { NimbusIconPage, type NimbusIconPageProps };
