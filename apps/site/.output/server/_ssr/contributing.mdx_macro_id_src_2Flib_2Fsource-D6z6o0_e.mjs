import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/contributing.mdx_macro_id_src_2Flib_2Fsource-D6z6o0_e.js
var import_jsx_runtime = require_jsx_runtime();
var frontmatter = {
	"title": "Contributing",
	"description": "Set up the Puzzle repository, understand its structure, and contribute changes consistently."
};
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "Puzzle is developed as a Bun workspace monorepo. Contributions should be focused, tested, accessible, and consistent with the existing component and package conventions."
		},
		{
			"heading": void 0,
			"content": "Puzzle is not production-ready. Public APIs and package boundaries may change while the project evolves."
		},
		{
			"heading": "prerequisites",
			"content": "Git."
		},
		{
			"heading": "prerequisites",
			"content": "Bun 1.4.4 or a compatible newer version."
		},
		{
			"heading": "prerequisites",
			"content": "Node.js 20.19 or later for the project generator and related tooling."
		},
		{
			"heading": "prerequisites",
			"content": "Docker with Compose for MongoDB integration tests."
		},
		{
			"heading": "repository-structure",
			"content": "| Path      | Responsibility        |\n| --------- | --------------------- |\n| apps/site | Documentation website |",
			"table": "table-0"
		},
		{
			"heading": "repository-structure",
			"content": "| Path            | Responsibility                     |\n| --------------- | ---------------------------------- |\n| apps/playground | Storybook and component playground |",
			"table": "table-0"
		},
		{
			"heading": "repository-structure",
			"content": "| Path          | Responsibility                  |\n| ------------- | ------------------------------- |\n| packages/core | Framework-independent utilities |",
			"table": "table-0"
		},
		{
			"heading": "repository-structure",
			"content": "| Path           | Responsibility       |\n| -------------- | -------------------- |\n| packages/hooks | Reusable React hooks |",
			"table": "table-0"
		},
		{
			"heading": "repository-structure",
			"content": "| Path           | Responsibility                |\n| -------------- | ----------------------------- |\n| packages/icons | Icon components and utilities |",
			"table": "table-0"
		},
		{
			"heading": "repository-structure",
			"content": "| Path           | Responsibility                   |\n| -------------- | -------------------------------- |\n| packages/theme | Theme provider and design tokens |",
			"table": "table-0"
		},
		{
			"heading": "repository-structure",
			"content": "| Path        | Responsibility         |\n| ----------- | ---------------------- |\n| packages/ui | Reusable UI components |",
			"table": "table-0"
		},
		{
			"heading": "repository-structure",
			"content": "| Path            | Responsibility                                  |\n| --------------- | ----------------------------------------------- |\n| packages/pieces | Composed UI sections and larger building blocks |",
			"table": "table-0"
		},
		{
			"heading": "repository-structure",
			"content": "| Path            | Responsibility                |\n| --------------- | ----------------------------- |\n| packages/create | Interactive project generator |",
			"table": "table-0"
		},
		{
			"heading": "repository-structure",
			"content": "| Path          | Responsibility                            |\n| ------------- | ----------------------------------------- |\n| packages/auth | Framework-independent authentication core |",
			"table": "table-0"
		},
		{
			"heading": "repository-structure",
			"content": "| Path             | Responsibility     |\n| ---------------- | ------------------ |\n| packages/session | Session management |",
			"table": "table-0"
		},
		{
			"heading": "repository-structure",
			"content": "| Path             | Responsibility    |\n| ---------------- | ----------------- |\n| packages/storage | Storage contracts |",
			"table": "table-0"
		},
		{
			"heading": "repository-structure",
			"content": "| Path                | Responsibility                |\n| ------------------- | ----------------------------- |\n| packages/storage-d1 | Cloudflare D1 storage adapter |",
			"table": "table-0"
		},
		{
			"heading": "repository-structure",
			"content": "| Path                     | Responsibility          |\n| ------------------------ | ----------------------- |\n| packages/storage-mongodb | MongoDB storage adapter |",
			"table": "table-0"
		},
		{
			"heading": "repository-structure",
			"content": "| Path               | Responsibility                                            |\n| ------------------ | --------------------------------------------------------- |\n| packages/fullstack | Authentication client, server, and framework integrations |",
			"table": "table-0"
		},
		{
			"heading": "start-developing",
			"content": "Start the documentation site:"
		},
		{
			"heading": "start-developing",
			"content": "Start the component playground:"
		},
		{
			"heading": "start-developing",
			"content": "Start Storybook:"
		},
		{
			"heading": "project-conventions",
			"content": "Before changing a package, inspect its existing implementation and the closest related example. Prefer established patterns over introducing new abstractions."
		},
		{
			"heading": "components",
			"content": "Use functional React components and arrow functions."
		},
		{
			"heading": "components",
			"content": "Use named exports."
		},
		{
			"heading": "components",
			"content": "Keep components generic and router-independent."
		},
		{
			"heading": "components",
			"content": "Prefer semantic HTML and native browser behavior."
		},
		{
			"heading": "components",
			"content": "Keep public APIs small and composable."
		},
		{
			"heading": "components",
			"content": "Preserve existing behavior unless a breaking change is intentional."
		},
		{
			"heading": "styling-and-themes",
			"content": "Use existing --puzzle-\\* CSS variables."
		},
		{
			"heading": "styling-and-themes",
			"content": "Prefer semantic theme tokens over hardcoded values."
		},
		{
			"heading": "styling-and-themes",
			"content": "Keep component styles scoped to the component."
		},
		{
			"heading": "styling-and-themes",
			"content": "Respect light and dark themes."
		},
		{
			"heading": "styling-and-themes",
			"content": "Respect reduced-motion preferences."
		},
		{
			"heading": "styling-and-themes",
			"content": "Avoid adding dependencies for small styling or interaction requirements."
		},
		{
			"heading": "accessibility",
			"content": "Interactive components should cover:"
		},
		{
			"heading": "accessibility",
			"content": "Keyboard navigation."
		},
		{
			"heading": "accessibility",
			"content": "Focus management and visible focus."
		},
		{
			"heading": "accessibility",
			"content": "Screen-reader support."
		},
		{
			"heading": "accessibility",
			"content": "Correct ARIA roles and relationships."
		},
		{
			"heading": "accessibility",
			"content": "Touch and pointer interactions."
		},
		{
			"heading": "accessibility",
			"content": "High-contrast environments."
		},
		{
			"heading": "accessibility",
			"content": "Reduced-motion preferences."
		},
		{
			"heading": "accessibility",
			"content": "Use native HTML semantics where possible. Do not add ARIA attributes that duplicate native browser behavior."
		},
		{
			"heading": "tests",
			"content": "Add tests for meaningful behavior and regressions. Follow the test organization used by the package."
		},
		{
			"heading": "tests",
			"content": "Use unit tests for isolated logic, component tests for rendered behavior, and browser tests for interactions that depend on a real browser."
		},
		{
			"heading": "tests",
			"content": "See Testing for the available commands."
		},
		{
			"heading": "documentation",
			"content": "The documentation site lives in apps/site."
		},
		{
			"heading": "documentation",
			"content": "UI component pages are organized by category under:"
		},
		{
			"heading": "documentation",
			"content": "Theme documentation lives under:"
		},
		{
			"heading": "documentation",
			"content": "Developer guides live under:"
		},
		{
			"heading": "documentation",
			"content": "When adding a documentation page:"
		},
		{
			"heading": "documentation",
			"content": "Add the MDX page in the appropriate category."
		},
		{
			"heading": "documentation",
			"content": "Include a title and description in its frontmatter."
		},
		{
			"heading": "documentation",
			"content": "Include installation or import instructions where relevant."
		},
		{
			"heading": "documentation",
			"content": "Document the public API and important behavior."
		},
		{
			"heading": "documentation",
			"content": "Include practical examples."
		},
		{
			"heading": "documentation",
			"content": "Explain accessibility behavior where relevant."
		},
		{
			"heading": "documentation",
			"content": "Add the page to the corresponding sidebar configuration."
		},
		{
			"heading": "documentation",
			"content": "Verify that all documented imports exist."
		},
		{
			"heading": "documentation",
			"content": "Use the existing Fumadocs and Puzzle documentation components. Stateful examples should be reusable components rather than duplicated inline implementations."
		},
		{
			"heading": "validate-your-changes",
			"content": "Run the narrowest relevant checks first."
		},
		{
			"heading": "validate-your-changes",
			"content": "For a full repository validation:"
		},
		{
			"heading": "validate-your-changes",
			"content": "For documentation changes:"
		},
		{
			"heading": "validate-your-changes",
			"content": "See Testing for package-specific test commands and requirements."
		},
		{
			"heading": "pull-requests",
			"content": "Keep pull requests focused and explain:"
		},
		{
			"heading": "pull-requests",
			"content": "What changed."
		},
		{
			"heading": "pull-requests",
			"content": "Why the change is needed."
		},
		{
			"heading": "pull-requests",
			"content": "Which packages or public APIs are affected."
		},
		{
			"heading": "pull-requests",
			"content": "Which tests and checks were run."
		},
		{
			"heading": "pull-requests",
			"content": "Any known limitations or follow-up work."
		},
		{
			"heading": "pull-requests",
			"content": "Include screenshots or short recordings when a visual or interaction change is difficult to understand from code alone."
		}
	],
	"headings": [
		{
			"id": "prerequisites",
			"content": "Prerequisites"
		},
		{
			"id": "clone-the-repository",
			"content": "Clone the repository"
		},
		{
			"id": "repository-structure",
			"content": "Repository structure"
		},
		{
			"id": "start-developing",
			"content": "Start developing"
		},
		{
			"id": "project-conventions",
			"content": "Project conventions"
		},
		{
			"id": "components",
			"content": "Components"
		},
		{
			"id": "styling-and-themes",
			"content": "Styling and themes"
		},
		{
			"id": "accessibility",
			"content": "Accessibility"
		},
		{
			"id": "tests",
			"content": "Tests"
		},
		{
			"id": "documentation",
			"content": "Documentation"
		},
		{
			"id": "validate-your-changes",
			"content": "Validate your changes"
		},
		{
			"id": "pull-requests",
			"content": "Pull requests"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#prerequisites",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Prerequisites" })
	},
	{
		depth: 2,
		url: "#clone-the-repository",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Clone the repository" })
	},
	{
		depth: 2,
		url: "#repository-structure",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Repository structure" })
	},
	{
		depth: 2,
		url: "#start-developing",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Start developing" })
	},
	{
		depth: 2,
		url: "#project-conventions",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Project conventions" })
	},
	{
		depth: 3,
		url: "#components",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Components" })
	},
	{
		depth: 3,
		url: "#styling-and-themes",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Styling and themes" })
	},
	{
		depth: 3,
		url: "#accessibility",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Accessibility" })
	},
	{
		depth: 3,
		url: "#tests",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Tests" })
	},
	{
		depth: 2,
		url: "#documentation",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Documentation" })
	},
	{
		depth: 2,
		url: "#validate-your-changes",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Validate your changes" })
	},
	{
		depth: 2,
		url: "#pull-requests",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Pull requests" })
	}
];
function _createMdxContent(props) {
	const _components = {
		a: "a",
		code: "code",
		h2: "h2",
		h3: "h3",
		li: "li",
		ol: "ol",
		p: "p",
		pre: "pre",
		span: "span",
		table: "table",
		tbody: "tbody",
		td: "td",
		th: "th",
		thead: "thead",
		tr: "tr",
		ul: "ul",
		...props.components
	};
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Puzzle is developed as a Bun workspace monorepo. Contributions should be focused, tested, accessible, and consistent with the existing component and package conventions." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Puzzle is not production-ready. Public APIs and package boundaries may change while the project evolves." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "prerequisites",
			children: "Prerequisites"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Git." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Bun 1.4.4 or a compatible newer version." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Node.js 20.19 or later for the project generator and related tooling." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Docker with Compose for MongoDB integration tests." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "clone-the-repository",
			children: "Clone the repository"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: (0, import_jsx_runtime.jsx)(_components.pre, {
			className: "shiki shiki-themes github-light github-dark",
			style: {
				"--shiki-light": "#24292e",
				"--shiki-dark": "#e1e4e8",
				"--shiki-light-bg": "#fff",
				"--shiki-dark-bg": "#24292e"
			},
			tabIndex: "0",
			icon: "<svg viewBox=\"0 0 24 24\"><path d=\"m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z\" fill=\"currentColor\" /></svg>",
			children: (0, import_jsx_runtime.jsxs)(_components.code, { children: [
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: "git"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " clone"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " https://github.com/senorprogramador/puzzle.git"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#005CC5",
							"--shiki-dark": "#79B8FF"
						},
						children: "cd"
					}), (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: " puzzle"
					})]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#6F42C1",
							"--shiki-dark": "#B392F0"
						},
						children: "bun"
					}), (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: " install"
					})]
				})
			] })
		}) }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "repository-structure",
			children: "Repository structure"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.th, { children: "Path" }), (0, import_jsx_runtime.jsx)(_components.th, { children: "Responsibility" })] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: "apps/site" }), (0, import_jsx_runtime.jsx)(_components.td, { children: "Documentation website" })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: "apps/playground" }), (0, import_jsx_runtime.jsx)(_components.td, { children: "Storybook and component playground" })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: "packages/core" }), (0, import_jsx_runtime.jsx)(_components.td, { children: "Framework-independent utilities" })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: "packages/hooks" }), (0, import_jsx_runtime.jsx)(_components.td, { children: "Reusable React hooks" })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: "packages/icons" }), (0, import_jsx_runtime.jsx)(_components.td, { children: "Icon components and utilities" })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: "packages/theme" }), (0, import_jsx_runtime.jsx)(_components.td, { children: "Theme provider and design tokens" })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: "packages/ui" }), (0, import_jsx_runtime.jsx)(_components.td, { children: "Reusable UI components" })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: "packages/pieces" }), (0, import_jsx_runtime.jsx)(_components.td, { children: "Composed UI sections and larger building blocks" })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: "packages/create" }), (0, import_jsx_runtime.jsx)(_components.td, { children: "Interactive project generator" })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: "packages/auth" }), (0, import_jsx_runtime.jsx)(_components.td, { children: "Framework-independent authentication core" })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: "packages/session" }), (0, import_jsx_runtime.jsx)(_components.td, { children: "Session management" })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: "packages/storage" }), (0, import_jsx_runtime.jsx)(_components.td, { children: "Storage contracts" })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: "packages/storage-d1" }), (0, import_jsx_runtime.jsx)(_components.td, { children: "Cloudflare D1 storage adapter" })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: "packages/storage-mongodb" }), (0, import_jsx_runtime.jsx)(_components.td, { children: "MongoDB storage adapter" })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: "packages/fullstack" }), (0, import_jsx_runtime.jsx)(_components.td, { children: "Authentication client, server, and framework integrations" })] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "start-developing",
			children: "Start developing"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Start the documentation site:" }),
		"\n",
		(0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: (0, import_jsx_runtime.jsx)(_components.pre, {
			className: "shiki shiki-themes github-light github-dark",
			style: {
				"--shiki-light": "#24292e",
				"--shiki-dark": "#e1e4e8",
				"--shiki-light-bg": "#fff",
				"--shiki-dark-bg": "#24292e"
			},
			tabIndex: "0",
			icon: "<svg viewBox=\"0 0 24 24\"><path d=\"m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z\" fill=\"currentColor\" /></svg>",
			children: (0, import_jsx_runtime.jsx)(_components.code, { children: (0, import_jsx_runtime.jsxs)(_components.span, {
				className: "line",
				children: [
					(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#6F42C1",
							"--shiki-dark": "#B392F0"
						},
						children: "bun"
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: " run"
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: " site"
					})
				]
			}) })
		}) }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Start the component playground:" }),
		"\n",
		(0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: (0, import_jsx_runtime.jsx)(_components.pre, {
			className: "shiki shiki-themes github-light github-dark",
			style: {
				"--shiki-light": "#24292e",
				"--shiki-dark": "#e1e4e8",
				"--shiki-light-bg": "#fff",
				"--shiki-dark-bg": "#24292e"
			},
			tabIndex: "0",
			icon: "<svg viewBox=\"0 0 24 24\"><path d=\"m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z\" fill=\"currentColor\" /></svg>",
			children: (0, import_jsx_runtime.jsx)(_components.code, { children: (0, import_jsx_runtime.jsxs)(_components.span, {
				className: "line",
				children: [
					(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#6F42C1",
							"--shiki-dark": "#B392F0"
						},
						children: "bun"
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: " run"
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: " dev"
					})
				]
			}) })
		}) }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Start Storybook:" }),
		"\n",
		(0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: (0, import_jsx_runtime.jsx)(_components.pre, {
			className: "shiki shiki-themes github-light github-dark",
			style: {
				"--shiki-light": "#24292e",
				"--shiki-dark": "#e1e4e8",
				"--shiki-light-bg": "#fff",
				"--shiki-dark-bg": "#24292e"
			},
			tabIndex: "0",
			icon: "<svg viewBox=\"0 0 24 24\"><path d=\"m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z\" fill=\"currentColor\" /></svg>",
			children: (0, import_jsx_runtime.jsx)(_components.code, { children: (0, import_jsx_runtime.jsxs)(_components.span, {
				className: "line",
				children: [
					(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#6F42C1",
							"--shiki-dark": "#B392F0"
						},
						children: "bun"
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: " run"
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: " storybook"
					})
				]
			}) })
		}) }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "project-conventions",
			children: "Project conventions"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Before changing a package, inspect its existing implementation and the closest related example. Prefer established patterns over introducing new abstractions." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "components",
			children: "Components"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Use functional React components and arrow functions." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Use named exports." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Keep components generic and router-independent." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Prefer semantic HTML and native browser behavior." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Keep public APIs small and composable." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Preserve existing behavior unless a breaking change is intentional." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "styling-and-themes",
			children: "Styling and themes"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				"Use existing ",
				(0, import_jsx_runtime.jsx)("code", { children: "--puzzle-*" }),
				" CSS variables."
			] }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Prefer semantic theme tokens over hardcoded values." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Keep component styles scoped to the component." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Respect light and dark themes." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Respect reduced-motion preferences." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Avoid adding dependencies for small styling or interaction requirements." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "accessibility",
			children: "Accessibility"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Interactive components should cover:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Keyboard navigation." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Focus management and visible focus." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Screen-reader support." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Correct ARIA roles and relationships." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Touch and pointer interactions." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "High-contrast environments." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Reduced-motion preferences." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Use native HTML semantics where possible. Do not add ARIA attributes that duplicate native browser behavior." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "tests",
			children: "Tests"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Add tests for meaningful behavior and regressions. Follow the test organization used by the package." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Use unit tests for isolated logic, component tests for rendered behavior, and browser tests for interactions that depend on a real browser." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"See ",
			(0, import_jsx_runtime.jsx)(_components.a, {
				href: "/docs/developer/testing",
				children: "Testing"
			}),
			" for the available commands."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "documentation",
			children: "Documentation"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The documentation site lives in ",
			(0, import_jsx_runtime.jsx)("code", { children: "apps/site" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "UI component pages are organized by category under:" }),
		"\n",
		(0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: (0, import_jsx_runtime.jsx)(_components.pre, {
			className: "shiki shiki-themes github-light github-dark",
			style: {
				"--shiki-light": "#24292e",
				"--shiki-dark": "#e1e4e8",
				"--shiki-light-bg": "#fff",
				"--shiki-dark-bg": "#24292e"
			},
			tabIndex: "0",
			icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z\" fill=\"currentColor\" /></svg>",
			children: (0, import_jsx_runtime.jsx)(_components.code, { children: (0, import_jsx_runtime.jsx)(_components.span, {
				className: "line",
				children: (0, import_jsx_runtime.jsx)(_components.span, { children: "apps/site/content/docs/ui/" })
			}) })
		}) }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Theme documentation lives under:" }),
		"\n",
		(0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: (0, import_jsx_runtime.jsx)(_components.pre, {
			className: "shiki shiki-themes github-light github-dark",
			style: {
				"--shiki-light": "#24292e",
				"--shiki-dark": "#e1e4e8",
				"--shiki-light-bg": "#fff",
				"--shiki-dark-bg": "#24292e"
			},
			tabIndex: "0",
			icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z\" fill=\"currentColor\" /></svg>",
			children: (0, import_jsx_runtime.jsx)(_components.code, { children: (0, import_jsx_runtime.jsx)(_components.span, {
				className: "line",
				children: (0, import_jsx_runtime.jsx)(_components.span, { children: "apps/site/content/docs/theme/" })
			}) })
		}) }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Developer guides live under:" }),
		"\n",
		(0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: (0, import_jsx_runtime.jsx)(_components.pre, {
			className: "shiki shiki-themes github-light github-dark",
			style: {
				"--shiki-light": "#24292e",
				"--shiki-dark": "#e1e4e8",
				"--shiki-light-bg": "#fff",
				"--shiki-dark-bg": "#24292e"
			},
			tabIndex: "0",
			icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M 6,1 C 4.354992,1 3,2.354992 3,4 v 16 c 0,1.645008 1.354992,3 3,3 h 12 c 1.645008,0 3,-1.354992 3,-3 V 8 7 A 1.0001,1.0001 0 0 0 20.707031,6.2929687 l -5,-5 A 1.0001,1.0001 0 0 0 15,1 h -1 z m 0,2 h 7 v 3 c 0,1.645008 1.354992,3 3,3 h 3 v 11 c 0,0.564129 -0.435871,1 -1,1 H 6 C 5.4358712,21 5,20.564129 5,20 V 4 C 5,3.4358712 5.4358712,3 6,3 Z M 15,3.4140625 18.585937,7 H 16 C 15.435871,7 15,6.5641288 15,6 Z\" fill=\"currentColor\" /></svg>",
			children: (0, import_jsx_runtime.jsx)(_components.code, { children: (0, import_jsx_runtime.jsx)(_components.span, {
				className: "line",
				children: (0, import_jsx_runtime.jsx)(_components.span, { children: "apps/site/content/docs/developer/" })
			}) })
		}) }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "When adding a documentation page:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ol, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Add the MDX page in the appropriate category." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Include a title and description in its frontmatter." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Include installation or import instructions where relevant." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Document the public API and important behavior." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Include practical examples." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Explain accessibility behavior where relevant." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Add the page to the corresponding sidebar configuration." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Verify that all documented imports exist." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Use the existing Fumadocs and Puzzle documentation components. Stateful examples should be reusable components rather than duplicated inline implementations." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "validate-your-changes",
			children: "Validate your changes"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Run the narrowest relevant checks first." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "For a full repository validation:" }),
		"\n",
		(0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: (0, import_jsx_runtime.jsx)(_components.pre, {
			className: "shiki shiki-themes github-light github-dark",
			style: {
				"--shiki-light": "#24292e",
				"--shiki-dark": "#e1e4e8",
				"--shiki-light-bg": "#fff",
				"--shiki-dark-bg": "#24292e"
			},
			tabIndex: "0",
			icon: "<svg viewBox=\"0 0 24 24\"><path d=\"m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z\" fill=\"currentColor\" /></svg>",
			children: (0, import_jsx_runtime.jsxs)(_components.code, { children: [
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: "bun"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " run"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " typecheck"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: "bun"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " run"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " build"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: "bun"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " run"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " vitest"
						})
					]
				})
			] })
		}) }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "For documentation changes:" }),
		"\n",
		(0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: (0, import_jsx_runtime.jsx)(_components.pre, {
			className: "shiki shiki-themes github-light github-dark",
			style: {
				"--shiki-light": "#24292e",
				"--shiki-dark": "#e1e4e8",
				"--shiki-light-bg": "#fff",
				"--shiki-dark-bg": "#24292e"
			},
			tabIndex: "0",
			icon: "<svg viewBox=\"0 0 24 24\"><path d=\"m 4,4 a 1,1 0 0 0 -0.7070312,0.2929687 1,1 0 0 0 0,1.4140625 L 8.5859375,11 3.2929688,16.292969 a 1,1 0 0 0 0,1.414062 1,1 0 0 0 1.4140624,0 l 5.9999998,-6 a 1.0001,1.0001 0 0 0 0,-1.414062 L 4.7070312,4.2929687 A 1,1 0 0 0 4,4 Z m 8,14 a 1,1 0 0 0 -1,1 1,1 0 0 0 1,1 h 8 a 1,1 0 0 0 1,-1 1,1 0 0 0 -1,-1 z\" fill=\"currentColor\" /></svg>",
			children: (0, import_jsx_runtime.jsxs)(_components.code, { children: [
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: "bun"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " run"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: " --filter"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " \"@puzzle-ui/site\""
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " typecheck"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: "bun"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " run"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: " --filter"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " \"@puzzle-ui/site\""
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " build"
						})
					]
				})
			] })
		}) }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"See ",
			(0, import_jsx_runtime.jsx)(_components.a, {
				href: "/docs/developer/testing",
				children: "Testing"
			}),
			" for package-specific test commands and requirements."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "pull-requests",
			children: "Pull requests"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Keep pull requests focused and explain:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "What changed." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Why the change is needed." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Which packages or public APIs are affected." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Which tests and checks were run." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Any known limitations or follow-up work." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Include screenshots or short recordings when a visual or interaction change is difficult to understand from code alone." })
	] });
}
function MDXContent(props = {}) {
	const { wrapper: MDXLayout } = props.components || {};
	return MDXLayout ? (0, import_jsx_runtime.jsx)(MDXLayout, {
		...props,
		children: (0, import_jsx_runtime.jsx)(_createMdxContent, { ...props })
	}) : _createMdxContent(props);
}
export { MDXContent as default, frontmatter, structuredData, toc };
