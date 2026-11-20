import { useMemo, useState, type FormEvent } from "react";

import {
  AboutSection,
  BenefitsSection,
  BlogSection,
  ContactSection,
  CTASection,
  FAQSection,
  FeaturesSection,
  FooterSection,
  Hero,
  ServicesSection,
} from "@puzzle-ui/pieces";
import { Button, FormField, TextAreaInput, TextInput } from "@puzzle-ui/ui";

import "./App.css";

const navigationLinks = [
  { id: "home", label: "Home", href: "/" },
  { id: "about", label: "About", href: "/about" },
  { id: "services", label: "Capabilities", href: "/services" },
  { id: "journal", label: "Journal", href: "/journal" },
  { id: "contact", label: "Contact", href: "/contact" },
] as const;

const stories = [
  {
    id: "choosing-the-right-layer",
    title: "Choosing the right layer",
    excerpt:
      "A practical way to decide between a reusable primitive, a composed section, and ordinary React.",
    category: "Composition",
    href: "/journal/choosing-the-right-layer",
    body: [
      "Start with the behavior and content your page needs. A UI primitive is a good fit when you need a focused interaction or control. A Piece is useful when its complete section composition matches the page. Ordinary React remains the right choice for layout and behavior that are specific to your application.",
      "Before creating something new, check the package's public exports and examples. Prefer the smallest layer that fully expresses the requirement, and keep routing, data, and persistence in the application.",
    ],
  },
  {
    id: "from-tokens-to-interface",
    title: "From tokens to interface",
    excerpt:
      "How a shared theme can keep an interface coherent while its pages and components vary.",
    category: "Design systems",
    href: "/journal/from-tokens-to-interface",
    body: [
      "A design system is more than a palette. Semantic tokens give components a shared language for surfaces, text, borders, and emphasis while allowing a theme to change those values in one place.",
      "Use the existing theme tokens before adding local values. Compose sections with distinct content and hierarchy so that consistency does not make every page look identical.",
    ],
  },
  {
    id: "testing-the-user-journey",
    title: "Testing the user journey",
    excerpt:
      "A focused browser checklist for navigation, forms, keyboard use, responsive layouts, and runtime errors.",
    category: "Quality",
    href: "/journal/testing-the-user-journey",
    body: [
      "Automated tests are most useful when they exercise behavior a person depends on: opening a menu, completing a form, following a link, or using a control with a keyboard.",
      "Pair those checks with screenshots and manual visual inspection at representative widths. A passing layout assertion cannot judge hierarchy, cropping, readability, or whether the page feels coherent.",
    ],
  },
] as const;

type Story = (typeof stories)[number];

const ProductPreview = () => (
  <div className="product-preview" aria-hidden="true">
    <div className="product-preview__topline">
      <span className="product-preview__mark">P</span>
      <span className="product-preview__label">A connected system</span>
      <span className="product-preview__status">Ready to compose</span>
    </div>
    <div className="product-preview__body">
      <div className="product-preview__rail">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="product-preview__canvas">
        <span className="product-preview__eyebrow">YOUR NEXT IDEA</span>
        <span className="product-preview__title">Start with a clear foundation.</span>
        <span className="product-preview__line product-preview__line--long" />
        <span className="product-preview__line" />
        <div className="product-preview__cards">
          <span>
            <i />
            UI primitives
          </span>
          <span>
            <i />
            Page sections
          </span>
          <span>
            <i />
            Theme tokens
          </span>
        </div>
      </div>
    </div>
  </div>
);

const SiteHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = window.location.pathname.replace(/\/$/, "") || "/";

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="site-brand" href="/" aria-label="Puzzle home">
          <span className="site-brand__mark" aria-hidden="true">
            P
          </span>
          <span>Puzzle</span>
        </a>
        <button
          className="site-menu-toggle"
          type="button"
          aria-controls="primary-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true">{menuOpen ? "Close" : "Menu"}</span>
        </button>
        <nav
          id="primary-navigation"
          className="site-nav"
          aria-label="Primary navigation"
          data-open={menuOpen}
        >
          {navigationLinks.map((link) => {
            const isCurrent =
              pathname === link.href ||
              (link.href === "/journal" && pathname.startsWith("/journal/"));

            return (
              <a
                key={link.id}
                href={link.href}
                aria-current={isCurrent ? "page" : undefined}
              >
                {link.label}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

const SiteFooter = () => (
  <FooterSection
    className="site-footer"
    variant="multi-column"
    logo={<span className="site-footer__brand">Puzzle</span>}
    description="A React ecosystem for building thoughtful digital experiences."
    navigationGroups={[
      {
        id: "explore",
        label: "Explore",
        links: navigationLinks.slice(1).map(({ id, label, href }) => ({
          id,
          label,
          href,
        })),
      },
    ]}
    copyright="Reference experience · Sample content"
  />
);

const PageIntro = ({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) => (
  <Hero
    className="page-intro"
    layout="centered"
    eyebrow={eyebrow}
    title={title}
    description={description}
  />
);

const HomePage = () => (
  <>
    <Hero
      className="home-hero"
      layout="split"
      eyebrow="A composable React ecosystem"
      title="Build thoughtfully. Grow with confidence."
      description="Start with reusable UI, compose the sections that fit, and keep your application in control."
      actions={
        <div className="hero-actions">
          <Button href="/services" variant="primary">
            Explore capabilities
          </Button>
          <Button href="/about" variant="outline">
            How Puzzle works
          </Button>
        </div>
      }
      media={<ProductPreview />}
    />
    <BenefitsSection
      className="home-benefits"
      eyebrow="A considered foundation"
      title="The pieces of a better starting point"
      items={[
        {
          id: "composable",
          title: "Compose what you need",
          description:
            "Use focused primitives and larger sections together without giving up application control.",
        },
        {
          id: "consistent",
          title: "Keep a shared language",
          description:
            "Build on theme tokens and shared patterns instead of starting from unrelated styles.",
        },
        {
          id: "adaptable",
          title: "Choose the right level",
          description:
            "Use a Piece, a UI component, or ordinary React according to the shape of the task.",
        },
      ]}
    />
    <FeaturesSection
      className="home-features"
      variant="tabs"
      eyebrow="A flexible toolkit"
      title="One system, different building blocks"
      description="Move from a single control to a complete page section while keeping your app's data and behavior close to home."
      items={[
        {
          id: "primitives",
          title: "UI primitives",
          description:
            "Use reusable controls and components for focused interface needs, such as buttons, inputs, and navigation.",
        },
        {
          id: "sections",
          title: "Composable sections",
          description:
            "Start with a ready-made page composition when its structure fits, then provide your own content and actions.",
        },
        {
          id: "foundations",
          title: "Theme and shared tools",
          description:
            "Use shared tokens, hooks, and utilities to support a consistent experience across your application.",
        },
      ]}
    />
    <CTASection
      className="home-cta"
      eyebrow="Start where you are"
      title="Build the experience your project needs."
      description="Explore the capabilities, then choose the components and patterns that fit your own application."
      primaryAction={
        <Button href="/services" variant="primary">
          Browse capabilities
        </Button>
      }
      secondaryAction={
        <Button href="/contact" variant="outline">
          Get in touch
        </Button>
      }
    />
  </>
);

const AboutPage = () => (
  <>
    <PageIntro
      eyebrow="About Puzzle"
      title="A thoughtful toolkit for building on the web."
      description="Puzzle brings reusable React building blocks together with themes, shared utilities, and application scaffolding."
    />
    <AboutSection
      className="about-story"
      variant="mission"
      eyebrow="The idea"
      title="Useful building blocks. Your application stays yours."
      description="Puzzle supports both human developers and AI-assisted application development, without taking routing, data, or product decisions away from the team building the app."
      mission="Make it easier to find and compose the right building blocks for an application."
      vision="A web where shared foundations make room for more distinct, useful experiences."
      values={[
        {
          id: "composability",
          title: "Composability",
          description: "Use a focused primitive or a complete section as needed.",
        },
        {
          id: "clarity",
          title: "Clarity",
          description:
            "Keep public APIs, responsibilities, and application behavior understandable.",
        },
        {
          id: "choice",
          title: "Application ownership",
          description:
            "Keep routing, content, validation, and persistence in the app.",
        },
      ]}
    />
    <CTASection
      className="about-cta"
      title="See how the pieces fit together."
      description="Explore the capabilities or read the sample journal for practical guidance."
      primaryAction={
        <Button href="/services" variant="primary">
          Explore capabilities
        </Button>
      }
      secondaryAction={
        <Button href="/journal" variant="outline">
          Visit the journal
        </Button>
      }
    />
  </>
);

const ServicesPage = () => (
  <>
    <PageIntro
      eyebrow="Capabilities"
      title="A connected set of building blocks."
      description="Use a layer on its own or combine the parts that make sense for your project."
    />
    <ServicesSection
      className="services-list"
      variant="grid"
      eyebrow="Explore the ecosystem"
      title="From interface details to application foundations"
      description="These examples describe the kinds of capabilities available in the Puzzle workspace."
      items={[
        {
          id: "ui-primitives",
          title: "UI primitives",
          description:
            "Reusable React components for actions, forms, navigation, data display, and other interface needs.",
        },
        {
          id: "page-sections",
          title: "Composable page sections",
          description:
            "Larger page and dashboard compositions that accept application-owned content and actions.",
        },
        {
          id: "design-tokens",
          title: "Design tokens and theming",
          description:
            "Theme providers and semantic tokens for color, typography, and consistent interface styling.",
        },
        {
          id: "shared-utilities",
          title: "Hooks and shared utilities",
          description:
            "Reusable behavior and framework-neutral helpers that support application development.",
        },
        {
          id: "application-services",
          title: "Auth and storage foundations",
          description:
            "Authentication, sessions, database-neutral storage contracts, and separate database adapters.",
        },
        {
          id: "framework-tools",
          title: "Framework integrations and scaffolding",
          description:
            "Documented framework entry points, SEO tooling, and a CLI for generating application starters.",
        },
      ]}
    />
    <FAQSection
      className="services-faq"
      eyebrow="Common questions"
      title="How to think about the building blocks"
      items={[
        {
          id: "application-behavior",
          question: "Do page sections include application behavior?",
          answer:
            "They render the content and controls provided by the application. Routing, data fetching, validation, permissions, and persistence remain application responsibilities.",
        },
        {
          id: "framework",
          question: "Does this reference website use a full-stack framework?",
          answer:
            "No. This reference experience is a client-side Vite and React app. Framework-specific examples are separate applications in the repository.",
        },
        {
          id: "contact-form",
          question: "Does the contact form send or save a message?",
          answer:
            "No. It demonstrates browser validation and a success state only; it does not send or store form data.",
        },
      ]}
    />
  </>
);

const JournalPage = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All topics");
  const categories = ["All topics", ...new Set(stories.map((story) => story.category))];
  const filteredStories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return stories.filter((story) => {
      const matchesCategory =
        category === "All topics" || story.category === category;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${story.title} ${story.excerpt} ${story.category}`
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <>
      <PageIntro
        eyebrow="The journal"
        title="Notes for building with care."
        description="Sample editorial content about composition, design systems, and quality. This reference site does not claim to be a published journal."
      />
      <section className="journal-tools" aria-label="Filter journal stories">
        <div className="journal-tools__search">
          <label htmlFor="journal-search">Search stories</label>
          <TextInput
            id="journal-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="Search by topic or title"
          />
        </div>
        <div className="journal-tools__topics" role="group" aria-label="Filter by topic">
          {categories.map((item) => (
            <Button
              key={item}
              type="button"
              size="sm"
              variant={category === item ? "primary" : "outline"}
              aria-pressed={category === item}
              onClick={() => setCategory(item)}
            >
              {item}
            </Button>
          ))}
        </div>
        <p className="journal-tools__count" role="status" aria-live="polite">
          {filteredStories.length}{" "}
          {filteredStories.length === 1 ? "story" : "stories"} found
        </p>
      </section>
      {filteredStories.length > 0 ? (
        <BlogSection
          className="journal-results"
          variant="grid"
          eyebrow="Sample stories"
          title="Ideas to explore"
          items={filteredStories.map(({ body: _body, ...story }) => story)}
        />
      ) : (
        <section className="journal-empty">
          <h2>No stories match those filters.</h2>
          <p>Try a different search or choose another topic.</p>
        </section>
      )}
    </>
  );
};

const ArticlePage = ({ story }: { story: Story }) => (
  <article className="article-page">
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/journal">Journal</a>
        </li>
        <li aria-current="page">{story.title}</li>
      </ol>
    </nav>
    <p className="article-page__category">{story.category} · Sample article</p>
    <h1>{story.title}</h1>
    <p className="article-page__intro">{story.excerpt}</p>
    <div className="article-page__body">
      {story.body.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
    <Button href="/journal" variant="outline">
      Back to the journal
    </Button>
  </article>
);

const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
  };

  return (
    <>
      <PageIntro
        eyebrow="Contact"
        title="Start with a question."
        description="Use the local demo form to see its validation and confirmation behavior. No data leaves this browser."
      />
      <ContactSection
        className="contact-section"
        variant="split"
        eyebrow="A demo interaction"
        title="Send a sample message"
        description="The form is intentionally client-only. It does not send or persist the information you enter."
        formSlot={
          <form className="contact-form" onSubmit={handleSubmit}>
            <FormField label="Name" controlId="contact-name" required>
              <TextInput name="name" autoComplete="name" required />
            </FormField>
            <FormField label="Email" controlId="contact-email" required>
              <TextInput
                name="email"
                type="email"
                prefix={null}
                autoComplete="email"
                required
              />
            </FormField>
            <FormField label="Message" controlId="contact-message" required>
              <TextAreaInput name="message" rows={4} required />
            </FormField>
            <Button type="submit" variant="primary">
              Show demo confirmation
            </Button>
          </form>
        }
        successSlot={
          submitted ? (
            <p className="contact-confirmation" role="status">
              Demo complete. No message was sent or stored.
            </p>
          ) : null
        }
      />
    </>
  );
};

const NotFoundPage = () => (
  <section className="not-found-page">
    <p className="not-found-page__eyebrow">404 · Page not found</p>
    <h1>This page is not part of the reference site.</h1>
    <p>Check the address or return to the homepage.</p>
    <Button href="/" variant="primary">
      Return home
    </Button>
  </section>
);

const resolvePage = (pathname: string) => {
  const normalizedPath = pathname.replace(/\/$/, "") || "/";

  if (normalizedPath === "/") return <HomePage />;
  if (normalizedPath === "/about") return <AboutPage />;
  if (normalizedPath === "/services") return <ServicesPage />;
  if (normalizedPath === "/journal") return <JournalPage />;
  if (normalizedPath === "/contact") return <ContactPage />;

  const story = stories.find((item) => item.href === normalizedPath);
  if (story) return <ArticlePage story={story} />;

  return <NotFoundPage />;
};

const App = () => (
  <>
    <a className="skip-link" href="#main-content">
      Skip to content
    </a>
    <SiteHeader />
    <main id="main-content" className="site-main">
      {resolvePage(window.location.pathname)}
    </main>
    <SiteFooter />
  </>
);

export default App;
