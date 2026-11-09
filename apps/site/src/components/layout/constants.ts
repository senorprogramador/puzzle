import type { TreeViewItem } from "@puzzle-ui/ui/components/navigation/tree-view";

const items: TreeViewItem[] = [
  {
    id: "getting-started",
    label: "Getting Started",
    href: "/docs/getting-started",
  },
  {
    id: "components",
    label: "Components",
    children: [
      {
        id: "ui",
        label: "UI",
        children: [
          {
            id: "actions",
            label: "Actions",
            children: [
              {
                id: "button-group",
                label: "Button Group",
                href: "/docs/components/ui/actions/button-group",
              },
              {
                id: "button",
                label: "Button",
                href: "/docs/components/ui/actions/button",
              },
              {
                id: "toggle-group",
                label: "Toggle Group",
                href: "/docs/components/ui/actions/toggle-group",
              },
            ],
          },
          {
            id: "data-display",
            label: "Data Display",
            children: [
              {
                id: "alert",
                label: "Alert",
                href: "/docs/components/ui/data-display/alert",
              },
              {
                id: "avatar",
                label: "Avatar",
                href: "/docs/components/ui/data-display/avatar",
              },
              {
                id: "badge",
                label: "Badge",
                href: "/docs/components/ui/data-display/badge",
              },
              {
                id: "card",
                label: "Card",
                href: "/docs/components/ui/data-display/card",
              },
              {
                id: "empty-state",
                label: "Empty State",
                href: "/docs/components/ui/data-display/empty-state",
              },
              {
                id: "image",
                label: "Image",
                href: "/docs/components/ui/data-display/image",
              },
              {
                id: "paper",
                label: "Paper",
                href: "/docs/components/ui/data-display/paper",
              },
              {
                id: "progress",
                label: "Progress",
                href: "/docs/components/ui/data-display/progress",
              },
              {
                id: "skeleton",
                label: "Skeleton",
                href: "/docs/components/ui/data-display/skeleton",
              },
            ],
          },
          {
            id: "forms",
            label: "Forms",
            children: [
              {
                id: "autocomplete",
                label: "Autocomplete",
                href: "/docs/components/ui/forms/autocomplete",
              },
              {
                id: "checkbox",
                label: "Checkbox",
                href: "/docs/components/ui/forms/checkbox",
              },
              {
                id: "color-picker",
                label: "Color Picker",
                href: "/docs/components/ui/forms/color-picker",
              },
              {
                id: "date-picker",
                label: "Date Picker",
                href: "/docs/components/ui/forms/date-picker",
              },
              {
                id: "file-upload",
                label: "File Upload",
                href: "/docs/components/ui/forms/file-upload",
              },
              {
                id: "form-field",
                label: "Form Field",
                href: "/docs/components/ui/forms/form-field",
              },
              {
                id: "input-group",
                label: "Input Group",
                href: "/docs/components/ui/forms/input-group",
              },
              {
                id: "label",
                label: "Label",
                href: "/docs/components/ui/forms/label",
              },
              {
                id: "number-input",
                label: "Number Input",
                href: "/docs/components/ui/forms/number-input",
              },
              {
                id: "radio-group",
                label: "Radio Group",
                href: "/docs/components/ui/forms/radio-group",
              },
              {
                id: "select",
                label: "Select",
                href: "/docs/components/ui/forms/select",
              },
              {
                id: "slider",
                label: "Slider",
                href: "/docs/components/ui/forms/slider",
              },
              {
                id: "stepper",
                label: "Stepper",
                href: "/docs/components/ui/forms/stepper",
              },
              {
                id: "switch",
                label: "Switch",
                href: "/docs/components/ui/forms/switch",
              },
              {
                id: "text-area-input",
                label: "Text Area Input",
                href: "/docs/components/ui/forms/text-area-input",
              },
              {
                id: "text-input",
                label: "Text Input",
                href: "/docs/components/ui/forms/text-input",
              },
            ],
          },
          {
            id: "layout",
            label: "Layout",
            children: [
              {
                id: "app-bar",
                label: "App Bar",
                href: "/docs/components/ui/layout/app-bar",
              },
              {
                id: "background",
                label: "Background",
                href: "/docs/components/ui/layout/background",
              },
              {
                id: "bottom-navigation",
                label: "Bottom Navigation",
                href: "/docs/components/ui/layout/bottom-navigation",
              },
              {
                id: "breadcrumbs",
                label: "Breadcrumbs",
                href: "/docs/components/ui/layout/breadcrumbs",
              },
              {
                id: "collapsable-sidebar",
                label: "Collapsable Sidebar",
                href: "/docs/components/ui/layout/collapsable-sidebar",
              },
              {
                id: "container",
                label: "Container",
                href: "/docs/components/ui/layout/container",
              },
              {
                id: "page-layout",
                label: "Page Layout",
                href: "/docs/components/ui/layout/page-layout",
              },
              {
                id: "resizable-panels",
                label: "Resizable Panels",
                href: "/docs/components/ui/layout/resizable-panels",
              },
              {
                id: "section",
                label: "Section",
                href: "/docs/components/ui/layout/section",
              },
              {
                id: "section-stack",
                label: "Section Stack",
                href: "/docs/components/ui/layout/section-stack",
              },
              {
                id: "sidebar",
                label: "Sidebar",
                href: "/docs/components/ui/layout/sidebar",
              },
              {
                id: "stack",
                label: "Stack",
                href: "/docs/components/ui/layout/stack",
              },
            ],
          },
          {
            id: "navigation",
            label: "Navigation",
            children: [
              {
                id: "accordion",
                label: "Accordion",
                href: "/docs/components/ui/navigation/accordion",
              },
              {
                id: "carousel",
                label: "Carousel",
                href: "/docs/components/ui/navigation/carousel",
              },
              {
                id: "link",
                label: "Link",
                href: "/docs/components/ui/navigation/link",
              },
              {
                id: "pagination",
                label: "Pagination",
                href: "/docs/components/ui/navigation/pagination",
              },
              {
                id: "tabs",
                label: "Tabs",
                href: "/docs/components/ui/navigation/tabs",
              },
              {
                id: "tree-view",
                label: "Tree View",
                href: "/docs/components/ui/navigation/tree-view",
              },
            ],
          },
          {
            id: "overlays",
            label: "Overlays",
            children: [
              {
                id: "backdrop",
                label: "Backdrop",
                href: "/docs/components/ui/overlays/backdrop",
              },
              {
                id: "command",
                label: "Command",
                href: "/docs/components/ui/overlays/command",
              },
              {
                id: "dialog",
                label: "Dialog",
                href: "/docs/components/ui/overlays/dialog",
              },
              {
                id: "drawer",
                label: "Drawer",
                href: "/docs/components/ui/overlays/drawer",
              },
              {
                id: "dropdown-menu",
                label: "Dropdown Menu",
                href: "/docs/components/ui/overlays/dropdown-menu",
              },
              {
                id: "notification",
                label: "Notification",
                href: "/docs/components/ui/overlays/notification",
              },
              {
                id: "popout",
                label: "Popout",
                href: "/docs/components/ui/overlays/popout",
              },
              {
                id: "popover",
                label: "Popover",
                href: "/docs/components/ui/overlays/popover",
              },
              {
                id: "portal",
                label: "Portal",
                href: "/docs/components/ui/overlays/portal",
              },
              {
                id: "tooltip",
                label: "Tooltip",
                href: "/docs/components/ui/overlays/tooltip",
              },
            ],
          },
          {
            id: "typography",
            label: "Typography",
            children: [
              {
                id: "heading",
                label: "Heading",
                href: "/docs/components/ui/typography/heading",
              },
              {
                id: "text",
                label: "Text",
                href: "/docs/components/ui/typography/text",
              },
            ],
          },
          {
            id: "utilities",
            label: "Utilities",
            children: [
              {
                id: "preview",
                label: "Preview",
                href: "/docs/components/ui/utilities/preview",
              },
              {
                id: "scroll-lock",
                label: "Scroll Lock",
                href: "/docs/components/ui/utilities/scroll-lock",
              },
              {
                id: "transition",
                label: "Transition",
                href: "/docs/components/ui/utilities/transition",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "theme",
    label: "Theme",
    children: [
      {
        id: "theme-overview",
        label: "Overview",
        href: "/docs/theme",
      },
      {
        id: "theme-provider",
        label: "Theme Provider",
        href: "/docs/theme/theme-provider",
      },
      {
        id: "theme-tokens",
        label: "Design Tokens",
        href: "/docs/theme/tokens",
      },
      {
        id: "theme-colors",
        label: "Colors",
        href: "/docs/theme/colors",
      },
      {
        id: "theme-typography",
        label: "Typography & Fonts",
        href: "/docs/theme/typography",
      },
      {
        id: "theme-breakpoints",
        label: "Breakpoints",
        href: "/docs/theme/breakpoints",
      },
      {
        id: "theme-components",
        label: "Component Overrides",
        href: "/docs/theme/components",
      },
    ],
  },
] as const;

export { items };
