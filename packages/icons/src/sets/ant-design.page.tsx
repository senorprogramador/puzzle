import { ALL_ANT_DESIGN_ICONS } from "./ant-design.constants";
import { AntDesignIcon } from "./ant-design";
type AntDesignIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "ant-design" as const;

const AntDesignIconPage = ({ filter = "", size = 42, color = "#302f41" }: AntDesignIconPageProps) => {
  const icons = filter === "" ? ALL_ANT_DESIGN_ICONS.slice(0, 100) : ALL_ANT_DESIGN_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Ant design Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <AntDesignIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { AntDesignIconPage, type AntDesignIconPageProps };
