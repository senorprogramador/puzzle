import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { MatitaIconName } from "./matita.types.ts";

const prefix = "matita" as const;

type SSRMatitaIconProps = Omit<SSRIconProps, "name"> & {
  name: MatitaIconName;
};

const MatitaIcon = ({ name, ...props }: SSRMatitaIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { MatitaIcon, type SSRMatitaIconProps };
