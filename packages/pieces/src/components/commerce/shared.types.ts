export type CommerceMoney = {
  amount: number;
  currency: string;
};

export type CommerceImage = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: "eager" | "lazy";
};

export type CommerceRating = {
  value: number;
  count?: number;
  max?: number;
};
