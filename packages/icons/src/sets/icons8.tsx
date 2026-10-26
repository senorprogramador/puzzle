import { Icon, type IconProps } from "../icon";
import type { Icons8IconName } from "./icons8.types.ts";

const prefix = "icons8" as const;

type Icons8IconProps = Omit<IconProps, "name"> & {
  name: Icons8IconName;
};

const Icons8Icon = ({ name, ...props }: Icons8IconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { Icons8Icon, type Icons8IconProps };
