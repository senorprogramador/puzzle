import { Heading, Text } from "@puzzle-ui/ui";
import type { ElementType } from "react";
import {
  EditorialAuthorView,
  EditorialCategory,
  EditorialDate,
  EditorialFigure,
  validateContentIds,
} from "../shared";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../../marketing/shared";
import { PiecesCarousel } from "../../shared/pieces-carousel";
import type {
  BlogArticle,
  BlogSectionProps,
  BlogSectionVariant,
} from "./blog-section.types";
import "./blog-section.css";

const BlogArticleCard = ({
  article,
  compact = false,
}: {
  article: BlogArticle;
  compact?: boolean;
}) => (
  <article
    className="puzzle-blog-section__article"
    data-compact={compact || undefined}
  >
    {article.image ? (
      <EditorialFigure
        image={article.image}
        className="puzzle-blog-section__figure"
      />
    ) : null}
    <div className="puzzle-blog-section__article-content">
      {article.category ? (
        <EditorialCategory>{article.category}</EditorialCategory>
      ) : null}
      <Heading level="headline3" as="h3" className="puzzle-blog-section__article-title">
        {article.href ? <a href={article.href}>{article.title}</a> : article.title}
      </Heading>
      {article.excerpt ? (
        <Text as="p" className="puzzle-blog-section__excerpt">{article.excerpt}</Text>
      ) : null}
      {article.author || article.date || article.readingTime ? (
        <div className="puzzle-blog-section__meta">
          {article.author ? <EditorialAuthorView author={article.author} /> : null}
          {article.date ? <EditorialDate date={article.date} /> : null}
          {article.readingTime ? (
            <span>
              {typeof article.readingTime === "number"
                ? `${article.readingTime} min read`
                : article.readingTime}
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  </article>
);

const BlogList = ({
  items,
  compact = false,
  className = "",
  scrollable = false,
}: {
  items: readonly BlogArticle[];
  compact?: boolean;
  className?: string;
  scrollable?: boolean;
}) => (
  <ul
    className={`puzzle-blog-section__items ${className}`.trim()}
    aria-label="Blog articles"
    tabIndex={scrollable ? 0 : undefined}
  >
    {items.map((article) => (
      <li key={article.id}>
        <BlogArticleCard article={article} compact={compact} />
      </li>
    ))}
  </ul>
);

const getFeatured = (
  items: readonly BlogArticle[],
  featuredArticle?: BlogArticle,
) =>
  featuredArticle ?? items.find((article) => article.featured) ?? items[0];

const getArticles = (
  items: readonly BlogArticle[],
  featuredArticle?: BlogArticle,
) => {
  if (!featuredArticle) {
    return items;
  }

  return [
    featuredArticle,
    ...items.filter((article) => article.id !== featuredArticle.id),
  ];
};

const renderByCategory = (items: readonly BlogArticle[]) => {
  const categories = new Map<string, BlogArticle[]>();

  for (const article of items) {
    const category = article.category ?? "Uncategorized";
    categories.set(category, [...(categories.get(category) ?? []), article]);
  }

  return (
    <div className="puzzle-blog-section__categories">
      {[...categories].map(([category, articles]) => (
        <section key={category} className="puzzle-blog-section__category-group">
          <Heading level="headline3" as="h3">{category}</Heading>
          <BlogList items={articles} />
        </section>
      ))}
    </div>
  );
};

const renderFeatured = (
  items: readonly BlogArticle[],
  featuredArticle?: BlogArticle,
) => {
  const articles = getArticles(items, featuredArticle);
  const featured = getFeatured(articles, featuredArticle);

  if (!featured) {
    return null;
  }

  return (
    <div className="puzzle-blog-section__featured">
      <BlogArticleCard article={featured} />
      {articles.length > 1 ? (
        <ul className="puzzle-blog-section__supporting">
          {articles
            .filter((article) => article.id !== featured.id)
            .map((article) => (
              <li key={article.id}>
                <BlogArticleCard article={article} compact />
              </li>
            ))}
        </ul>
      ) : null}
    </div>
  );
};

const BlogSection = <C extends ElementType = "section">({
  variant = "grid",
  items,
  featuredArticle,
  children,
  className,
  ...sectionProps
}: BlogSectionProps<C>) => {
  validateContentIds(items, "Blog article");
  if (featuredArticle) {
    validateContentIds([featuredArticle], "Featured blog article");
  }

  const articles = getArticles(items, featuredArticle);
  let content =
    variant === "carousel" && articles.length ? (
      <PiecesCarousel
        itemKeys={articles.map((article) => article.id)}
        slides={articles.map((article) => (
          <BlogArticleCard key={article.id} article={article} />
        ))}
        ariaLabel="Blog articles"
        itemLabel="article"
        panelsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
        gap="var(--puzzle-space-5, 1.25rem)"
      />
    ) : articles.length ? (
      <BlogList items={articles} scrollable={variant === "horizontal"} />
    ) : null;

  if (
    variant === "featured" ||
    variant === "editorial" ||
    variant === "magazine" ||
    variant === "split" ||
    variant === "latest"
  ) {
    content = renderFeatured(items, featuredArticle);
  } else if (variant === "categories" && articles.length) {
    content = renderByCategory(articles);
  } else if (variant === "compact" && articles.length) {
    content = <BlogList items={articles} compact />;
  }

  return (
    <MarketingSection<C>
      {...(sectionProps as MarketingSectionBaseProps<C>)}
      className={`puzzle-blog-section ${className ?? ""}`.trim()}
      family="blog"
      variant={variant satisfies BlogSectionVariant}
    >
      {content}
      {children}
    </MarketingSection>
  );
};

export { BlogSection };
