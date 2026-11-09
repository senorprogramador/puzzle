import type { InputGroupAddonAlign } from "./input-group.types";

const resolveInputGroupAddonAlign = (
  align?: InputGroupAddonAlign,
): InputGroupAddonAlign => align ?? "start";

export { resolveInputGroupAddonAlign };
