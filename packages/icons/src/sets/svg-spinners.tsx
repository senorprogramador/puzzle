import { Icon, type IconProps } from "../icon";
import type { SvgSpinnersIconName } from "./svg-spinners.types.ts";

const prefix = "svg-spinners" as const;

type SvgSpinnersIconProps = Omit<IconProps, "name"> & {
  name: SvgSpinnersIconName;
};

const SvgSpinnersIcon = ({ name, ...props }: SvgSpinnersIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { SvgSpinnersIcon, type SvgSpinnersIconProps };
