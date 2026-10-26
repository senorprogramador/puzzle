import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { CharmIconName } from "./charm.types.ts";

const prefix = "charm" as const;

type SSRCharmIconProps = Omit<SSRIconProps, "name"> & {
  name: CharmIconName;
};

const CharmIcon = ({ name, ...props }: SSRCharmIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { CharmIcon, type SSRCharmIconProps };
