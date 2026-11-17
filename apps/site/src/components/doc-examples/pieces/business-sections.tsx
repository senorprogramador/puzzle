import {
  AboutSection,
  AwardsSection,
  CareersSection,
  CaseStudiesSection,
  ContactSection,
  PartnersSection,
  ServicesSection,
  TeamSection,
  type AboutSectionVariant,
  type AwardsSectionVariant,
  type CareersSectionVariant,
  type CaseStudiesSectionVariant,
  type ContactSectionVariant,
  type PartnersSectionVariant,
  type ServicesSectionVariant,
  type TeamSectionVariant,
} from "@puzzle-ui/pieces";
import { Button } from "@puzzle-ui/ui";
import {
  SectionVariantPreviews,
  type SectionVariantPreview,
} from "../shared/section-variant-previews";
import { sectionPreviewImages } from "../shared/section-preview-media";

const profiles = [
  {
    id: "maya",
    name: "Maya Patel",
    role: "Managing partner",
    department: "Leadership",
    avatar: {
      src: sectionPreviewImages.portraitOne,
      alt: "Portrait of Maya Patel",
    },
    biography: "A thoughtful guide to complex decisions and lasting change.",
    href: "/people/maya-patel",
    socials: [
      {
        id: "linkedin",
        label: "LinkedIn",
        href: "/docs/pieces/components/team-section",
        external: true,
      },
    ],
  },
  {
    id: "leo",
    name: "Leo Okafor",
    role: "Design director",
    department: "Design",
    avatar: {
      src: sectionPreviewImages.team,
      alt: "Portrait of Leo Okafor",
    },
    biography: "He turns ambitious ideas into useful, welcoming experiences.",
  },
  {
    id: "ines",
    name: "Ines Laurent",
    role: "Research lead",
    department: "Research",
    biography: "Ines brings customer evidence into everyday product decisions.",
  },
];

const services = [
  {
    id: "strategy",
    title: "Business strategy",
    description:
      "Find a clear direction, align your teams, and make the next move with confidence.",
    icon: "01",
    image: {
      src: sectionPreviewImages.workspace,
      alt: "Consultants planning together around a table",
    },
    pricing: "Strategy engagements from $8,000",
    category: "Consulting",
    href: "/services/strategy",
    action: <Button type="button" variant="secondary">Talk to a strategist</Button>,
    featured: true,
  },
  {
    id: "identity",
    title: "Brand identity",
    description:
      "Create a distinctive visual and verbal system that can grow with your business.",
    icon: "02",
    category: "Creative",
    href: "/services/identity",
  },
  {
    id: "experience",
    title: "Digital experience",
    description:
      "Make every interaction feel clear, consistent, and easy to use.",
    icon: "03",
    category: "Creative",
    pricing: "Scoped to your team",
  },
];

const caseStudies = [
  {
    id: "cedar-house",
    title: "A more considered guest journey",
    client: "Cedar House",
    industry: "Hospitality",
    challenge: "Connect a fragmented guest experience across every touchpoint.",
    solution: "Unify booking, arrival, and on-property service around the guest.",
    results: "More direct bookings and a more personal stay.",
    image: {
      src: sectionPreviewImages.product,
      alt: "Warm contemporary hotel interior",
    },
    beforeAfter: {
      before: {
        src: sectionPreviewImages.workspace,
        alt: "Cedar House booking experience before redesign",
      },
      after: {
        src: sectionPreviewImages.product,
        alt: "Cedar House booking experience after redesign",
      },
    },
    metrics: [
      { id: "bookings", label: "Direct bookings", value: "+28%" },
      { id: "satisfaction", label: "Guest satisfaction", value: "94%" },
    ],
    href: "/docs/pieces/components/case-studies-section",
    external: true,
    featured: true,
  },
  {
    id: "meridian",
    title: "One platform for every team",
    client: "Meridian Cloud",
    industry: "SaaS",
    challenge: "Bring product teams together around a shared plan.",
    solution: "Design a connected planning experience for distributed teams.",
    results: "A third less time spent on cross-team handoffs.",
    image: {
      src: sectionPreviewImages.team,
      alt: "SaaS product team working through a planning session",
    },
    metrics: [{ id: "handoffs", label: "Faster handoffs", value: "33%" }],
    href: "/work/meridian-cloud",
  },
  {
    id: "morrow",
    title: "A new chapter for Morrow Journal",
    client: "Morrow Journal",
    industry: "Creative portfolio",
    challenge: "Make a growing archive feel effortless to explore.",
    solution: "Build a flexible editorial system around its contributors.",
    results: "A more cohesive reading experience across devices.",
    image: {
      src: sectionPreviewImages.landscape,
      alt: "A quiet landscape at the edge of a creative studio",
    },
  },
];

const positions = [
  {
    id: "product-designer",
    title: "Senior product designer",
    department: "Product",
    location: "Amsterdam, Netherlands",
    employmentType: "Full-time",
    description:
      "Shape thoughtful tools for growing teams, from early research through launch.",
    href: "/careers/senior-product-designer",
    featured: true,
  },
  {
    id: "content-designer",
    title: "Content designer",
    department: "Brand",
    location: "London, United Kingdom",
    employmentType: "Contract",
    description:
      "Help make complex products feel clear, human, and consistent.",
    href: "/careers/content-designer",
  },
  {
    id: "researcher",
    title: "Customer researcher",
    department: "Research",
    location: "Remote, Europe",
    employmentType: "Full-time",
    description: "Bring customer evidence into product and service decisions.",
    href: "/careers/customer-researcher",
  },
];

const aboutVariants: SectionVariantPreview<AboutSectionVariant>[] = [
  { variant: "split", useCase: "Balance the story with supporting company details." },
  { variant: "centered", useCase: "Lead with a focused, centered introduction." },
  { variant: "editorial", useCase: "Give the company story a generous reading measure." },
  { variant: "image-led", useCase: "Put a company photograph at the center." },
  { variant: "story", useCase: "Emphasize the founding story and point of view." },
  { variant: "timeline", useCase: "Show milestones in the order they happened." },
  { variant: "stats", useCase: "Pair the introduction with measurable outcomes." },
  { variant: "team", useCase: "Introduce the people behind the company." },
  { variant: "mission", useCase: "Bring mission and vision into the foreground." },
  { variant: "values", useCase: "Make company values easy to scan." },
  { variant: "asymmetric", useCase: "Use an editorially weighted two-column layout." },
  { variant: "full-width", useCase: "Give a collection of company images more room." },
];

const teamVariants: SectionVariantPreview<TeamSectionVariant>[] = [
  { variant: "grid", useCase: "Show the whole team in a responsive grid." },
  { variant: "cards", useCase: "Give every team profile its own card surface." },
  { variant: "featured", useCase: "Introduce one featured member before the rest." },
  { variant: "leadership", useCase: "Highlight leadership and supporting profiles." },
  { variant: "departments", useCase: "Organize profiles by team or department." },
  { variant: "horizontal", useCase: "Browse profiles in a horizontal rail." },
  { variant: "carousel", useCase: "Keep a compact, keyboard-focusable profile carousel." },
  { variant: "editorial", useCase: "Give biographies an editorial profile layout." },
  { variant: "compact", useCase: "Fit more profiles into a smaller space." },
  { variant: "asymmetric", useCase: "Give a lead profile more visual weight." },
  { variant: "profile", useCase: "Keep profiles simple and people-first." },
  { variant: "split", useCase: "Balance profiles across two responsive columns." },
];

const servicesVariants: SectionVariantPreview<ServicesSectionVariant>[] = [
  { variant: "grid", useCase: "Present services in a balanced responsive grid." },
  { variant: "cards", useCase: "Give each service a distinct card." },
  { variant: "list", useCase: "Make a longer service catalogue easy to scan." },
  { variant: "split", useCase: "Use two columns for a shorter service menu." },
  { variant: "alternating", useCase: "Alternate media and service descriptions." },
  { variant: "featured", useCase: "Give a primary service more space." },
  { variant: "icons", useCase: "Emphasize the service icon and concise summary." },
  { variant: "numbered", useCase: "Present services as a numbered sequence." },
  { variant: "pricing", useCase: "Include pricing content beside each service." },
  { variant: "editorial", useCase: "Use a lighter, image-forward presentation." },
  { variant: "categorized", useCase: "Group services under their categories." },
  { variant: "carousel", useCase: "Browse service cards in a scrollable rail." },
];

const caseStudyVariants: SectionVariantPreview<CaseStudiesSectionVariant>[] = [
  { variant: "grid", useCase: "Browse case studies in a responsive grid." },
  { variant: "featured", useCase: "Lead with a featured client result." },
  { variant: "split", useCase: "Give the first project additional room." },
  { variant: "masonry", useCase: "Use responsive columns for a varied portfolio." },
  { variant: "carousel", useCase: "Scroll through a focused set of projects." },
  { variant: "editorial", useCase: "Tell each project story with more context." },
  { variant: "metrics", useCase: "Put measurable results front and center." },
  { variant: "before-after", useCase: "Compare the experience before and after." },
  { variant: "cards", useCase: "Separate each project on a card surface." },
  { variant: "list", useCase: "Present projects in a linear reading order." },
  { variant: "portfolio", useCase: "Let project imagery lead the page." },
  { variant: "bento", useCase: "Create a varied portfolio grid." },
  { variant: "horizontal", useCase: "Show projects in a horizontal rail." },
];

const contactVariants: SectionVariantPreview<ContactSectionVariant>[] = [
  { variant: "split", useCase: "Pair contact information with a form slot." },
  { variant: "centered", useCase: "Keep a simple contact invitation focused." },
  { variant: "form", useCase: "Give the consumer-provided form slot priority." },
  { variant: "card", useCase: "Set contact information on a distinct surface." },
  { variant: "map", useCase: "Pair office details with a map slot." },
  { variant: "details", useCase: "Make practical contact details easy to find." },
  { variant: "minimal", useCase: "Keep the contact block compact." },
  { variant: "full-width", useCase: "Give map or form content more space." },
  { variant: "departments", useCase: "Show contact people by department." },
  { variant: "multi-column", useCase: "Distribute contact details across columns." },
  { variant: "editorial", useCase: "Use a calmer, text-led presentation." },
  { variant: "support", useCase: "Guide customers to the right support channel." },
  { variant: "inquiry", useCase: "Frame a consumer-provided inquiry form slot." },
];

const careersVariants: SectionVariantPreview<CareersSectionVariant>[] = [
  { variant: "list", useCase: "Present open roles in a straightforward list." },
  { variant: "grid", useCase: "Browse openings as responsive cards." },
  { variant: "featured", useCase: "Highlight a priority role." },
  { variant: "departments", useCase: "Group openings by department." },
  { variant: "culture", useCase: "Pair company culture with open roles." },
  { variant: "split", useCase: "Balance roles and benefits in two columns." },
  { variant: "benefits", useCase: "Give the employee benefits more emphasis." },
  { variant: "editorial", useCase: "Add room for a considered culture statement." },
  { variant: "cards", useCase: "Separate each opportunity on a card surface." },
  { variant: "locations", useCase: "Group openings by workplace or region." },
  { variant: "compact", useCase: "Keep a dense role list concise." },
  { variant: "hiring", useCase: "Make active hiring priorities easy to spot." },
];

const partnerVariants: SectionVariantPreview<PartnersSectionVariant>[] = [
  { variant: "grid", useCase: "Show partner details in a responsive grid." },
  { variant: "logo-wall", useCase: "Let partner identities form a logo wall." },
  { variant: "featured", useCase: "Put a featured partner first." },
  { variant: "categories", useCase: "Group partner organizations by category." },
  { variant: "cards", useCase: "Include a short description for each partner." },
  { variant: "network", useCase: "Present a broad ecosystem of collaborators." },
  { variant: "split", useCase: "Use an even two-column partner layout." },
  { variant: "carousel", useCase: "Browse partner logos in a scrollable rail." },
  { variant: "ecosystem", useCase: "Show the role each partner plays." },
  { variant: "minimal", useCase: "Keep the partner presentation understated." },
];

const awardVariants: SectionVariantPreview<AwardsSectionVariant>[] = [
  { variant: "grid", useCase: "Display recognition in a responsive grid." },
  { variant: "list", useCase: "Keep award names and years easy to scan." },
  { variant: "featured", useCase: "Give a featured award more visual weight." },
  { variant: "badges", useCase: "Present achievements as compact badges." },
  { variant: "timeline", useCase: "Show recognition across the years." },
  { variant: "cards", useCase: "Give each award a defined card surface." },
  { variant: "logo-wall", useCase: "Emphasize awarding organizations and marks." },
  { variant: "split", useCase: "Balance award details across two columns." },
  { variant: "compact", useCase: "Fit several awards into a compact section." },
  { variant: "editorial", useCase: "Tell the story behind selected recognition." },
];

export const AboutSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="AboutSection"
    variants={aboutVariants}
    buildCode={(variant) =>
      `<AboutSection variant="${variant}" title="About Northstar" story={story} stats={stats} />`
    }
    renderVariant={(variant) => (
      <AboutSection
        variant={variant}
        eyebrow="About Northstar"
        title="Make meaningful progress."
        description="A people-first consultancy for the moments that matter."
        company={{
          name: "Northstar Advisory",
          tagline: "Independent thinking, shared purpose.",
        }}
        story={{
          title: "Built for lasting change",
          description:
            "Since 2008, we have helped ambitious organizations turn complex challenges into clear next steps.",
        }}
        mission="Make complex change manageable for every team."
        vision="A more resilient, thoughtful way to do business."
        images={[
          {
            src: sectionPreviewImages.workspace,
            alt: "Northstar colleagues working together",
          },
        ]}
        stats={[
          { id: "years", label: "Years in business", value: "18" },
          { id: "markets", label: "Markets", value: "12" },
        ]}
        values={[
          { id: "care", title: "Care", description: "Start with people." },
          { id: "clarity", title: "Clarity", description: "Make the complex useful." },
        ]}
        timeline={[
          { id: "founded", year: "2008", title: "Northstar begins" },
          { id: "global", year: "2018", title: "First international studio" },
        ]}
        team={profiles}
      />
    )}
  />
);

export const TeamSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="TeamSection"
    variants={teamVariants}
    buildCode={(variant) =>
      `<TeamSection variant="${variant}" title="Meet the team" items={people} />`
    }
    renderVariant={(variant) => (
      <TeamSection
        variant={variant}
        eyebrow="The people"
        title="Meet the Northstar team"
        description="A small, multidisciplinary group with a global point of view."
        items={profiles}
        departments={[
          { id: "leadership", name: "Leadership", members: [profiles[0]!] },
          { id: "design", name: "Design", members: [profiles[1]!] },
          { id: "research", name: "Research", members: [profiles[2]!] },
        ]}
        featuredMember="maya"
      />
    )}
  />
);

export const ServicesSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="ServicesSection"
    variants={servicesVariants}
    buildCode={(variant) =>
      `<ServicesSection variant="${variant}" title="How we help" items={services} />`
    }
    renderVariant={(variant) => (
      <ServicesSection
        variant={variant}
        eyebrow="Our services"
        title="Make the next move count."
        description="SaaS, hospitality, and creative businesses come to us for clear thinking and careful execution."
        items={services}
      />
    )}
  />
);

export const CaseStudiesSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="CaseStudiesSection"
    variants={caseStudyVariants}
    buildCode={(variant) =>
      `<CaseStudiesSection variant="${variant}" title="Selected work" items={caseStudies} />`
    }
    renderVariant={(variant) => (
      <CaseStudiesSection
        variant={variant}
        eyebrow="Selected work"
        title="Outcomes built around people."
        description="A few partnerships that turned thoughtful work into measurable progress."
        items={caseStudies}
      />
    )}
  />
);

export const ContactSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="ContactSection"
    variants={contactVariants}
    buildCode={(variant) =>
      `<ContactSection variant="${variant}" title="Start a conversation" email="hello@northstar.example" formSlot={contactForm} />`
    }
    renderVariant={(variant) => (
      <ContactSection
        variant={variant}
        eyebrow="Contact"
        title="Start a conversation."
        description="Tell us what you are working through. We will help you find the right next step."
        address="12 Market Street, Amsterdam"
        phone="+31 20 123 4567"
        email="hello@northstar.example"
        openingHours="Monday to Friday, 09:00–17:00 CET"
        details={[
          {
            id: "press",
            label: "Press",
            value: "press@northstar.example",
            href: "mailto:press@northstar.example",
          },
        ]}
        departments={[
          {
            id: "studio",
            name: "Studio",
            contacts: [
              {
                id: "maya",
                name: "Maya Patel",
                role: "Studio lead",
                email: "maya@northstar.example",
              },
            ],
          },
          {
            id: "press-team",
            name: "Press",
            contacts: [
              {
                id: "leo",
                name: "Leo Okafor",
                role: "Communications",
                email: "press@northstar.example",
              },
            ],
          },
        ]}
        formSlot={
          <form aria-label="Contact request">
            <label>
              Work email
              <input type="email" placeholder="you@company.com" />
            </label>
            <Button type="button">Request a conversation</Button>
          </form>
        }
        mapSlot={
          <div className="business-preview-map">
            Amsterdam studio map slot
          </div>
        }
        successSlot={<p>Your message is ready for the team.</p>}
      />
    )}
  />
);

export const CareersSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="CareersSection"
    variants={careersVariants}
    buildCode={(variant) =>
      `<CareersSection variant="${variant}" title="Work with Northstar" positions={positions} />`
    }
    renderVariant={(variant) => (
      <CareersSection
        variant={variant}
        eyebrow="Careers"
        title="Do work that moves things forward."
        description="Join a generous, curious team helping organizations build what comes next."
        positions={positions}
        culture="We value curiosity, thoughtful collaboration, and clear writing. Our team works across disciplines and time zones."
        benefits={[
          {
            id: "flexibility",
            title: "Flexible by design",
            description: "Choose the working rhythm that helps you do your best work.",
          },
          {
            id: "learning",
            title: "Room to grow",
            description: "Dedicated time and budget for learning.",
          },
        ]}
      />
    )}
  />
);

export const PartnersSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="PartnersSection"
    variants={partnerVariants}
    buildCode={(variant) =>
      `<PartnersSection variant="${variant}" title="Our partners" items={partners} />`
    }
    renderVariant={(variant) => (
      <PartnersSection
        variant={variant}
        eyebrow="A connected ecosystem"
        title="Better together."
        description="We work with trusted specialists across technology, hospitality, and creative practice."
        items={[
          {
            id: "fieldwork",
            name: "Fieldwork Studio",
            description: "Independent brand and digital studio.",
            category: "Creative",
            href: "/docs/pieces/components/partners-section",
            external: true,
            featured: true,
          },
          {
            id: "meridian",
            name: "Meridian Cloud",
            description: "Secure infrastructure for growing teams.",
            category: "Technology",
            image: {
              src: sectionPreviewImages.product,
              alt: "Meridian Cloud logo",
            },
          },
          {
            id: "cedar",
            name: "Cedar House",
            description: "Independent hospitality group.",
            category: "Hospitality",
          },
        ]}
      />
    )}
  />
);

export const AwardsSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="AwardsSection"
    variants={awardVariants}
    buildCode={(variant) =>
      `<AwardsSection variant="${variant}" title="Recognition" items={awards} />`
    }
    renderVariant={(variant) => (
      <AwardsSection
        variant={variant}
        eyebrow="Recognition"
        title="A few milestones along the way."
        items={[
          {
            id: "independent-studio",
            title: "Independent Studio of the Year",
            organization: "Design Guild",
            year: 2025,
            description:
              "Recognizing thoughtful work and a lasting contribution to the creative community.",
            href: "/docs/pieces/components/awards-section",
            external: true,
            featured: true,
            logo: {
              src: sectionPreviewImages.product,
              alt: "Design Guild award mark",
            },
          },
          {
            id: "guest-experience",
            title: "Guest Experience Award",
            organization: "Hospitality Forum",
            year: 2024,
            description: "For the Cedar House guest experience program.",
          },
          {
            id: "service-design",
            title: "Service Design Shortlist",
            organization: "European Design Council",
            year: 2023,
          },
        ]}
      />
    )}
  />
);
