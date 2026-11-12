import { Icon as IconifyIcon } from "@iconify/react";
import type { ComponentProps, CSSProperties } from "react";

type IconProps = Omit<ComponentProps<"svg">, "mode" | "onLoad" | "rotate"> & {
  name: string;
  size?: number;
  color?: string;
  showLoader?: boolean;
};

const Icon = ({
  name,
  size,
  color,
  showLoader = false,
  style,
  children,
  ...props
}: IconProps) => {
  const iconStyle: CSSProperties = {
    display: "inline-block",
    flexShrink: 0,
    verticalAlign: "middle",
    ...style,
    color: color ?? style?.color,
    width: size !== undefined ? size : (style?.width ?? props.width),
    height: size !== undefined ? size : (style?.height ?? props.height),
  };

  return (
    <IconifyIcon
      {...props}
      icon={name ?? ""}
      width={size ?? props.width ?? "1em"}
      height={size ?? props.height ?? "1em"}
      style={iconStyle}
    >
      <svg
        {...props}
        width={size ?? props.width ?? "1em"}
        height={size ?? props.height ?? "1em"}
        style={iconStyle}
        viewBox="0 0 100 100"
      >
        {showLoader ? (
          <>
            <style>{`
              @keyframes puzzle-icon-loading { from { opacity: 1; } to { opacity: 0.2; } }
              .puzzle-icon-loading-bar { animation: puzzle-icon-loading 1.2s linear infinite; }
              @media (prefers-reduced-motion: reduce) { .puzzle-icon-loading-bar { animation: none; } }
            `}</style>
            {Array.from({ length: 12 }, (_, index) => (
              <rect
                key={index}
                className="puzzle-icon-loading-bar"
                x="47"
                y="4"
                width="6"
                height="24"
                rx="3"
                fill={iconStyle.color ?? "currentColor"}
                transform={`rotate(${index * 30} 50 50)`}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  opacity: (index + 1) / 12,
                }}
              />
            ))}
          </>
        ) : (
          children
        )}
      </svg>
    </IconifyIcon>
  );
};

export { Icon, type IconProps };
