import { ALL_QUILL_ICONS } from "./quill.constants";
import { QuillIcon } from "./quill";
type QuillIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "quill" as const;

const QuillIconPage = ({ filter = "", size = 42, color = "#302f41" }: QuillIconPageProps) => {
  const icons = filter === "" ? ALL_QUILL_ICONS.slice(0, 100) : ALL_QUILL_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Quill Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <QuillIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { QuillIconPage, type QuillIconPageProps };
