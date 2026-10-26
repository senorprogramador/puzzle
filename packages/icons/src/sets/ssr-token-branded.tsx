import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { TokenBrandedIconName } from "./token-branded.types.ts";

const prefix = "token-branded" as const;

type SSRTokenBrandedIconProps = Omit<SSRIconProps, "name"> & {
  name: TokenBrandedIconName;
};

const TokenBrandedIcon = ({ name, ...props }: SSRTokenBrandedIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { TokenBrandedIcon, type SSRTokenBrandedIconProps };
