import { ALL_TOKEN_ICONS } from "./token.constants";
import { TokenIcon } from "./token";
type TokenIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "token" as const;

const TokenIconPage = ({ filter = "", size = 42, color = "#302f41" }: TokenIconPageProps) => {
  const icons = filter === "" ? ALL_TOKEN_ICONS.slice(0, 100) : ALL_TOKEN_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Token Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <TokenIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { TokenIconPage, type TokenIconPageProps };
