import {
  AboutSection,
  AmenityListSection,
  AccommodationDetailsSection,
  AccommodationHero,
  AccommodationOverviewSection,
  AgencyHero,
  AwardsSection,
  BlogSection,
  ContactSection,
  EditorialHero,
  FeaturesSection,
  GuestReviewsSection,
  RestaurantHero,
  RestaurantMenuSection,
  SaaSHero,
  ServicesSection,
  StatsSection,
  TestimonialsSection,
} from "@puzzle-ui/pieces";
import { Button, Image } from "@puzzle-ui/ui";
import type { ComponentType, ReactNode } from "react";
import { useEffect, useState } from "react";

import { sectionPreviewImages } from "../../doc-examples/shared/section-preview-media";
import type {
  PreviewPage,
  WebsiteTemplate,
} from "../theme-studio-model";
import "./website-templates.css";

export type WebsiteTemplateComponentProps = {
  page: PreviewPage;
  onPageChange: (page: PreviewPage) => void;
};

export type WebsiteTemplateMetadata = {
  id: WebsiteTemplate;
  label: string;
  tagline: string;
  detailPageLabel: string;
  summary: string;
};

export const WEBSITE_TEMPLATE_METADATA: readonly WebsiteTemplateMetadata[] = [
  {
    id: "marketing",
    label: "Marketing",
    tagline: "Make good work matter",
    detailPageLabel: "Features",
    summary: "A confident, conversion-focused home for a growing product.",
  },
  {
    id: "bnb",
    label: "B&B",
    tagline: "A little space to exhale",
    detailPageLabel: "Stay",
    summary: "A welcoming guesthouse preview built around rooms and amenities.",
  },
  {
    id: "restaurant",
    label: "Restaurant",
    tagline: "Seasonal food, shared well",
    detailPageLabel: "Menu",
    summary: "A neighborhood dining site with a navigable, filterable menu.",
  },
  {
    id: "blog",
    label: "Blog",
    tagline: "Ideas worth keeping",
    detailPageLabel: "Journal",
    summary: "An editorial front page with topic filters and article previews.",
  },
  {
    id: "corporate",
    label: "Corporate",
    tagline: "A better way forward",
    detailPageLabel: "Services",
    summary: "A considered business site for expertise, services, and results.",
  },
];

type TemplateView = PreviewPage | "detail";

const useTemplateNavigation = (
  template: WebsiteTemplate,
  page: PreviewPage,
  onPageChange: (page: PreviewPage) => void,
) => {
  const [detailPageOpen, setDetailPageOpen] = useState(false);

  useEffect(() => {
    setDetailPageOpen(false);
  }, [page, template]);

  return {
    view: (detailPageOpen ? "detail" : page) as TemplateView,
    openDetailPage: () => setDetailPageOpen(true),
    selectPage: (nextPage: PreviewPage) => {
      setDetailPageOpen(false);
      onPageChange(nextPage);
    },
  };
};

const TemplateAction = ({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) => (
  <Button
    className="theme-studio-template__action"
    variant="primary"
    size="md"
    onClick={onClick}
  >
    {children}
  </Button>
);

const TemplateHeroMedia = ({
  src,
  alt,
  variant,
  children,
}: {
  src: string;
  alt: string;
  variant: "marketing" | "blog" | "corporate" | "stay" | "restaurant";
  children?: ReactNode;
}) => (
  <div
    className={`theme-studio-template__hero-media theme-studio-template__hero-media--${variant}`}
  >
    <Image
      src={src}
      alt={alt}
      fill
      fit="cover"
      loading="eager"
      containerClassName="theme-studio-template__hero-image"
      containerStyle={{ position: "absolute", inset: 0 }}
    />
    {children ? (
      <div className="theme-studio-template__hero-media-overlay">{children}</div>
    ) : null}
  </div>
);

const TemplateFrame = ({
  template,
  brand,
  tagline,
  detailPageLabel,
  view,
  onPageChange,
  onDetailPageChange,
  children,
}: {
  template: WebsiteTemplate;
  brand: string;
  tagline: string;
  detailPageLabel: string;
  view: TemplateView;
  onPageChange: (page: PreviewPage) => void;
  onDetailPageChange: () => void;
  children: ReactNode;
}) => (
  <div
    className="theme-studio-template"
    data-template={template}
    data-template-view={view}
    data-preview-page={view === "detail" ? "home" : view}
  >
    <header className="theme-studio-template__header">
      <Button
        className="theme-studio-template__identity"
        variant="ghost"
        size="sm"
        onClick={() => onPageChange("home")}
        aria-label={`${brand}, home`}
      >
        <span className="theme-studio-template__mark" aria-hidden="true">
          {brand.slice(0, 1)}
        </span>
        <span className="theme-studio-template__identity-copy">
          <strong>{brand}</strong>
          <span>{tagline}</span>
        </span>
      </Button>

      <nav className="theme-studio-template__navigation" aria-label="Preview pages">
        <Button
          variant="ghost"
          size="sm"
          aria-current={view === "home" ? "page" : undefined}
          onClick={() => onPageChange("home")}
        >
          Home
        </Button>
        <Button
          variant="ghost"
          size="sm"
          aria-current={view === "detail" ? "page" : undefined}
          onClick={onDetailPageChange}
        >
          {detailPageLabel}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          aria-current={view === "about" ? "page" : undefined}
          onClick={() => onPageChange("about")}
        >
          About
        </Button>
        <Button
          variant="ghost"
          size="sm"
          aria-current={view === "contact" ? "page" : undefined}
          onClick={() => onPageChange("contact")}
        >
          Contact
        </Button>
      </nav>
    </header>

    <div className="theme-studio-template__main">{children}</div>

    <footer className="theme-studio-template__footer">
      <span>{brand}</span>
      <span>Website preview · Built with Puzzle</span>
      <Button
        variant="link"
        size="sm"
        onClick={() => onPageChange("home")}
      >
        Back to home
      </Button>
    </footer>
  </div>
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
  <section className="theme-studio-template__page-intro">
    <p className="theme-studio-template__eyebrow">{eyebrow}</p>
    <h1>{title}</h1>
    <p>{description}</p>
  </section>
);

const marketingFeatures = [
  {
    id: "focus",
    title: "Find your focus",
    description:
      "Bring the right work into view and give your team a clear place to begin.",
  },
  {
    id: "momentum",
    title: "Build momentum",
    description:
      "Turn decisions into manageable next steps without adding more process.",
  },
  {
    id: "direction",
    title: "See what is next",
    description:
      "Keep priorities visible so progress stays connected to the bigger picture.",
  },
];

const marketingStats = [
  { id: "teams", label: "Teams supported", value: "2,400+" },
  { id: "projects", label: "Projects moved forward", value: "18k" },
  { id: "retention", label: "Would recommend us", value: "96%" },
];

const marketingTestimonials = [
  {
    id: "maya",
    quote:
      "We replaced a scattered process with a shared sense of what matters next.",
    author: "Maya Chen",
    role: "Operations lead",
    organization: "Common Ground",
    rating: 5,
  },
  {
    id: "jordan",
    quote:
      "The simple view helped our team make better decisions with less noise.",
    author: "Jordan Lee",
    role: "Product director",
    organization: "Northwind",
    rating: 5,
  },
];

export const MarketingTemplate = ({
  page,
  onPageChange,
}: WebsiteTemplateComponentProps) => {
  const navigation = useTemplateNavigation("marketing", page, onPageChange);

  return (
    <TemplateFrame
      template="marketing"
      brand="Northstar"
      tagline="Make good work matter"
      detailPageLabel="Features"
      view={navigation.view}
      onPageChange={navigation.selectPage}
      onDetailPageChange={navigation.openDetailPage}
    >
      {navigation.view === "home" ? (
        <>
          <SaaSHero
            className="theme-studio-template__hero"
            eyebrow="A clearer way to move"
            title="Make room for your next big idea."
            description="Thoughtful tools for teams that want to turn good intentions into meaningful progress."
            layout="asymmetric"
            height="large"
            theme="light"
            overlay="none"
            mediaPosition="right"
            media={
              <TemplateHeroMedia
                variant="marketing"
                src={sectionPreviewImages.team}
                alt="A small team working together around a table"
              >
                <div className="theme-studio-template__summary-card">
                <p className="theme-studio-template__eyebrow">This week</p>
                <strong>Good work, in motion</strong>
                <ul>
                  <li><span>Set a clear direction</span><span>Ready</span></li>
                  <li><span>Bring people together</span><span>In progress</span></li>
                  <li><span>Make the next move</span><span>Up next</span></li>
                </ul>
                </div>
              </TemplateHeroMedia>
            }
            actions={
              <TemplateAction onClick={() => navigation.selectPage("contact")}>
                Start a conversation
              </TemplateAction>
            }
          />
          <StatsSection
            className="theme-studio-template__section"
            title="Progress that feels tangible"
            description="A few signals from teams using Northstar to work with more intention."
            variant="inline"
            items={marketingStats}
          />
          <TestimonialsSection
            className="theme-studio-template__section"
            title="A calmer way to make progress"
            variant="grid"
            items={marketingTestimonials}
          />
        </>
      ) : null}

      {navigation.view === "detail" ? (
        <>
          <PageIntro
            eyebrow="Northstar, at a glance"
            title="The pieces that keep good work moving."
            description="Explore the practical tools behind a clearer, more connected way to work."
          />
          <FeaturesSection
            className="theme-studio-template__section"
            title="Everything you need to move forward"
            description="Build a rhythm that keeps priorities, people, and progress in view."
            variant="bento"
            items={marketingFeatures}
          />
          <TestimonialsSection
            className="theme-studio-template__section"
            title="Made for real teams"
            variant="quote"
            items={marketingTestimonials.slice(0, 1)}
          />
        </>
      ) : null}

      {navigation.view === "about" ? (
        <>
          <PageIntro
            eyebrow="About Northstar"
            title="Good work deserves a clearer path."
            description="We help thoughtful teams bring focus to their work and make progress they can feel."
          />
          <AboutSection
            className="theme-studio-template__section"
            variant="editorial"
            title="A tool should make the work feel more human."
            description="Northstar grew from a simple belief: teams do better when they can see what matters, make room for each other, and move forward together."
            mission="Make meaningful work easier to start, share, and sustain."
            vision="A world where every team can spend more energy on the work that matters."
            values={[
              { id: "clarity", title: "Clarity", description: "Make the important thing easier to see." },
              { id: "care", title: "Care", description: "Build around the people doing the work." },
              { id: "progress", title: "Progress", description: "Keep learning and moving, one step at a time." },
            ]}
          />
        </>
      ) : null}

      {navigation.view === "contact" ? (
        <>
          <PageIntro
            eyebrow="Start with a hello"
            title="Let’s find your next good step."
            description="Tell us what your team is working toward. We’ll help you see whether Northstar is a fit."
          />
          <ContactSection
            className="theme-studio-template__section"
            variant="split"
            title="Talk with our team"
            description="This preview shows contact details only; it does not send messages."
            email="hello@northstar.example"
            openingHours="Weekdays, 9am–5pm"
          />
        </>
      ) : null}
    </TemplateFrame>
  );
};

const accommodationItems = [
  {
    id: "garden-room",
    name: "The Garden Room",
    description: "A quiet room with a king bed and a view over the courtyard.",
    capacity: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    price: { amount: 148, currency: "USD" },
    priceNote: "per night",
    featured: true,
  },
  {
    id: "loft-suite",
    name: "The Loft Suite",
    description: "A light-filled suite with a small sitting area and space to stay awhile.",
    capacity: 3,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    price: { amount: 186, currency: "USD" },
    priceNote: "per night",
  },
];

const guestReviews = [
  {
    id: "ellen",
    quote: "A thoughtful, peaceful place to come back to after a day outside.",
    author: "Ellen R.",
    rating: 5,
    date: "October 2025",
  },
  {
    id: "sam",
    quote: "The breakfast and the small details made the whole stay feel easy.",
    author: "Sam T.",
    rating: 5,
    date: "September 2025",
  },
];

const accommodationAmenities = [
  {
    id: "in-room",
    name: "In every room",
    items: [
      { id: "wifi", label: "Wi-Fi and a reading nook" },
      { id: "linens", label: "Soft cotton linens" },
      { id: "coffee", label: "Tea and coffee" },
    ],
  },
  {
    id: "around-the-house",
    name: "Around the house",
    items: [
      { id: "breakfast", label: "Fresh breakfast each morning" },
      { id: "garden", label: "A shared garden and quiet sitting areas" },
    ],
  },
];

export const BedAndBreakfastTemplate = ({
  page,
  onPageChange,
}: WebsiteTemplateComponentProps) => {
  const navigation = useTemplateNavigation("bnb", page, onPageChange);

  return (
    <TemplateFrame
      template="bnb"
      brand="Hearth & Stay"
      tagline="A little space to exhale"
      detailPageLabel="Stay"
      view={navigation.view}
      onPageChange={navigation.selectPage}
      onDetailPageChange={navigation.openDetailPage}
    >
      {navigation.view === "home" ? (
        <>
          <AccommodationHero
            className="theme-studio-template__hero"
            eyebrow="A welcoming guesthouse"
            title="Come away. Feel at home."
            description="Slow mornings, thoughtful details, and a comfortable place to return to at the end of the day."
            layout="full-width"
            height="large"
            theme="dark"
            alignment="center"
            overlay="gradient"
            mediaPosition="background"
            media={
              <TemplateHeroMedia
                variant="stay"
                src={sectionPreviewImages.landscape}
                alt="A mountain landscape beside a quiet place to stay"
              />
            }
            actions={
              <TemplateAction onClick={navigation.openDetailPage}>
                Explore the rooms
              </TemplateAction>
            }
          />
          <AccommodationOverviewSection
            className="theme-studio-template__section"
            title="A stay made for slowing down"
            description="Choose a room that gives you space to rest and feel at home."
            variant="grid"
            locale="en-US"
            items={accommodationItems}
          />
          <GuestReviewsSection
            className="theme-studio-template__section"
            title="Kind words from recent guests"
            variant="grid"
            reviews={guestReviews}
            summary={{ score: 4.9, totalReviews: 82 }}
          />
        </>
      ) : null}

      {navigation.view === "detail" ? (
        <>
          <PageIntro
            eyebrow="Rooms and comforts"
            title="A quieter kind of getaway."
            description="A closer look at the rooms, small comforts, and everyday details that make a stay feel easy."
          />
          <AccommodationDetailsSection
            className="theme-studio-template__section"
            variant="split"
            accommodation={{
              name: "The Garden Room",
              description: "A restful room for two, set beside the garden and made for slow starts.",
              capacity: 2,
              bedrooms: 1,
              beds: 1,
              bathrooms: 1,
              sleepingArrangements: [
                { id: "king-bed", name: "King bed", description: "A comfortable bed with soft cotton linens." },
              ],
              highlights: [
                { id: "garden-view", label: "Garden view" },
                { id: "breakfast", label: "Breakfast included" },
                { id: "wifi", label: "Wi-Fi and a reading nook" },
              ],
            }}
          />
          <AmenityListSection
            className="theme-studio-template__section"
            title="The comforts that make it easy"
            variant="expanded"
            layout="grid"
            categories={accommodationAmenities}
          />
          <GuestReviewsSection
            className="theme-studio-template__section"
            title="A note from our guests"
            variant="quote"
            reviews={guestReviews.slice(0, 1)}
          />
        </>
      ) : null}

      {navigation.view === "about" ? (
        <>
          <PageIntro
            eyebrow="Our place"
            title="Hospitality, with room to breathe."
            description="Hearth & Stay is a small guesthouse shaped by a love of quiet mornings, local makers, and warm welcomes."
          />
          <AboutSection
            className="theme-studio-template__section"
            variant="story"
            title="A house with a little more heart."
            description="We opened our doors to share the things we love about this corner of the world: generous breakfasts, unhurried afternoons, and helpful recommendations from people who live here."
            mission="Make every guest feel cared for, never hurried."
            values={[
              { id: "welcome", title: "A warm welcome", description: "A familiar face and a thoughtful start to every stay." },
              { id: "local", title: "Rooted locally", description: "Good places and good people, shared with care." },
            ]}
          />
        </>
      ) : null}

      {navigation.view === "contact" ? (
        <>
          <PageIntro
            eyebrow="Plan a visit"
            title="We’d be happy to help you plan."
            description="Ask about the rooms, getting here, or what to see while you’re in town."
          />
          <ContactSection
            className="theme-studio-template__section"
            variant="card"
            title="Get in touch"
            description="Contact details for this preview; availability is not checked or reserved."
            email="stay@hearthandstay.example"
            phone="+1-555-0102"
            openingHours="Replies Monday–Saturday"
          />
        </>
      ) : null}
    </TemplateFrame>
  );
};

const restaurantMenus = [
  {
    id: "evening",
    title: "Evening menu",
    description: "A short, seasonal menu made for sharing.",
    categories: [
      {
        id: "small-plates",
        title: "Small plates",
        dishes: [
          {
            id: "tomato-toast",
            name: "Tomato toast",
            description: "Grilled sourdough, late-season tomatoes, basil oil.",
            price: { amount: 12, currency: "USD" },
            dietaryTags: [{ id: "vegetarian", label: "Vegetarian" }],
            popular: true,
          },
          {
            id: "roasted-carrots",
            name: "Roasted carrots",
            description: "Whipped white beans, toasted seeds, herbs.",
            price: { amount: 14, currency: "USD" },
            dietaryTags: [
              { id: "vegetarian", label: "Vegetarian" },
              { id: "vegan", label: "Vegan" },
            ],
          },
        ],
      },
      {
        id: "from-the-kitchen",
        title: "From the kitchen",
        dishes: [
          {
            id: "market-pasta",
            name: "Market pasta",
            description: "Hand-cut pasta with the week’s greens and parmesan.",
            price: { amount: 24, currency: "USD" },
            dietaryTags: [{ id: "vegetarian", label: "Vegetarian" }],
            featured: true,
          },
          {
            id: "wood-fired-trout",
            name: "Wood-fired trout",
            description: "Crisp potatoes, lemon, and garden herbs.",
            price: { amount: 29, currency: "USD" },
          },
        ],
      },
    ],
  },
];

const dietaryFilters = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
];

export const RestaurantTemplate = ({
  page,
  onPageChange,
}: WebsiteTemplateComponentProps) => {
  const navigation = useTemplateNavigation("restaurant", page, onPageChange);

  return (
    <TemplateFrame
      template="restaurant"
      brand="Olive & Ember"
      tagline="Seasonal food, shared well"
      detailPageLabel="Menu"
      view={navigation.view}
      onPageChange={navigation.selectPage}
      onDetailPageChange={navigation.openDetailPage}
    >
      {navigation.view === "home" ? (
        <>
          <RestaurantHero
            className="theme-studio-template__hero"
            eyebrow="A neighborhood table"
            title="Gather around something good."
            description="Ingredient-led cooking, long lunches, and evenings worth lingering over."
            layout="full-width"
            height="large"
            theme="dark"
            alignment="start"
            overlay="gradient"
            mediaPosition="background"
            media={
              <TemplateHeroMedia
                variant="restaurant"
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=85"
                alt="A carefully plated dinner served at a restaurant"
              />
            }
            actions={
              <TemplateAction onClick={navigation.openDetailPage}>
                Browse the menu
              </TemplateAction>
            }
          />
          <RestaurantMenuSection
            className="theme-studio-template__section"
            title="From our kitchen to your table"
            description="A few favorites from the current evening menu."
            menus={restaurantMenus}
            dietaryFilters={dietaryFilters}
          />
        </>
      ) : null}

      {navigation.view === "detail" ? (
        <>
          <PageIntro
            eyebrow="Olive & Ember"
            title="A menu that follows the season."
            description="Browse the evening menu and filter by dietary preference. Dishes and prices are sample preview content."
          />
          <RestaurantMenuSection
            className="theme-studio-template__section"
            title="The evening menu"
            description="Made with the market, meant to be shared."
            menus={restaurantMenus}
            dietaryFilters={dietaryFilters}
            showDietaryDetailsPopover
          />
        </>
      ) : null}

      {navigation.view === "about" ? (
        <>
          <PageIntro
            eyebrow="Our kitchen"
            title="Season-led cooking, without the fuss."
            description="Olive & Ember is a neighborhood restaurant built around good ingredients and the pleasure of sharing a table."
          />
          <AboutSection
            className="theme-studio-template__section"
            variant="image-led"
            title="A good meal starts with good choices."
            description="We work with nearby growers, cook over live fire when the season calls for it, and keep the room welcoming for regulars and first-time guests alike."
            mission="Serve honest, generous food with care for the people and places behind it."
            values={[
              { id: "seasonal", title: "Seasonal", description: "A menu that makes room for what is good right now." },
              { id: "shared", title: "Shared", description: "Plates and spaces that bring people together." },
              { id: "local", title: "Local", description: "Ingredients and partnerships close to home." },
            ]}
          />
        </>
      ) : null}

      {navigation.view === "contact" ? (
        <>
          <PageIntro
            eyebrow="Visit us"
            title="There’s always room at the table."
            description="Find our dining room details and opening hours. This preview does not take reservations."
          />
          <ContactSection
            className="theme-studio-template__section"
            variant="editorial"
            title="Olive & Ember"
            email="hello@olive-ember.example"
            phone="+1-555-0104"
            address="The neighborhood dining room"
            openingHours="Tuesday–Sunday, 5pm–10pm"
          />
        </>
      ) : null}
    </TemplateFrame>
  );
};

const blogArticles = [
  {
    id: "starting-small",
    title: "The art of starting small",
    excerpt: "Why the first useful version is often the one that teaches you most.",
    date: "2026-03-19",
    category: "Practice",
    readingTime: "5 min read",
  },
  {
    id: "slower-progress",
    title: "A slower kind of progress",
    excerpt: "Making room for care, craft, and the long view in everyday work.",
    date: "2026-03-12",
    category: "Field notes",
    readingTime: "7 min read",
  },
  {
    id: "room-for-ideas",
    title: "Making room for ideas",
    excerpt: "A few habits that help creative teams keep curiosity alive.",
    date: "2026-03-05",
    category: "People",
    readingTime: "4 min read",
  },
  {
    id: "good-questions",
    title: "Better questions, better work",
    excerpt: "How a little more listening can change what a team makes next.",
    date: "2026-02-26",
    category: "Practice",
    readingTime: "6 min read",
  },
];

const blogTopics = ["All", "Practice", "Field notes", "People"];

export const BlogTemplate = ({
  page,
  onPageChange,
}: WebsiteTemplateComponentProps) => {
  const navigation = useTemplateNavigation("blog", page, onPageChange);
  const [selectedTopic, setSelectedTopic] = useState("All");
  const filteredArticles =
    selectedTopic === "All"
      ? blogArticles
      : blogArticles.filter((article) => article.category === selectedTopic);

  return (
    <TemplateFrame
      template="blog"
      brand="Fieldnotes"
      tagline="Ideas worth keeping"
      detailPageLabel="Journal"
      view={navigation.view}
      onPageChange={navigation.selectPage}
      onDetailPageChange={navigation.openDetailPage}
    >
      {navigation.view === "home" ? (
        <>
          <EditorialHero
            className="theme-studio-template__hero theme-studio-template__hero--editorial"
            eyebrow="Notes for a more curious world"
            title="Stories for people who make thoughtful things happen."
            description="Ideas, perspectives, and practical notes from a community of curious makers."
            layout="split"
            height="large"
            theme="contrast"
            overlay="none"
            mediaPosition="left"
            media={
              <TemplateHeroMedia
                variant="blog"
                src={sectionPreviewImages.dashboard}
                alt="A creative workspace with a laptop and notebook"
              >
              <div className="theme-studio-template__summary-card theme-studio-template__summary-card--editorial">
                <p className="theme-studio-template__eyebrow">In this issue</p>
                <strong>Small beginnings, lasting change</strong>
                <p>Four short reads on doing meaningful work with intention.</p>
              </div>
              </TemplateHeroMedia>
            }
            actions={
              <TemplateAction onClick={navigation.openDetailPage}>
                Open the journal
              </TemplateAction>
            }
          />
          <BlogSection
            className="theme-studio-template__section"
            title="The latest from Fieldnotes"
            description="New perspectives for the work and life around it."
            variant="magazine"
            items={blogArticles.slice(0, 3)}
            featuredArticle={blogArticles[0]}
          />
        </>
      ) : null}

      {navigation.view === "detail" ? (
        <>
          <PageIntro
            eyebrow="The journal"
            title="Ideas worth returning to."
            description="Browse recent notes and choose a topic to narrow the list."
          />
          <div
            className="theme-studio-template__filters"
            role="group"
            aria-label="Filter articles by topic"
          >
            {blogTopics.map((topic) => (
              <Button
                key={topic}
                className="theme-studio-template__filter"
                variant={selectedTopic === topic ? "toggle-active" : "toggle"}
                size="sm"
                aria-pressed={selectedTopic === topic}
                onClick={() => setSelectedTopic(topic)}
              >
                {topic}
              </Button>
            ))}
          </div>
          <BlogSection
            className="theme-studio-template__section"
            title={selectedTopic === "All" ? "Recent articles" : selectedTopic}
            variant="editorial"
            items={filteredArticles}
          />
        </>
      ) : null}

      {navigation.view === "about" ? (
        <>
          <PageIntro
            eyebrow="About Fieldnotes"
            title="A place for good questions and generous ideas."
            description="Fieldnotes brings together people who care about how things are made, shared, and improved."
          />
          <AboutSection
            className="theme-studio-template__section"
            variant="editorial"
            title="Curiosity is a practice."
            description="We publish stories that make room for nuance, share what people are learning, and offer useful perspectives without pretending there is only one way forward."
            mission="Make thoughtful ideas easier to find and put into practice."
            values={[
              { id: "curiosity", title: "Stay curious", description: "Ask better questions before reaching for easy answers." },
              { id: "generosity", title: "Share generously", description: "Pass along the process, not only the polished result." },
            ]}
          />
          <BlogSection
            className="theme-studio-template__section"
            title="A few reader favorites"
            variant="list"
            items={blogArticles.slice(0, 2)}
          />
        </>
      ) : null}

      {navigation.view === "contact" ? (
        <>
          <PageIntro
            eyebrow="Get in touch"
            title="Have a story or idea to share?"
            description="We welcome thoughtful pitches, questions, and notes from readers."
          />
          <ContactSection
            className="theme-studio-template__section"
            variant="minimal"
            title="Write to the editors"
            description="This is a local preview; messages are not collected or sent."
            email="editors@fieldnotes.example"
          />
        </>
      ) : null}
    </TemplateFrame>
  );
};

const corporateServices = [
  {
    id: "strategy",
    title: "Strategy",
    description: "Turn a complex set of choices into a direction your organization can act on.",
  },
  {
    id: "operations",
    title: "Operations",
    description: "Build the practices and systems that make good work repeatable.",
  },
  {
    id: "partnerships",
    title: "Partnerships",
    description: "Connect the people and capabilities that help an ambitious idea grow.",
  },
];

const corporateStats = [
  { id: "years", label: "Years working alongside teams", value: "14" },
  { id: "projects", label: "Projects delivered together", value: "320+" },
  { id: "markets", label: "Markets served", value: "12" },
];

const corporateAwards = [
  {
    id: "responsible-growth",
    title: "Responsible Growth Partner",
    organization: "North American Business Forum",
    year: "2025",
    description: "Recognizing practical, people-centered approaches to growth.",
  },
  {
    id: "designing-for-good",
    title: "Designing for Good",
    organization: "Civic Futures",
    year: "2024",
    description: "For work that helps institutions serve their communities better.",
  },
];

export const CorporateTemplate = ({
  page,
  onPageChange,
}: WebsiteTemplateComponentProps) => {
  const navigation = useTemplateNavigation("corporate", page, onPageChange);

  return (
    <TemplateFrame
      template="corporate"
      brand="Meridian"
      tagline="A better way forward"
      detailPageLabel="Services"
      view={navigation.view}
      onPageChange={navigation.selectPage}
      onDetailPageChange={navigation.openDetailPage}
    >
      {navigation.view === "home" ? (
        <>
          <AgencyHero
            className="theme-studio-template__hero theme-studio-template__hero--corporate"
            eyebrow="Clarity for your next move"
            title="Make your next move with confidence."
            description="Practical expertise and a clear point of view for organizations ready to grow with purpose."
            layout="split"
            height="large"
            theme="light"
            overlay="none"
            mediaPosition="right"
            media={
              <TemplateHeroMedia
                variant="corporate"
                src={sectionPreviewImages.workspace}
                alt="A bright, modern shared office"
              >
              <div className="theme-studio-template__summary-card theme-studio-template__summary-card--corporate">
                <p className="theme-studio-template__eyebrow">A useful starting point</p>
                <strong>From challenge to confident action</strong>
                <ol>
                  <li>Understand what is changing</li>
                  <li>Align around the opportunity</li>
                  <li>Make the next move together</li>
                </ol>
              </div>
              </TemplateHeroMedia>
            }
            actions={
              <TemplateAction onClick={() => navigation.selectPage("contact")}>
                Talk to our team
              </TemplateAction>
            }
          />
          <StatsSection
            className="theme-studio-template__section"
            title="Experience you can put to work"
            variant="cards"
            items={corporateStats}
          />
          <ServicesSection
            className="theme-studio-template__section"
            title="Expertise built around your goals"
            description="Bring the right perspective to the work in front of you."
            variant="cards"
            items={corporateServices}
          />
        </>
      ) : null}

      {navigation.view === "detail" ? (
        <>
          <PageIntro
            eyebrow="How we help"
            title="Experienced partners for consequential work."
            description="Our teams work across strategy, operations, and partnerships to help organizations find a practical path forward."
          />
          <ServicesSection
            className="theme-studio-template__section"
            title="Services"
            variant="numbered"
            items={corporateServices}
          />
          <AwardsSection
            className="theme-studio-template__section"
            title="Recognition for thoughtful work"
            variant="list"
            items={corporateAwards}
          />
        </>
      ) : null}

      {navigation.view === "about" ? (
        <>
          <PageIntro
            eyebrow="About Meridian"
            title="Clear thinking. Useful action. Work that lasts."
            description="We partner with leaders and teams to make complex challenges easier to understand and act on."
          />
          <AboutSection
            className="theme-studio-template__section"
            variant="mission"
            title="Partnership is how progress happens."
            description="Meridian brings independent thinking and hands-on experience to the moments that matter: a new direction, an important transition, or a more resilient way to work."
            mission="Help organizations make progress that is purposeful, practical, and shared."
            vision="A future where growth and responsibility reinforce one another."
            values={[
              { id: "honesty", title: "Honest advice", description: "Say what is useful, not only what is easy to hear." },
              { id: "craft", title: "Careful craft", description: "Make the details work as well as the strategy." },
              { id: "partnership", title: "Shared ownership", description: "Build capability with the people closest to the work." },
            ]}
          />
          <AwardsSection
            className="theme-studio-template__section"
            title="Acknowledged by our peers"
            variant="badges"
            items={corporateAwards}
          />
        </>
      ) : null}

      {navigation.view === "contact" ? (
        <>
          <PageIntro
            eyebrow="Let’s talk"
            title="Start with the challenge in front of you."
            description="Share a little context and we’ll point you toward the right next conversation."
          />
          <ContactSection
            className="theme-studio-template__section"
            variant="departments"
            title="Contact Meridian"
            description="Use these sample preview details to see how a business contact page could be structured."
            email="hello@meridian.example"
            openingHours="Weekdays, 9am–5pm"
            address="Serving teams across North America"
          />
        </>
      ) : null}
    </TemplateFrame>
  );
};

export const TEMPLATE_COMPONENTS: Record<
  WebsiteTemplate,
  ComponentType<WebsiteTemplateComponentProps>
> = {
  marketing: MarketingTemplate,
  bnb: BedAndBreakfastTemplate,
  restaurant: RestaurantTemplate,
  blog: BlogTemplate,
  corporate: CorporateTemplate,
};

export const WebsiteTemplatePreview = ({
  template,
  page,
  onPageChange,
}: WebsiteTemplateComponentProps & { template: WebsiteTemplate }) => {
  const Template = TEMPLATE_COMPONENTS[template];

  return <Template page={page} onPageChange={onPageChange} />;
};
