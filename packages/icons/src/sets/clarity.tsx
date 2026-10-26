import { Icon, type IconProps } from "../icon";
import type { ClarityIconName } from "./clarity.types.ts";

const prefix = "clarity" as const;

type ClarityIconProps = Omit<IconProps, "name"> & {
  name: ClarityIconName;
};

const ClarityIcon = ({ name, ...props }: ClarityIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { ClarityIcon, type ClarityIconProps };
