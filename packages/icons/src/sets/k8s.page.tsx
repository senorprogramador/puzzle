import { ALL_K8S_ICONS } from "./k8s.constants";
import { K8sIcon } from "./k8s";
type K8sIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "k8s" as const;

const K8sIconPage = ({ filter = "", size = 42, color = "#302f41" }: K8sIconPageProps) => {
  const icons = filter === "" ? ALL_K8S_ICONS.slice(0, 100) : ALL_K8S_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>K8s Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <K8sIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { K8sIconPage, type K8sIconPageProps };
