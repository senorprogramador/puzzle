import { createFileRoute } from "@tanstack/react-router";
import { Theme, ThemeMode } from "@puzzle-ui/theme";
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  Carousel,
  CarouselController,
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
} from "@puzzle-ui/ui";
import "./home.css";
import { Header } from "@/components/layout/header";
import { useState } from "react";
import { Icon } from "@puzzle-ui/icons/icon";
import { componentPanels } from "@/components/component-catalog";

const features = [
  {
    number: "01",
    title: "Designed to compose",
    description:
      "Build interfaces from small, predictable building blocks. Compose complex experiences without fighting the framework.",
  },
  {
    number: "02",
    title: "Accessibility first",
    description:
      "Keyboard navigation, focus management, semantic markup and screen reader support are part of the foundation.",
  },
  {
    number: "03",
    title: "Developer experience",
    description:
      "TypeScript-first APIs, predictable behavior and a consistent design system make development enjoyable.",
  },
];

const codeExample = `import { Button, Card, Heading, Text } from "@puzzle/ui";

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

        <Stack direction="row" alignV="center" gap="sm">
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
              <strong>Dark mode</strong>
              <span>Use dark appearance</span>
            </div>
            <Switch defaultChecked onChange={onToggleTheme} />
          </div>

          <div className="home-preview__control">
            <div>
              <strong>Notifications</strong>
              <span>Receive updates</span>
            </div>
            <Switch />
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
        <label className="home-preview__input-label">Project name</label>
        <TextInput placeholder="My awesome project" defaultValue="Puzzle UI" />
      </Card>

      <div className="home-preview__footer">
        <span>
          <span className="home-preview__status" />
          All components ready
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

const Home = () => {
  const [theme, setTheme] = useState<ThemeMode>("dark");
  return (
    <Theme theme={theme} scope="local">
      <PageLayout>
        <PageLayout.Header className="puzzle-site-header">
          <Header />
        </PageLayout.Header>
        <PageLayout.Main>
          <SectionStack>
            <Section>
              <div className="home-hero__background" />
              <Stack
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
                      Interfaces,
                      <br />
                      <span>beautifully</span> composed.
                    </Heading>

                    <Text className="home-hero__description">
                      A thoughtfully crafted React UI framework for developers
                      who care about the details. Build accessible, consistent
                      and beautiful interfaces without getting in your way.
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
                      Accessibility focused
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
                      <strong>Accessible by default</strong>
                      <span>Built for everyone.</span>
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
                <span>BUILT FOR REACT</span>
                <span className="home-strip__line" />
                <span>BUILT FOR NEXT.JS</span>
                <span className="home-strip__line" />
                <span>BUILT FOR TANSTACK START</span>
              </Stack>
            </Section>

            <Section id="features">
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

                <Stack
                  direction={{ mobile: "col", tablet: "row" }}
                  wrap="nowrap"
                  gap="md"
                >
                  {features.map((feature) => (
                    <Card key={feature.number}>
                      <div className="home-feature-card__icon">
                        {feature.number === "01" ? (
                          <Icon name="hugeicons:infinity-circle" size={32} />
                        ) : feature.number === "02" ? (
                          <Icon
                            name="hugeicons:universal-access-circle"
                            size={32}
                          />
                        ) : (
                          <Icon name="griddy-icons:code-circle" size={32} />
                        )}
                      </div>
                      <Heading level="headline3" as="h3">
                        {feature.title}
                      </Heading>
                      <Text>{feature.description}</Text>
                    </Card>
                  ))}
                </Stack>
              </Stack>
            </Section>

            <Section theme="dark" id="components">
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

                <CarouselController items={componentPanels}>
                  <Carousel<(typeof componentPanels)[number]>
                    className="home-component-carousel"
                    ariaLabel="UI components"
                    panelsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
                    gap="1rem"
                    getItemKey={(panel) => panel[0]!.href}
                    backButton={
                      <Button
                        variant="outline"
                        size="sm"
                        aria-label="Previous component panels"
                      >
                        <Icon
                          name="akar-icons:chevron-left"
                          aria-hidden="true"
                        />
                      </Button>
                    }
                    nextButton={
                      <Button
                        variant="outline"
                        size="sm"
                        aria-label="Next component panels"
                      >
                        <Icon
                          name="akar-icons:chevron-right"
                          aria-hidden="true"
                        />
                      </Button>
                    }
                    buttonAlignment="aside"
                    renderItem={(panel) => (
                      <Stack
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
                            aria-labelledby={`component-${component.href.split("/").at(-1)}`}
                          >
                            <span className="home-component-card__icon">
                              <Icon name={component.icon} aria-hidden="true" />
                            </span>
                            <CardHeader>
                              <CardTitle
                                id={`component-${component.href.split("/").at(-1)}`}
                              >
                                {component.name}
                              </CardTitle>
                              <CardDescription>
                                {component.description}
                              </CardDescription>
                            </CardHeader>
                          </Card>
                        ))}
                      </Stack>
                    )}
                  />
                </CarouselController>
              </Stack>
            </Section>

            <Section className="home-developer" id="developers">
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

            <Section theme="dark" className="home-cta">
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
              <Text as="span">puzzle-ui</Text>
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
});
