import { Icon, type IconProps } from "../icon";
import type { IonIconName } from "./ion.types.ts";

const prefix = "ion" as const;

type IonIconProps = Omit<IconProps, "name"> & {
  name: IonIconName;
};

const IonIcon = ({ name, ...props }: IonIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { IonIcon, type IonIconProps };
