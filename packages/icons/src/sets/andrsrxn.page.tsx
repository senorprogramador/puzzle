import { ALL_ANDRSRXN_ICONS } from "./andrsrxn.constants";
import { AndrsrxnIcon } from "./andrsrxn";
type AndrsrxnIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "andrsrxn" as const;

const AndrsrxnIconPage = ({ filter = "", size = 42, color = "#302f41" }: AndrsrxnIconPageProps) => {
  const icons = filter === "" ? ALL_ANDRSRXN_ICONS.slice(0, 100) : ALL_ANDRSRXN_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Andrsrxn Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <AndrsrxnIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { AndrsrxnIconPage, type AndrsrxnIconPageProps };
