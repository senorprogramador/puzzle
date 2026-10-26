import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { RaphaelIconName } from "./raphael.types.ts";

const prefix = "raphael" as const;

type SSRRaphaelIconProps = Omit<SSRIconProps, "name"> & {
  name: RaphaelIconName;
};

const RaphaelIcon = ({ name, ...props }: SSRRaphaelIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { RaphaelIcon, type SSRRaphaelIconProps };
