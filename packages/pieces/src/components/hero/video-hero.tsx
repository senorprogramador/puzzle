import { Hero } from "./hero";
import type { HeroProps, HeroVideoSource } from "./hero.types";

type VideoHeroProps = Omit<HeroProps, "backgroundVideo"> & {
  backgroundVideo: HeroVideoSource;
};

const VideoHero = ({ backgroundVideo, ...props }: VideoHeroProps) => (
  <Hero
    layout="full-width"
    mediaPosition="background"
    alignment="center"
    height="viewport"
    theme="dark"
    overlay="gradient"
    {...props}
    backgroundVideo={backgroundVideo}
  />
);

export { VideoHero };
export type { VideoHeroProps };
