import {
  DietaryInformation,
  DishCard,
  RestaurantMenuSection,
} from "@puzzle-ui/pieces";
import type {
  Allergen,
  DietaryInformationVariant,
  DietaryTag,
  DishCardVariant,
  RestaurantDish,
  RestaurantMenu,
  RestaurantMenuDietaryFilter,
} from "@puzzle-ui/pieces";
import {
  SectionVariantPreviews,
  type SectionVariantPreview,
} from "../shared/section-variant-previews";

const photos = {
  toast:
    "https://images.unsplash.com/photo-1553909489-cd47e0ef937f?auto=format&fit=crop&w=960&q=85",
  salad:
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=960&q=85",
  tapas:
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=960&q=85",
  fineDining:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=960&q=85",
};

const plantBased: DietaryTag = {
  id: "plant-based",
  label: "Plant-based",
  description: "Label supplied by the restaurant.",
};

const vegetarian: DietaryTag = {
  id: "vegetarian",
  label: "Vegetarian",
};

const sesame: Allergen = {
  id: "sesame",
  label: "Sesame",
  description: "Allergen information supplied by the restaurant.",
};

const almond: Allergen = {
  id: "almond",
  label: "Almond",
  description: "Allergen information supplied by the restaurant.",
};

const cafeMenus: RestaurantMenu[] = [
  {
    id: "cafe",
    title: "Daybreak Café",
    description: "Breakfast and lunch, prepared throughout the day.",
    categories: [
      {
        id: "toast-and-bowls",
        title: "Toast and bowls",
        dishes: [
          {
            id: "garden-toast",
            name: "Garden toast",
            description: "Sourdough, smashed peas, lemon, and herbs.",
            price: { amount: 11.5, currency: "EUR" },
            image: { src: photos.toast, alt: "Toast served on a café plate" },
            dietaryTags: [plantBased],
            featured: true,
          },
          {
            id: "market-bowl",
            name: "Market bowl",
            description: "Grains and vegetables from the local market.",
            price: { amount: 14, currency: "EUR" },
            image: { src: photos.salad, alt: "A colorful bowl of vegetables" },
            dietaryTags: [plantBased],
            allergens: [sesame],
          },
        ],
      },
      {
        id: "coffee",
        title: "Coffee and something sweet",
        dishes: [
          {
            id: "filter-coffee",
            name: "Filter coffee",
            description: "Rotating single-origin coffee.",
            price: { amount: 4, currency: "EUR" },
          },
          {
            id: "almond-cake",
            name: "Almond cake",
            description: "A small slice with seasonal fruit.",
            price: { amount: 7, currency: "EUR" },
            allergens: [almond],
          },
        ],
      },
    ],
  },
];

const tapasMenus: RestaurantMenu[] = [
  {
    id: "tapas",
    title: "Mesa de Barrio",
    description: "Small plates for sharing with the whole table.",
    categories: [
      {
        id: "cold-plates",
        title: "Cold plates",
        dishes: [
          {
            id: "marinated-olives",
            name: "Marinated olives",
            description: "Citrus peel, rosemary, and cracked coriander.",
            price: { amount: 6, currency: "EUR" },
            popular: true,
          },
          {
            id: "tomato-bread",
            name: "Tomato bread",
            description: "Grilled country bread with ripe tomato.",
            price: { amount: 8, currency: "EUR" },
            dietaryTags: [plantBased],
          },
        ],
      },
      {
        id: "warm-plates",
        title: "Warm plates",
        dishes: [
          {
            id: "charred-peppers",
            name: "Charred peppers",
            description: "Sweet peppers with a smoked almond dressing.",
            price: { amount: 12, currency: "EUR" },
            allergens: [almond],
          },
          {
            id: "crispy-potatoes",
            name: "Crispy potatoes",
            description: "Saffron potatoes with a bright tomato sauce.",
            price: { amount: 9, currency: "EUR" },
            dietaryTags: [plantBased],
          },
        ],
      },
      {
        id: "sweet-plates",
        title: "Something sweet",
        dishes: [
          {
            id: "orange-custard",
            name: "Orange custard",
            description: "Citrus custard with a crisp sugar top.",
            price: { amount: 8, currency: "EUR" },
          },
        ],
      },
    ],
  },
];

const fineDiningMenus: RestaurantMenu[] = [
  {
    id: "tasting-menu",
    title: "Atelier No. 8",
    description: "A seasonal tasting menu with each course listed by name.",
    categories: [
      {
        id: "first-course",
        title: "First course",
        dishes: [
          {
            id: "tomato-consomme",
            name: "Tomato consommé",
            description: "Clear tomato, basil oil, and a crisp garden leaf.",
            price: { amount: 18, currency: "GBP" },
            image: {
              src: photos.fineDining,
              alt: "A carefully plated tasting-menu course",
            },
            portionSize: "Tasting course",
          },
        ],
      },
      {
        id: "main-course",
        title: "Main course",
        dishes: [
          {
            id: "roasted-celeriac",
            name: "Roasted celeriac",
            description:
              "Slow-roasted celeriac with orchard fruit and toasted seeds.",
            price: { amount: 34, currency: "GBP" },
            dietaryTags: [vegetarian],
            allergens: [sesame],
            featured: true,
          },
        ],
      },
      {
        id: "dessert",
        title: "Dessert",
        dishes: [
          {
            id: "pear-and-almond",
            name: "Pear and almond",
            description: "Poached pear, almond cream, and a crisp tuile.",
            price: { amount: 16, currency: "GBP" },
            allergens: [almond],
          },
        ],
      },
    ],
  },
];

const lunchDinnerMenus: RestaurantMenu[] = [
  {
    id: "lunch",
    title: "Lunch",
    description: "Served from 11:30 AM to 2:30 PM.",
    categories: [
      {
        id: "lunch-mains",
        title: "Lunch plates",
        dishes: [
          {
            id: "soup-and-bread",
            name: "Soup and bread",
            description: "A daily soup with warm country bread.",
            price: { amount: 13, currency: "USD" },
          },
          {
            id: "roasted-vegetables",
            name: "Roasted vegetables",
            description: "The day's vegetables with grains and herbs.",
            price: { amount: 16, currency: "USD" },
            dietaryTags: [plantBased],
          },
        ],
      },
    ],
  },
  {
    id: "dinner",
    title: "Dinner",
    description: "Dinner service begins at 5:30 PM.",
    categories: [
      {
        id: "dinner-mains",
        title: "Dinner plates",
        dishes: [
          {
            id: "slow-cooked-lentils",
            name: "Slow-cooked lentils",
            description: "Lentils, roasted roots, and bright green herbs.",
            price: { amount: 24, currency: "USD" },
            dietaryTags: [plantBased],
            featured: true,
          },
          {
            id: "market-fish",
            name: "Market fish",
            description: "Today's fish with a seasonal side.",
            price: { amount: 32, currency: "USD" },
          },
        ],
      },
    ],
  },
];

const dietaryMenus: RestaurantMenu[] = [
  {
    id: "sample-menu",
    title: "A menu with supplied dietary information",
    categories: [
      {
        id: "mains",
        title: "Mains",
        dishes: [
          {
            id: "green-risotto",
            name: "Green risotto",
            description: "Peas, herbs, and a toasted seed topping.",
            price: { amount: 19, currency: "EUR" },
            dietaryTags: [plantBased],
            allergens: [sesame],
          },
          {
            id: "roasted-squash",
            name: "Roasted squash",
            description: "Squash, grains, and a spoon of almond cream.",
            price: { amount: 21, currency: "EUR" },
            dietaryTags: [vegetarian],
            allergens: [almond],
          },
        ],
      },
    ],
  },
];

const noImageMenus: RestaurantMenu[] = [
  {
    id: "no-photos",
    title: "The menu, without photography",
    description: "A clear text-first menu for a small neighborhood kitchen.",
    categories: [
      {
        id: "plates",
        title: "Plates",
        dishes: [
          {
            id: "beans-on-toast",
            name: "Butter beans on toast",
            description:
              "White beans with slow-cooked tomato and toasted sourdough.",
            price: { amount: 12, currency: "GBP" },
            dietaryTags: [vegetarian],
          },
          {
            id: "seasonal-salad",
            name: "Seasonal salad",
            description: "Leaves, roots, and a sharp house dressing.",
            price: { amount: 15, currency: "GBP" },
            dietaryTags: [plantBased],
          },
          {
            id: "apple-crumble",
            name: "Apple crumble",
            description: "Warm apple with oat topping and pouring cream.",
            price: { amount: 8, currency: "GBP" },
          },
        ],
      },
    ],
  },
];

const dietaryFilters: RestaurantMenuDietaryFilter[] = [
  { id: "plant-based", label: "Plant-based" },
  { id: "vegetarian", label: "Vegetarian" },
];

const scenarios = [
  { variant: "cafe", useCase: "A café breakfast and lunch menu." },
  { variant: "tapas", useCase: "A tapas menu with several plate categories." },
  { variant: "fine-dining", useCase: "A tasting menu with named courses." },
  { variant: "lunch-dinner", useCase: "Separate lunch and dinner menus." },
  {
    variant: "dietary",
    useCase: "Caller-supplied dietary tags and allergen information.",
  },
  { variant: "no-photos", useCase: "A complete menu without food photography." },
] as const satisfies readonly SectionVariantPreview<MenuScenario>[];

type MenuScenario =
  | "cafe"
  | "tapas"
  | "fine-dining"
  | "lunch-dinner"
  | "dietary"
  | "no-photos";

type MenuScenarioData = {
  title: string;
  menus: RestaurantMenu[];
  dietaryFilters?: RestaurantMenuDietaryFilter[];
};

const menuScenarioData: Record<MenuScenario, MenuScenarioData> = {
  cafe: { title: "Café menu", menus: cafeMenus },
  tapas: { title: "Tapas menu", menus: tapasMenus },
  "fine-dining": { title: "Fine dining menu", menus: fineDiningMenus },
  "lunch-dinner": {
    title: "Lunch and dinner",
    menus: lunchDinnerMenus,
  },
  dietary: {
    title: "Dietary and allergen notes",
    menus: dietaryMenus,
    dietaryFilters,
  },
  "no-photos": { title: "Text-first menu", menus: noImageMenus },
};

const featuredDish: RestaurantDish = {
  id: "seasonal-tart",
  name: "Seasonal tomato tart",
  description:
    "Heirloom tomatoes, soft herbs, and a flaky pastry base. ".repeat(2),
  price: { amount: 17.5, currency: "EUR" },
  image: { src: photos.tapas, alt: "A seasonal dish served for sharing" },
  dietaryTags: [vegetarian],
  allergens: [almond],
  popular: true,
  portionSize: "Serves one",
};

const dishVariants: SectionVariantPreview<DishCardVariant>[] = [
  { variant: "compact", useCase: "Fit a dish into a dense list." },
  { variant: "standard", useCase: "Present the full dish description." },
  { variant: "featured", useCase: "Give a highlighted dish more visual weight." },
];

const dietaryVariants: SectionVariantPreview<DietaryInformationVariant>[] = [
  { variant: "compact", useCase: "Show readable tags with minimal detail." },
  { variant: "expanded", useCase: "Include descriptions for supplied labels." },
];

export const DishCardVariantsExample = () => (
  <SectionVariantPreviews
    componentName="DishCard"
    variants={dishVariants}
    buildCode={(variant) =>
      `<DishCard dish={dish} variant="${variant}" locale="en-GB" />`
    }
    renderVariant={(variant) => (
      <DishCard dish={featuredDish} variant={variant} locale="en-GB" />
    )}
  />
);

export const DietaryInformationVariantsExample = () => (
  <SectionVariantPreviews
    componentName="DietaryInformation"
    variants={dietaryVariants}
    buildCode={(variant) =>
      `<DietaryInformation tags={tags} allergens={allergens} variant="${variant}" />`
    }
    renderVariant={(variant) => (
      <DietaryInformation
        tags={[plantBased, vegetarian]}
        allergens={[sesame, almond]}
        variant={variant}
      />
    )}
  />
);

export const DietaryInformationPopoverExample = () => (
  <DietaryInformation
    tags={[plantBased]}
    allergens={[sesame, almond]}
    showDetailsPopover
  />
);

export const RestaurantMenuSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="RestaurantMenuSection"
    variants={scenarios}
    buildCode={(variant) =>
      `<RestaurantMenuSection title="${menuScenarioData[variant].title}" menus={${variant}Menus} locale="en-GB"${variant === "dietary" ? " dietaryFilters={dietaryFilters}" : ""} />`
    }
    renderVariant={(variant) => {
      const { title, menus, dietaryFilters: filters } =
        menuScenarioData[variant];

      return (
        <RestaurantMenuSection
          title={title}
          menus={menus}
          dietaryFilters={filters}
          locale="en-GB"
          showDietaryDetailsPopover={variant === "dietary"}
        />
      );
    }}
  />
);
