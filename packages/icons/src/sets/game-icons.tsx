import { Icon, type IconProps } from "../icon";
import type { GameIconsIconName } from "./game-icons.types.ts";

const prefix = "game-icons" as const;

type GameIconsIconProps = Omit<IconProps, "name"> & {
  name: GameIconsIconName;
};

const GameIconsIcon = ({ name, ...props }: GameIconsIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { GameIconsIcon, type GameIconsIconProps };
