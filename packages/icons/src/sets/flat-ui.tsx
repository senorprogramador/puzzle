import { Icon, type IconProps } from "../icon";
import type { FlatUiIconName } from "./flat-ui.types.ts";

const prefix = "flat-ui" as const;

type FlatUiIconProps = Omit<IconProps, "name"> & {
  name: FlatUiIconName;
};

const FlatUiIcon = ({ name, ...props }: FlatUiIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { FlatUiIcon, type FlatUiIconProps };
