import { ALL_LINE_MD_ICONS } from "./line-md.constants";
import { LineMdIcon } from "./line-md";
type LineMdIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "line-md" as const;

const LineMdIconPage = ({ filter = "", size = 42, color = "#302f41" }: LineMdIconPageProps) => {
  const icons = filter === "" ? ALL_LINE_MD_ICONS.slice(0, 100) : ALL_LINE_MD_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Line md Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <LineMdIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { LineMdIconPage, type LineMdIconPageProps };
