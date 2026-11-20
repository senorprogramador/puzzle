import { createFileRoute } from "@tanstack/react-router";
import {
  AUTHOR_ID,
  HOME_URL,
  PUBLISHER_ID,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  getCanonicalUrl,
} from "@/lib/seo";
import { aiReadinessFaqs, ecosystem } from "@/lib/homepage";
import { HomeAiReadiness } from "@/components/home-ai-readiness";
import { useColorScheme, type ColorScheme } from "@puzzle-ui/hooks";
import { Theme, type ThemeMode } from "@puzzle-ui/theme";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Heading,
  Link,
  Stack,
  Switch,
  Text,
  TextInput,
} from "@puzzle-ui/ui";
import {
  BenefitsSection,
  CodeShowcaseSection,
  CTASection,
  FeaturesSection,
  FooterSection,
  Hero,
  HowItWorksSection,
  IntegrationsSection,
  ProductShowcaseSection,
  StatsSection,
  UseCasesSection,
  FAQSection,
} from "@puzzle-ui/pieces";
import { Schema } from "@puzzle-ui/seo";
import { useEffect, useRef, useState, type ComponentType } from "react";

import {
  type componentPanels,
  randomComponentsOfLength,
} from "@/components/component-catalog";

import { Header } from "@/components/layout/header";
import "./home.css";

type ComponentPanels = typeof componentPanels;

const getHomepageThemeScope = (): HTMLElement | null => {
  if (typeof document === "undefined") return null;
  return document.querySelector<HTMLElement>(
    ".puzzle-theme-scope[data-puzzle-theme-scope]",
  );
};

const getSystemColorScheme = (): ColorScheme =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

const codeExample = `import {
  Button,
  Card,
  Heading,
  Text,
} from "@puzzle-ui/ui";

export function Welcome() {
  return (
    <Card>
      <Heading level="headline2">
        Welcome to Puzzle
      </Heading>

      <Text>
        Build something wonderful.
      </Text>

      <Button variant="primary">
        Get started
      </Button>
    </Card>
  );
}`;

const ArrowIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const CodeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m8 17-5-5 5-5M16 7l5 5-5 5M14 4l-4 16" />
  </svg>
);

const PuzzleLogo = ({
  size = 36,
  className,
}: {
  size?: number;
  className?: string;
}) => (
  <img
    src="/favicon.svg"
    width={size}
    height={size}
    alt="Puzzle UI"
    className={className}
  />
);

/**
 * A small interactive showcase of actual Puzzle UI components.
 *
 * This remains a custom component because the interactive behavior is
 * specific to the Puzzle homepage rather than a generic marketing section.
 */
const ComponentPreview = ({
  isDarkMode,
  onToggleTheme,
}: {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}) => (
  <div className="home-preview">
    <div className="home-preview__topbar">
      <div className="home-preview__dots">
        <span />
        <span />
        <span />
      </div>

      <span>puzzle / playground</span>

      <Badge color="secondary" content="Interactive" />
    </div>

    <div className="home-preview__content">
      <Stack direction="col" alignH="start" gap="sm">
        <Badge color="secondary" content="Component showcase" />

        <Stack direction="col" alignH="start" gap="0">
          <Heading level="headline3">Everything in its place.</Heading>

          <Text>A glimpse into what you can build.</Text>
        </Stack>
      </Stack>

      <Card className="home-preview__card">
        <div className="home-preview__section-heading">
          <span>Buttons</span>
          <Badge color="secondary" content="Button" />
        </div>

        <Stack
          direction={{ mobile: "col", tablet: "row" }}
          wrap="wrap"
          alignV="center"
          gap="sm"
        >
          <Button variant="primary" href="/docs/getting-started">
            Get started
          </Button>

          <Button variant="secondary" href="/docs/ui">
            Explore
          </Button>

          <Button variant="outline" href="/docs/getting-started">
            Documentation
          </Button>
        </Stack>
      </Card>

      <div className="home-preview__columns">
        <Card className="home-preview__card">
          <div className="home-preview__section-heading">
            <span>Preferences</span>
            <Badge color="secondary" content="Switch" />
          </div>

          <div className="home-preview__control">
            <div>
              <strong>
                <label htmlFor="home-dark-mode">Dark mode</label>
              </strong>
              <span>Use dark appearance</span>
            </div>

            <Switch
              id="home-dark-mode"
              checked={isDarkMode}
              onChange={onToggleTheme}
            />
          </div>

          <div className="home-preview__control">
            <div>
              <strong>
                <label htmlFor="home-notifications">Notifications</label>
              </strong>
              <span>Receive updates</span>
            </div>

            <Switch id="home-notifications" />
          </div>
        </Card>

        <Card className="home-preview__card">
          <div className="home-preview__section-heading">
            <span>Tasks</span>
            <Badge color="secondary" content="Checkbox" />
          </div>

          <div className="home-preview__tasks">
            <Checkbox defaultChecked>
              <span>Build components</span>
            </Checkbox>

            <Checkbox defaultChecked>
              <span>Write documentation</span>
            </Checkbox>

            <Checkbox defaultChecked>
              <span>Ship your product</span>
            </Checkbox>
          </div>
        </Card>
      </div>

      <Card className="home-preview__card">
        <div className="home-preview__section-heading">
          <span>Project settings</span>
          <Badge color="secondary" content="Input" />
        </div>

        <label
          className="home-preview__input-label"
          htmlFor="home-project-name"
        >
          Project name
        </label>

        <TextInput
          id="home-project-name"
          placeholder="My awesome project"
          defaultValue="Puzzle UI"
        />
      </Card>

      <div className="home-preview__footer">
        <span>
          <span className="home-preview__status" />
          Interactive example
        </span>

        <span>Built with Puzzle</span>
      </div>
    </div>
  </div>
);

/**
 * The carousel is loaded only when it approaches the viewport.
 *
 * The static fallback is intentionally kept in the initial render:
 * users and search engines can see useful component links without
 * waiting for the interactive carousel bundle.
 */
const DeferredComponentCarousel = ({ panels }: { panels: ComponentPanels }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const loadedRef = useRef<ComponentType<{ panels: ComponentPanels }> | null>(
    null,
  );

  const [Carousel, setCarousel] = useState<ComponentType<{
    panels: ComponentPanels;
  }> | null>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    let active = true;

    const load = () => {
      void import("@/components/home-component-carousel")
        .then(({ HomeComponentCarousel }) => {
          if (!active) return;

          loadedRef.current = HomeComponentCarousel;

          if (!container.contains(document.activeElement)) {
            setCarousel(() => HomeComponentCarousel);
          }
        })
        .catch((error: unknown) => {
          console.error("Failed to load the home component carousel:", error);
        });
    };

    if (!("IntersectionObserver" in window)) {
      load();

      return () => {
        active = false;
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          load();
        }
      },
      { rootMargin: "600px" },
    );

    observer.observe(container);

    return () => {
      active = false;
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="home-component-carousel-container"
      onBlurCapture={(event) => {
        if (
          !event.currentTarget.contains(event.relatedTarget) &&
          loadedRef.current
        ) {
          setCarousel(() => loadedRef.current);
        }
      }}
    >
      {Carousel ? (
        <Carousel panels={panels} />
      ) : (
        <div className="home-component-fallback" aria-label="UI components">
          {panels.map((panel) => (
            <Stack
              key={panel[0]!.href}
              direction="col"
              alignH="stretch"
              gap="md"
              className="home-component-panel"
            >
              {panel.map((component) => (
                <Card
                  as="a"
                  interactive
                  className="home-component-card"
                  href={component.href}
                  key={component.href}
                >
                  <span
                    className="home-component-card__icon"
                    aria-hidden="true"
                  >
                    <svg />
                  </span>

                  <div>
                    <Heading level="headline3" as="h3">
                      {component.name}
                    </Heading>

                    <Text>{component.description}</Text>
                  </div>
                </Card>
              ))}
            </Stack>
          ))}
        </div>
      )}
    </div>
  );
};

const Home = () => {
  const panels = Route.useLoaderData();
  const colorScheme = useColorScheme({ target: getHomepageThemeScope });

  const [theme, setTheme] = useState<ThemeMode>("system");

  const toggleTheme = () => {
    setTheme((current) => {
      const activeScheme =
        current === "system"
          ? colorScheme ?? getSystemColorScheme()
          : current;
      return activeScheme === "dark" ? "light" : "dark";
    });
  };

  return (
    <Theme theme={theme} scope="local">
      <Schema
        type="SoftwareSourceCode"
        id={`${SITE_URL}/#software`}
        properties={{
          name: SITE_NAME,
          description: SITE_DESCRIPTION,
          url: HOME_URL,
          codeRepository: "https://github.com/senorprogramador/puzzle",
          programmingLanguage: "TypeScript",
          runtimePlatform: "React",
          license: "https://opensource.org/license/mit/",
          author: {
            "@id": AUTHOR_ID,
          },
          publisher: {
            "@id": PUBLISHER_ID,
          },
        }}
      />

      <div className="home-page">
        <Header />

        <main>
          {/* 1. HERO */}

          <Hero
            id="home"
            className="home-hero"
            layout="split"
            mediaPosition="right"
            alignment="start"
            height="large"
            theme="light"
            contentWidth="wide"
            reverseOnMobile={false}
            eyebrow="A modern React design system"
            title={
              <>
                A TypeScript-first
                <br />
                <span>React design system.</span>
              </>
            }
            description="Build accessible React interfaces with a carefully designed component system. Compose predictable building blocks, establish a consistent visual language and focus on creating great products."
            actions={
              <>
                <Button variant="primary" href="/docs/getting-started">
                  Start building <ArrowIcon />
                </Button>

                <Button variant="outline" href="/docs/ui">
                  <CodeIcon />
                  Explore components
                </Button>
              </>
            }
            media={
              <div className="home-hero__visual">
                <ComponentPreview
                  isDarkMode={colorScheme === "dark"}
                  onToggleTheme={toggleTheme}
                />
              </div>
            }
            meta={
              <Stack
                direction="row"
                alignV="center"
                wrap="wrap"
                gap="md"
                className="home-hero__meta"
              >
                <span>
                  <span className="home-hero__check">✓</span>
                  TypeScript first
                </span>

                <span>
                  <span className="home-hero__check">✓</span>
                  Accessibility informed
                </span>

                <span>
                  <span className="home-hero__check">✓</span>
                  Open source
                </span>
              </Stack>
            }
          />

          {/* 2. PROJECT CHARACTERISTICS */}

          <StatsSection
            id="highlights"
            className="home-below-fold"
            variant="inline"
            theme="dark"
            items={[
              {
                id: "react",
                value: "React",
                label: "Built for",
                description: "Modern React applications",
              },
              {
                id: "typescript",
                value: "TypeScript",
                label: "Designed with",
                description: "Typed, predictable APIs",
              },
              {
                id: "opensource",
                value: "MIT",
                label: "Licensed under",
                description: "Open-source ecosystem",
              },
              {
                id: "composable",
                value: "Composable",
                label: "Built around",
                description: "Reusable building blocks",
              },
            ]}
          />

          {/* 3. FEATURES */}

          <FeaturesSection
            id="features"
            className="home-below-fold"
            variant="bento"
            eyebrow="Why Puzzle"
            title={
              <>
                Less boilerplate.
                <br />
                <span>More building.</span>
              </>
            }
            description="The foundations of a great interface, thoughtfully implemented so you can focus on creating great products."
            items={[
              {
                id: "composition",
                title: "Designed to compose",
                description:
                  "Build interfaces from small, predictable building blocks. Compose complex experiences without fighting the framework.",
                featured: true,
              },
              {
                id: "accessibility",
                title: "Accessibility informed",
                description:
                  "Semantic markup, keyboard navigation, focus management and screen reader behavior are considered in the component design.",
              },
              {
                id: "developer-experience",
                title: "Developer experience",
                description:
                  "TypeScript-first APIs, predictable behavior and a consistent design system make development enjoyable.",
              },
              {
                id: "customizable",
                title: "Flexible by design",
                description:
                  "Use the pieces you need, customize the visual language and compose components around your own product requirements.",
              },
            ]}
          />

          {/* 4. COMPONENT LIBRARY SHOWCASE */}

          <ProductShowcaseSection
            id="components"
            className="home-below-fold"
            theme="dark"
            variant="split"
            eyebrow="The building blocks"
            title={
              <>
                Everything you need.
                <br />
                <span>Nothing you don't.</span>
              </>
            }
            description="Explore a growing collection of carefully designed components. Each one is built to work together as part of a consistent design system."
            alignment="start"
            actions={
              <Button variant="outline" href="/docs/ui">
                Explore all components <ArrowIcon />
              </Button>
            }
            items={[
              {
                id: "component-library",
                title: "A component for every interaction",
                description:
                  "From buttons and forms to navigation, overlays, layout and typography. Discover reusable components with a consistent API.",
                media: <DeferredComponentCarousel panels={panels} />,
                caption: "Explore the Puzzle UI component library",
              },
            ]}
          />

          {/* 5. REUSABLE PAGE SECTIONS */}

          <FeaturesSection
            id="pieces-showcase"
            className="home-below-fold"
            variant="bento"
            eyebrow="Reusable page sections"
            title={
              <>
                Go beyond components.
                <br />
                <span>Compose the whole page.</span>
              </>
            }
            description="Pieces brings responsive, theme-aware sections together into complete marketing pages, product experiences, and application layouts."
            items={[
              {
                id: "marketing-pages",
                title: "Marketing pages",
                description:
                  "Compose heroes, feature grids, social proof, FAQs, and calls to action into a cohesive landing page.",
                featured: true,
                action: (
                  <Button variant="outline" href="/docs/pieces">
                    Explore Pieces <ArrowIcon />
                  </Button>
                ),
              },
              {
                id: "product-experiences",
                title: "Product experiences",
                description:
                  "Bring product showcases, pricing, comparisons, and customer stories into a consistent visual system.",
              },
              {
                id: "application-layouts",
                title: "Application layouts",
                description:
                  "Use reusable sections across content, commerce, business, and dashboard experiences.",
              },
            ]}
          />

          {/* 6. HOW IT WORKS */}

          <HowItWorksSection
            id="how-it-works"
            className="home-below-fold"
            variant="connected"
            eyebrow="Getting started"
            title="From installation to implementation."
            description="Start with the foundation you need. Add more of the Puzzle ecosystem whenever your application calls for it."
            steps={[
              {
                id: "install",
                title: "Install the packages",
                description:
                  "Add the UI and theme packages to an existing React application, or generate a new project with the Puzzle CLI.",
              },
              {
                id: "configure",
                title: "Set up your design system",
                description:
                  "Configure your theme, design tokens and application-wide styling to establish a consistent foundation.",
              },
              {
                id: "compose",
                title: "Compose your interface",
                description:
                  "Combine accessible components and reusable pieces to build the experiences your product needs.",
              },
              {
                id: "grow",
                title: "Expand when you need to",
                description:
                  "Explore additional packages for icons, hooks, SEO, authentication, storage and more.",
              },
            ]}
          />

          {/* 6. PUZZLE ECOSYSTEM */}

          <IntegrationsSection
            id="ecosystem"
            className="home-below-fold"
            variant="grid"
            eyebrow="The Puzzle ecosystem"
            title="More than components."
            description="A collection of focused packages designed to work together where useful. Use them independently or build on top of the wider ecosystem."
            items={ecosystem.map((item) => ({
              id: item.href,
              name: item.name,
              description: item.description,
              href: item.href,
              category: "Puzzle package",
            }))}
          />

          {/* 7. CODE EXAMPLE */}

          <CodeShowcaseSection
            id="code-example"
            className="home-below-fold"
            theme="dark"
            variant="single"
            eyebrow="A familiar React experience"
            title="Simple APIs. Composable interfaces."
            description="Use Puzzle components directly in your React application. Start small and compose more complex interfaces as your product grows."
            items={[
              {
                id: "welcome-component",
                title: "A simple component",
                filename: "Welcome.tsx",
                language: "tsx",
                code: codeExample,
              },
            ]}
            copyable
            showLineNumbers
          />

          {/* 8. GETTING STARTED OPTIONS */}

          <UseCasesSection
            id="getting-started"
            className="home-below-fold"
            variant="persona"
            eyebrow="Start building"
            title={
              <>
                Your project.
                <br />
                <span>Your choice.</span>
              </>
            }
            description="Whether you are starting from scratch or integrating Puzzle into an existing React application, there is a straightforward way to get started."
            items={[
              {
                id: "new-project",
                persona: "New projects",
                title: "Create a project with Puzzle",
                description:
                  "Generate a new React application with the Puzzle ecosystem configured. Supports Next.js, TanStack Start and standard React with Vite.",
                benefits: [
                  "Choose your preferred framework",
                  "Start with a configured project",
                  "Add the packages you need",
                ],
                action: (
                  <Button variant="primary" href="/docs/create">
                    Explore project generator <ArrowIcon />
                  </Button>
                ),
              },
              {
                id: "existing-project",
                persona: "Existing projects",
                title: "Add Puzzle to your application",
                description:
                  "Install the UI and theme packages independently and start using components in your existing React project.",
                benefits: [
                  "Install packages independently",
                  "Keep your existing application structure",
                  "Adopt Puzzle incrementally",
                ],
                action: (
                  <Button variant="outline" href="/docs/getting-started">
                    Read installation guide <ArrowIcon />
                  </Button>
                ),
              },
            ]}
          />

          {/* 9. BENEFITS */}

          <BenefitsSection
            id="developer-experience"
            className="home-below-fold"
            theme="dark"
            variant="checklist"
            eyebrow="Made for developers"
            title={
              <>
                Your ideas.
                <br />
                <span>Without the friction.</span>
              </>
            }
            description="Predictable APIs, powerful composition and a consistent design language. Puzzle gives you the building blocks to turn ideas into polished experiences."
            items={[
              {
                id: "typescript",
                title: "TypeScript-first",
                description:
                  "Excellent types and predictable APIs help you understand how components behave and how to compose them.",
              },
              {
                id: "flexible",
                title: "Flexible by design",
                description:
                  "Customize and compose components to fit your product instead of adapting your product to a rigid component library.",
              },
              {
                id: "accessible",
                title: "Accessibility matters",
                description:
                  "Thoughtful interaction patterns and semantic foundations are part of the component design process.",
              },
              {
                id: "consistent",
                title: "A consistent design language",
                description:
                  "Shared theme tokens and reusable building blocks help keep your application visually coherent.",
              },
            ]}
          />

          {/* 10. AI-READY DEVELOPMENT */}

          <HomeAiReadiness />

          {/* 11. FAQ */}

          <FAQSection
            id="faq"
            className="home-below-fold"
            variant="accordion"
            eyebrow="Frequently asked questions"
            title="A few things worth knowing."
            description="Some quick answers to help you decide whether Puzzle is right for your next project."
            items={[
              {
                id: "what-is-puzzle",
                question: "What is Puzzle?",
                answer:
                  "Puzzle is a TypeScript-first React design system and ecosystem of developer packages. It includes UI components, theme tools, reusable page sections and additional packages for common application needs.",
              },
              {
                id: "frameworks",
                question: "Which frameworks can I use?",
                answer:
                  "Puzzle is designed for React applications. The project generator supports Next.js, TanStack Start and standard React applications built with Vite. Check the documentation for package-specific framework compatibility.",
              },
              {
                id: "existing-project",
                question: "Can I use Puzzle in an existing project?",
                answer:
                  "Yes. You can install the packages independently and introduce Puzzle into an existing React application. You do not need to migrate your entire application at once.",
              },
              {
                id: "customization",
                question: "Can I customize the design?",
                answer:
                  "Yes. Puzzle includes a theme system and design tokens so you can adapt the visual language to your application.",
              },
              {
                id: "opensource",
                question: "Is Puzzle open source?",
                answer:
                  "Yes. The repository is publicly available on GitHub under the MIT license.",
              },
              {
                id: "pieces",
                question: "What is the Pieces package?",
                answer:
                  "The Pieces package contains reusable React page sections and interface compositions. It helps you build complete pages from consistent, configurable building blocks.",
              },
              ...aiReadinessFaqs.map((faq) => ({
                id: faq.id,
                question: faq.question,
                answer: (
                  <>
                    {faq.answer}{" "}
                    {"link" in faq && (
                      <Link href={faq.link.href}>{faq.link.label}</Link>
                    )}
                  </>
                ),
              })),
            ]}
          />

          {/* 12. FINAL CTA */}

          <CTASection
            id="start-building"
            className="home-below-fold"
            theme="dark"
            variant="centered"
            eyebrow="Build with Puzzle"
            title={
              <>
                Make something
                <br />
                <span>remarkable.</span>
              </>
            }
            description="Explore the components, create your design system and bring your ideas to life."
            media={<PuzzleLogo size={112} />}
            primaryAction={
              <Button variant="primary" href="/docs/getting-started">
                Get started with Puzzle <ArrowIcon />
              </Button>
            }
            secondaryAction={
              <Button
                variant="outline"
                href="https://github.com/senorprogramador/puzzle"
                target="_blank"
                rel="noreferrer"
              >
                View on GitHub
              </Button>
            }
          />
        </main>

        {/* 13. FOOTER */}

        <FooterSection
          variant="multi-column"
          logo={
            <Link className="home-brand" href="/">
              <PuzzleLogo size={32} />
              <span>puzzle-ui.com</span>
            </Link>
          }
          description="A TypeScript-first React design system for developers who care about the details."
          navigationGroups={[
            {
              id: "documentation",
              label: "Documentation",
              links: [
                {
                  id: "getting-started",
                  label: "Getting started",
                  href: "/docs/getting-started",
                },
                {
                  id: "components",
                  label: "UI components",
                  href: "/docs/ui",
                },
                {
                  id: "pieces",
                  label: "Pieces",
                  href: "/docs/pieces",
                },
                {
                  id: "theme",
                  label: "Theme",
                  href: "/docs/theme",
                },
              ],
            },
            {
              id: "ecosystem",
              label: "Ecosystem",
              links: [
                {
                  id: "hooks",
                  label: "Hooks",
                  href: "/docs/hooks",
                },
                {
                  id: "icons",
                  label: "Icons",
                  href: "/docs/icons",
                },
                {
                  id: "seo",
                  label: "SEO",
                  href: "/docs/seo",
                },
                {
                  id: "auth",
                  label: "Authentication",
                  href: "/docs/auth",
                },
                {
                  id: "storage",
                  label: "Storage",
                  href: "/docs/storage",
                },
              ],
            },
            {
              id: "resources",
              label: "Resources",
              links: [
                {
                  id: "create",
                  label: "Project generator",
                  href: "/docs/create",
                },
                {
                  id: "github",
                  label: "GitHub",
                  href: "https://github.com/senorprogramador/puzzle",
                },
              ],
            },
          ]}
          copyright={`© ${new Date().getFullYear()} Puzzle UI`}
        />
      </div>
    </Theme>
  );
};

export const Route = createFileRoute("/")({
  component: Home,
  loader: () => randomComponentsOfLength(16),
  head: () => ({
    links: [
      {
        rel: "canonical",
        href: getCanonicalUrl("/"),
      },
    ],
    meta: [
      {
        property: "og:url",
        content: getCanonicalUrl("/"),
      },
    ],
  }),
});
