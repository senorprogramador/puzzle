import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { CodiconIconName } from "./codicon.types.ts";

const prefix = "codicon" as const;

type SSRCodiconIconProps = Omit<SSRIconProps, "name"> & {
  name: CodiconIconName;
};

const CodiconIcon = ({ name, ...props }: SSRCodiconIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { CodiconIcon, type SSRCodiconIconProps };
