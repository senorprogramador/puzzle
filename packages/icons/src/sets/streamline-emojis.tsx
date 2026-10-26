import { Icon, type IconProps } from "../icon";
import type { StreamlineEmojisIconName } from "./streamline-emojis.types.ts";

const prefix = "streamline-emojis" as const;

type StreamlineEmojisIconProps = Omit<IconProps, "name"> & {
  name: StreamlineEmojisIconName;
};

const StreamlineEmojisIcon = ({ name, ...props }: StreamlineEmojisIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { StreamlineEmojisIcon, type StreamlineEmojisIconProps };
