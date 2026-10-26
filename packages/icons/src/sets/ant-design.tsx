import { Icon, type IconProps } from "../icon";
import type { AntDesignIconName } from "./ant-design.types.ts";

const prefix = "ant-design" as const;

type AntDesignIconProps = Omit<IconProps, "name"> & {
  name: AntDesignIconName;
};

const AntDesignIcon = ({ name, ...props }: AntDesignIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { AntDesignIcon, type AntDesignIconProps };
