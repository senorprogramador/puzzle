import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { VaadinIconName } from "./vaadin.types.ts";

const prefix = "vaadin" as const;

type SSRVaadinIconProps = Omit<SSRIconProps, "name"> & {
  name: VaadinIconName;
};

const VaadinIcon = ({ name, ...props }: SSRVaadinIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { VaadinIcon, type SSRVaadinIconProps };
