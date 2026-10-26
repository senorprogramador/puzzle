import { ALL_ENTYPO_SOCIAL_ICONS } from "./entypo-social.constants";
import { EntypoSocialIcon } from "./entypo-social";
type EntypoSocialIconPageProps = {
  filter?: string;
  size?: number;
  color?: string;
};

const prefix = "entypo-social" as const;

const EntypoSocialIconPage = ({ filter = "", size = 42, color = "#302f41" }: EntypoSocialIconPageProps) => {
  const icons = filter === "" ? ALL_ENTYPO_SOCIAL_ICONS.slice(0, 100) : ALL_ENTYPO_SOCIAL_ICONS.filter(
    (icon) => icon.toLowerCase().includes(filter.toLowerCase())
  ).slice(0, 100);
  if (icons.length === 0) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <h2>Entypo social Icons</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(${size}px, 1fr))`, gap: "16px" }}>
        {icons.map((icon) => (
          <EntypoSocialIcon key={icon} name={icon} size={size} color={color} />
        ))}
      </div>
    </div>
  );
};

export { EntypoSocialIconPage, type EntypoSocialIconPageProps };
