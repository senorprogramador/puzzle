import { ALL_NOTO_V1_ICONS } from "./noto-v1.constants";
import { NotoV1Icon } from "./noto-v1";
type NotoV1IconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "noto-v1" as const;

const NotoV1IconPage = ({ filter = "", size = 42, color = "#302f41" }: NotoV1IconPageProps) => {
  const icons = filter === "" ? ALL_NOTO_V1_ICONS.slice(0, 100) : ALL_NOTO_V1_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Noto v1 Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <NotoV1Icon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { NotoV1IconPage, type NotoV1IconPageProps };
