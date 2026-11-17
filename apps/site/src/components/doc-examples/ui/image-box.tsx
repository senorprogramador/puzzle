import { useState } from "react";
import { ImageBox } from "@puzzle-ui/ui";
import { imageBoxPhotos } from "../shared/image-box-images";

type ImageBoxGalleryExampleProps = {
  count?: number;
  offset?: number;
  aspectRatio?: number;
  gap?: number | string;
  radius?: number | string;
};

export const ImageBoxGalleryExample = ({
  count = 5,
  offset = 0,
  aspectRatio,
  gap,
  radius,
}: ImageBoxGalleryExampleProps) => {
  const images = Array.from(
    { length: count },
    (_, index) => imageBoxPhotos[(index + offset) % imageBoxPhotos.length]!,
  );

  return (
    <ImageBox
      images={images}
      aspectRatio={aspectRatio}
      gap={gap}
      radius={radius}
    />
  );
};

export const ImageBoxInteractionExample = () => {
  const [status, setStatus] = useState(
    "Choose a photo or view the full gallery.",
  );

  return (
    <div style={{ width: "100%" }}>
      <ImageBox
        images={imageBoxPhotos}
        onImageClick={(image, index) =>
          setStatus(`Selected ${image.alt} (photo ${index + 1}).`)
        }
        onViewAll={() =>
          setStatus(`Opening all ${imageBoxPhotos.length} photos.`)
        }
      />
      <p
        role="status"
        style={{ marginBlockStart: "var(--puzzle-space-3, 0.75rem)" }}
      >
        {status}
      </p>
    </div>
  );
};
