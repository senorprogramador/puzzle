import { useState } from "react";
import {
  ImageCropper,
  ImageHotspotEditor,
  type ImageCrop,
  type ImageHotspotEditorValue,
} from "@puzzle-ui/ui";

import { imageBoxPhotos } from "../shared/image-box-images";

const exampleImage = imageBoxPhotos[0]!;

export const ImageCropperExample = () => {
  const [crop, setCrop] = useState<ImageCrop>({
    x: 0.1,
    y: 0.1,
    width: 0.8,
    height: 0.8,
  });

  return (
    <div className="puzzle-image-editor-example">
      <ImageCropper
        src={exampleImage.src}
        alt={exampleImage.alt}
        label="Crop the room photo"
        value={crop}
        onChange={setCrop}
      />
      <pre aria-live="polite">
        <code>{JSON.stringify(crop, null, 2)}</code>
      </pre>
    </div>
  );
};

export const ImageHotspotEditorExample = () => {
  const [value, setValue] = useState<ImageHotspotEditorValue>({
    focalPoint: { x: 0.52, y: 0.46 },
    hotspots: [
      {
        id: "reading-chair",
        x: 0.58,
        y: 0.54,
        width: 0.2,
        height: 0.24,
        label: "Reading chair",
        data: { href: "/furniture/chair", kind: "product" },
      },
    ],
  });

  return (
    <div className="puzzle-image-editor-example">
      <ImageHotspotEditor
        src={exampleImage.src}
        alt={exampleImage.alt}
        label="Annotate the room photo"
        value={value}
        onChange={setValue}
      />
      <pre aria-live="polite">
        <code>{JSON.stringify(value, null, 2)}</code>
      </pre>
    </div>
  );
};
