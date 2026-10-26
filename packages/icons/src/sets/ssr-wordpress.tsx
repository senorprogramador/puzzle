import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { WordpressIconName } from "./wordpress.types.ts";

const prefix = "wordpress" as const;

type SSRWordpressIconProps = Omit<SSRIconProps, "name"> & {
  name: WordpressIconName;
};

const WordpressIcon = ({ name, ...props }: SSRWordpressIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { WordpressIcon, type SSRWordpressIconProps };
