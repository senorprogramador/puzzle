import { ALL_MARKETEQ_ICONS } from "./marketeq.constants";
import { MarketeqIcon } from "./marketeq";
type MarketeqIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "marketeq" as const;

const MarketeqIconPage = ({ filter = "", size = 42, color = "#302f41" }: MarketeqIconPageProps) => {
  const icons = filter === "" ? ALL_MARKETEQ_ICONS.slice(0, 100) : ALL_MARKETEQ_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Marketeq Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <MarketeqIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { MarketeqIconPage, type MarketeqIconPageProps };
