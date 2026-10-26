import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { CodexIconName } from "./codex.types.ts";

const prefix = "codex" as const;

type SSRCodexIconProps = Omit<SSRIconProps, "name"> & {
  name: CodexIconName;
};

const CodexIcon = ({ name, ...props }: SSRCodexIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { CodexIcon, type SSRCodexIconProps };
