import { SSRIcon, type SSRIconProps } from "../ssr-icon";
import type { QuillIconName } from "./quill.types.ts";

const prefix = "quill" as const;

type SSRQuillIconProps = Omit<SSRIconProps, "name"> & {
  name: QuillIconName;
};

const QuillIcon = ({ name, ...props }: SSRQuillIconProps) => {
  return (
    <SSRIcon {...props} name={`${prefix}:${name}`} />
  );
};

export { QuillIcon, type SSRQuillIconProps };
