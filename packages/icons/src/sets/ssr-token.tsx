import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { TokenIconName } from "./token.types.ts";

const prefix = "token" as const;

type SSRTokenIconProps = Omit<SSRIconProps, "name"> & {
  name: TokenIconName;
};

const TokenIcon = ({ name, ...props }: SSRTokenIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { TokenIcon, type SSRTokenIconProps };
