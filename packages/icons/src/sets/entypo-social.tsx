import { Icon, type IconProps } from "../icon";
import type { EntypoSocialIconName } from "./entypo-social.types.ts";

const prefix = "entypo-social" as const;

type EntypoSocialIconProps = Omit<IconProps, "name"> & {
  name: EntypoSocialIconName;
};

const EntypoSocialIcon = ({ name, ...props }: EntypoSocialIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { EntypoSocialIcon, type EntypoSocialIconProps };
