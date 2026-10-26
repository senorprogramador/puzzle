import { ALL_FLOWBITE_ICONS } from "./flowbite.constants";
import { FlowbiteIcon } from "./flowbite";
type FlowbiteIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "flowbite" as const;

const FlowbiteIconPage = ({ filter = "", size = 42, color = "#302f41" }: FlowbiteIconPageProps) => {
  const icons = filter === "" ? ALL_FLOWBITE_ICONS.slice(0, 100) : ALL_FLOWBITE_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Flowbite Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <FlowbiteIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { FlowbiteIconPage, type FlowbiteIconPageProps };
