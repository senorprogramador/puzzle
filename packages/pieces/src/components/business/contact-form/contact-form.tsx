"use client";

import { useState, type FormEvent } from "react";
import {
  Button,
  Checkbox,
  FormField,
  Select,
  TextAreaInput,
  TextInput,
} from "@puzzle-ui/ui";
import { cn } from "@puzzle-ui/core";
import type {
  ContactFormField,
  ContactFormProps,
  ContactFormValue,
  ContactFormValues,
} from "./contact-form.types";
import { DEFAULT_FIELDS, validateContactForm } from "./contact-form.utils";

import "./contact-form.css";

const fieldValue = (
  values: ContactFormValues,
  field: ContactFormField,
): ContactFormValue => values[field.name] ?? (field.type === "checkbox" ? false : "");

const ContactForm = ({
  fields = DEFAULT_FIELDS,
  value,
  defaultValue = {},
  onChange,
  onSubmit,
  errors,
  error,
  success,
  loading = false,
  disabled = false,
  title,
  description,
  submitLabel = "Send inquiry",
  loadingLabel = "Sending…",
  consent,
  honeypotName,
  honeypotLabel = "Leave this field empty",
  className,
}: ContactFormProps) => {
  const controlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<ContactFormValues>(defaultValue);
  const [internalErrors, setInternalErrors] = useState<Record<string, string>>({});
  const [statusError, setStatusError] = useState<unknown>(null);
  const [submitted, setSubmitted] = useState(false);
  const currentValue = controlled ? value : internalValue;
  const consentName = consent?.name ?? "consent";

  const updateValue = (name: string, next: ContactFormValue) => {
    const nextValue = { ...currentValue, [name]: next };
    if (!controlled) setInternalValue(nextValue);
    onChange?.(nextValue);
    setInternalErrors((current) => ({ ...current, [name]: "" }));
    setStatusError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading || disabled) return;
    setSubmitted(true);
    const validationErrors = validateContactForm(fields, currentValue);
    if (consent?.required && currentValue[consentName] !== true) {
      validationErrors[consentName] = "Consent is required.";
    }
    const mergedErrors = { ...validationErrors, ...errors };
    setInternalErrors(validationErrors as Record<string, string>);
    if (Object.values(mergedErrors).some(Boolean)) return;
    setStatusError(null);
    try {
      await onSubmit(currentValue);
    } catch (reason) {
      setStatusError(reason);
    }
  };

  const renderField = (field: ContactFormField) => {
    const current = fieldValue(currentValue, field);
    const fieldError = errors?.[field.name] ?? (submitted ? internalErrors[field.name] : undefined);
    const common = {
      disabled: disabled || loading,
      required: field.required,
      placeholder: field.placeholder,
    };

    if (field.type === "checkbox") {
      return (
        <Checkbox
          {...common}
          checked={current === true}
          onChange={(event) => updateValue(field.name, event.currentTarget.checked)}
          label={field.label}
          description={field.description}
          aria-invalid={fieldError ? true : undefined}
        />
      );
    }

    if (field.type === "textarea") {
      return (
        <FormField label={field.label} description={field.description} error={fieldError} required={field.required}>
          <TextAreaInput
            {...common}
            value={String(current)}
            onChange={(event) => updateValue(field.name, event.currentTarget.value)}
          />
        </FormField>
      );
    }

    if (field.type === "select") {
      return (
        <FormField label={field.label} description={field.description} error={fieldError} required={field.required}>
          <Select<string>
            options={field.options ?? []}
            value={String(current)}
            onChange={(next) => updateValue(field.name, next ?? "")}
            placeholder={field.placeholder ?? "Select an option"}
            disabled={disabled || loading}
            required={field.required}
          />
        </FormField>
      );
    }

    return (
      <FormField label={field.label} description={field.description} error={fieldError} required={field.required}>
        <TextInput
          {...common}
          type={field.type}
          value={String(current)}
          onChange={(event) => updateValue(field.name, event.currentTarget.value)}
        />
      </FormField>
    );
  };

  const reportedError =
    error ??
    (statusError instanceof Error
      ? statusError.message
      : typeof statusError === "string"
        ? statusError
        : statusError
          ? "Your message could not be sent. Please try again."
          : null);

  return (
    <form className={cn("puzzle-contact-form", className)} onSubmit={handleSubmit} noValidate>
      {title ? <h2>{title}</h2> : null}
      {description ? <p>{description}</p> : null}
      {reportedError ? <div className="puzzle-contact-form__status" role="alert">{reportedError}</div> : null}
      {success ? <div className="puzzle-contact-form__status" role="status" aria-live="polite">{success}</div> : null}
      <div className="puzzle-contact-form__fields">
        {fields.map((field) => (
          <div
            className={cn(
              "puzzle-contact-form__field",
              field.type === "textarea" && "puzzle-contact-form__field--full",
            )}
            key={field.id}
          >
            {renderField(field)}
          </div>
        ))}
      </div>
      {consent ? (
        <div className="puzzle-contact-form__consent">
          <Checkbox
            name={consentName}
            checked={currentValue[consentName] === true}
            onChange={(event) => updateValue(consentName, event.currentTarget.checked)}
            label={
              <>
                {consent.label}{" "}
                {consent.privacyHref ? <a href={consent.privacyHref}>{consent.privacyLabel ?? "Privacy policy"}</a> : null}
              </>
            }
            description={consent.description}
            required={consent.required}
            disabled={disabled || loading}
          />
        </div>
      ) : null}
      {honeypotName ? (
        <div className="puzzle-contact-form__honeypot" aria-hidden="true">
          <label>
            {honeypotLabel}
            <input
              tabIndex={-1}
              autoComplete="off"
              name={honeypotName}
              value={String(currentValue[honeypotName] ?? "")}
              onChange={(event) => updateValue(honeypotName, event.currentTarget.value)}
            />
          </label>
        </div>
      ) : null}
      <Button
        type="submit"
        className="puzzle-contact-form__submit"
        loading={loading}
        disabled={disabled}
      >
        {loading ? loadingLabel : submitLabel}
      </Button>
    </form>
  );
};

export { ContactForm };
