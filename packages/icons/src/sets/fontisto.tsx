import { Icon, type IconProps } from "../icon";
import type { FontistoIconName } from "./fontisto.types.ts";

const prefix = "fontisto" as const;

type FontistoIconProps = Omit<IconProps, "name"> & {
  name: FontistoIconName;
};

const FontistoIcon = ({ name, ...props }: FontistoIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { FontistoIcon, type FontistoIconProps };
