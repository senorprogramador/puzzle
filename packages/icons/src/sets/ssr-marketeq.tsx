import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { MarketeqIconName } from "./marketeq.types.ts";

const prefix = "marketeq" as const;

type SSRMarketeqIconProps = Omit<SSRIconProps, "name"> & {
  name: MarketeqIconName;
};

const MarketeqIcon = ({ name, ...props }: SSRMarketeqIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { MarketeqIcon, type SSRMarketeqIconProps };
