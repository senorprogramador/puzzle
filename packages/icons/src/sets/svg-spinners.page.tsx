import { ALL_SVG_SPINNERS_ICONS } from "./svg-spinners.constants";
import { SvgSpinnersIcon } from "./svg-spinners";
type SvgSpinnersIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "svg-spinners" as const;

const SvgSpinnersIconPage = ({ filter = "", size = 42, color = "#302f41" }: SvgSpinnersIconPageProps) => {
  const icons = filter === "" ? ALL_SVG_SPINNERS_ICONS.slice(0, 100) : ALL_SVG_SPINNERS_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Svg spinners Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <SvgSpinnersIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { SvgSpinnersIconPage, type SvgSpinnersIconPageProps };
