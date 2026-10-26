import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { FontistoIconName } from "./fontisto.types.ts";

const prefix = "fontisto" as const;

type SSRFontistoIconProps = Omit<SSRIconProps, "name"> & {
  name: FontistoIconName;
};

const FontistoIcon = ({ name, ...props }: SSRFontistoIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { FontistoIcon, type SSRFontistoIconProps };
