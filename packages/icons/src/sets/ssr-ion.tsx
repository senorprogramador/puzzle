import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { IonIconName } from "./ion.types.ts";

const prefix = "ion" as const;

type SSRIonIconProps = Omit<SSRIconProps, "name"> & {
  name: IonIconName;
};

const IonIcon = ({ name, ...props }: SSRIonIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { IonIcon, type SSRIonIconProps };
