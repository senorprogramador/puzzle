import { ALL_COVID_ICONS } from "./covid.constants";
import { CovidIcon } from "./covid";
type CovidIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "covid" as const;

const CovidIconPage = ({ filter = "", size = 42, color = "#302f41" }: CovidIconPageProps) => {
  const icons = filter === "" ? ALL_COVID_ICONS.slice(0, 100) : ALL_COVID_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Covid Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <CovidIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { CovidIconPage, type CovidIconPageProps };
