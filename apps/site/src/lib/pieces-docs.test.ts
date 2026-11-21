import { describe, expect, it } from "bun:test";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { getPiecesCatalogEntries } from "../components/doc-examples/pieces/catalog-data";

const docsDirectory = fileURLToPath(
  new URL("../../content/docs/pieces/components/", import.meta.url),
);
const piecesContentDirectory = join(docsDirectory, "..");
const examplesDirectory = fileURLToPath(
  new URL("../components/doc-examples/pieces/", import.meta.url),
);
const sidebarPath = fileURLToPath(
  new URL("../components/layout/sidebar/pieces.ts", import.meta.url),
);
const publicDirectory = fileURLToPath(
  new URL("../../public/", import.meta.url),
);
const piecesComponentsDirectory = fileURLToPath(
  new URL("../../../../packages/pieces/src/components/", import.meta.url),
);

const findIndexFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory()
      ? findIndexFiles(path)
      : entry.name === "index.ts"
        ? [path]
        : [];
  });

const findMdxFiles = (directory: string): string[] =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return findMdxFiles(path);
    return entry.name.endsWith(".mdx") ? [path] : [];
  });

const sectionIndexFiles = findIndexFiles(piecesComponentsDirectory);

const findTypeBody = (files: readonly string[], typeName: string): string | null => {
  for (const path of files) {
    const source = readFileSync(path, "utf8");
    const declaration = new RegExp(
      `(?:export\\s+)?type\\s+${typeName}(?:<[^>]+>)?\\s*=`,
      "m",
    ).exec(source);
    if (!declaration) {
      continue;
    }

    const start = declaration.index + declaration[0].length;
    let braceDepth = 0;
    for (let index = start; index < source.length; index += 1) {
      if (source[index] === "{") braceDepth += 1;
      if (source[index] === "}") braceDepth -= 1;
      if (source[index] === ";" && braceDepth === 0) {
        return source.slice(start, index);
      }
    }
  }

  return null;
};

const getDirectProps = (
  files: readonly string[],
  typeName: string,
  seen = new Set<string>(),
): string[] => {
  if (seen.has(typeName)) return [];
  seen.add(typeName);
  const body = findTypeBody(files, typeName);
  if (!body) return [];

  const props: string[] = [];
  let braceDepth = 0;
  for (const line of body.split("\n")) {
    if (braceDepth === 1) {
      const property = /^\s+([A-Za-z_$][\w$]*)\??\s*:/.exec(line)?.[1];
      if (property) props.push(property);
    }
    for (const character of line) {
      if (character === "{") braceDepth += 1;
      if (character === "}") braceDepth -= 1;
    }
  }

  if (props.length) return [...new Set(props)];
  const alias = /^\s*([A-Za-z_$][\w$]*)\s*$/.exec(body)?.[1];
  return alias ? getDirectProps(files, alias, seen) : [];
};

const componentDocs = [
  ["announcement", "AnnouncementSection"],
  ["logo-cloud", "LogoCloudSection"],
  ["features", "FeaturesSection"],
  ["benefits", "BenefitsSection"],
  ["stats", "StatsSection"],
  ["testimonials", "TestimonialsSection"],
  ["guest-reviews", "GuestReviewsSection"],
  ["cta", "CTASection"],
  ["faq", "FAQSection"],
  ["how-it-works", "HowItWorksSection"],
  ["comparison", "ComparisonSection"],
  ["product-showcase", "ProductShowcaseSection"],
  ["integrations", "IntegrationsSection"],
  ["use-cases", "UseCasesSection"],
  ["security", "SecuritySection"],
  ["pricing", "PricingSection"],
  ["code-showcase", "CodeShowcaseSection"],
  ["roadmap", "RoadmapSection"],
  ["product-grid", "ProductGridSection"],
  ["gift-voucher", "GiftVoucherSection"],
  ["categories", "CategoriesSection"],
  ["product-gallery", "ProductGallerySection"],
  ["cart-summary", "CartSummarySection"],
  ["product-details", "ProductDetailsSection"],
  ["availability-search", "AvailabilitySearchSection"],
  ["rate-plans", "RatePlansSection"],
  ["stay-summary", "StaySummarySection"],
  ["restaurant-menu", "RestaurantMenuSection"],
  ["table-reservation", "TableReservationSection"],
  ["commerce-benefits", "CommerceBenefitsSection"],
  ["blog-section", "BlogSection"],
  ["content-section", "ContentSection"],
  ["gallery-section", "GallerySection"],
  ["timeline-section", "TimelineSection"],
  ["changelog-section", "ChangelogSection"],
  ["about-section", "AboutSection"],
  ["team-section", "TeamSection"],
  ["services-section", "ServicesSection"],
  ["case-studies-section", "CaseStudiesSection"],
  ["contact-section", "ContactSection"],
  ["careers-section", "CareersSection"],
  ["partners-section", "PartnersSection"],
  ["awards-section", "AwardsSection"],
  ["accommodation-overview", "AccommodationOverviewSection"],
  ["accommodation-details", "AccommodationDetailsSection"],
  ["amenity-list", "AmenityListSection"],
  ["house-rules", "HouseRulesSection"],
  ["opening-hours", "OpeningHoursSection"],
  ["dashboard", "DashboardOverviewSection"],
  ["activity", "ActivitySection"],
  ["onboarding", "OnboardingSection"],
  ["empty-state", "EmptyStateSection"],
  ["settings", "SettingsSection"],
  ["video-section", "VideoSection"],
  ["booking-section", "BookingSection"],
  ["location-section", "LocationSection"],
  ["waitlist-section", "WaitlistSection"],
  ["resource-section", "ResourceSection"],
  ["event-section", "EventSection"],
  ["local-guide", "LocalGuideSection"],
  ["host-profile", "HostProfileSection"],
  ["service-options", "ServiceOptionsSection"],
  ["footer-section", "FooterSection"],
] as const;

const categoryPages = [
  "marketing",
  "saas-product",
  "commerce",
  "content",
  "business",
  "application-dashboard",
  "specialized-interactive",
] as const;

describe("Pieces documentation coverage", () => {
  it("documents all 63 section families with public imports and previews", () => {
    expect(componentDocs).toHaveLength(63);

    const sidebar = readFileSync(sidebarPath, "utf8");
    for (const [slug, componentName] of componentDocs) {
      const path = join(docsDirectory, `${slug}.mdx`);
      expect(existsSync(path), `${slug}.mdx exists`).toBe(true);
      const page = readFileSync(path, "utf8");
      const packageImports = [
        ...page.matchAll(/import\s*\{([\s\S]*?)\}\s*from\s*["']@puzzle-ui\/pieces["']/g),
      ];

      expect(
        packageImports.some((match) => match[1]?.includes(componentName)),
        `${slug} imports ${componentName} from the public package`,
      ).toBe(true);
      expect(page, `${slug} imports a per-variant preview`).toMatch(
        /VariantsExample|SectionVariantPreviews/,
      );
      expect(page, `${slug} has an API reference`).toMatch(
        /^## (?:.*API|Data model)/im,
      );
      expect(page, `${slug} documents responsive behavior`).toMatch(
        /^## .*responsive/im,
      );
      expect(page, `${slug} documents theme support`).toMatch(
        /^## .*theme|^## .*token/im,
      );
      expect(page, `${slug} documents customization and composition`).toMatch(
        /^## .*customization/im,
      );
      expect(page, `${slug} has a TypeScript example`).toMatch(
        /^## .*typescript/im,
      );
      expect(page, `${slug} links framework integration`).toContain(
        "/docs/pieces/framework-integration",
      );
      expect(page, `${slug} relates to other components`).toMatch(
        /^## related components/im,
      );
      expect(sidebar, `${slug} is linked from the Pieces sidebar`).toContain(
        `\${componentsFolder}/${slug}`,
      );

      const exampleImport = [
        ...page.matchAll(
          /import\s*\{([^}]+)\}\s*from\s*["']([^"']*doc-examples\/pieces\/([^"']+))["']/gs,
        ),
      ].find((match) => /VariantsExample/.test(match[1] ?? ""));
      expect(exampleImport, `${slug} imports a per-variant example`).toBeDefined();
      const exampleName = exampleImport?.[1]?.match(/\b[A-Za-z0-9_]*VariantsExample\b/)?.[0];
      const exampleModule = exampleImport?.[3];
      expect(exampleName, `${slug} names its variant example`).toBeDefined();
      expect(exampleModule, `${slug} names its example module`).toBeDefined();
      const examplePath = join(examplesDirectory, `${exampleModule}.tsx`);
      expect(existsSync(examplePath), `${slug} example module exists`).toBe(true);
      const exampleSource = readFileSync(examplePath, "utf8");
      expect(exampleSource).toContain(`export const ${exampleName}`);
      expect(exampleSource).toContain("SectionVariantPreviews");

      const sectionIndex = sectionIndexFiles
        .filter((indexPath) =>
          new RegExp(`\\b${componentName}\\b`).test(
            readFileSync(indexPath, "utf8"),
          ),
        )
        .sort((first, second) => second.length - first.length)[0];
      expect(sectionIndex, `${componentName} has a family export`).toBeDefined();
      const familyDirectory = sectionIndex
        ? join(sectionIndex, "..")
        : piecesComponentsDirectory;
      const variantFiles = readdirSync(familyDirectory)
        .filter(
          (name) =>
            name.endsWith(".types.ts") ||
            (name.endsWith(".tsx") && !name.endsWith(".test.tsx")),
        )
        .map((name) => join(familyDirectory, name));
      const variants = variantFiles.flatMap((variantFile) => {
        const source = readFileSync(variantFile, "utf8");
        return [...source.matchAll(/(?:export\s+)?type\s+\w*Variant\s*=\s*([\s\S]*?);/g)]
          .flatMap((match) =>
            [...(match[1] ?? "").matchAll(/["']([^"']+)["']/g)].map(
              (value) => value[1],
            ),
          );
      });
      if (variants.length > 0) {
        for (const variant of new Set(variants)) {
          expect(
            exampleSource,
            `${componentName} variant "${variant}" has a preview entry`,
          ).toContain(`"${variant}"`);
        }
      }

      const publicProps = getDirectProps(
        variantFiles,
        `${componentName}Props`,
      );
      expect(
        publicProps.length,
        `${componentName} has a discoverable public props type`,
      ).toBeGreaterThan(0);
      const apiStart = page.search(/^## [^\n]*API\b[^\n]*$/im);
      expect(apiStart, `${slug} includes its API table`).toBeGreaterThanOrEqual(0);
      const afterApi = page.slice(apiStart);
      const nextSection = afterApi.slice(1).search(/^## /m);
      const apiSection =
        nextSection < 0 ? afterApi : afterApi.slice(0, nextSection + 1);
      expect(apiSection).toMatch(
        /^\| [^\n]*Prop[^\n]*\|[^\n]*Required[^\n]*\|[^\n]*Default[^\n]*\|/im,
      );
      for (const prop of publicProps) {
        expect(
          apiSection.includes(`\`${prop}\``) ||
            apiSection.includes(`\`${prop}.`),
          `${componentName}.${prop} appears in the API reference`,
        ).toBe(true);
      }
    }
  });

  it("provides all seven category overviews and framework examples", () => {
    const sidebar = readFileSync(sidebarPath, "utf8");
    for (const slug of categoryPages) {
      expect(existsSync(join(docsDirectory, `${slug}.mdx`)), `${slug}.mdx exists`).toBe(
        true,
      );
      expect(sidebar).toContain(`\${componentsFolder}/${slug}`);
    }

    const integrationPage = readFileSync(
      fileURLToPath(
        new URL("../../content/docs/pieces/framework-integration.mdx", import.meta.url),
      ),
      "utf8",
    );
    expect(integrationPage).toContain("Next.js App Router");
    expect(integrationPage).toContain("TanStack Start");
    expect(integrationPage).toContain('from "@puzzle-ui/pieces"');
  });

  it("lists every documented section family on the Pieces overview", () => {
    const entries = getPiecesCatalogEntries();
    const overview = readFileSync(join(piecesContentDirectory, "index.mdx"), "utf8");
    const catalog = readFileSync(
      new URL("../components/doc-examples/pieces/component-catalog.tsx", import.meta.url),
      "utf8",
    );
    const catalogStyles = readFileSync(
      new URL("../components/doc-examples/ui/component-catalog.css", import.meta.url),
      "utf8",
    );

    expect(entries).toHaveLength(componentDocs.length);
    expect(new Set(entries.map((entry) => entry.href)).size).toBe(
      componentDocs.length,
    );
    expect(entries.map((entry) => entry.href).sort()).toEqual(
      componentDocs
        .map(([slug]) => `/docs/pieces/components/${slug}`)
        .sort(),
    );
    expect(overview).toContain("<PiecesComponentCatalog />");
    expect(catalog).toContain("source.getPage(slug)?.data.description");
    expect(catalog).toContain("component.description");
    expect(catalog).toContain('as="a"');
    expect(catalogStyles).toMatch(/grid-template-columns:\s*minmax\(0,\s*1fr\)/);
    expect(catalogStyles).toMatch(/min-width:\s*768px[\s\S]*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
    expect(catalogStyles).toMatch(/min-width:\s*1024px[\s\S]*repeat\(3,\s*minmax\(0,\s*1fr\)\)/);
  });

  it("resolves internal Pieces documentation links", () => {
    const pages = findMdxFiles(piecesContentDirectory);
    const routes = new Set(
      pages.map((path) => {
        const relative = path
          .slice(piecesContentDirectory.length + 1)
          .replaceAll("\\", "/");
        const route = relative === "index.mdx"
          ? "/docs/pieces"
          : `/docs/pieces/${relative.replace(/\.mdx$/, "")}`;
        return route.replace(/\/+$/, "");
      }),
    );

    for (const path of pages) {
      const source = readFileSync(path, "utf8");
      for (const match of source.matchAll(/\]\((\/docs\/pieces[^)\s]*)\)/g)) {
        const route = (match[1] ?? "").split(/[?#]/, 1)[0]?.replace(/\/+$/, "");
        expect(routes.has(route ?? ""), `${path}: ${route} resolves`).toBe(true);
      }
    }
  });

  it("ships local assets used by the interactive resource and caption previews", () => {
    expect(
      existsSync(join(publicDirectory, "captions/flower.en.vtt")),
    ).toBe(true);
    expect(
      existsSync(join(publicDirectory, "resources/northstar-launch-checklist.txt")),
    ).toBe(true);
  });
});
