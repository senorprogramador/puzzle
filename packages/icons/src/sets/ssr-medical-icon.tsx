import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { MedicalIconIconName } from "./medical-icon.types.ts";

const prefix = "medical-icon" as const;

type SSRMedicalIconIconProps = Omit<SSRIconProps, "name"> & {
  name: MedicalIconIconName;
};

const MedicalIconIcon = ({ name, ...props }: SSRMedicalIconIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { MedicalIconIcon, type SSRMedicalIconIconProps };
