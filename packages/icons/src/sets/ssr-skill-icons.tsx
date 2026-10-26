import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { SkillIconsIconName } from "./skill-icons.types.ts";

const prefix = "skill-icons" as const;

type SSRSkillIconsIconProps = Omit<SSRIconProps, "name"> & {
  name: SkillIconsIconName;
};

const SkillIconsIcon = ({ name, ...props }: SSRSkillIconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { SkillIconsIcon, type SSRSkillIconsIconProps };
