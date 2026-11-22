import type {
  ContactFormErrors,
  ContactFormField,
  ContactFormValues,
} from "./contact-form.types";

const DEFAULT_FIELDS: readonly ContactFormField[] = [
  { id: "name", name: "name", type: "text", label: "Name", required: true },
  { id: "email", name: "email", type: "email", label: "Email", required: true },
  { id: "phone", name: "phone", type: "phone", label: "Phone" },
  { id: "subject", name: "subject", type: "text", label: "Subject" },
  {
    id: "message",
    name: "message",
    type: "textarea",
    label: "Message",
    required: true,
  },
];

const hasValue = (value: unknown): boolean =>
  typeof value === "boolean" ? value : typeof value === "string" && value.trim().length > 0;

const validateContactForm = (
  fields: readonly ContactFormField[],
  values: ContactFormValues,
): ContactFormErrors => {
  const errors: ContactFormErrors = {};
  for (const field of fields) {
    const value = values[field.name];
    if (field.required && !hasValue(value)) {
      errors[field.name] = `${String(field.label)} is required.`;
      continue;
    }
    if (field.type === "email" && hasValue(value) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
      errors[field.name] = "Enter a valid email address.";
    }
    if (field.type === "select" && hasValue(value) && field.options && !field.options.some((option) => option.value === value)) {
      errors[field.name] = "Choose a valid option.";
    }
  }
  return errors;
};

export { DEFAULT_FIELDS, hasValue, validateContactForm };
