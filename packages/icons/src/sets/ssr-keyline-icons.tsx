import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { KeylineIconsIconName } from "./keyline-icons.types.ts";

const prefix = "keyline-icons" as const;

type SSRKeylineIconsIconProps = Omit<SSRIconProps, "name"> & {
  name: KeylineIconsIconName;
};

const KeylineIconsIcon = ({ name, ...props }: SSRKeylineIconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { KeylineIconsIcon, type SSRKeylineIconsIconProps };
