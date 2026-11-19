import { Accordion, Badge, Tabs, Heading, Text } from "@puzzle-ui/ui";
import type { ElementType } from "react";
import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../../marketing/shared";
import {
  CommercePrice,
  formatRating,
  validateCommerceRating,
} from "../shared";
import { CommerceImageView } from "../commerce-image";
import type {
  ProductDetailsData,
  ProductDetailsSectionProps,
  ProductDetailsVariant,
  ProductSpecification,
} from "./product-details.types";
import "./product-details.css";

const ProductFacts = ({
  product,
}: {
  product: ProductDetailsData;
}) => (
  <>
    {product.description ? (
      <div className="puzzle-product-details__description">
        {product.description}
      </div>
    ) : null}
    {product.features?.length ? (
      <ul className="puzzle-product-details__features">
        {product.features.map((feature, index) => (
          <li key={`${product.id}-feature-${index}`}>{feature}</li>
        ))}
      </ul>
    ) : null}
    {product.specifications?.length ? (
      <dl className="puzzle-product-details__specifications">
        {product.specifications.map((specification) => (
          <div key={specification.id}>
            <dt>{specification.label}</dt>
            <dd>{specification.value}</dd>
          </div>
        ))}
      </dl>
    ) : null}
  </>
);

const ProductMedia = ({
  product,
}: {
  product: ProductDetailsData;
}) => (
  <div className="puzzle-product-details__media">
    {product.media?.length ? (
      product.media.map((image, index) => (
        <CommerceImageView
          key={`${product.id}-${index}`}
          image={image}
          label={`${product.name} image ${index + 1}`}
          loading={index === 0 ? "eager" : "lazy"}
        />
      ))
    ) : (
      <CommerceImageView label={product.name} />
    )}
  </div>
);

const Specifications = ({
  items,
}: {
  items: readonly ProductSpecification[];
}) => (
  <dl className="puzzle-product-details__specifications">
    {items.map((specification) => (
      <div key={specification.id}>
        <dt>{specification.label}</dt>
        <dd>{specification.value}</dd>
      </div>
    ))}
  </dl>
);

const ProductComparison = ({
  product,
}: {
  product: ProductDetailsData;
}) => {
  const comparison = product.comparison;

  if (!comparison) {
    return null;
  }

  return (
    <div className="puzzle-product-details__comparison-scroll" tabIndex={0}>
      <table className="puzzle-product-details__comparison">
        <caption>Product comparison</caption>
        <thead>
          <tr>
            <th scope="col">Specification</th>
            <th scope="col">{product.name}</th>
            <th scope="col">{comparison.comparisonName}</th>
          </tr>
        </thead>
        <tbody>
          {comparison.rows.map((row) => (
            <tr key={row.id}>
              <th scope="row">{row.label}</th>
              <td>{row.productValue}</td>
              <td>{row.comparisonValue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ProductDetailsContent = ({
  product,
  locale,
  variant,
}: {
  product: ProductDetailsData;
  locale: string;
  variant: ProductDetailsVariant;
}) => {
  validateCommerceRating(product.id, product.rating);
  const detailItems = [
    ...(product.description
      ? [{ id: "description", title: "Description", content: product.description }]
      : []),
    ...(product.features?.length
      ? [
          {
            id: "features",
            title: "Features",
            content: (
              <ul className="puzzle-product-details__features">
                {product.features.map((feature, index) => (
                  <li key={`${product.id}-detail-feature-${index}`}>{feature}</li>
                ))}
              </ul>
            ),
          },
        ]
      : []),
    ...(product.specifications?.length
      ? [
          {
            id: "specifications",
            title: "Specifications",
            content: <Specifications items={product.specifications} />,
          },
        ]
      : []),
  ];

  return (
    <div className="puzzle-product-details__content">
      {product.labels?.length ? (
        <div className="puzzle-product-details__labels">
          {product.labels.map((label) => (
            <Badge key={label.id} content={label.content} />
          ))}
        </div>
      ) : null}
      <Heading level="headline3" as="h3">{product.name}</Heading>
      {product.rating ? (
        <Text as="p" className="puzzle-product-details__rating">
          Rated {formatRating(product.rating, locale)} out of {product.rating.max ?? 5}
          {product.rating.count === undefined
            ? ""
            : ` by ${product.rating.count} reviews`}
        </Text>
      ) : null}
      {product.availability != null ? (
        <div className="puzzle-product-details__availability">
          {product.availability}
        </div>
      ) : null}
      {variant === "tabs" && detailItems.length ? (
        <Tabs className="puzzle-product-details__tabs">
          {detailItems.map((item) => (
            <Tabs.Tab key={item.id} id={item.id} tab={item.title}>
              {item.content}
            </Tabs.Tab>
          ))}
        </Tabs>
      ) : variant === "accordion" && detailItems.length ? (
        <Accordion
          className="puzzle-product-details__accordion"
          headingLevel={4}
          items={detailItems.map((item) => ({
            id: item.id,
            title: item.title,
            content: item.content,
          }))}
        />
      ) : variant === "specifications" && product.specifications?.length ? (
        <Specifications items={product.specifications} />
      ) : variant === "features" && product.features?.length ? (
        <ul className="puzzle-product-details__features">
          {product.features.map((feature, index) => (
            <li key={`${product.id}-feature-panel-${index}`}>{feature}</li>
          ))}
        </ul>
      ) : variant === "comparison" ? (
        <ProductComparison product={product} />
      ) : (
        <ProductFacts product={product} />
      )}
      {product.variantSelector != null ? (
        <div className="puzzle-product-details__selector">
          {product.variantSelector}
        </div>
      ) : null}
      {product.price ? (
        <CommercePrice
          price={product.price}
          compareAtPrice={product.compareAtPrice}
          locale={locale}
        />
      ) : null}
      {product.actions ? (
        <div className="puzzle-product-details__actions">{product.actions}</div>
      ) : null}
    </div>
  );
};

const ProductDetailsSection = <C extends ElementType = "section">({
  variant = "split",
  product,
  locale = "en-US",
  children,
  className,
  ...sectionProps
}: ProductDetailsSectionProps<C>) => {
  const layout = (
    <>
      <ProductMedia product={product} />
      <ProductDetailsContent product={product} locale={locale} variant={variant} />
    </>
  );

  return (
    <MarketingSection<C>
      {...(sectionProps as MarketingSectionBaseProps<C>)}
      fullWidth={sectionProps.fullWidth ?? variant === "full-width"}
      className={`puzzle-product-details ${className ?? ""}`.trim()}
      family="product-details"
      variant={variant}
    >
      {variant === "comparison" && product.comparison ? (
        <div className="puzzle-product-details__comparison-layout">{layout}</div>
      ) : (
        <div className="puzzle-product-details__layout">{layout}</div>
      )}
      {children}
    </MarketingSection>
  );
};

export { ProductDetailsSection };
