import { Icon, type IconProps } from "../icon";
import type { FluentMdl2IconName } from "./fluent-mdl2.types.ts";

const prefix = "fluent-mdl2" as const;

type FluentMdl2IconProps = Omit<IconProps, "name"> & {
  name: FluentMdl2IconName;
};

const FluentMdl2Icon = ({ name, ...props }: FluentMdl2IconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { FluentMdl2Icon, type FluentMdl2IconProps };
