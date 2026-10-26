import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { AntDesignIconName } from "./ant-design.types.ts";

const prefix = "ant-design" as const;

type SSRAntDesignIconProps = Omit<SSRIconProps, "name"> & {
  name: AntDesignIconName;
};

const AntDesignIcon = ({ name, ...props }: SSRAntDesignIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { AntDesignIcon, type SSRAntDesignIconProps };
