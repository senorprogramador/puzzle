import { ALL_FORMKIT_ICONS } from "./formkit.constants";
import { FormkitIcon } from "./formkit";
type FormkitIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "formkit" as const;

const FormkitIconPage = ({ filter = "", size = 42, color = "#302f41" }: FormkitIconPageProps) => {
  const icons = filter === "" ? ALL_FORMKIT_ICONS.slice(0, 100) : ALL_FORMKIT_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Formkit Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <FormkitIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { FormkitIconPage, type FormkitIconPageProps };
