import { Icon, type IconProps } from "../icon";
import type { MarketeqIconName } from "./marketeq.types.ts";

const prefix = "marketeq" as const;

type MarketeqIconProps = Omit<IconProps, "name"> & {
  name: MarketeqIconName;
};

const MarketeqIcon = ({ name, ...props }: MarketeqIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { MarketeqIcon, type MarketeqIconProps };
