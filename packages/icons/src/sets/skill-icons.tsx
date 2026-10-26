import { Icon, type IconProps } from "../icon";
import type { SkillIconsIconName } from "./skill-icons.types.ts";

const prefix = "skill-icons" as const;

type SkillIconsIconProps = Omit<IconProps, "name"> & {
  name: SkillIconsIconName;
};

const SkillIconsIcon = ({ name, ...props }: SkillIconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { SkillIconsIcon, type SkillIconsIconProps };
