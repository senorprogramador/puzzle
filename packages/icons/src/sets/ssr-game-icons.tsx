import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { GameIconsIconName } from "./game-icons.types.ts";

const prefix = "game-icons" as const;

type SSRGameIconsIconProps = Omit<SSRIconProps, "name"> & {
  name: GameIconsIconName;
};

const GameIconsIcon = ({ name, ...props }: SSRGameIconsIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { GameIconsIcon, type SSRGameIconsIconProps };
