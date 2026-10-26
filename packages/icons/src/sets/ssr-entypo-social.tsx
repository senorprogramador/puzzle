import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { EntypoSocialIconName } from "./entypo-social.types.ts";

const prefix = "entypo-social" as const;

type SSREntypoSocialIconProps = Omit<SSRIconProps, "name"> & {
  name: EntypoSocialIconName;
};

const EntypoSocialIcon = ({ name, ...props }: SSREntypoSocialIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { EntypoSocialIcon, type SSREntypoSocialIconProps };
