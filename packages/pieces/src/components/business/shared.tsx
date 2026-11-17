import { BusinessImageView } from "@puzzle-ui/ui";
import type { EditorialImage } from "../content/shared";

import "./shared.css";

export const BusinessFigure = ({
  image,
  className,
}: {
  image: EditorialImage;
  className?: string;
}) => (
  <figure className={`puzzle-business-figure ${className ?? ""}`.trim()}>
    <BusinessImageView image={image} />
    {image.caption ? (
      <figcaption className="puzzle-business-figure__caption">
        {image.caption}
      </figcaption>
    ) : null}
  </figure>
);
