import { ALL_VADIVAM_ICONS } from "./vadivam.constants";
import { VadivamIcon } from "./vadivam";
type VadivamIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "vadivam" as const;

const VadivamIconPage = ({ filter = "", size = 42, color = "#302f41" }: VadivamIconPageProps) => {
  const icons = filter === "" ? ALL_VADIVAM_ICONS.slice(0, 100) : ALL_VADIVAM_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Vadivam Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <VadivamIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { VadivamIconPage, type VadivamIconPageProps };
