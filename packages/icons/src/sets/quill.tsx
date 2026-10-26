import { Icon, type IconProps } from "../icon";
import type { QuillIconName } from "./quill.types.ts";

const prefix = "quill" as const;

type QuillIconProps = Omit<IconProps, "name"> & {
  name: QuillIconName;
};

const QuillIcon = ({ name, ...props }: QuillIconProps) => {
  return (
    <Icon {...props} name={`${prefix}:${name}`} />
  );
};

export { QuillIcon, type QuillIconProps };
