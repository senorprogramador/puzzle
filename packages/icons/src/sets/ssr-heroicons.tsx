import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { HeroiconsIconName } from "./heroicons.types.ts";

const prefix = "heroicons" as const;

type SSRHeroiconsIconProps = Omit<SSRIconProps, "name"> & {
  name: HeroiconsIconName;
};

const HeroiconsIcon = ({ name, ...props }: SSRHeroiconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { HeroiconsIcon, type SSRHeroiconsIconProps };
