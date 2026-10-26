import { Icon as IconifyIcon } from "@iconify/react";
import type { ComponentProps } from "react";
import { getIconData, stringToIcon } from "@iconify/utils";

async function fetchIconDataServer(iconName: string) {
  const iconObj = stringToIcon(iconName);
  if (!iconObj) return null;

  try {
    const response = await fetch(
      `https://iconify.design/${iconObj.prefix}.json?icons=${iconObj.name}`,
    );
    if (!response.ok) return null;

    const json = await response.json();
    return getIconData(json, iconObj.name);
  } catch (error) {
    console.error(`[SSR] Error fetching icon ${iconName}:`, error);
    return null;
  }
}

type SSRIconProps = Omit<
  ComponentProps<"svg">,
  "mode" | "onLoad" | "rotate"
> & {
  name: string;
  size?: number;
  color?: string;
};

const SSRIcon = async ({ name, size, color, ...props }: SSRIconProps) => {
  const iconData = await fetchIconDataServer(name);
  if (iconData) {
    return (
      <IconifyIcon
        {...props}
        icon={iconData}
        width={size}
        height={size}
        style={{
          color: color,
          width: size ? `${size}px` : undefined,
          height: size ? `${size}px` : undefined,
        }}
      />
    );
  }
  console.warn(`[SSR] Fallback to client-side for icon: ${name}`);
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

export { SSRIcon, type SSRIconProps };
