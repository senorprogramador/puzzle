import { ALL_MYNAUI_ICONS } from "./mynaui.constants";
import { MynauiIcon } from "./mynaui";
type MynauiIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "mynaui" as const;

const MynauiIconPage = ({ filter = "", size = 42, color = "#302f41" }: MynauiIconPageProps) => {
  const icons = filter === "" ? ALL_MYNAUI_ICONS.slice(0, 100) : ALL_MYNAUI_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Mynaui Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <MynauiIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { MynauiIconPage, type MynauiIconPageProps };
