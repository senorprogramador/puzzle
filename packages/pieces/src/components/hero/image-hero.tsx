import { Hero } from "./hero";
import type { HeroProps } from "./hero.types";

type ImageHeroProps = Omit<HeroProps, "backgroundImage"> & {
  backgroundImage: string;
};

const ImageHero = ({ backgroundImage, ...props }: ImageHeroProps) => (
  <Hero
    layout="full-width"
    mediaPosition="background"
    alignment="center"
    height="large"
    theme="dark"
    overlay="gradient"
    {...props}
    backgroundImage={backgroundImage}
  />
);

export { ImageHero };
export type { ImageHeroProps };
