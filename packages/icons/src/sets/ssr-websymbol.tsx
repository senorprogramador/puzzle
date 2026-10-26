import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { WebsymbolIconName } from "./websymbol.types.ts";

const prefix = "websymbol" as const;

type SSRWebsymbolIconProps = Omit<SSRIconProps, "name"> & {
  name: WebsymbolIconName;
};

const WebsymbolIcon = ({ name, ...props }: SSRWebsymbolIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { WebsymbolIcon, type SSRWebsymbolIconProps };
