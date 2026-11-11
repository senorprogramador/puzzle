import { TreeViewItem } from "@puzzle-ui/ui/components/navigation/tree-view";

const folder = "/docs/ui" as const;

//#region Actions
const actions: TreeViewItem = {
  id: "ui-actions",
  label: "Actions",
  children: [
    {
      id: "ui-button-group",
      label: "Button Group",
      href: `${folder}/actions/button-group`,
    },
    {
      id: "ui-button",
      label: "Button",
      href: `${folder}/actions/button`,
    },
    {
      id: "ui-toggle-group",
      label: "Toggle Group",
      href: `${folder}/actions/toggle-group`,
    },
  ],
} as const;
//#endregion Actions

//#region Data Display
const dataDisplay: TreeViewItem = {
  id: "ui-data-display",
  label: "Data Display",
  children: [
    {
      id: "ui-alert",
      label: "Alert",
      href: `${folder}/data-display/alert`,
    },
    {
      id: "ui-avatar",
      label: "Avatar",
      href: `${folder}/data-display/avatar`,
    },
    {
      id: "ui-badge",
      label: "Badge",
      href: `${folder}/data-display/badge`,
    },
    {
      id: "ui-card",
      label: "Card",
      href: `${folder}/data-display/card`,
    },
    {
      id: "ui-empty-state",
      label: "Empty State",
      href: `${folder}/data-display/empty-state`,
    },
    {
      id: "ui-image",
      label: "Image",
      href: `${folder}/data-display/image`,
    },
    {
      id: "ui-paper",
      label: "Paper",
      href: `${folder}/data-display/paper`,
    },
    {
      id: "ui-progress",
      label: "Progress",
      href: `${folder}/data-display/progress`,
    },
    {
      id: "ui-rating",
      label: "Rating",
      href: `${folder}/data-display/rating`,
    },
    {
      id: "ui-skeleton",
      label: "Skeleton",
      href: `${folder}/data-display/skeleton`,
    },
  ],
} as const;
//#endregion Data Display

//#region Forms
const forms: TreeViewItem = {
  id: "ui-forms",
  label: "Forms",
  children: [
    {
      id: "ui-autocomplete",
      label: "Autocomplete",
      href: `${folder}/forms/autocomplete`,
    },
    {
      id: "ui-checkbox",
      label: "Checkbox",
      href: `${folder}/forms/checkbox`,
    },
    {
      id: "ui-color-picker",
      label: "Color Picker",
      href: `${folder}/forms/color-picker`,
    },
    {
      id: "ui-date-picker",
      label: "Date Picker",
      href: `${folder}/forms/date-picker`,
    },
    {
      id: "ui-file-upload",
      label: "File Upload",
      href: `${folder}/forms/file-upload`,
    },
    {
      id: "ui-form-field",
      label: "Form Field",
      href: `${folder}/forms/form-field`,
    },
    {
      id: "ui-input-group",
      label: "Input Group",
      href: `${folder}/forms/input-group`,
    },
    {
      id: "ui-label",
      label: "Label",
      href: `${folder}/forms/label`,
    },
    {
      id: "ui-number-input",
      label: "Number Input",
      href: `${folder}/forms/number-input`,
    },
    {
      id: "ui-radio-group",
      label: "Radio Group",
      href: `${folder}/forms/radio-group`,
    },
    {
      id: "ui-select",
      label: "Select",
      href: `${folder}/forms/select`,
    },
    {
      id: "ui-slider",
      label: "Slider",
      href: `${folder}/forms/slider`,
    },
    {
      id: "ui-stepper",
      label: "Stepper",
      href: `${folder}/forms/stepper`,
    },
    {
      id: "ui-switch",
      label: "Switch",
      href: `${folder}/forms/switch`,
    },
    {
      id: "ui-text-area-input",
      label: "Text Area Input",
      href: `${folder}/forms/text-area-input`,
    },
    {
      id: "ui-text-input",
      label: "Text Input",
      href: `${folder}/forms/text-input`,
    },
    {
      id: "ui-time-picker",
      label: "Time Picker",
      href: `${folder}/forms/time-picker`,
    },
    {
      id: "ui-token-input",
      label: "Token Input",
      href: `${folder}/forms/token-input`,
    },
  ],
} as const;
//#endregion Forms

//#region Layout
const layout: TreeViewItem = {
  id: "ui-layout",
  label: "Layout",
  children: [
    {
      id: "ui-app-bar",
      label: "App Bar",
      href: `${folder}/layout/app-bar`,
    },
    {
      id: "ui-aspect-ratio",
      label: "Aspect Ratio",
      href: `${folder}/layout/aspect-ratio`,
    },
    {
      id: "ui-background",
      label: "Background",
      href: `${folder}/layout/background`,
    },
    {
      id: "ui-bottom-navigation",
      label: "Bottom Navigation",
      href: `${folder}/layout/bottom-navigation`,
    },
    {
      id: "ui-breadcrumbs",
      label: "Breadcrumbs",
      href: `${folder}/layout/breadcrumbs`,
    },
    {
      id: "ui-collapsable-sidebar",
      label: "Collapsable Sidebar",
      href: `${folder}/layout/collapsable-sidebar`,
    },
    {
      id: "ui-container",
      label: "Container",
      href: `${folder}/layout/container`,
    },
    {
      id: "ui-page-layout",
      label: "Page Layout",
      href: `${folder}/layout/page-layout`,
    },
    {
      id: "ui-resizable-panels",
      label: "Resizable Panels",
      href: `${folder}/layout/resizable-panels`,
    },
    {
      id: "ui-scroll-area",
      label: "Scroll Area",
      href: `${folder}/layout/scroll-area`,
    },
    {
      id: "ui-section",
      label: "Section",
      href: `${folder}/layout/section`,
    },
    {
      id: "ui-section-stack",
      label: "Section Stack",
      href: `${folder}/layout/section-stack`,
    },
    {
      id: "ui-separator",
      label: "Separator",
      href: `${folder}/layout/separator`,
    },
    {
      id: "ui-sidebar",
      label: "Sidebar",
      href: `${folder}/layout/sidebar`,
    },
    {
      id: "ui-stack",
      label: "Stack",
      href: `${folder}/layout/stack`,
    },
  ],
} as const;
//#endregion Layout

//#region Navigation
const navigation: TreeViewItem = {
  id: "ui-navigation",
  label: "Navigation",
  children: [
    {
      id: "ui-accordion",
      label: "Accordion",
      href: `${folder}/navigation/accordion`,
    },
    {
      id: "ui-carousel",
      label: "Carousel",
      href: `${folder}/navigation/carousel`,
    },
    {
      id: "ui-link",
      label: "Link",
      href: `${folder}/navigation/link`,
    },
    {
      id: "ui-pagination",
      label: "Pagination",
      href: `${folder}/navigation/pagination`,
    },
    {
      id: "ui-tabs",
      label: "Tabs",
      href: `${folder}/navigation/tabs`,
    },
    {
      id: "ui-tree-view",
      label: "Tree View",
      href: `${folder}/navigation/tree-view`,
    },
  ],
} as const;
//#endregion Navigation

//#region Overlays
const overlays: TreeViewItem = {
  id: "ui-overlays",
  label: "Overlays",
  children: [
    {
      id: "ui-backdrop",
      label: "Backdrop",
      href: `${folder}/overlays/backdrop`,
    },
    {
      id: "ui-command",
      label: "Command",
      href: `${folder}/overlays/command`,
    },
    {
      id: "ui-context-menu",
      label: "Context Menu",
      href: `${folder}/overlays/context-menu`,
    },
    {
      id: "ui-dialog",
      label: "Dialog",
      href: `${folder}/overlays/dialog`,
    },
    {
      id: "ui-drawer",
      label: "Drawer",
      href: `${folder}/overlays/drawer`,
    },
    {
      id: "ui-dropdown-menu",
      label: "Dropdown Menu",
      href: `${folder}/overlays/dropdown-menu`,
    },
    {
      id: "ui-notification",
      label: "Notification",
      href: `${folder}/overlays/notification`,
    },
    {
      id: "ui-popout",
      label: "Popout",
      href: `${folder}/overlays/popout`,
    },
    {
      id: "ui-popover",
      label: "Popover",
      href: `${folder}/overlays/popover`,
    },
    {
      id: "ui-portal",
      label: "Portal",
      href: `${folder}/overlays/portal`,
    },
    {
      id: "ui-tooltip",
      label: "Tooltip",
      href: `${folder}/overlays/tooltip`,
    },
  ],
} as const;
//#endregion Overlays

//#region Typography
const typography: TreeViewItem = {
  id: "ui-typography",
  label: "Typography",
  children: [
    {
      id: "ui-heading",
      label: "Heading",
      href: `${folder}/typography/heading`,
    },
    {
      id: "ui-text",
      label: "Text",
      href: `${folder}/typography/text`,
    },
  ],
} as const;
//#endregion Typography

//#region Utilities
const utilities: TreeViewItem = {
  id: "ui-utilities",
  label: "Utilities",
  children: [
    {
      id: "ui-preview",
      label: "Preview",
      href: `${folder}/utilities/preview`,
    },
    {
      id: "ui-scroll-lock",
      label: "Scroll Lock",
      href: `${folder}/utilities/scroll-lock`,
    },
    {
      id: "ui-transition",
      label: "Transition",
      href: `${folder}/utilities/transition`,
    },
  ],
} as const;
//#endregion Utilities

export const ui: TreeViewItem = {
  id: "ui",
  label: "UI",
  children: [
    actions,
    dataDisplay,
    forms,
    layout,
    navigation,
    overlays,
    typography,
    utilities,
  ],
} as const;

export const ALL_UI_GROUP_IDS = [
  "ui",
  "ui-actions",
  "ui-data-display",
  "ui-forms",
  "ui-layout",
  "ui-navigation",
  "ui-overlays",
  "ui-typography",
  "ui-utilities",
] as const;
