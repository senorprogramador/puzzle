import { cn } from "@puzzle-ui/core";
import { Badge, Card, Heading, Text } from "@puzzle-ui/ui";
import { DietaryInformation } from "../dietary-information";
import { formatMoney } from "../shared";
import type { DishCardProps } from "./dish-card.types";
import "./dish-card.css";

const DishCard = ({
  dish,
  variant = "standard",
  headingAs = "h3",
  locale,
  featuredLabel = "Featured",
  popularLabel = "Popular",
  dietaryInformationVariant = "compact",
  showDietaryDetailsPopover = false,
  mediaSlot,
  contentSlot,
  actions,
  className,
}: DishCardProps) => {
  const resolvedLocale =
    locale ?? Intl.NumberFormat().resolvedOptions().locale;
  const isFeatured = dish.featured || variant === "featured";

  return (
    <Card
      as="article"
      className={cn("puzzle-dish-card", className)}
      data-dish-variant={variant}
    >
      {mediaSlot != null || dish.image ? (
        <div className="puzzle-dish-card__media">
          {mediaSlot != null ? (
            mediaSlot
          ) : dish.image ? (
            <img
              src={dish.image.src}
              alt={dish.image.alt}
              width={dish.image.width}
              height={dish.image.height}
              loading={dish.image.loading ?? "lazy"}
              decoding="async"
            />
          ) : null}
        </div>
      ) : null}

      <div className="puzzle-dish-card__content">
        <div className="puzzle-dish-card__name-price">
          <Heading
            className="puzzle-dish-card__name"
            level="headline4"
            as={headingAs}
          >
            {dish.name}
          </Heading>
          <span className="puzzle-dish-card__price">
            {formatMoney(dish.price, resolvedLocale)}
          </span>
        </div>

        {isFeatured || dish.popular ? (
          <div className="puzzle-dish-card__badges">
            {isFeatured ? (
              <Badge content={featuredLabel} color="primary" />
            ) : null}
            {dish.popular ? (
              <Badge content={popularLabel} color="info" />
            ) : null}
          </div>
        ) : null}

        {dish.description ? (
          <Text className="puzzle-dish-card__description" as="p">
            {dish.description}
          </Text>
        ) : null}

        {dish.portionSize != null ? (
          <p className="puzzle-dish-card__portion">{dish.portionSize}</p>
        ) : null}

        <DietaryInformation
          tags={dish.dietaryTags}
          allergens={dish.allergens}
          variant={dietaryInformationVariant}
          showDetailsPopover={showDietaryDetailsPopover}
        />

        {contentSlot != null ? (
          <div className="puzzle-dish-card__slot">{contentSlot}</div>
        ) : null}
        {actions != null ? (
          <div className="puzzle-dish-card__actions">{actions}</div>
        ) : null}
      </div>
    </Card>
  );
};

export { DishCard };
