import type { ComponentProps } from "react";
type IconProps = Omit<ComponentProps<"svg">, "mode" | "onLoad" | "rotate"> & {
    name: string;
    size?: number;
    color?: string;
};
declare const Icon: ({ name, size, color, ...props }: IconProps) => import("react").JSX.Element;
export { Icon, type IconProps };
