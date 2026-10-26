import { ALL_VAADIN_ICONS } from "./vaadin.constants";
import { VaadinIcon } from "./vaadin";
type VaadinIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "vaadin" as const;

const VaadinIconPage = ({ filter = "", size = 42, color = "#302f41" }: VaadinIconPageProps) => {
  const icons = filter === "" ? ALL_VAADIN_ICONS.slice(0, 100) : ALL_VAADIN_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Vaadin Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <VaadinIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { VaadinIconPage, type VaadinIconPageProps };
