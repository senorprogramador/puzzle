import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { DeviconPlainIconName } from "./devicon-plain.types.ts";

const prefix = "devicon-plain" as const;

type SSRDeviconPlainIconProps = Omit<SSRIconProps, "name"> & {
  name: DeviconPlainIconName;
};

const DeviconPlainIcon = ({ name, ...props }: SSRDeviconPlainIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { DeviconPlainIcon, type SSRDeviconPlainIconProps };
