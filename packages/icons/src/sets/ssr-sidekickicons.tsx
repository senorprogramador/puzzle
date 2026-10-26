import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { SidekickiconsIconName } from "./sidekickicons.types.ts";

const prefix = "sidekickicons" as const;

type SSRSidekickiconsIconProps = Omit<SSRIconProps, "name"> & {
  name: SidekickiconsIconName;
};

const SidekickiconsIcon = ({ name, ...props }: SSRSidekickiconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { SidekickiconsIcon, type SSRSidekickiconsIconProps };
