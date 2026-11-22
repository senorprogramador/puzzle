import type { ReactNode } from "react";
import type { SelectOption } from "@puzzle-ui/ui";

export type ContactFormValue = string | boolean;
export type ContactFormValues = Record<string, ContactFormValue>;
export type ContactFormErrors = Record<string, ReactNode>;

export type ContactFormFieldType =
  | "text"
  | "email"
  | "phone"
  | "textarea"
  | "select"
  | "checkbox";

export type ContactFormField = {
  id: string;
  name: string;
  type: ContactFormFieldType;
  label: ReactNode;
  description?: ReactNode;
  placeholder?: string;
  required?: boolean;
  options?: readonly SelectOption<string>[];
};

export type ContactFormConsent = {
  name?: string;
  label: ReactNode;
  description?: ReactNode;
  required?: boolean;
  privacyHref?: string;
  privacyLabel?: ReactNode;
};

export type ContactFormProps = {
  fields?: readonly ContactFormField[];
  value?: ContactFormValues;
  defaultValue?: ContactFormValues;
  onChange?: (value: ContactFormValues) => void;
  onSubmit: (value: ContactFormValues) => void | Promise<void>;
  errors?: ContactFormErrors;
  error?: ReactNode;
  success?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  title?: ReactNode;
  description?: ReactNode;
  submitLabel?: ReactNode;
  loadingLabel?: ReactNode;
  consent?: ContactFormConsent;
  honeypotName?: string;
  honeypotLabel?: string;
  className?: string;
};
