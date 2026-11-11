import { require_jsx_runtime } from "../_libs/react2.mjs";
// node_modules/.nitro/vite/services/ssr/assets/create-project.mdx_macro_id_src_2Flib_2Fsource-CLgkKxym.js
var import_jsx_runtime = require_jsx_runtime();
var frontmatter = {
	"title": "Create a Project",
	"description": "Scaffold a React application with Puzzle UI, Theme, optional Tailwind CSS, and optional Puzzle Auth."
};
var structuredData = {
	"contents": [
		{
			"heading": void 0,
			"content": "The @puzzle-ui/create package creates a new React application with Puzzle UI installed and configured."
		},
		{
			"heading": void 0,
			"content": "It supports Next.js, TanStack Start, and a basic React + Vite application."
		},
		{
			"heading": "requirements",
			"content": "Node.js 20.19 or later."
		},
		{
			"heading": "requirements",
			"content": "npm, Bun, pnpm, or Yarn."
		},
		{
			"heading": "requirements",
			"content": "An internet connection to download framework templates and dependencies."
		},
		{
			"heading": "yarn",
			"content": "Yarn's dlx command requires Yarn 2 or later. With Yarn Classic, use the npm command."
		},
		{
			"heading": "interactive-setup",
			"content": "The generator asks for four options."
		},
		{
			"heading": "project-name",
			"content": "Enter a project name. The generator converts it to kebab-case and uses it for the target directory and package name."
		},
		{
			"heading": "framework",
			"content": "| Framework | Generated application              |\n| --------- | ---------------------------------- |\n| Next.js   | Next.js App Router with TypeScript |",
			"table": "table-0"
		},
		{
			"heading": "framework",
			"content": "| Framework      | Generated application        |\n| -------------- | ---------------------------- |\n| TanStack Start | Full-stack React application |",
			"table": "table-0"
		},
		{
			"heading": "framework",
			"content": "| Framework   | Generated application       |\n| ----------- | --------------------------- |\n| Basic React | React, Vite, and TypeScript |",
			"table": "table-0"
		},
		{
			"heading": "framework",
			"content": "Next.js and TanStack Start projects are generated using their official CLI tools. The Basic React template is generated directly by Puzzle."
		},
		{
			"heading": "tailwind-css",
			"content": "You can optionally configure Tailwind CSS v4."
		},
		{
			"heading": "tailwind-css",
			"content": "When enabled, the generator configures the appropriate integration for the selected framework and installs the required development dependencies."
		},
		{
			"heading": "puzzle-auth",
			"content": "You can optionally add Puzzle authentication."
		},
		{
			"heading": "puzzle-auth",
			"content": "When enabled, the generator installs:"
		},
		{
			"heading": "puzzle-auth",
			"content": "@puzzle-ui/auth"
		},
		{
			"heading": "puzzle-auth",
			"content": "@puzzle-ui/fullstack"
		},
		{
			"heading": "puzzle-auth",
			"content": "@puzzle-ui/session"
		},
		{
			"heading": "puzzle-auth",
			"content": "For Next.js and TanStack Start, it also creates:"
		},
		{
			"heading": "puzzle-auth",
			"content": "An application-level AuthProvider."
		},
		{
			"heading": "puzzle-auth",
			"content": "A sign-in page."
		},
		{
			"heading": "puzzle-auth",
			"content": "A sign-up page."
		},
		{
			"heading": "puzzle-auth",
			"content": "A framework-specific authentication API route."
		},
		{
			"heading": "puzzle-auth",
			"content": "A server-only AuthServer registration module."
		},
		{
			"heading": "puzzle-auth",
			"content": "An application bootstrap function."
		},
		{
			"heading": "puzzle-auth",
			"content": "For Basic React, it creates the AuthProvider and sign-in/sign-up components. A Basic React application has no server runtime, so its authentication API must be hosted separately."
		},
		{
			"heading": "puzzle-auth",
			"content": "Puzzle Auth requires application-specific security dependencies. The generator\ndoes not create an insecure password hasher, fake storage adapter, or\nprocess-local production rate limiter. The generated API route returns HTTP\n503 until you register a real AuthServer."
		},
		{
			"heading": "puzzle-auth",
			"content": "See Authentication Setup for the required server configuration."
		},
		{
			"heading": "what-gets-configured",
			"content": "After framework generation, the CLI:"
		},
		{
			"heading": "what-gets-configured",
			"content": "Configures framework package transpilation."
		},
		{
			"heading": "what-gets-configured",
			"content": "Adds the Puzzle theme provider."
		},
		{
			"heading": "what-gets-configured",
			"content": "Creates a starter page using the Puzzle UI package."
		},
		{
			"heading": "what-gets-configured",
			"content": "Sets the generated package name."
		},
		{
			"heading": "what-gets-configured",
			"content": "Optionally configures and installs Tailwind CSS."
		},
		{
			"heading": "what-gets-configured",
			"content": "Optionally creates the Puzzle Auth client and server integration files."
		},
		{
			"heading": "what-gets-configured",
			"content": "Installs the selected Puzzle packages."
		},
		{
			"heading": "what-gets-configured",
			"content": "The target directory must not already exist. The generator never overwrites an existing project."
		},
		{
			"heading": "start-developing",
			"content": "Move into the generated directory and run its development server."
		},
		{
			"heading": "start-developing",
			"content": "Use the package manager selected during setup. For example:"
		},
		{
			"heading": "manual-installation",
			"content": "Install the UI and theme packages:"
		},
		{
			"heading": "manual-installation",
			"content": "Add the theme provider at the root of your application."
		},
		{
			"heading": "manual-installation",
			"content": "To add the authentication packages:"
		},
		{
			"heading": "manual-installation",
			"content": "Follow Authentication Setup before exposing authentication routes."
		},
		{
			"heading": "the-project-directory-already-exists",
			"content": "Choose a different project name or remove the existing directory yourself. The generator deliberately refuses to overwrite existing files."
		},
		{
			"heading": "framework-generation-fails",
			"content": "The generator downloads the framework CLI through your selected package manager. Verify that the package manager is installed and can access the package registry."
		},
		{
			"heading": "dependency-installation-fails",
			"content": "Run the failed installation command manually from the generated project directory. Check the package manager output for registry, network, or version errors."
		},
		{
			"heading": "authentication-returns-http-503",
			"content": "The server bootstrap is intentionally incomplete. Configure the storage adapter, password hasher, rate limiter, session manager, MFA manager, step-up manager, cookies, CSRF policy, and trusted client IP resolver."
		},
		{
			"heading": "authentication-returns-http-503",
			"content": "Register the resulting AuthServer with configureAuthServer."
		},
		{
			"heading": "tailwind-styles-are-missing",
			"content": "Check that Tailwind was enabled during setup and that the generated CSS entry point is imported by the application."
		},
		{
			"heading": "package-details",
			"content": "The generator is published as @puzzle-ui/create. Its executable is named create-puzzle."
		},
		{
			"heading": "package-details",
			"content": "The package requires Node.js 20.19 or later."
		}
	],
	"headings": [
		{
			"id": "requirements",
			"content": "Requirements"
		},
		{
			"id": "run-the-generator",
			"content": "Run the generator"
		},
		{
			"id": "npm",
			"content": "npm"
		},
		{
			"id": "bun",
			"content": "Bun"
		},
		{
			"id": "pnpm",
			"content": "pnpm"
		},
		{
			"id": "yarn",
			"content": "Yarn"
		},
		{
			"id": "interactive-setup",
			"content": "Interactive setup"
		},
		{
			"id": "project-name",
			"content": "Project name"
		},
		{
			"id": "framework",
			"content": "Framework"
		},
		{
			"id": "tailwind-css",
			"content": "Tailwind CSS"
		},
		{
			"id": "puzzle-auth",
			"content": "Puzzle Auth"
		},
		{
			"id": "what-gets-configured",
			"content": "What gets configured"
		},
		{
			"id": "start-developing",
			"content": "Start developing"
		},
		{
			"id": "manual-installation",
			"content": "Manual installation"
		},
		{
			"id": "troubleshooting",
			"content": "Troubleshooting"
		},
		{
			"id": "the-project-directory-already-exists",
			"content": "The project directory already exists"
		},
		{
			"id": "framework-generation-fails",
			"content": "Framework generation fails"
		},
		{
			"id": "dependency-installation-fails",
			"content": "Dependency installation fails"
		},
		{
			"id": "authentication-returns-http-503",
			"content": "Authentication returns HTTP 503"
		},
		{
			"id": "tailwind-styles-are-missing",
			"content": "Tailwind styles are missing"
		},
		{
			"id": "package-details",
			"content": "Package details"
		}
	]
};
var toc = [
	{
		depth: 2,
		url: "#requirements",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Requirements" })
	},
	{
		depth: 2,
		url: "#run-the-generator",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Run the generator" })
	},
	{
		depth: 3,
		url: "#npm",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "npm" })
	},
	{
		depth: 3,
		url: "#bun",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Bun" })
	},
	{
		depth: 3,
		url: "#pnpm",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "pnpm" })
	},
	{
		depth: 3,
		url: "#yarn",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Yarn" })
	},
	{
		depth: 2,
		url: "#interactive-setup",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Interactive setup" })
	},
	{
		depth: 3,
		url: "#project-name",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Project name" })
	},
	{
		depth: 3,
		url: "#framework",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Framework" })
	},
	{
		depth: 3,
		url: "#tailwind-css",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Tailwind CSS" })
	},
	{
		depth: 3,
		url: "#puzzle-auth",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Puzzle Auth" })
	},
	{
		depth: 2,
		url: "#what-gets-configured",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "What gets configured" })
	},
	{
		depth: 2,
		url: "#start-developing",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Start developing" })
	},
	{
		depth: 2,
		url: "#manual-installation",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Manual installation" })
	},
	{
		depth: 2,
		url: "#troubleshooting",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Troubleshooting" })
	},
	{
		depth: 3,
		url: "#the-project-directory-already-exists",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "The project directory already exists" })
	},
	{
		depth: 3,
		url: "#framework-generation-fails",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Framework generation fails" })
	},
	{
		depth: 3,
		url: "#dependency-installation-fails",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Dependency installation fails" })
	},
	{
		depth: 3,
		url: "#authentication-returns-http-503",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Authentication returns HTTP 503" })
	},
	{
		depth: 3,
		url: "#tailwind-styles-are-missing",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Tailwind styles are missing" })
	},
	{
		depth: 2,
		url: "#package-details",
		title: (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: "Package details" })
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
	}, { Callout } = _components;
	if (!Callout) _missingMdxReference("Callout", true);
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The ",
			(0, import_jsx_runtime.jsx)("code", { children: "@puzzle-ui/create" }),
			" package creates a new React application with Puzzle UI installed and configured."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "It supports Next.js, TanStack Start, and a basic React + Vite application." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "requirements",
			children: "Requirements"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Node.js 20.19 or later." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "npm, Bun, pnpm, or Yarn." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "An internet connection to download framework templates and dependencies." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "run-the-generator",
			children: "Run the generator"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "npm",
			children: "npm"
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
			children: (0, import_jsx_runtime.jsx)(_components.code, { children: (0, import_jsx_runtime.jsxs)(_components.span, {
				className: "line",
				children: [(0, import_jsx_runtime.jsx)(_components.span, {
					style: {
						"--shiki-light": "#6F42C1",
						"--shiki-dark": "#B392F0"
					},
					children: "npx"
				}), (0, import_jsx_runtime.jsx)(_components.span, {
					style: {
						"--shiki-light": "#032F62",
						"--shiki-dark": "#9ECBFF"
					},
					children: " @puzzle-ui/create"
				})]
			}) })
		}) }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "bun",
			children: "Bun"
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
			children: (0, import_jsx_runtime.jsx)(_components.code, { children: (0, import_jsx_runtime.jsxs)(_components.span, {
				className: "line",
				children: [(0, import_jsx_runtime.jsx)(_components.span, {
					style: {
						"--shiki-light": "#6F42C1",
						"--shiki-dark": "#B392F0"
					},
					children: "bunx"
				}), (0, import_jsx_runtime.jsx)(_components.span, {
					style: {
						"--shiki-light": "#032F62",
						"--shiki-dark": "#9ECBFF"
					},
					children: " @puzzle-ui/create"
				})]
			}) })
		}) }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "pnpm",
			children: "pnpm"
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
			children: (0, import_jsx_runtime.jsx)(_components.code, { children: (0, import_jsx_runtime.jsxs)(_components.span, {
				className: "line",
				children: [
					(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#6F42C1",
							"--shiki-dark": "#B392F0"
						},
						children: "pnpm"
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: " dlx"
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: " @puzzle-ui/create"
					})
				]
			}) })
		}) }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "yarn",
			children: "Yarn"
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
			children: (0, import_jsx_runtime.jsx)(_components.code, { children: (0, import_jsx_runtime.jsxs)(_components.span, {
				className: "line",
				children: [
					(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#6F42C1",
							"--shiki-dark": "#B392F0"
						},
						children: "yarn"
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: " dlx"
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: " @puzzle-ui/create"
					})
				]
			}) })
		}) }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Yarn's ",
			(0, import_jsx_runtime.jsx)("code", { children: "dlx" }),
			" command requires Yarn 2 or later. With Yarn Classic, use the npm command."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "interactive-setup",
			children: "Interactive setup"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The generator asks for four options." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "project-name",
			children: "Project name"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Enter a project name. The generator converts it to kebab-case and uses it for the target directory and package name." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "framework",
			children: "Framework"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.table, { children: [(0, import_jsx_runtime.jsx)(_components.thead, { children: (0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.th, { children: "Framework" }), (0, import_jsx_runtime.jsx)(_components.th, { children: "Generated application" })] }) }), (0, import_jsx_runtime.jsxs)(_components.tbody, { children: [
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: "Next.js" }), (0, import_jsx_runtime.jsx)(_components.td, { children: "Next.js App Router with TypeScript" })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: "TanStack Start" }), (0, import_jsx_runtime.jsx)(_components.td, { children: "Full-stack React application" })] }),
			(0, import_jsx_runtime.jsxs)(_components.tr, { children: [(0, import_jsx_runtime.jsx)(_components.td, { children: "Basic React" }), (0, import_jsx_runtime.jsx)(_components.td, { children: "React, Vite, and TypeScript" })] })
		] })] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Next.js and TanStack Start projects are generated using their official CLI tools. The Basic React template is generated directly by Puzzle." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "tailwind-css",
			children: "Tailwind CSS"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "You can optionally configure Tailwind CSS v4." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "When enabled, the generator configures the appropriate integration for the selected framework and installs the required development dependencies." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "puzzle-auth",
			children: "Puzzle Auth"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "You can optionally add Puzzle authentication." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "When enabled, the generator installs:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime.jsx)("code", { children: "@puzzle-ui/auth" }),
				"\n"
			] }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime.jsx)("code", { children: "@puzzle-ui/fullstack" }),
				"\n"
			] }),
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				"\n",
				(0, import_jsx_runtime.jsx)("code", { children: "@puzzle-ui/session" }),
				"\n"
			] }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "For Next.js and TanStack Start, it also creates:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ul, { children: [
			"\n",
			(0, import_jsx_runtime.jsxs)(_components.li, { children: [
				"An application-level ",
				(0, import_jsx_runtime.jsx)("code", { children: "AuthProvider" }),
				"."
			] }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "A sign-in page." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "A sign-up page." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "A framework-specific authentication API route." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "A server-only AuthServer registration module." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "An application bootstrap function." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "For Basic React, it creates the AuthProvider and sign-in/sign-up components. A Basic React application has no server runtime, so its authentication API must be hosted separately." }),
		"\n",
		(0, import_jsx_runtime.jsx)(Callout, {
			type: "warn",
			title: "Complete server configuration is required",
			children: (0, import_jsx_runtime.jsx)(_components.p, { children: "Puzzle Auth requires application-specific security dependencies. The generator\ndoes not create an insecure password hasher, fake storage adapter, or\nprocess-local production rate limiter. The generated API route returns HTTP\n503 until you register a real AuthServer." })
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"See ",
			(0, import_jsx_runtime.jsx)(_components.a, {
				href: "/docs/developer/authentication",
				children: "Authentication Setup"
			}),
			" for the required server configuration."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "what-gets-configured",
			children: "What gets configured"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "After framework generation, the CLI:" }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.ol, { children: [
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Configures framework package transpilation." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Adds the Puzzle theme provider." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Creates a starter page using the Puzzle UI package." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Sets the generated package name." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Optionally configures and installs Tailwind CSS." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Optionally creates the Puzzle Auth client and server integration files." }),
			"\n",
			(0, import_jsx_runtime.jsx)(_components.li, { children: "Installs the selected Puzzle packages." }),
			"\n"
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The target directory must not already exist. The generator never overwrites an existing project." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "start-developing",
			children: "Start developing"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Move into the generated directory and run its development server." }),
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
						children: " my-dashboard"
					})]
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
							children: "npm"
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
				})
			] })
		}) }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Use the package manager selected during setup. For example:" }),
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
						children: " my-dashboard"
					})]
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
							children: " dev"
						})
					]
				})
			] })
		}) }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "manual-installation",
			children: "Manual installation"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Install the UI and theme packages:" }),
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
						children: "npm"
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: " install"
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: " @puzzle-ui/ui"
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: " @puzzle-ui/theme"
					})
				]
			}) })
		}) }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Add the theme provider at the root of your application." }),
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
			icon: "<svg viewBox=\"0 0 24 24\"><path d=\"M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z\" fill=\"currentColor\" /></svg>",
			children: (0, import_jsx_runtime.jsxs)(_components.code, { children: [
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "import"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " { Theme } "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "from"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " \"@puzzle-ui/theme\""
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ";"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "import"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " { Button } "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "from"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: " \"@puzzle-ui/ui\""
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ";"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, { className: "line" }),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "const"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " App"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: " ="
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " () "
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "=>"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " ("
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "  <"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "Theme"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#6F42C1",
								"--shiki-dark": "#B392F0"
							},
							children: " theme"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "="
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#032F62",
								"--shiki-dark": "#9ECBFF"
							},
							children: "\"system\""
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ">"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "    <"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#85E89D"
							},
							children: "main"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ">"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "      <"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#85E89D"
							},
							children: "h1"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ">My application</"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#85E89D"
							},
							children: "h1"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ">"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "      <"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "Button"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ">Continue</"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "Button"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ">"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "    </"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#22863A",
								"--shiki-dark": "#85E89D"
							},
							children: "main"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ">"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: "  </"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#005CC5",
								"--shiki-dark": "#79B8FF"
							},
							children: "Theme"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: ">"
						})
					]
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, {
					className: "line",
					children: (0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#24292E",
							"--shiki-dark": "#E1E4E8"
						},
						children: ");"
					})
				}),
				"\n",
				(0, import_jsx_runtime.jsx)(_components.span, { className: "line" }),
				"\n",
				(0, import_jsx_runtime.jsxs)(_components.span, {
					className: "line",
					children: [
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: "export"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#D73A49",
								"--shiki-dark": "#F97583"
							},
							children: " default"
						}),
						(0, import_jsx_runtime.jsx)(_components.span, {
							style: {
								"--shiki-light": "#24292E",
								"--shiki-dark": "#E1E4E8"
							},
							children: " App;"
						})
					]
				})
			] })
		}) }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "To add the authentication packages:" }),
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
						children: "npm"
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: " install"
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: " @puzzle-ui/auth"
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: " @puzzle-ui/fullstack"
					}),
					(0, import_jsx_runtime.jsx)(_components.span, {
						style: {
							"--shiki-light": "#032F62",
							"--shiki-dark": "#9ECBFF"
						},
						children: " @puzzle-ui/session"
					})
				]
			}) })
		}) }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Follow ",
			(0, import_jsx_runtime.jsx)(_components.a, {
				href: "/docs/developer/authentication",
				children: "Authentication Setup"
			}),
			" before exposing authentication routes."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "troubleshooting",
			children: "Troubleshooting"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "the-project-directory-already-exists",
			children: "The project directory already exists"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Choose a different project name or remove the existing directory yourself. The generator deliberately refuses to overwrite existing files." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "framework-generation-fails",
			children: "Framework generation fails"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The generator downloads the framework CLI through your selected package manager. Verify that the package manager is installed and can access the package registry." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "dependency-installation-fails",
			children: "Dependency installation fails"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Run the failed installation command manually from the generated project directory. Check the package manager output for registry, network, or version errors." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "authentication-returns-http-503",
			children: "Authentication returns HTTP 503"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The server bootstrap is intentionally incomplete. Configure the storage adapter, password hasher, rate limiter, session manager, MFA manager, step-up manager, cookies, CSRF policy, and trusted client IP resolver." }),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"Register the resulting ",
			(0, import_jsx_runtime.jsx)("code", { children: "AuthServer" }),
			" with ",
			(0, import_jsx_runtime.jsx)("code", { children: "configureAuthServer" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h3, {
			id: "tailwind-styles-are-missing",
			children: "Tailwind styles are missing"
		}),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "Check that Tailwind was enabled during setup and that the generated CSS entry point is imported by the application." }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.h2, {
			id: "package-details",
			children: "Package details"
		}),
		"\n",
		(0, import_jsx_runtime.jsxs)(_components.p, { children: [
			"The generator is published as ",
			(0, import_jsx_runtime.jsx)("code", { children: "@puzzle-ui/create" }),
			". Its executable is named ",
			(0, import_jsx_runtime.jsx)("code", { children: "create-puzzle" }),
			"."
		] }),
		"\n",
		(0, import_jsx_runtime.jsx)(_components.p, { children: "The package requires Node.js 20.19 or later." })
	] });
}
function MDXContent(props = {}) {
	const { wrapper: MDXLayout } = props.components || {};
	return MDXLayout ? (0, import_jsx_runtime.jsx)(MDXLayout, {
		...props,
		children: (0, import_jsx_runtime.jsx)(_createMdxContent, { ...props })
	}) : _createMdxContent(props);
}
function _missingMdxReference(id, component) {
	throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
export { MDXContent as default, frontmatter, structuredData, toc };
