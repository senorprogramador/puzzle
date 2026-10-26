import { Icon, type IconProps } from "../icon";
import type { BytesizeIconName } from "./bytesize.types.ts";

const prefix = "bytesize" as const;

type BytesizeIconProps = Omit<IconProps, "name"> & {
  name: BytesizeIconName;
};

const BytesizeIcon = ({ name, ...props }: BytesizeIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { BytesizeIcon, type BytesizeIconProps };
