import { __toESM } from "../_runtime.mjs";
import { Theme } from "./theme-CdO4PIrK.mjs";
import { Button, Card, CardDescription, CardHeader, CardTitle, Stack } from "./drawer-CUQXsr8p.mjs";
import { AppBar, Badge, Checkbox, Heading, PageLayout, SectionStack, Switch, Text, TextInput } from "./heading-D_H_fVaV.mjs";
import { Icon$1, Link, Section } from "./section-Ns7rCqaa.mjs";
import { require_react } from "../_libs/react.mjs";
import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/routes-BFh0w94o.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Header = ({}) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppBar, {
		logo: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: "/favicon.svg",
			width: "48",
			height: "48",
			alt: "Logo",
			className: "h-12 w-12"
		}),
		title: "Puzzle",
		navigationItems: [{
			label: "Home",
			href: "/",
			current: true
		}, {
			label: "Docs",
			href: "/docs/getting-started"
		}],
		sticky: true
	});
};
var components = [
	{
		name: "Button",
		href: "/docs/ui/actions/button",
		icon: "lucide:mouse-pointer-click",
		description: "Trigger actions with clear sizes, variants, and loading states."
	},
	{
		name: "Button Group",
		href: "/docs/ui/actions/button-group",
		icon: "lucide:group",
		description: "Arrange related actions in a connected set of buttons."
	},
	{
		name: "Toggle Group",
		href: "/docs/ui/actions/toggle-group",
		icon: "lucide:toggle-left",
		description: "Select one or more options from a group of toggles."
	},
	{
		name: "Alert",
		href: "/docs/ui/data-display/alert",
		icon: "lucide:triangle-alert",
		description: "Highlight important information, warnings, and errors."
	},
	{
		name: "Avatar",
		href: "/docs/ui/data-display/avatar",
		icon: "lucide:circle-user-round",
		description: "Represent people with profile images or initials."
	},
	{
		name: "Badge",
		href: "/docs/ui/data-display/badge",
		icon: "lucide:badge",
		description: "Annotate content with a count, label, or status."
	},
	{
		name: "Card",
		href: "/docs/ui/data-display/card",
		icon: "lucide:panel-top",
		description: "Compose content with headers, media, actions, and footers."
	},
	{
		name: "Empty State",
		href: "/docs/ui/data-display/empty-state",
		icon: "lucide:inbox",
		description: "Explain missing content and offer a useful next step."
	},
	{
		name: "Image",
		href: "/docs/ui/data-display/image",
		icon: "lucide:image",
		description: "Display responsive images with fitting and placeholders."
	},
	{
		name: "Paper",
		href: "/docs/ui/data-display/paper",
		icon: "lucide:sticky-note",
		description: "Place content on a simple themed surface."
	},
	{
		name: "Progress",
		href: "/docs/ui/data-display/progress",
		icon: "lucide:loader-circle",
		description: "Show activity with circular or linear progress indicators."
	},
	{
		name: "Rating",
		href: "/docs/ui/data-display/rating",
		icon: "lucide:star",
		description: "Display or collect a rating using familiar stars."
	},
	{
		name: "Skeleton",
		href: "/docs/ui/data-display/skeleton",
		icon: "lucide:rectangle-ellipsis",
		description: "Reserve space with placeholders while content loads."
	},
	{
		name: "Text Editor",
		href: "/docs/ui/editors/text-editor",
		icon: "lucide:file-pen-line",
		description: "Edit rich text with a formatting toolbar and document renderer."
	},
	{
		name: "Autocomplete",
		href: "/docs/ui/forms/autocomplete",
		icon: "lucide:list-filter",
		description: "Find and select options with searchable suggestions."
	},
	{
		name: "Checkbox",
		href: "/docs/ui/forms/checkbox",
		icon: "lucide:square-check",
		description: "Select independent options with checked and mixed states."
	},
	{
		name: "Color Picker",
		href: "/docs/ui/forms/color-picker",
		icon: "lucide:palette",
		description: "Choose colors with swatches and editable color values."
	},
	{
		name: "Date Picker",
		href: "/docs/ui/forms/date-picker",
		icon: "lucide:calendar-days",
		description: "Choose a date using a calendar and input field."
	},
	{
		name: "File Upload",
		href: "/docs/ui/forms/file-upload",
		icon: "lucide:upload",
		description: "Select files and communicate upload progress and errors."
	},
	{
		name: "Form Field",
		href: "/docs/ui/forms/form-field",
		icon: "lucide:text-cursor-input",
		description: "Connect inputs to labels, descriptions, and validation feedback."
	},
	{
		name: "Input Group",
		href: "/docs/ui/forms/input-group",
		icon: "lucide:between-horizontal-start",
		description: "Compose inputs with leading or trailing content."
	},
	{
		name: "Label",
		href: "/docs/ui/forms/label",
		icon: "lucide:tag",
		description: "Give form controls a clear, associated label."
	},
	{
		name: "Number Input",
		href: "/docs/ui/forms/number-input",
		icon: "lucide:hash",
		description: "Enter numeric values with increment and decrement controls."
	},
	{
		name: "Radio Group",
		href: "/docs/ui/forms/radio-group",
		icon: "lucide:circle-dot",
		description: "Choose a single option from a set of radio controls."
	},
	{
		name: "Select",
		href: "/docs/ui/forms/select",
		icon: "lucide:chevrons-up-down",
		description: "Choose one or more values from a dropdown list."
	},
	{
		name: "Slider",
		href: "/docs/ui/forms/slider",
		icon: "lucide:sliders-horizontal",
		description: "Adjust a value along a track with optional marks."
	},
	{
		name: "Stepper",
		href: "/docs/ui/forms/stepper",
		icon: "lucide:list-ordered",
		description: "Guide users through the steps of a multi-stage flow."
	},
	{
		name: "Switch",
		href: "/docs/ui/forms/switch",
		icon: "lucide:toggle-right",
		description: "Turn a setting on or off with a compact toggle."
	},
	{
		name: "Text Area Input",
		href: "/docs/ui/forms/text-area-input",
		icon: "lucide:align-left",
		description: "Collect longer messages and multi-line text."
	},
	{
		name: "Text Input",
		href: "/docs/ui/forms/text-input",
		icon: "lucide:text-cursor",
		description: "Collect single-line text with familiar input behavior."
	},
	{
		name: "Time Picker",
		href: "/docs/ui/forms/time-picker",
		icon: "lucide:clock",
		description: "Enter and select a time of day."
	},
	{
		name: "Token Input",
		href: "/docs/ui/forms/token-input",
		icon: "lucide:key-round",
		description: "Enter verification codes in individual character slots."
	},
	{
		name: "App Bar",
		href: "/docs/ui/layout/app-bar",
		icon: "lucide:panel-top-dashed",
		description: "Compose an application header with branding and navigation."
	},
	{
		name: "Aspect Ratio",
		href: "/docs/ui/layout/aspect-ratio",
		icon: "lucide:ratio",
		description: "Keep media and other content at a consistent aspect ratio."
	},
	{
		name: "Background",
		href: "/docs/ui/layout/background",
		icon: "lucide:paintbrush",
		description: "Add themed patterns, fades, and mesh backgrounds."
	},
	{
		name: "Bottom Navigation",
		href: "/docs/ui/layout/bottom-navigation",
		icon: "lucide:panel-bottom",
		description: "Keep primary destinations within reach at the bottom of a view."
	},
	{
		name: "Breadcrumbs",
		href: "/docs/ui/layout/breadcrumbs",
		icon: "lucide:chevrons-right",
		description: "Show the current location within a page hierarchy."
	},
	{
		name: "Collapsable Sidebar",
		href: "/docs/ui/layout/collapsable-sidebar",
		icon: "lucide:panel-left-close",
		description: "Organize navigation in an expandable side panel."
	},
	{
		name: "Container",
		href: "/docs/ui/layout/container",
		icon: "lucide:box",
		description: "Constrain content width with consistent page gutters."
	},
	{
		name: "Page Layout",
		href: "/docs/ui/layout/page-layout",
		icon: "lucide:layout-dashboard",
		description: "Compose page headers, sidebars, and main content regions."
	},
	{
		name: "Resizable Panels",
		href: "/docs/ui/layout/resizable-panels",
		icon: "lucide:panels-left-bottom",
		description: "Split content into panels with draggable resize handles."
	},
	{
		name: "Scroll Area",
		href: "/docs/ui/layout/scroll-area",
		icon: "lucide:scroll",
		description: "Contain overflowing content in a dedicated scroll region."
	},
	{
		name: "Section",
		href: "/docs/ui/layout/section",
		icon: "lucide:panel-top-bottom-dashed",
		description: "Define page sections with themed spacing and surfaces."
	},
	{
		name: "Section Stack",
		href: "/docs/ui/layout/section-stack",
		icon: "lucide:layers",
		description: "Arrange page sections with consistent separation."
	},
	{
		name: "Separator",
		href: "/docs/ui/layout/separator",
		icon: "lucide:minus",
		description: "Separate related content horizontally or vertically."
	},
	{
		name: "Sidebar",
		href: "/docs/ui/layout/sidebar",
		icon: "lucide:panel-left",
		description: "Place supporting content and navigation beside the main view."
	},
	{
		name: "Stack",
		href: "/docs/ui/layout/stack",
		icon: "lucide:layout-list",
		description: "Arrange content with responsive direction, alignment, and gaps."
	},
	{
		name: "Accordion",
		href: "/docs/ui/navigation/accordion",
		icon: "lucide:list-collapse",
		description: "Expand and collapse related sections of content."
	},
	{
		name: "Carousel",
		href: "/docs/ui/navigation/carousel",
		icon: "lucide:gallery-horizontal",
		description: "Browse items with slides, navigation, and pager controls."
	},
	{
		name: "Link",
		href: "/docs/ui/navigation/link",
		icon: "lucide:link",
		description: "Navigate with themed links and optional router integration."
	},
	{
		name: "Pagination",
		href: "/docs/ui/navigation/pagination",
		icon: "lucide:ellipsis",
		description: "Navigate between pages of a larger collection."
	},
	{
		name: "Tabs",
		href: "/docs/ui/navigation/tabs",
		icon: "lucide:panels-top-left",
		description: "Switch between related views using a tab list."
	},
	{
		name: "Tree View",
		href: "/docs/ui/navigation/tree-view",
		icon: "lucide:folder-tree",
		description: "Browse and select items in a hierarchical tree."
	},
	{
		name: "Backdrop",
		href: "/docs/ui/overlays/backdrop",
		icon: "lucide:blend",
		description: "Dim the surrounding view behind focused content."
	},
	{
		name: "Command",
		href: "/docs/ui/overlays/command",
		icon: "lucide:command",
		description: "Find actions through a searchable command list or dialog."
	},
	{
		name: "Context Menu",
		href: "/docs/ui/overlays/context-menu",
		icon: "lucide:mouse-pointer-2",
		description: "Offer contextual actions through a right-click menu."
	},
	{
		name: "Dialog",
		href: "/docs/ui/overlays/dialog",
		icon: "lucide:app-window",
		description: "Present focused modal content with dismissal controls."
	},
	{
		name: "Drawer",
		href: "/docs/ui/overlays/drawer",
		icon: "lucide:panel-right-open",
		description: "Reveal supporting content in a sliding side panel."
	},
	{
		name: "Dropdown Menu",
		href: "/docs/ui/overlays/dropdown-menu",
		icon: "lucide:list",
		description: "Offer grouped actions and choices in an anchored menu."
	},
	{
		name: "Notification",
		href: "/docs/ui/overlays/notification",
		icon: "lucide:bell",
		description: "Deliver transient feedback with a provider and viewport."
	},
	{
		name: "Popout",
		href: "/docs/ui/overlays/popout",
		icon: "lucide:external-link",
		description: "Attach a contextual panel to a trigger."
	},
	{
		name: "Popover",
		href: "/docs/ui/overlays/popover",
		icon: "lucide:message-square",
		description: "Show interactive content in an anchored floating panel."
	},
	{
		name: "Portal",
		href: "/docs/ui/overlays/portal",
		icon: "lucide:move-up-right",
		description: "Render content outside its parent into a portal target."
	},
	{
		name: "Tooltip",
		href: "/docs/ui/overlays/tooltip",
		icon: "lucide:message-circle",
		description: "Add a short explanation on hover or keyboard focus."
	},
	{
		name: "Heading",
		href: "/docs/ui/typography/heading",
		icon: "lucide:heading",
		description: "Apply heading styles independently of semantic level."
	},
	{
		name: "Text",
		href: "/docs/ui/typography/text",
		icon: "lucide:type",
		description: "Style body copy and supporting text with theme typography."
	},
	{
		name: "Preview",
		href: "/docs/ui/utilities/preview",
		icon: "lucide:eye",
		description: "Present runnable component examples alongside their code."
	},
	{
		name: "Scroll Lock",
		href: "/docs/ui/utilities/scroll-lock",
		icon: "lucide:lock",
		description: "Prevent background scrolling while an overlay is active."
	},
	{
		name: "Transition",
		href: "/docs/ui/utilities/transition",
		icon: "lucide:repeat",
		description: "Animate mounting and unmounting with transition templates."
	}
];
var features = [
	{
		number: "01",
		title: "Designed to compose",
		description: "Build interfaces from small, predictable building blocks. Compose complex experiences without fighting the framework."
	},
	{
		number: "02",
		title: "Accessibility first",
		description: "Keyboard navigation, focus management, semantic markup and screen reader support are part of the foundation."
	},
	{
		number: "03",
		title: "Developer experience",
		description: "TypeScript-first APIs, predictable behavior and a consistent design system make development enjoyable."
	}
];
var codeExample = `import { Button, Card } from "@puzzle/ui";

export function Welcome() {
  return (
    <Card>
      <h2>Welcome to Puzzle</h2>
      <p>Build something wonderful.</p>
      <Button variant="primary">
        Get started
      </Button>
    </Card>
  );
}`;
var ArrowIcon = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
	viewBox: "0 0 24 24",
	width: "18",
	height: "18",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: "1.8",
	strokeLinecap: "round",
	strokeLinejoin: "round",
	"aria-hidden": "true",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M5 12h14M13 6l6 6-6 6" })
});
var CodeIcon = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
	viewBox: "0 0 24 24",
	width: "18",
	height: "18",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: "1.8",
	strokeLinecap: "round",
	strokeLinejoin: "round",
	"aria-hidden": "true",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m8 17-5-5 5-5M16 7l5 5-5 5M14 4l-4 16" })
});
var ComponentPreview = ({ onToggleTheme }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "home-preview",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "home-preview__topbar",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "home-preview__dots",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "puzzle / playground" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				color: "secondary",
				content: "Interactive"
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "home-preview__content",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, {
				direction: "col",
				alignH: "start",
				gap: "sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					color: "secondary",
					content: "Component showcase"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, {
					direction: "col",
					alignH: "start",
					gap: "0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading, {
						level: "headline3",
						children: "Everything in its place."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, { children: "A glimpse into what you can build." })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "home-preview__card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "home-preview__section-heading",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Buttons" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						color: "secondary",
						content: "Button"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, {
					direction: "row",
					alignV: "center",
					gap: "sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "primary",
							children: "Get started"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "secondary",
							children: "Explore"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							children: "Documentation"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "home-preview__columns",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "home-preview__card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "home-preview__section-heading",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Preferences" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								color: "secondary",
								content: "Switch"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "home-preview__control",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Dark mode" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Use dark appearance" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								defaultChecked: true,
								onChange: onToggleTheme
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "home-preview__control",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Notifications" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Receive updates" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "home-preview__card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "home-preview__section-heading",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tasks" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							color: "secondary",
							content: "Checkbox"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "home-preview__tasks",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
								defaultChecked: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Build components" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
								defaultChecked: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Write documentation" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
								defaultChecked: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ship your product" })
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "home-preview__card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "home-preview__section-heading",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Project settings" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							color: "secondary",
							content: "Input"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "home-preview__input-label",
						children: "Project name"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						placeholder: "My awesome project",
						defaultValue: "Puzzle UI"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "home-preview__footer",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "home-preview__status" }), "All components ready"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Built with Puzzle" })]
			})
		]
	})]
});
var PuzzleLogo = ({ size = 36 }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
	src: "/favicon.svg",
	width: size,
	height: size,
	alt: "Logo",
	className: "h-12 w-12"
});
var Home = () => {
	const [theme, setTheme] = (0, import_react.useState)("dark");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Theme, {
		theme,
		scope: "root",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageLayout.Header, {
			className: "puzzle-site-header",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PageLayout.Main, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionStack, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "home-hero__background" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, {
				direction: {
					mobile: "col",
					desktop: "row"
				},
				alignV: "center",
				alignH: {
					mobile: "center",
					desktop: "evenly"
				},
				gap: "xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, {
					className: "home-hero__content",
					direction: "col",
					alignV: "center",
					alignH: "center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, {
							direction: "col",
							alignV: "center",
							alignH: "start",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Heading, {
								level: "headline1",
								as: "h1",
								children: [
									"Interfaces,",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "beautifully" }),
									" composed."
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								className: "home-hero__description",
								children: "A thoughtfully crafted React UI framework for developers who care about the details. Build accessible, consistent and beautiful interfaces without getting in your way."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, {
							className: "home-hero__actions",
							direction: "row",
							alignV: "center",
							wrap: "wrap",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "primary",
								onClick: () => {
									window.location.href = "/docs/getting-started";
								},
								children: ["Start building ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowIcon, {})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								onClick: () => {
									window.location.href = "/docs/ui";
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeIcon, {}), " Explore components"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, {
							className: "home-hero__meta",
							direction: "row",
							alignV: "center",
							wrap: "wrap",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "home-hero__check",
									children: "✓"
								}), "TypeScript first"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "home-hero__check",
									children: "✓"
								}), "Accessibility focused"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "home-hero__check",
									children: "✓"
								}), "Open source"] })
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "home-hero__visual",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "home-hero__visual-glow" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ComponentPreview, { onToggleTheme: () => setTheme(theme === "dark" ? "light" : "dark") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "home-hero__floating home-hero__floating--top",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "home-floating-icon",
								children: "✳"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Thoughtful by design" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Every detail matters." })] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "home-hero__floating home-hero__floating--bottom",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "home-floating-check",
								children: "✓"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Accessible by default" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Built for everyone." })] })]
						})
					]
				})]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				theme: "dark",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, {
					direction: {
						mobile: "col",
						tablet: "row"
					},
					alignV: "center",
					alignH: "center",
					wrap: "wrap",
					gap: "md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ONE DESIGN SYSTEM" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "home-strip__line" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ENDLESS POSSIBILITIES" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "home-strip__line" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "BUILT FOR REACT" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "home-strip__line" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "BUILT FOR NEXT.JS" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "home-strip__line" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "BUILT FOR TANSTACK START" })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				id: "features",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, {
					direction: "col",
					alignV: "center",
					alignH: "center",
					gap: "xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, {
						direction: "col",
						alignV: "center",
						alignH: "start",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								color: "secondary",
								content: "Why Puzzle"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Heading, {
								level: "headline1",
								as: "h2",
								children: [
									"Less boilerplate.",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "More building." })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								className: "home-hero__description",
								children: "The foundations of a great interface, thoughtfully implemented so you can focus on creating great products."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stack, {
						direction: {
							mobile: "col",
							tablet: "row"
						},
						wrap: "nowrap",
						gap: "md",
						children: features.map((feature) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "home-feature-card__icon",
								children: feature.number === "01" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon$1, {
									name: "hugeicons:infinity-circle",
									size: 32
								}) : feature.number === "02" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon$1, {
									name: "hugeicons:universal-access-circle",
									size: 32
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon$1, {
									name: "griddy-icons:code-circle",
									size: 32
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: feature.title }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: feature.description }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "home-feature-card__arrow",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowIcon, {})
							})
						] }, feature.number))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				theme: "dark",
				id: "components",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, {
					direction: "col",
					alignV: "center",
					alignH: {
						mobile: "center",
						desktop: "center"
					},
					gap: "xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Stack, {
						direction: "col",
						alignV: "center",
						alignH: "start",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								color: "secondary",
								content: "The building blocks"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Heading, {
								level: "headline1",
								as: "h2",
								children: [
									"Everything you need.",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Nothing you don't." })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Text, {
								className: "home-hero__description",
								children: "A growing collection of carefully designed components. Each one built to work together as part of a consistent design system."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								href: "/docs/ui",
								className: "home-text-link",
								children: ["Explore all components ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowIcon, {})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "home-component-grid",
						children: components.map((component) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							as: "a",
							interactive: true,
							className: "home-component-card",
							href: component.href,
							"aria-labelledby": `component-${component.href.split("/").at(-1)}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "home-component-card__icon",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon$1, {
									name: component.icon,
									"aria-hidden": "true"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								id: `component-${component.href.split("/").at(-1)}`,
								children: component.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: component.description })] })]
						}, component.href))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				className: "home-developer",
				id: "developers",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "home-developer__content",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							color: "secondary",
							content: "Made for developers"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: [
							"Your ideas.",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Without the friction." })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Predictable APIs, powerful composition and a consistent design language. Puzzle gives you the building blocks to turn ideas into polished experiences." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "home-developer__benefits",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "01" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "TypeScript-first" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Excellent types and a predictable developer experience." })
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "02" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Flexible by design" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Customize and compose components to fit your product." })
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "03" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Accessibility matters" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Thoughtful interaction patterns and semantic foundations." })
								] })
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "home-code",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "home-code__header",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "home-preview__dots",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Welcome.tsx" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									color: "secondary",
									content: "TSX"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: codeExample }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "home-code__footer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Simple. Composable. Predictable." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "⌘ + C" })]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				className: "home-cta",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "home-cta__logo",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PuzzleLogo, { size: 54 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						color: "secondary",
						content: "Your next project starts here"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", { children: [
						"Make something",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "remarkable." })
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Start building with Puzzle. Explore the components, create your design system and bring your ideas to life." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "primary",
						onClick: () => {
							window.location.href = "/getting-started";
						},
						children: ["Get started with Puzzle ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowIcon, {})]
					})
				]
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
			className: "home-footer",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					className: "home-brand",
					href: "/",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PuzzleLogo, { size: 28 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "puzzle-ui" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Made for developers who care about the details." }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						href: "/docs/getting-started",
						children: "Documentation"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						href: "https://github.com/senorprogramador/puzzle",
						target: "_blank",
						rel: "noreferrer",
						children: "GitHub"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" Puzzle UI"
					] })
				] })
			]
		})] })] })
	});
};
export { Home as component };
