import { Icon, type IconProps } from "../icon";
import type { FormkitIconName } from "./formkit.types.ts";

const prefix = "formkit" as const;

type FormkitIconProps = Omit<IconProps, "name"> & {
  name: FormkitIconName;
};

const FormkitIcon = ({ name, ...props }: FormkitIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { FormkitIcon, type FormkitIconProps };
