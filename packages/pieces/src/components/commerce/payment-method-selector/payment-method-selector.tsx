"use client";

import { Radio, RadioGroup } from "@puzzle-ui/ui";
import { useId } from "react";
import type { PaymentMethodSelectorProps } from "./payment-method-selector.types";
import "./payment-method-selector.css";

const PaymentMethodSelector = ({
  methods,
  value,
  defaultValue,
  name,
  label = "Payment method",
  description,
  error,
  required = false,
  disabled = false,
  onValueChange,
}: PaymentMethodSelectorProps) => {
  const generatedName = useId();
  const ids = new Set<string>();

  methods.forEach((method) => {
    if (!method.id.trim() || ids.has(method.id)) {
      throw new TypeError(
        "Payment method IDs must be non-empty and unique.",
      );
    }

    ids.add(method.id);
  });

  return (
    <RadioGroup
      className="puzzle-payment-method-selector"
      name={name ?? generatedName}
      value={value}
      defaultValue={defaultValue}
      label={label}
      description={description}
      error={error}
      required={required}
      disabled={disabled}
      onValueChange={onValueChange}
    >
      {methods.map((method) => (
        <Radio
          key={method.id}
          value={method.id}
          label={
            <span className="puzzle-payment-method-selector__label">
              {method.icon ? (
                <span aria-hidden="true">{method.icon}</span>
              ) : null}
              <span>{method.label}</span>
              {method.provider ? (
                <span className="puzzle-payment-method-selector__provider">
                  {method.provider}
                </span>
              ) : null}
            </span>
          }
          description={method.description}
          disabled={method.disabled}
        />
      ))}
    </RadioGroup>
  );
};

export { PaymentMethodSelector };
