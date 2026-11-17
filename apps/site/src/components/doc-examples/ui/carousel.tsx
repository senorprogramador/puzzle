import { useState } from "react";
import { Button, Carousel, CarouselController, Image, Stack } from "@puzzle-ui/ui";
import { Icon } from "@puzzle-ui/icons/icon";
import { imageBoxPhotos } from "../shared/image-box-images";

export const carouselItems = [
  { id: "living-room", ...imageBoxPhotos[0]! },
  { id: "garden-room", ...imageBoxPhotos[1]! },
  { id: "bedroom", ...imageBoxPhotos[2]! },
  { id: "kitchen", ...imageBoxPhotos[3]! },
];

export const ControlledCarouselExample = () => {
  const [panel, setPanel] = useState(0);

  return (
    <Stack>
      <Button variant="outline" onClick={() => setPanel(0)}>
        Back to first item
      </Button>
      <CarouselController
        items={carouselItems}
        currentPanel={panel}
        onPanelChange={setPanel}
      >
        <Carousel<(typeof carouselItems)[number]>
          getItemKey={(item) => item.id}
          renderItem={(item) => (
            <Image
              src={item.src}
              alt={item.alt}
              fill
              containerStyle={{ height: 300 }}
              loading="lazy"
            />
          )}
          backButton={
            <Button variant="primary" aria-label="Previous slide">
              <Icon name="bx:caret-left" aria-hidden="true" />
            </Button>
          }
          nextButton={
            <Button variant="primary" aria-label="Next slide">
              <Icon name="bx:caret-right" aria-hidden="true" />
            </Button>
          }
          buttonAlignment="aside"
          renderPager={(current, total) => (
            <span role="status">
              Page {current + 1} of {total}
            </span>
          )}
        />
      </CarouselController>
    </Stack>
  );
};
