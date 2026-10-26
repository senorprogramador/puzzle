import { ALL_BPMN_ICONS } from "./bpmn.constants";
import { BpmnIcon } from "./bpmn";
type BpmnIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "bpmn" as const;

const BpmnIconPage = ({ filter = "", size = 42, color = "#302f41" }: BpmnIconPageProps) => {
  const icons = filter === "" ? ALL_BPMN_ICONS.slice(0, 100) : ALL_BPMN_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Bpmn Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <BpmnIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { BpmnIconPage, type BpmnIconPageProps };
