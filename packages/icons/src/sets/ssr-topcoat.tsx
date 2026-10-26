import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { TopcoatIconName } from "./topcoat.types.ts";

const prefix = "topcoat" as const;

type SSRTopcoatIconProps = Omit<SSRIconProps, "name"> & {
  name: TopcoatIconName;
};

const TopcoatIcon = ({ name, ...props }: SSRTopcoatIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { TopcoatIcon, type SSRTopcoatIconProps };
