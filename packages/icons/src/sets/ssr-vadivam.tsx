import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { VadivamIconName } from "./vadivam.types.ts";

const prefix = "vadivam" as const;

type SSRVadivamIconProps = Omit<SSRIconProps, "name"> & {
  name: VadivamIconName;
};

const VadivamIcon = ({ name, ...props }: SSRVadivamIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { VadivamIcon, type SSRVadivamIconProps };
