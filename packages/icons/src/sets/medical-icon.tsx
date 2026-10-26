import { Icon, type IconProps } from "../icon";
import type { MedicalIconIconName } from "./medical-icon.types.ts";

const prefix = "medical-icon" as const;

type MedicalIconIconProps = Omit<IconProps, "name"> & {
  name: MedicalIconIconName;
};

const MedicalIconIcon = ({ name, ...props }: MedicalIconIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { MedicalIconIcon, type MedicalIconIconProps };
