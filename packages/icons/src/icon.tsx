import { Icon as IconifyIcon } from "@iconify/react";
import type { ComponentProps } from "react";

type IconProps = Omit<ComponentProps<"svg">, "mode" | "onLoad" | "rotate"> & {
  name: string;
  size?: number;
  color?: string;
};

const Icon = ({ name, size, color, ...props }: IconProps) => {
  return (
    <IconifyIcon
      {...props}
      icon={name ?? ""}
      width={size}
      height={size}
      style={{
        color: color,
        width: size ? `${size}px` : undefined,
        height: size ? `${size}px` : undefined,
      }}
    />
  );
};

export { Icon, type IconProps };
