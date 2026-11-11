import { Hero } from ".";

const HeroBrowserFixture = () => (
  <main>
    <Hero
      testId="hero-responsive"
      layout="split"
      mediaPosition="right"
      reverseOnMobile
      title="Discover something new"
      description="A responsive hero component."
      media={
        <img
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
          alt="Example landscape"
        />
      }
    />

    <Hero
      testId="hero-normal-order"
      layout="split"
      mediaPosition="right"
      reverseOnMobile={false}
      title="Normal mobile order"
      media={
        <img
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
          alt="Example product"
        />
      }
    />
  </main>
);

export { HeroBrowserFixture };
