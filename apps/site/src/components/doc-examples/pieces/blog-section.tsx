import {
  BlogSection,
  type BlogArticle,
  type BlogSectionVariant,
} from "@puzzle-ui/pieces";
import { sectionPreviewImages } from "../shared/section-preview-media";
import {
  SectionVariantPreviews,
  type SectionVariantPreview,
} from "../shared/section-variant-previews";

const articles: BlogArticle[] = [
  {
    id: "slow-mornings",
    title: "The case for slower mornings",
    excerpt:
      "A few thoughtful rituals can change the pace of an entire working day.",
    image: {
      src: sectionPreviewImages.workspace,
      alt: "A sunlit studio desk ready for the morning",
      width: 1200,
      height: 800,
    },
    author: {
      name: "Mara Chen",
      image: {
        src: sectionPreviewImages.portraitOne,
        alt: "Portrait of Mara Chen",
        width: 160,
        height: 160,
      },
    },
    date: "2025-05-12",
    category: "Studio notes",
    readingTime: 6,
    href: "/journal/slower-mornings",
    featured: true,
  },
  {
    id: "honest-materials",
    title: "Choosing materials that age well",
    excerpt:
      "A practical guide to pieces that become more personal with everyday use.",
    image: {
      src: sectionPreviewImages.product,
      alt: "Natural materials arranged on a worktable",
      width: 1200,
      height: 800,
    },
    author: { name: "Elliot Park" },
    date: "2025-04-04",
    category: "Field guides",
    readingTime: "8 min read",
    href: "/journal/materials-that-age",
  },
  {
    id: "shared-table",
    title: "Making room around the table",
    excerpt: "Small changes that make gathering feel more welcoming.",
    image: {
      src: sectionPreviewImages.team,
      alt: "Friends gathering around a long table",
      width: 1200,
      height: 800,
    },
    author: { name: "Noah James" },
    date: "2025-03-19",
    category: "At home",
    readingTime: 4,
    href: "/journal/room-around-the-table",
  },
  {
    id: "soft-light",
    title: "Working with the last light",
    excerpt: "Notes on the gentle shift from afternoon to evening.",
    image: {
      src: sectionPreviewImages.landscape,
      alt: "Soft evening light across a quiet landscape",
      width: 1200,
      height: 800,
    },
    author: { name: "Mara Chen" },
    date: "2025-02-02",
    category: "Studio notes",
    readingTime: 5,
    href: "/journal/last-light",
  },
];

const variants: SectionVariantPreview<BlogSectionVariant>[] = [
  { variant: "grid", useCase: "Browse recent stories in a responsive card grid." },
  { variant: "featured", useCase: "Lead with one article and keep supporting stories nearby." },
  { variant: "list", useCase: "Give each article a readable, full-width row." },
  { variant: "masonry", useCase: "Use a responsive editorial column layout." },
  { variant: "carousel", useCase: "Scroll through a compact horizontal story rail." },
  { variant: "editorial", useCase: "Give the leading story more room and a clear byline." },
  { variant: "magazine", useCase: "Pair a cover story with supporting articles." },
  { variant: "split", useCase: "Separate the lead story from the supporting list." },
  { variant: "compact", useCase: "Show article summaries in a denser list." },
  { variant: "categories", useCase: "Group articles under their editorial categories." },
  { variant: "latest", useCase: "Put the newest lead story first." },
  { variant: "horizontal", useCase: "Present a free-scrolling row of articles." },
  { variant: "cards", useCase: "Place article content on distinct card surfaces." },
];

export const BlogSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="BlogSection"
    variants={variants}
    buildCode={(variant) =>
      `<BlogSection variant="${variant}" items={articles} />`
    }
    renderVariant={(variant) => (
      <BlogSection
        variant={variant}
        eyebrow="Morrow Journal"
        title="Notes for more considered days"
        description="Stories on spaces, rituals, and the objects we keep."
        items={articles}
      />
    )}
  />
);
