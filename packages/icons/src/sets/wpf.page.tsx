import { ALL_WPF_ICONS } from "./wpf.constants";
import { WpfIcon } from "./wpf";
type WpfIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "wpf" as const;

const WpfIconPage = ({ filter = "", size = 42, color = "#302f41" }: WpfIconPageProps) => {
  const icons = filter === "" ? ALL_WPF_ICONS.slice(0, 100) : ALL_WPF_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Wpf Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <WpfIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { WpfIconPage, type WpfIconPageProps };
