import {
  Children,
  Fragment,
  isValidElement,
  type ReactNode,
} from "react";

const hasRenderableContent = (content: ReactNode): boolean =>
  Children.toArray(content).some((child) =>
    isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment
      ? hasRenderableContent(child.props.children)
      : true,
  );

export { hasRenderableContent };
