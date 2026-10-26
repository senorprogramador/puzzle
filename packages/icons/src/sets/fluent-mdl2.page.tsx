import { ALL_FLUENT_MDL2_ICONS } from "./fluent-mdl2.constants";
import { FluentMdl2Icon } from "./fluent-mdl2";
type FluentMdl2IconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "fluent-mdl2" as const;

const FluentMdl2IconPage = ({ filter = "", size = 42, color = "#302f41" }: FluentMdl2IconPageProps) => {
  const icons = filter === "" ? ALL_FLUENT_MDL2_ICONS.slice(0, 100) : ALL_FLUENT_MDL2_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Fluent mdl2 Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <FluentMdl2Icon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { FluentMdl2IconPage, type FluentMdl2IconPageProps };
