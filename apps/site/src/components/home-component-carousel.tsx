import {
  Button,
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  Carousel,
  CarouselController,
  Stack,
} from "@puzzle-ui/ui";
import { Icon } from "@puzzle-ui/icons/icon";
import type { componentPanels } from "./component-catalog";

type HomeComponentCarouselProps = {
  panels: typeof componentPanels;
};

export const HomeComponentCarousel = ({ panels }: HomeComponentCarouselProps) => (
  <CarouselController items={panels}>
    <Carousel<(typeof componentPanels)[number]>
      className="home-component-carousel"
      ariaLabel="UI components"
      panelsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
      gap="1rem"
      getItemKey={(panel) => panel[0]!.href}
      backButton={
        <Button variant="outline" size="sm" aria-label="Previous component panels">
          <Icon name="akar-icons:chevron-left" aria-hidden="true" />
        </Button>
      }
      nextButton={
        <Button variant="outline" size="sm" aria-label="Next component panels">
          <Icon name="akar-icons:chevron-right" aria-hidden="true" />
        </Button>
      }
      buttonAlignment="aside"
      renderItem={(panel) => (
        <Stack
          direction="col"
          alignH="stretch"
          gap="md"
          className="home-component-panel"
        >
          {panel.map((component) => (
            <Card
              as="a"
              interactive
              className="home-component-card"
              href={component.href}
              key={component.href}
              aria-labelledby={`component-${component.href.split("/").at(-1)}`}
            >
              <span className="home-component-card__icon">
                <Icon name={component.icon} aria-hidden="true" />
              </span>
              <CardHeader>
                <CardTitle id={`component-${component.href.split("/").at(-1)}`}>
                  {component.name}
                </CardTitle>
                <CardDescription>{component.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </Stack>
      )}
    />
  </CarouselController>
);
