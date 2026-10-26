import { ALL_PRIME_ICONS } from "./prime.constants";
import { PrimeIcon } from "./prime";
type PrimeIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "prime" as const;

const PrimeIconPage = ({ filter = "", size = 42, color = "#302f41" }: PrimeIconPageProps) => {
  const icons = filter === "" ? ALL_PRIME_ICONS.slice(0, 100) : ALL_PRIME_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Prime Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <PrimeIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { PrimeIconPage, type PrimeIconPageProps };
