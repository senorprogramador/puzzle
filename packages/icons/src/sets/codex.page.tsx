import { ALL_CODEX_ICONS } from "./codex.constants";
import { CodexIcon } from "./codex";
type CodexIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "codex" as const;

const CodexIconPage = ({ filter = "", size = 42, color = "#302f41" }: CodexIconPageProps) => {
  const icons = filter === "" ? ALL_CODEX_ICONS.slice(0, 100) : ALL_CODEX_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Codex Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <CodexIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { CodexIconPage, type CodexIconPageProps };
