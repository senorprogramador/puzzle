import type { ComponentProps } from "react";
type SSRIconProps = Omit<ComponentProps<"svg">, "mode" | "onLoad" | "rotate"> & {
    name: string;
    size?: number;
    color?: string;
};
declare const SSRIcon: ({ name, size, color, ...props }: SSRIconProps) => Promise<import("react").JSX.Element>;
export { SSRIcon, type SSRIconProps };
