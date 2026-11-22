import type { TreeViewItem } from "./types";

const folder = "/docs/pieces" as const;
//#region Components
const componentsFolder = `${folder}/components` as const;
const components: TreeViewItem = {
  id: "pieces-components",
  label: "Components",
  children: [
    {
      id: "pieces-site-chrome",
      label: "Navigation & Site Chrome",
      href: `${componentsFolder}/navigation-site-chrome`,
      children: [
        {
          id: "pieces-site-header",
          label: "Site Header",
          href: `${componentsFolder}/site-header`,
        },
        {
          id: "pieces-locale-switcher",
          label: "Locale Switcher",
          href: `${componentsFolder}/locale-switcher`,
        },
      ],
    },
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
          id: "pieces-waitlist-section",
          label: "Waitlist Section",
          href: `${componentsFolder}/waitlist-section`,
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
          id: "pieces-guest-reviews",
          label: "Guest Reviews",
          href: `${componentsFolder}/guest-reviews`,
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
      href: `${componentsFolder}/commerce`,
      children: [
        {
          id: "pieces-product-grid",
          label: "Product Grid",
          href: `${componentsFolder}/product-grid`,
        },
        {
          id: "pieces-gift-voucher",
          label: "Gift Voucher",
          href: `${componentsFolder}/gift-voucher`,
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
          id: "pieces-checkout",
          label: "Checkout",
          href: `${componentsFolder}/checkout`,
        },
        {
          id: "pieces-payment-method-selector",
          label: "Payment Method Selector",
          href: `${componentsFolder}/payment-method-selector`,
        },
        {
          id: "pieces-product-details",
          label: "Product Details",
          href: `${componentsFolder}/product-details`,
        },
        {
          id: "pieces-booking-section",
          label: "Booking Section",
          href: `${componentsFolder}/booking-section`,
        },
        {
          id: "pieces-availability-search",
          label: "Availability Search",
          href: `${componentsFolder}/availability-search`,
        },
        {
          id: "pieces-availability-calendar",
          label: "Availability Calendar",
          href: `${componentsFolder}/availability-calendar`,
        },
        {
          id: "pieces-rate-plans",
          label: "Rate Plans",
          href: `${componentsFolder}/rate-plans`,
        },
        {
          id: "pieces-stay-summary",
          label: "Stay Summary",
          href: `${componentsFolder}/stay-summary`,
        },
        {
          id: "pieces-restaurant-menu",
          label: "Restaurant Menu",
          href: `${componentsFolder}/restaurant-menu`,
        },
        {
          id: "pieces-dish-card",
          label: "Dish Card",
          href: `${componentsFolder}/dish-card`,
        },
        {
          id: "pieces-dietary-information",
          label: "Dietary Information",
          href: `${componentsFolder}/dietary-information`,
        },
        {
          id: "pieces-table-reservation",
          label: "Table Reservation",
          href: `${componentsFolder}/table-reservation`,
        },
        {
          id: "pieces-hospitality-booking-flow",
          label: "Hospitality Booking Flow",
          href: `${componentsFolder}/hospitality-booking-flow`,
        },
        {
          id: "pieces-restaurant-experience",
          label: "Restaurant Experience",
          href: `${componentsFolder}/restaurant-experience`,
        },
        {
          id: "pieces-boutique-bnb",
          label: "Boutique B&B",
          href: `${componentsFolder}/boutique-bnb`,
        },
        {
          id: "pieces-hospitality-overview",
          label: "Hospitality Overview",
          href: `${componentsFolder}/hospitality-overview`,
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
      href: `${componentsFolder}/content`,
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
        {
          id: "pieces-video-section",
          label: "Video Section",
          href: `${componentsFolder}/video-section`,
        },
        {
          id: "pieces-resource-section",
          label: "Resource Section",
          href: `${componentsFolder}/resource-section`,
        },
        {
          id: "pieces-local-guide",
          label: "Local Guide",
          href: `${componentsFolder}/local-guide`,
        },
        {
          id: "pieces-event-section",
          label: "Event Section",
          href: `${componentsFolder}/event-section`,
        },
      ],
    },
    {
      id: "pieces-business",
      label: "Business & Corporate",
      href: `${componentsFolder}/business`,
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
          id: "pieces-host-profile",
          label: "Host Profile",
          href: `${componentsFolder}/host-profile`,
        },
        {
          id: "pieces-services-section",
          label: "Services Section",
          href: `${componentsFolder}/services-section`,
        },
        {
          id: "pieces-service-options",
          label: "Service Options",
          href: `${componentsFolder}/service-options`,
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
          id: "pieces-contact-form",
          label: "Contact Form",
          href: `${componentsFolder}/contact-form`,
        },
        {
          id: "pieces-location-section",
          label: "Location Section",
          href: `${componentsFolder}/location-section`,
        },
        {
          id: "pieces-opening-hours",
          label: "Opening Hours",
          href: `${componentsFolder}/opening-hours`,
        },
        {
          id: "pieces-accommodation-discovery",
          label: "Accommodation Discovery",
          href: `${componentsFolder}/accommodation-discovery`,
        },
        {
          id: "pieces-accommodation-overview",
          label: "Accommodation Overview",
          href: `${componentsFolder}/accommodation-overview`,
        },
        {
          id: "pieces-accommodation-details",
          label: "Accommodation Details",
          href: `${componentsFolder}/accommodation-details`,
        },
        {
          id: "pieces-amenity-list",
          label: "Amenity List",
          href: `${componentsFolder}/amenity-list`,
        },
        {
          id: "pieces-house-rules",
          label: "House Rules",
          href: `${componentsFolder}/house-rules`,
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
      id: "pieces-saas-product",
      label: "SaaS & Product",
      href: `${componentsFolder}/saas-product`,
    },
    {
      id: "pieces-application-dashboard",
      label: "Application & Dashboard",
      href: `${componentsFolder}/application-dashboard`,
      children: [
        {
          id: "pieces-dashboard",
          label: "Dashboard",
          href: `${componentsFolder}/dashboard`,
        },
        {
          id: "pieces-activity",
          label: "Activity",
          href: `${componentsFolder}/activity`,
        },
        {
          id: "pieces-onboarding",
          label: "Onboarding",
          href: `${componentsFolder}/onboarding`,
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
          id: "pieces-empty-state",
          label: "Empty State",
          href: `${componentsFolder}/empty-state`,
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
    },
    {
      id: "pieces-specialized-interactive",
      label: "Specialized & Interactive",
      href: `${componentsFolder}/specialized-interactive`,
      children: [
        {
          id: "pieces-footer-section",
          label: "Footer Section",
          href: `${componentsFolder}/footer-section`,
        },
      ],
    },
    {
      id: "pieces-media",
      label: "Media & Asset Management",
      href: `${componentsFolder}/media`,
      children: [
        {
          id: "pieces-media-library",
          label: "MediaLibrary",
          href: `${componentsFolder}/media-library`,
        },
        {
          id: "pieces-asset-picker-dialog",
          label: "AssetPickerDialog",
          href: `${componentsFolder}/asset-picker-dialog`,
        },
        {
          id: "pieces-asset-details-panel",
          label: "AssetDetailsPanel",
          href: `${componentsFolder}/asset-details-panel`,
        },
        {
          id: "pieces-media-field",
          label: "MediaField",
          href: `${componentsFolder}/media-field`,
        },
      ],
    },
    {
      id: "pieces-cms",
      label: "CMS Authoring",
      href: `${componentsFolder}/cms`,
      children: [
        {
          id: "pieces-cms-shell",
          label: "CmsShell",
          href: `${componentsFolder}/cms-shell`,
        },
        {
          id: "pieces-content-list",
          label: "ContentList",
          href: `${componentsFolder}/content-list`,
        },
        {
          id: "pieces-content-editor",
          label: "ContentEditor",
          href: `${componentsFolder}/content-editor`,
        },
        {
          id: "pieces-block-editor",
          label: "BlockEditor",
          href: `${componentsFolder}/block-editor`,
        },
        {
          id: "pieces-content-type-builder",
          label: "ContentTypeBuilder",
          href: `${componentsFolder}/content-type-builder`,
        },
        {
          id: "pieces-localization-editor",
          label: "LocalizationEditor",
          href: `${componentsFolder}/localization-editor`,
        },
        {
          id: "pieces-relationship-field",
          label: "RelationshipField",
          href: `${componentsFolder}/relationship-field`,
        },
        {
          id: "pieces-revision-history",
          label: "RevisionHistory",
          href: `${componentsFolder}/revision-history`,
        },
        {
          id: "pieces-publish-scheduler",
          label: "PublishScheduler",
          href: `${componentsFolder}/publish-scheduler`,
        },
        {
          id: "pieces-editorial-calendar",
          label: "EditorialCalendar",
          href: `${componentsFolder}/editorial-calendar`,
        },
        {
          id: "pieces-audit-log-viewer",
          label: "AuditLogViewer",
          href: `${componentsFolder}/audit-log-viewer`,
        },
        {
          id: "pieces-webhook-management",
          label: "WebhookManagement",
          href: `${componentsFolder}/webhook-management`,
        },
      ],
    },
    {
      id: "pieces-framework-integration",
      label: "Framework Integration",
      href: `${folder}/framework-integration`,
    },
    {
      id: "pieces-hero",
      label: "Hero",
      href: `${componentsFolder}/hero`,
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
