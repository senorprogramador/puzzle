import { Icon, type IconProps } from "../icon";
import type { MatitaIconName } from "./matita.types.ts";

const prefix = "matita" as const;

type MatitaIconProps = Omit<IconProps, "name"> & {
  name: MatitaIconName;
};

const MatitaIcon = ({ name, ...props }: MatitaIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { MatitaIcon, type MatitaIconProps };
