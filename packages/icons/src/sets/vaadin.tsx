import { Icon, type IconProps } from "../icon";
import type { VaadinIconName } from "./vaadin.types.ts";

const prefix = "vaadin" as const;

type VaadinIconProps = Omit<IconProps, "name"> & {
  name: VaadinIconName;
};

const VaadinIcon = ({ name, ...props }: VaadinIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { VaadinIcon, type VaadinIconProps };
