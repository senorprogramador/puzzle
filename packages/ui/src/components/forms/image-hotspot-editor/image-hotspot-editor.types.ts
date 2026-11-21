import type { ComponentPropsWithRef } from "react";

import type {
  ImageHotspotData,
  NormalizedImagePoint,
  NormalizedImageRect,
} from "../image-editor.types";

type ImageHotspot = NormalizedImageRect & {
  /** Stable caller-owned identifier. */
  id: string;

  /** Optional user-facing name. */
  label?: string;

  /** Optional JSON-safe application metadata, passed through unchanged. */
  data?: ImageHotspotData;
};

type ImageHotspotEditorValue = {
  /** One important point normalized to the visible source image. */
  focalPoint?: NormalizedImagePoint | null;

  /** Hotspots normalized to the visible source image. */
  hotspots: ImageHotspot[];
};

type ImageHotspotEditorProps = Omit<
  ComponentPropsWithRef<"div">,
  "children" | "onChange" | "value" | "defaultValue" | "src"
> & {
  /** Image URL to annotate. The editor does not fetch or persist it. */
  src: string;

  /** Alternative text for the image. */
  alt: string;

  /** Accessible name for the editor group. */
  label?: string;

  /** Controlled focal point and hotspot data. */
  value?: ImageHotspotEditorValue;

  /** Initial focal point and hotspot data for uncontrolled usage. */
  defaultValue?: ImageHotspotEditorValue;

  /** Called with normalized serializable values whenever an edit is made. */
  onChange?: (value: ImageHotspotEditorValue) => void;

  /** Whether the editor is disabled. */
  disabled?: boolean;

  /** Class applied to the outer editor element. */
  className?: string;
};

export type {
  ImageHotspot,
  ImageHotspotEditorProps,
  ImageHotspotEditorValue,
};
