import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { FluentEmojiFlatIconName } from "./fluent-emoji-flat.types.ts";

const prefix = "fluent-emoji-flat" as const;

type SSRFluentEmojiFlatIconProps = Omit<SSRIconProps, "name"> & {
  name: FluentEmojiFlatIconName;
};

const FluentEmojiFlatIcon = ({ name, ...props }: SSRFluentEmojiFlatIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { FluentEmojiFlatIcon, type SSRFluentEmojiFlatIconProps };
