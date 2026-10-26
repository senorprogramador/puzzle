import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { FluentColorIconName } from "./fluent-color.types.ts";

const prefix = "fluent-color" as const;

type SSRFluentColorIconProps = Omit<SSRIconProps, "name"> & {
  name: FluentColorIconName;
};

const FluentColorIcon = ({ name, ...props }: SSRFluentColorIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { FluentColorIcon, type SSRFluentColorIconProps };
