import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { FluentMdl2IconName } from "./fluent-mdl2.types.ts";

const prefix = "fluent-mdl2" as const;

type SSRFluentMdl2IconProps = Omit<SSRIconProps, "name"> & {
  name: FluentMdl2IconName;
};

const FluentMdl2Icon = ({ name, ...props }: SSRFluentMdl2IconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { FluentMdl2Icon, type SSRFluentMdl2IconProps };
