import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { QlementineIconsIconName } from "./qlementine-icons.types.ts";

const prefix = "qlementine-icons" as const;

type SSRQlementineIconsIconProps = Omit<SSRIconProps, "name"> & {
  name: QlementineIconsIconName;
};

const QlementineIconsIcon = ({ name, ...props }: SSRQlementineIconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { QlementineIconsIcon, type SSRQlementineIconsIconProps };
