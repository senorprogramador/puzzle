import { ALL_STREAMLINE_EMOJIS_ICONS } from "./streamline-emojis.constants";
import { StreamlineEmojisIcon } from "./streamline-emojis";
type StreamlineEmojisIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "streamline-emojis" as const;

const StreamlineEmojisIconPage = ({ filter = "", size = 42, color = "#302f41" }: StreamlineEmojisIconPageProps) => {
  const icons = filter === "" ? ALL_STREAMLINE_EMOJIS_ICONS.slice(0, 100) : ALL_STREAMLINE_EMOJIS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Streamline emojis Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <StreamlineEmojisIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { StreamlineEmojisIconPage, type StreamlineEmojisIconPageProps };
