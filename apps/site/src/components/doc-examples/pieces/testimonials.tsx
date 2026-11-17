import { TestimonialsSection } from "@puzzle-ui/pieces";
import type { TestimonialItem, TestimonialsVariant } from "@puzzle-ui/pieces";
import { sectionPreviewImages, SectionPreviewVideo } from "../shared/section-preview-media";
import { BrandWordmark } from "../shared/brand-wordmark";
import { SectionVariantPreviews } from "../shared/section-variant-previews";
import type { SectionVariantPreview } from "../shared/section-variant-previews";

const TestimonialInitials = ({ initials }: { initials: string }) => (
  <span
    style={{
      display: "grid",
      width: "100%",
      height: "100%",
      placeItems: "center",
      background: "var(--puzzle-color-surface-sunken)",
      color: "var(--puzzle-color-text-muted)",
      fontSize: "var(--puzzle-font-size-sm, 0.875rem)",
      fontWeight: 700,
    }}
  >
    {initials}
  </span>
);

const testimonialItems: TestimonialItem[] = [
  {
    id: "riley",
    quote:
      "Puzzle gave our team a shared view of the work. We spend less time chasing updates and more time making the product better.",
    author: "Riley Chen",
    role: "VP of Product",
    organization: "Aperture",
    rating: 5,
    avatar: <TestimonialInitials initials="RC" />,
    companyLogo: (
      <BrandWordmark
        name="aperture"
        mark="A"
        color="var(--puzzle-color-primary)"
      />
    ),
    featured: true,
  },
  {
    id: "jordan",
    quote:
      "We got everyone aligned in a week. Even our newest teammates know exactly where to find the context they need.",
    author: "Jordan Lee",
    role: "Operations Director",
    organization: "Northstar",
    rating: 5,
    avatar: <TestimonialInitials initials="JL" />,
    companyLogo: (
      <BrandWordmark
        name="northstar"
        mark="N"
        color="var(--puzzle-color-text)"
      />
    ),
  },
  {
    id: "alex",
    quote:
      "The project view is simple enough to use every day and detailed enough to keep leadership in the loop.",
    author: "Alex Morgan",
    role: "Studio Founder",
    organization: "Fieldnotes",
    rating: 4,
    avatar: <TestimonialInitials initials="AM" />,
    companyLogo: (
      <BrandWordmark
        name="fieldnotes"
        mark="F"
        color="var(--puzzle-color-warning)"
      />
    ),
  },
  {
    id: "sam",
    quote:
      "We can finally see what is moving, what is stuck, and where a little help will make the biggest difference.",
    author: "Sam Rivera",
    role: "Customer Experience Lead",
    organization: "Kin",
    rating: 5,
    avatar: <TestimonialInitials initials="SR" />,
    companyLogo: (
      <BrandWordmark name="kin" mark="K" color="var(--puzzle-color-info)" />
    ),
  },
];

const testimonialVariants: SectionVariantPreview<TestimonialsVariant>[] = [
  { variant: "grid", useCase: "A balanced set of customer quotes." },
  { variant: "cards", useCase: "Testimonials shown as distinct cards." },
  {
    variant: "carousel",
    useCase: "A keyboard-navigable featured quote at a time.",
  },
  {
    variant: "featured",
    useCase: "One highlighted testimonial with supporting quotes.",
  },
  { variant: "quote", useCase: "A single quote with restrained framing." },
  { variant: "masonry", useCase: "Testimonials with varied quote lengths." },
  {
    variant: "split",
    useCase: "Quotes paired with an adjacent introduction or media.",
  },
  {
    variant: "video",
    useCase: "Testimonials that include consumer-provided video.",
  },
  {
    variant: "avatar-grid",
    useCase: "A collection emphasizing customer identity.",
  },
  { variant: "wall", useCase: "A dense wall of short customer endorsements." },
  { variant: "minimal", useCase: "A low-decoration quotation list." },
  {
    variant: "editorial",
    useCase: "Longer quotations with stronger typography.",
  },
  {
    variant: "rating",
    useCase: "Testimonials that include a customer rating.",
  },
  { variant: "dark", useCase: "Quotes on a contrasting dark surface." },
];

export const TestimonialsSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="TestimonialsSection"
    variants={testimonialVariants}
    buildCode={(variant) =>
      variant === "video"
        ? `<TestimonialsSection variant="video" items={[{ id: "riley", author: "Riley Chen", quote: "A clearer way to work together.", media: <video controls poster="${sectionPreviewImages.team}"><source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" /></video> }]} />`
        : `<TestimonialsSection variant="${variant}" items={testimonials} />`
    }
    renderVariant={(variant) => {
      const items =
        variant === "video"
          ? testimonialItems.map((item, index) =>
              index === 0 ? { ...item, media: <SectionPreviewVideo /> } : item,
            )
          : variant === "avatar-grid"
            ? testimonialItems.map((item, index) => ({
                ...item,
                avatar: (
                  <img
                    src={
                      [
                        sectionPreviewImages.portraitOne,
                        sectionPreviewImages.portraitTwo,
                        sectionPreviewImages.portraitThree,
                        sectionPreviewImages.portraitFour,
                      ][index]!
                    }
                    alt=""
                    loading="eager"
                  />
                ),
              }))
          : variant === "dark"
            ? testimonialItems.map((item) => ({
                ...item,
                companyLogo: item.organization ? (
                  <BrandWordmark
                    name={item.organization.toLowerCase()}
                    mark={item.organization.slice(0, 1).toUpperCase()}
                    color="var(--puzzle-color-background)"
                  />
                ) : undefined,
              }))
          : testimonialItems;
      const titles: Partial<Record<TestimonialsVariant, string>> = {
        featured: "A partnership that changed the way we work",
        quote: "A little more room for the work that matters",
        split: "Good work speaks for itself",
        video: "Hear it from the people doing the work",
        "avatar-grid": "Meet the teams behind the kind words",
        wall: "A growing community, in their own words",
        editorial: "The best measure is how the work feels",
        rating: "Loved by teams who care about the details",
        dark: "Built for people who care about their craft",
      };

      return (
        <TestimonialsSection
          variant={variant}
          eyebrow="Customer stories"
          title={titles[variant] ?? "What teams say after working with Puzzle"}
          description="Honest notes from people who found a calmer way to build together."
          items={items}
        />
      );
    }}
  />
);
