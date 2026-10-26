import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { TablerIconName } from "./tabler.types.ts";

const prefix = "tabler" as const;

type SSRTablerIconProps = Omit<SSRIconProps, "name"> & {
  name: TablerIconName;
};

const TablerIcon = ({ name, ...props }: SSRTablerIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { TablerIcon, type SSRTablerIconProps };
