import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { FadIconName } from "./fad.types.ts";

const prefix = "fad" as const;

type SSRFadIconProps = Omit<SSRIconProps, "name"> & {
  name: FadIconName;
};

const FadIcon = ({ name, ...props }: SSRFadIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { FadIcon, type SSRFadIconProps };
