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
import { ecosystem } from "@/lib/homepage";
import { Theme, ThemeMode } from "@puzzle-ui/theme";
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  Switch,
  Checkbox,
  TextInput,
  PageLayout,
  SectionStack,
  Section,
  Link,
  Stack,
  Text,
  Heading,
  Grid,
} from "@puzzle-ui/ui";
import "./home.css";
import { Header } from "@/components/layout/header";
import { useEffect, useRef, useState, type ComponentType } from "react";
import {
  type componentPanels,
  randomComponentsOfLength,
} from "@/components/component-catalog";
import { Schema } from "@puzzle-ui/seo";

const features = [
  {
    number: "01",
    title: "Designed to compose",
    icon: "hugeicons:infinity-circle",
    description:
      "Build interfaces from small, predictable building blocks. Compose complex experiences without fighting the framework.",
  },
  {
    number: "02",
    title: "Accessibility informed",
    icon: "hugeicons:universal-access-circle",
    description:
      "Semantic markup, keyboard navigation, focus management, and screen reader behavior are considered in the component design.",
  },
  {
    number: "03",
    title: "Developer experience",
    icon: "griddy-icons:code-circle",
    description:
      "TypeScript-first APIs, predictable behavior and a consistent design system make development enjoyable.",
  },
];

const codeExample = `import { Button, Card, Heading, Text } from "@puzzle-ui/ui";

export function Welcome() {
  return (
    <Card>
      <Heading level="headline2">Welcome to Puzzle</Heading>
      <Text>Build something wonderful.</Text>
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

type ComponentPreviewProps = {
  onToggleTheme: () => void;
};

const ComponentPreview = ({ onToggleTheme }: ComponentPreviewProps) => (
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
              defaultChecked
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

const PuzzleLogo = ({
  size = 36,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <img
    src="/favicon.svg"
    width={size}
    height={size}
    alt="Logo"
    className={className}
  />
);

type ComponentPanels = typeof componentPanels;

const FeatureCards = () => {
  const firstIconRef = useRef<HTMLDivElement>(null);
  const [Icon, setIcon] = useState<typeof import("@puzzle-ui/icons").Icon | null>(null);

  useEffect(() => {
    const target = firstIconRef.current;
    if (!target) return;

    let active = true;
    const load = () => {
      void import("@puzzle-ui/icons")
        .then((module) => {
          if (active) setIcon(() => module.Icon);
        })
        .catch((error: unknown) => {
          console.error("Failed to load the home feature icons:", error);
        });
    };

    if (!("IntersectionObserver" in window)) {
      load();
      return () => { active = false; };
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        load();
      }
    }, { rootMargin: "600px" });
    observer.observe(target);
    return () => {
      active = false;
      observer.disconnect();
    };
  }, []);

  return (
    <Stack direction={{ mobile: "col", tablet: "row" }} wrap="nowrap" gap="md">
      {features.map((feature, index) => (
        <Card key={feature.number}>
          <div
            ref={index === 0 ? firstIconRef : undefined}
            className="home-feature-card__icon"
          >
            {Icon ? (
              <Icon name={feature.icon} size={32} aria-hidden="true" />
            ) : (
              <svg width="32" height="32" aria-hidden="true" />
            )}
          </div>
          <Heading level="headline3" as="h3">
            {feature.title}
          </Heading>
          <Text>{feature.description}</Text>
        </Card>
      ))}
    </Stack>
  );
};

const DeferredComponentCarousel = ({ panels }: { panels: ComponentPanels }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef<ComponentType<{ panels: ComponentPanels }> | null>(null);
  const [Carousel, setCarousel] = useState<ComponentType<{ panels: ComponentPanels }> | null>(null);

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
      return () => { active = false; };
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        load();
      }
    }, { rootMargin: "600px" });
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
        if (!event.currentTarget.contains(event.relatedTarget) && loadedRef.current) {
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
                  <span className="home-component-card__icon" aria-hidden="true">
                    <svg />
                  </span>
                  <CardHeader>
                    <CardTitle>{component.name}</CardTitle>
                    <CardDescription>{component.description}</CardDescription>
                  </CardHeader>
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
  const [theme, setTheme] = useState<ThemeMode>("dark");
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
      <PageLayout>
        <PageLayout.Header className="puzzle-site-header">
          <Header />
        </PageLayout.Header>
        <PageLayout.Main>
          <SectionStack>
            <Section>
              <div className="home-hero__background" />
              <Stack
                className="home-hero__stack"
                direction={{ mobile: "col", desktop: "row" }}
                alignV="center"
                alignH={{ mobile: "stretch", desktop: "evenly" }}
                gap="xl"
              >
                <Stack
                  className="home-hero__content"
                  direction="col"
                  alignH="start"
                  alignV="center"
                >
                  <Stack direction="col" alignV="center" alignH="start">
                    <Heading level="headline1" as="h1">
                      A TypeScript-first
                      <br />
                      <span>React design system.</span>
                    </Heading>

                    <Text className="home-hero__description">
                      Build accessible React interfaces with a TypeScript-first
                      component system, or explore a broader ecosystem of
                      developer packages designed to work together where useful.
                    </Text>
                  </Stack>
                  <Stack
                    className="home-hero__actions"
                    direction="row"
                    alignH="center"
                    wrap="wrap"
                  >
                    <Button variant="primary" href="/docs/getting-started">
                      Start building <ArrowIcon />
                    </Button>

                    <Button variant="outline" href="/docs/ui">
                      <CodeIcon /> Explore components
                    </Button>
                  </Stack>

                  <Stack
                    className="home-hero__meta"
                    direction="row"
                    alignH="center"
                    wrap="wrap"
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
                </Stack>

                <div className="home-hero__visual">
                  <div className="home-hero__visual-glow" />
                  <ComponentPreview
                    onToggleTheme={() =>
                      setTheme(theme === "dark" ? "light" : "dark")
                    }
                  />
                  <div className="home-hero__floating home-hero__floating--top">
                    <span className="home-floating-icon">✳</span>
                    <div>
                      <strong>Thoughtful by design</strong>
                      <span>Every detail matters.</span>
                    </div>
                  </div>
                  <div className="home-hero__floating home-hero__floating--bottom">
                    <span className="home-floating-check">✓</span>
                    <div>
                      <strong>Accessibility in focus</strong>
                      <span>Semantics, labels, focus, and keyboard use.</span>
                    </div>
                  </div>
                </div>
              </Stack>
            </Section>

            <Section theme="dark">
              <Stack
                direction={{ mobile: "col", tablet: "row" }}
                alignH="center"
                alignV="center"
                wrap="wrap"
                gap="md"
              >
                <span>ONE DESIGN SYSTEM</span>
                <span className="home-strip__line" />
                <span>ENDLESS POSSIBILITIES</span>
                <span className="home-strip__line" />
                <span>
                  REACT DESIGN SYSTEM | SHARED TOKENS | DEVELOPER TOOLS
                </span>
              </Stack>
            </Section>

            <Section id="features" className="home-below-fold">
              <Stack direction="col" alignH="center" alignV="center" gap="xl">
                <Stack direction="col" alignH="start" alignV="center">
                  <Badge color="secondary" content="Why Puzzle" />
                  <Heading level="headline1" as="h2">
                    Less boilerplate.
                    <br />
                    <span>More building.</span>
                  </Heading>
                  <Text className="home-hero__description">
                    The foundations of a great interface, thoughtfully
                    implemented so you can focus on creating great products.
                  </Text>
                </Stack>

                <FeatureCards />
              </Stack>
            </Section>

            <Section theme="dark" id="components" className="home-below-fold">
              <Stack
                direction="col"
                alignH="center"
                alignV={{ mobile: "center", desktop: "center" }}
                gap="xl"
              >
                <Stack direction="col" alignH="start" alignV="start">
                  <Badge color="secondary" content="The building blocks" />
                  <Heading level="headline1" as="h2">
                    Everything you need.
                    <br />
                    <span>Nothing you don't.</span>
                  </Heading>
                  <Text className="home-hero__description">
                    A growing collection of carefully designed components. Each
                    one built to work together as part of a consistent design
                    system.
                  </Text>
                  <Button
                    variant="outline"
                    href="/docs/ui"
                    className="home-text-link"
                  >
                    Explore all components <ArrowIcon />
                  </Button>
                </Stack>

                <DeferredComponentCarousel panels={panels} />
              </Stack>
            </Section>

            <Section id="ecosystem" className="home-below-fold">
              <Stack direction="col" alignH="center" gap="xl">
                <Stack direction="col" alignH="start" alignV="center">
                  <Badge color="secondary" content="The Puzzle ecosystem" />
                  <Heading level="headline1" as="h2">
                    More than components.
                  </Heading>
                  <Text className="home-hero__description">
                    Puzzle is more than a component library. Its packages can
                    be used independently where supported and composed as your
                    application grows, with accessibility and developer
                    experience at the center.
                  </Text>
                </Stack>

                <Grid columns={{ mobile: 1, tablet: 2, desktop: 2 }}>
                  {ecosystem.map((item) => (
                    <Card as="a" interactive href={item.href} key={item.href}>
                      <CardHeader>
                        <CardTitle>{item.name}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </Grid>

                <Text className="home-hero__description">
                  Component API maturity and package-specific compatibility
                  notes are documented with each package.
                </Text>
              </Stack>
            </Section>

            <Section className="home-developer home-below-fold" id="developers">
              <Stack
                className="home-developer__layout"
                direction={{ mobile: "col", desktop: "row" }}
                alignV="start"
                alignH={{ mobile: "center", desktop: "evenly" }}
                gap="xl"
              >
                <Stack
                  className="home-hero__content home-developer__content"
                  direction="col"
                  alignH={{ mobile: "stretch", desktop: "start" }}
                  alignV="center"
                >
                  <Stack
                    direction="col"
                    alignV="center"
                    alignH="start"
                    className="desktop:max-w-105"
                  >
                    <Badge color="secondary" content="Made for developers" />
                    <Heading level="display1" as="h2">
                      Your ideas.
                      <br />
                      <span>Without the friction.</span>
                    </Heading>
                    <Text className="home-hero__description">
                      Predictable APIs, powerful composition and a consistent
                      design language. Puzzle gives you the building blocks to
                      turn ideas into polished experiences.
                    </Text>
                  </Stack>
                  <div className="home-developer__benefits">
                    <div>
                      <span>01</span>
                      <strong>TypeScript-first</strong>
                      <p>
                        Excellent types and a predictable developer experience.
                      </p>
                    </div>
                    <div>
                      <span>02</span>
                      <strong>Flexible by design</strong>
                      <p>
                        Customize and compose components to fit your product.
                      </p>
                    </div>
                    <div>
                      <span>03</span>
                      <strong>Accessibility matters</strong>
                      <p>
                        Thoughtful interaction patterns and semantic
                        foundations.
                      </p>
                    </div>
                  </div>
                </Stack>
                <div className="home-code">
                  <div className="home-code__header">
                    <div className="home-preview__dots">
                      <span />
                      <span />
                      <span />
                    </div>
                    <span>Welcome.tsx</span>
                    <Badge color="secondary" content="TSX" />
                  </div>
                  <pre>
                    <code>{codeExample}</code>
                  </pre>
                  <div className="home-code__footer">
                    <span>Simple. Composable. Predictable.</span>
                    <span>⌘ + C</span>
                  </div>
                </div>
              </Stack>
            </Section>

            <Section theme="dark" className="home-cta home-below-fold">
              <Stack direction="col" alignH="center">
                <Stack direction="col" alignV="start" alignH="center" gap="0">
                  <PuzzleLogo size={128} className="mt-4" />
                  <Heading level="headline1">
                    Make something
                    <br />
                    <span>remarkable.</span>
                  </Heading>
                  <Text className="home-hero__description">
                    Start building with Puzzle. Explore the components, create
                    your design system and bring your ideas to life.
                  </Text>
                </Stack>
                <Button variant="primary" href="/docs/getting-started">
                  Get started with Puzzle <ArrowIcon />
                </Button>
              </Stack>
            </Section>
          </SectionStack>
          <footer className="home-footer">
            <Link className="home-brand" href="/">
              <PuzzleLogo size={28} />
              <Text as="span">puzzle-ui.com</Text>
            </Link>

            <span>Made for developers who care about the details.</span>

            <div>
              <Link href="/docs/getting-started">Documentation</Link>
              <Link
                href="https://github.com/senorprogramador/puzzle"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </Link>
              <span>© {new Date().getFullYear()} Puzzle UI</span>
            </div>
          </footer>
        </PageLayout.Main>
      </PageLayout>
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
