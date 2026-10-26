import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { ClarityIconName } from "./clarity.types.ts";

const prefix = "clarity" as const;

type SSRClarityIconProps = Omit<SSRIconProps, "name"> & {
  name: ClarityIconName;
};

const ClarityIcon = ({ name, ...props }: SSRClarityIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { ClarityIcon, type SSRClarityIconProps };
