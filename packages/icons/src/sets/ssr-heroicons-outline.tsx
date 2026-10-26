import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { HeroiconsOutlineIconName } from "./heroicons-outline.types.ts";

const prefix = "heroicons-outline" as const;

type SSRHeroiconsOutlineIconProps = Omit<SSRIconProps, "name"> & {
  name: HeroiconsOutlineIconName;
};

const HeroiconsOutlineIcon = ({ name, ...props }: SSRHeroiconsOutlineIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { HeroiconsOutlineIcon, type SSRHeroiconsOutlineIconProps };
