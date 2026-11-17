import { TreeViewItem } from "@puzzle-ui/ui";

const folder = "/docs/pieces" as const;
//#region Components
const componentsFolder = `${folder}/components` as const;
const components: TreeViewItem = {
  id: "pieces-components",
  label: "Components",
  children: [
    {
      id: "pieces-marketing",
      label: "Marketing & Conversion",
      href: `${componentsFolder}/marketing`,
      children: [
        {
          id: "pieces-announcement",
          label: "Announcement",
          href: `${componentsFolder}/announcement`,
        },
        {
          id: "pieces-logo-cloud",
          label: "Logo Cloud",
          href: `${componentsFolder}/logo-cloud`,
        },
        {
          id: "pieces-features",
          label: "Features",
          href: `${componentsFolder}/features`,
        },
        {
          id: "pieces-product-showcase",
          label: "Product Showcase",
          href: `${componentsFolder}/product-showcase`,
        },
        {
          id: "pieces-integrations",
          label: "Integrations",
          href: `${componentsFolder}/integrations`,
        },
        {
          id: "pieces-use-cases",
          label: "Use Cases",
          href: `${componentsFolder}/use-cases`,
        },
        {
          id: "pieces-security",
          label: "Security",
          href: `${componentsFolder}/security`,
        },
        {
          id: "pieces-pricing",
          label: "Pricing",
          href: `${componentsFolder}/pricing`,
        },
        {
          id: "pieces-code-showcase",
          label: "Code Showcase",
          href: `${componentsFolder}/code-showcase`,
        },
        {
          id: "pieces-roadmap",
          label: "Roadmap",
          href: `${componentsFolder}/roadmap`,
        },
        {
          id: "pieces-benefits",
          label: "Benefits",
          href: `${componentsFolder}/benefits`,
        },
        {
          id: "pieces-stats",
          label: "Stats",
          href: `${componentsFolder}/stats`,
        },
        {
          id: "pieces-testimonials",
          label: "Testimonials",
          href: `${componentsFolder}/testimonials`,
        },
        {
          id: "pieces-cta",
          label: "CTA",
          href: `${componentsFolder}/cta`,
        },
        {
          id: "pieces-faq",
          label: "FAQ",
          href: `${componentsFolder}/faq`,
        },
        {
          id: "pieces-how-it-works",
          label: "How It Works",
          href: `${componentsFolder}/how-it-works`,
        },
        {
          id: "pieces-comparison",
          label: "Comparison",
          href: `${componentsFolder}/comparison`,
        },
      ],
    },
    {
      id: "pieces-commerce",
      label: "Commerce & Retail",
      children: [
        {
          id: "pieces-product-grid",
          label: "Product Grid",
          href: `${componentsFolder}/product-grid`,
        },
        {
          id: "pieces-categories",
          label: "Categories",
          href: `${componentsFolder}/categories`,
        },
        {
          id: "pieces-product-gallery",
          label: "Product Gallery",
          href: `${componentsFolder}/product-gallery`,
        },
        {
          id: "pieces-cart-summary",
          label: "Cart Summary",
          href: `${componentsFolder}/cart-summary`,
        },
        {
          id: "pieces-product-details",
          label: "Product Details",
          href: `${componentsFolder}/product-details`,
        },
        {
          id: "pieces-commerce-benefits",
          label: "Commerce Benefits",
          href: `${componentsFolder}/commerce-benefits`,
        },
      ],
    },
    {
      id: "pieces-content",
      label: "Content & Editorial",
      children: [
        {
          id: "pieces-blog-section",
          label: "Blog Section",
          href: `${componentsFolder}/blog-section`,
        },
        {
          id: "pieces-content-section",
          label: "Content Section",
          href: `${componentsFolder}/content-section`,
        },
        {
          id: "pieces-gallery-section",
          label: "Gallery Section",
          href: `${componentsFolder}/gallery-section`,
        },
        {
          id: "pieces-timeline-section",
          label: "Timeline Section",
          href: `${componentsFolder}/timeline-section`,
        },
        {
          id: "pieces-changelog-section",
          label: "Changelog Section",
          href: `${componentsFolder}/changelog-section`,
        },
      ],
    },
    {
      id: "pieces-business",
      label: "Business & Corporate",
      children: [
        {
          id: "pieces-about-section",
          label: "About Section",
          href: `${componentsFolder}/about-section`,
        },
        {
          id: "pieces-team-section",
          label: "Team Section",
          href: `${componentsFolder}/team-section`,
        },
        {
          id: "pieces-services-section",
          label: "Services Section",
          href: `${componentsFolder}/services-section`,
        },
        {
          id: "pieces-case-studies-section",
          label: "Case Studies Section",
          href: `${componentsFolder}/case-studies-section`,
        },
        {
          id: "pieces-contact-section",
          label: "Contact Section",
          href: `${componentsFolder}/contact-section`,
        },
        {
          id: "pieces-careers-section",
          label: "Careers Section",
          href: `${componentsFolder}/careers-section`,
        },
        {
          id: "pieces-partners-section",
          label: "Partners Section",
          href: `${componentsFolder}/partners-section`,
        },
        {
          id: "pieces-awards-section",
          label: "Awards Section",
          href: `${componentsFolder}/awards-section`,
        },
      ],
    },
    {
      id: "pieces-hero",
      label: "Hero",
      href: `${componentsFolder}/hero`,
    },
    {
      id: "pieces-dashboard",
      label: "Dashboard",
      href: `${componentsFolder}/dashboard`,
    },
    {
      id: "pieces-dashboard-navigation",
      label: "Dashboard Navigation",
      href: `${componentsFolder}/navigation`,
    },
    {
      id: "pieces-project",
      label: "Project",
      href: `${componentsFolder}/project`,
    },
    {
      id: "pieces-data-display",
      label: "Data Display",
      href: `${componentsFolder}/data-display`,
    },
    {
      id: "pieces-settings",
      label: "Settings",
      href: `${componentsFolder}/settings`,
    },
    {
      id: "pieces-feedback",
      label: "Feedback",
      href: `${componentsFolder}/feedback`,
    },
  ],
};
//#endregion

export const pieces: TreeViewItem = {
  id: "pieces",
  label: "Page Sections",
  children: [
    {
      id: "pieces-overview",
      label: "Overview",
      href: folder,
    },
    components,
  ],
} as const;
