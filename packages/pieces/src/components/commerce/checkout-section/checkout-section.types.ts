import type { ReactNode } from "react";
import type { MarketingSectionBaseProps } from "../../marketing/shared";
import type { PaymentMethodOption } from "../payment-method-selector";

export type CheckoutSectionVariant =
  | "form"
  | "split"
  | "compact"
  | "multi-step"
  | "sidebar";

export type CheckoutStep = {
  id: string;
  title: ReactNode;
  completed?: boolean;
  disabled?: boolean;
};

export type CheckoutSectionProps = Omit<
  MarketingSectionBaseProps<"section">,
  "as" | "onSubmit"
> & {
  variant?: CheckoutSectionVariant;
  customerDetails?: ReactNode;
  billingDetails?: ReactNode;
  shippingDetails?: ReactNode;
  payment?: ReactNode;
  review?: ReactNode;
  summary?: ReactNode;
  paymentMethods?: readonly PaymentMethodOption[];
  selectedPaymentMethod?: string;
  defaultPaymentMethod?: string;
  paymentMethodName?: string;
  onPaymentMethodChange?: (value: string) => void;
  steps?: readonly CheckoutStep[];
  currentStepId?: string;
  onStepChange?: (stepId: string) => void;
  terms?: ReactNode;
  actions?: ReactNode;
  onSubmit?: (formData: FormData) => void | Promise<void>;
  submitLabel?: ReactNode;
  loading?: boolean;
  success?: ReactNode;
  error?: ReactNode;
};
