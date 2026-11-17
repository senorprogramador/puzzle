import {
  ProductShowcaseSection,
  type ProductShowcaseItem,
  type ProductShowcaseVariant,
} from "@puzzle-ui/pieces";
import {
  sectionPreviewImages,
  SectionPreviewImage,
  SectionPreviewVideo,
} from "../shared/section-preview-media";
import {
  SectionVariantPreviews,
  type SectionVariantPreview,
} from "../shared/section-variant-previews";

const productItems: ProductShowcaseItem[] = [
  {
    id: "workspace",
    title: "Keep launches in view",
    description:
      "See owners, milestones, and decisions together in one shared workspace.",
    media: (
      <SectionPreviewImage
        src={sectionPreviewImages.dashboard}
        alt="A project dashboard with milestones and owners"
      />
    ),
    caption: "Launch dashboard",
    annotations: [
      {
        id: "owners",
        label: "Owners",
        description: "See who is responsible for each milestone.",
      },
      {
        id: "progress",
        label: "Progress",
        description: "Review delivery status across the launch.",
      },
    ],
    featured: true,
  },
  {
    id: "collaboration",
    title: "Bring context together",
    description:
      "Give every team a clear place to share updates and unblock the next step.",
    media: (
      <SectionPreviewImage
        src={sectionPreviewImages.team}
        alt="A team collaborating around a shared project plan"
      />
    ),
    caption: "Team collaboration",
  },
];

const variants: SectionVariantPreview<ProductShowcaseVariant>[] = [
  { variant: "split", useCase: "Pair the product view with its explanation." },
  { variant: "centered", useCase: "Center a focused, media-led product story." },
  { variant: "browser", useCase: "Frame a web application screenshot as a browser window." },
  { variant: "desktop", useCase: "Present a wide desktop application view." },
  { variant: "mobile", useCase: "Focus on a responsive mobile screen." },
  { variant: "device-stack", useCase: "Layer a small set of mobile product screens." },
  { variant: "gallery", useCase: "Show several product screens in a gallery." },
  { variant: "tabs", useCase: "Let visitors switch between product capabilities." },
  { variant: "carousel", useCase: "Browse product screens with explicit controls." },
  { variant: "sticky", useCase: "Keep the selected product view beside a feature list." },
  { variant: "bento", useCase: "Give a highlighted capability more room in a grid." },
  { variant: "full-width", useCase: "Use a wider section for expansive product media." },
  { variant: "layered", useCase: "Stack related screens into a layered composition." },
  { variant: "editorial", useCase: "Tell a product story with alternating media and copy." },
  { variant: "video", useCase: "Show a customer-provided video or demo clip." },
  { variant: "interactive", useCase: "Expose annotated product details as disclosures." },
];

export const ProductShowcaseSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="ProductShowcaseSection"
    variants={variants}
    buildCode={(variant) =>
      `<ProductShowcaseSection variant="${variant}" items={productItems} />`
    }
    renderVariant={(variant) => (
      <ProductShowcaseSection
        variant={variant}
        eyebrow="Northstar product"
        title="A clear view from brief to launch"
        description="A fictional SaaS workspace that brings plans, owners, and progress into one place."
        items={
          variant === "video"
            ? [
                { ...productItems[0]!, media: <SectionPreviewVideo /> },
                productItems[1]!,
              ]
            : productItems
        }
      />
    )}
  />
);
