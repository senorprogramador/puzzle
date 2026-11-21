import type { ReactNode } from "react";

export type PaymentMethodOption = {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  provider?: string;
  disabled?: boolean;
};

export type PaymentMethodSelectorProps = {
  methods: readonly PaymentMethodOption[];
  value?: string;
  defaultValue?: string;
  name?: string;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
};
