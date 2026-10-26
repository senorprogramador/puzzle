import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { StreamlineEmojisIconName } from "./streamline-emojis.types.ts";

const prefix = "streamline-emojis" as const;

type SSRStreamlineEmojisIconProps = Omit<SSRIconProps, "name"> & {
  name: StreamlineEmojisIconName;
};

const StreamlineEmojisIcon = ({ name, ...props }: SSRStreamlineEmojisIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { StreamlineEmojisIcon, type SSRStreamlineEmojisIconProps };
