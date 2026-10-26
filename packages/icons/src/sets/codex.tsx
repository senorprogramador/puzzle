import { Icon, type IconProps } from "../icon";
import type { CodexIconName } from "./codex.types.ts";

const prefix = "codex" as const;

type CodexIconProps = Omit<IconProps, "name"> & {
  name: CodexIconName;
};

const CodexIcon = ({ name, ...props }: CodexIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { CodexIcon, type CodexIconProps };
