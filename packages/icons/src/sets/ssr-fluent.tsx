import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { FluentIconName } from "./fluent.types.ts";

const prefix = "fluent" as const;

type SSRFluentIconProps = Omit<SSRIconProps, "name"> & {
  name: FluentIconName;
};

const FluentIcon = ({ name, ...props }: SSRFluentIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { FluentIcon, type SSRFluentIconProps };
