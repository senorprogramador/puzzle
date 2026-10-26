import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { SvgSpinnersIconName } from "./svg-spinners.types.ts";

const prefix = "svg-spinners" as const;

type SSRSvgSpinnersIconProps = Omit<SSRIconProps, "name"> & {
  name: SvgSpinnersIconName;
};

const SvgSpinnersIcon = ({ name, ...props }: SSRSvgSpinnersIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { SvgSpinnersIcon, type SSRSvgSpinnersIconProps };
