import { cn } from "@puzzle/core";
import { type ComponentPropsWithRef } from "react";
import "./portal-target.css";

type PortalTargetOwnProps = {
  id: string;
};
type PortalTargetProps = PortalTargetOwnProps &
  Omit<ComponentPropsWithRef<"div">, keyof PortalTargetOwnProps>;

const PortalTarget = ({
  id,
  className,
  children,
  ...props
}: PortalTargetProps) => {
  const classes = cn("puzzle-portal-target", className);
  return (
    <div id={id} className={classes} {...props}>
      {children}
    </div>
  );
};

export { PortalTarget, type PortalTargetProps };
