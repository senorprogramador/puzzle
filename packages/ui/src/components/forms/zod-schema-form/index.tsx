"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import type { z } from "zod";

import { Grid } from "../../layout/grid";
import { Stack } from "../../layout/stack";
import { Checkbox } from "../checkbox";
import { DatePicker } from "../date-picker";
import { FieldArray } from "../field-array";
import { FormField } from "../form-field";
import {
  NumberInput,
  TextAreaInput,
  TextInput,
  type TextInputType,
} from "../input";
import { Select } from "../select";

import { normalizeZodObjectSchema } from "./schema";
import {
  createValidationRunGuard,
  createZodSchemaValidator,
  formatValidationPath,
  type ValidationResult,
} from "./validation";
import {
  createEmptyValue,
  resolveRelativePath,
  getValueAtPath,
  setValueAtPath,
  toHumanLabel,
} from "./zod-schema-form.utils";
import type {
  DeepPartial,
  ZodSchemaArrayConfig,
  ZodSchemaFieldConfig,
  ZodSchemaFieldContext,
  ZodSchemaFieldRenderer,
  ZodSchemaFormDiagnostic,
  ZodSchemaFormGroup,
  ZodSchemaFormProps,
  ZodSchemaFormState,
  ZodSchemaFormValidationMode,
  ZodSchemaFormValidationState,
  ZodSchemaFormValidationStatus,
  ZodSchemaObjectConfig,
} from "./zod-schema-form.types";
import type {
  NormalizedZodDescriptor,
  NormalizedZodOptionValue,
  NormalizedZodPathSegment,
} from "./schema";

import "./zod-schema-form.css";

const EMPTY_ERRORS: Readonly<Record<string, readonly string[]>> = {};
const EMPTY_TOUCHED = new Set<string>();

type ValidationSource = "change" | "blur" | "manual";

const toValidationState = <Schema extends z.ZodType>(
  status: ZodSchemaFormValidationStatus,
  result: ValidationResult<Schema> | null,
): ZodSchemaFormValidationState<Schema> => {
  const errors = result && !result.success ? result.messages : EMPTY_ERRORS;

  return {
    status,
    result,
    errors,
    isValid: status === "valid",
    isValidating: status === "validating",
  };
};

const sameErrors = (
  left: Readonly<Record<string, readonly string[]>>,
  right: Readonly<Record<string, readonly string[]>>,
) => {
  const leftKeys = Object.keys(left);
  const rightKeys = Object.keys(right);

  return (
    leftKeys.length === rightKeys.length &&
    leftKeys.every((key) => {
      const leftMessages = left[key] ?? [];
      const rightMessages = right[key] ?? [];

      return (
        leftMessages.length === rightMessages.length &&
        leftMessages.every((message, index) => message === rightMessages[index])
      );
    })
  );
};

const getMessages = (
  errors: Readonly<Record<string, readonly string[]>>,
  path: readonly NormalizedZodPathSegment[],
) => errors[formatValidationPath(path)] ?? [];

const renderMessages = (messages: readonly string[]): ReactNode => {
  if (messages.length === 0) {
    return undefined;
  }

  if (messages.length === 1) {
    return messages[0];
  }

  return (
    <ul className="puzzle-zod-schema-form__error-list">
      {messages.map((message, index) => (
        <li key={`${index}-${message}`}>{message}</li>
      ))}
    </ul>
  );
};

const formatOptionLabel = (value: NormalizedZodOptionValue) => {
  if (typeof value === "string") {
    return toHumanLabel(value);
  }

  return value == null ? "Empty" : String(value);
};

const isTextInputType = (value: string): value is TextInputType =>
  ["text", "email", "url", "password", "phone", "search"].some(
    (type) => type === value,
  );

const getTextInputType = (
  descriptor: NormalizedZodDescriptor,
): TextInputType => {
  if (descriptor.type === "email" || descriptor.type === "url") {
    return descriptor.type;
  }

  const inputType = descriptor.metadata.inputType;
  return typeof inputType === "string" && isTextInputType(inputType)
    ? inputType
    : "text";
};

const dateConstraint = (value: string | undefined) => {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const getStableItemId = (item: unknown) => {
  if (item === null || typeof item !== "object") {
    return undefined;
  }

  const id = Reflect.get(item, "id");
  return typeof id === "string" || typeof id === "number" ? id : undefined;
};

const toFieldKey = (path: readonly NormalizedZodPathSegment[]) => {
  if (path.length === 0) {
    return formatValidationPath(path);
  }

  const canUseDottedAlias = path.every(
    (segment) =>
      typeof segment === "number" ||
      (!segment.includes(".") && !/^\d+$/.test(segment)),
  );

  return canUseDottedAlias
    ? path.map(String).join(".")
    : formatValidationPath(path);
};

const resolveConfig = (
  fields: Readonly<Record<string, ZodSchemaFieldConfig>> | undefined,
  path: readonly NormalizedZodPathSegment[],
): ZodSchemaFieldConfig | undefined => {
  const pathKey = formatValidationPath(path);
  const pathConfig = fields?.[pathKey];

  if (pathConfig) {
    return pathConfig;
  }

  if (path.length === 1 && typeof path[0] === "string" && fields?.[path[0]]) {
    return fields[path[0]];
  }

  const dottedAlias = toFieldKey(path);
  return dottedAlias !== pathKey ? fields?.[dottedAlias] : undefined;
};

const resolveObjectConfig = (
  objects: Readonly<Record<string, ZodSchemaObjectConfig>> | undefined,
  path: readonly NormalizedZodPathSegment[],
) => {
  const pathKey = formatValidationPath(path);
  const pathConfig = objects?.[pathKey];

  if (pathConfig) {
    return pathConfig;
  }

  if (path.length === 1 && typeof path[0] === "string" && objects?.[path[0]]) {
    return objects[path[0]];
  }

  const dottedAlias = toFieldKey(path);
  return dottedAlias !== pathKey ? objects?.[dottedAlias] : undefined;
};

const getPropertyName = (descriptor: NormalizedZodDescriptor) => {
  const lastSegment = descriptor.path[descriptor.path.length - 1];

  return (
    descriptor.name ??
    (typeof lastSegment === "string" ? lastSegment : undefined)
  );
};

const labelForDescriptor = (
  descriptor: NormalizedZodDescriptor,
  config: ZodSchemaFieldConfig | undefined,
) => {
  if (config?.label !== undefined) {
    return config.label;
  }

  const name = getPropertyName(descriptor);
  const metadataLabel = descriptor.metadata.label;

  if (typeof metadataLabel === "string") {
    return metadataLabel;
  }

  if (descriptor.label !== undefined && descriptor.label !== name) {
    return descriptor.label;
  }

  return name ? toHumanLabel(name) : "Value";
};

const descriptionForDescriptor = (
  descriptor: NormalizedZodDescriptor,
  config: ZodSchemaFieldConfig | undefined,
) => config?.description ?? descriptor.description;

const diagnostic = (
  code:
    | "unknown_group_key"
    | "duplicate_group_key"
    | "unassigned_field"
    | "unsupported_field",
  path: readonly NormalizedZodPathSegment[],
  message: string,
): ZodSchemaFormDiagnostic => ({ code, path, message });

const ZodSchemaForm = <Schema extends z.ZodObject>({
  schema,
  value,
  onChange,
  onSubmit,
  onValidationChange,
  validationMode = "submit",
  validationDebounceMs = 0,
  disabled = false,
  readOnly = false,
  groups,
  fields,
  fieldTypes,
  objects,
  unassignedFields = "after-groups",
  render,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
}: ZodSchemaFormProps<Schema>) => {
  if (!Number.isFinite(validationDebounceMs) || validationDebounceMs < 0) {
    throw new RangeError("validationDebounceMs must be a non-negative number.");
  }

  const normalized = useMemo(() => normalizeZodObjectSchema(schema), [schema]);
  const validator = useMemo(() => createZodSchemaValidator(schema), [schema]);
  const schemaRef = useRef(schema);
  const valueRef = useRef(value);
  const validatorRef = useRef(validator);
  const callbackRef = useRef(onValidationChange);
  const guardRef = useRef(createValidationRunGuard());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestSourceRef = useRef<ValidationSource>("manual");
  const previousPropsRef = useRef({ schema, value });

  schemaRef.current = schema;
  valueRef.current = value;
  validatorRef.current = validator;
  callbackRef.current = onValidationChange;

  const [validationState, setValidationState] = useState<
    ZodSchemaFormValidationState<Schema>
  >(() => toValidationState("unvalidated", null));
  const validationStateRef = useRef(validationState);
  validationStateRef.current = validationState;

  const [touchedFields, setTouchedFields] =
    useState<ReadonlySet<string>>(EMPTY_TOUCHED);
  const generatedId = useId();

  const validationModes = useMemo(
    () =>
      new Set(
        Array.isArray(validationMode) ? validationMode : [validationMode],
      ),
    [validationMode],
  );

  const publishValidationState = useCallback(
    (next: ZodSchemaFormValidationState<Schema>) => {
      const previous = validationStateRef.current;
      const stateUnchanged =
        previous.status === next.status &&
        previous.result === next.result &&
        previous.isValid === next.isValid &&
        previous.isValidating === next.isValidating &&
        sameErrors(previous.errors, next.errors);

      if (stateUnchanged) {
        return;
      }

      validationStateRef.current = next;
      setValidationState(next);
      callbackRef.current?.(next);
    },
    [],
  );

  const clearScheduledValidation = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resetValidation = useCallback(() => {
    clearScheduledValidation();
    guardRef.current.invalidate();
    setTouchedFields(EMPTY_TOUCHED);
    latestSourceRef.current = "manual";
    publishValidationState(toValidationState("unvalidated", null));
  }, [clearScheduledValidation, publishValidationState]);

  const runValidation = useCallback(
    async (source: ValidationSource): Promise<ValidationResult<Schema>> => {
      clearScheduledValidation();

      const currentSchema = schemaRef.current;
      const currentValue = valueRef.current;
      const currentValidator = validatorRef.current;
      const revision = guardRef.current.startRun();

      latestSourceRef.current = source;
      publishValidationState(
        toValidationState("validating", validationStateRef.current.result),
      );

      let result: ValidationResult<Schema>;

      try {
        result = await currentValidator(currentValue as z.input<Schema>);
      } catch (error) {
        if (
          guardRef.current.isCurrent(revision) &&
          schemaRef.current === currentSchema &&
          valueRef.current === currentValue
        ) {
          publishValidationState(toValidationState("unvalidated", null));
        }

        throw error;
      }

      if (
        !guardRef.current.isCurrent(revision) ||
        schemaRef.current !== currentSchema ||
        valueRef.current !== currentValue
      ) {
        return result;
      }

      publishValidationState(
        toValidationState(result.success ? "valid" : "invalid", result),
      );

      return result;
    },
    [clearScheduledValidation, publishValidationState],
  );

  const validate = useCallback(() => runValidation("manual"), [runValidation]);

  const scheduleValidation = useCallback(
    (source: ValidationSource) => {
      clearScheduledValidation();

      if (validationDebounceMs === 0) {
        void runValidation(source);
        return;
      }

      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        void runValidation(source);
      }, validationDebounceMs);
    },
    [clearScheduledValidation, runValidation, validationDebounceMs],
  );

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      if (validationModes.has("submit")) {
        scheduleValidation("manual");
      }

      onSubmit?.(event);
    },
    [onSubmit, scheduleValidation, validationModes],
  );

  useEffect(() => {
    const previous = previousPropsRef.current;
    const schemaChanged = previous.schema !== schema;
    const valueChanged = previous.value !== value;

    previousPropsRef.current = { schema, value };

    if (!schemaChanged && !valueChanged) {
      return;
    }

    clearScheduledValidation();
    guardRef.current.invalidate();
    publishValidationState(toValidationState("unvalidated", null));

    if (validationModes.has("change")) {
      scheduleValidation("change");
    }
  }, [
    clearScheduledValidation,
    publishValidationState,
    scheduleValidation,
    schema,
    validationModes,
    value,
  ]);

  useEffect(
    () => () => {
      clearScheduledValidation();
      guardRef.current.invalidate();
    },
    [clearScheduledValidation],
  );

  const emitFieldChange = useCallback(
    (path: readonly NormalizedZodPathSegment[], nextValue: unknown) => {
      clearScheduledValidation();
      guardRef.current.invalidate();
      latestSourceRef.current = "manual";
      publishValidationState(toValidationState("unvalidated", null));

      onChange(
        setValueAtPath(valueRef.current, path, nextValue) as DeepPartial<
          z.input<Schema>
        >,
      );
    },
    [clearScheduledValidation, onChange, publishValidationState],
  );

  const markTouched = useCallback(
    (path: readonly NormalizedZodPathSegment[]) => {
      const key = formatValidationPath(path);

      setTouchedFields((current) => {
        if (current.has(key)) {
          return current;
        }

        const next = new Set(current);
        next.add(key);
        return next;
      });

      if (validationModes.has("blur") || validationModes.has("touched")) {
        scheduleValidation("blur");
      }
    },
    [scheduleValidation, validationModes],
  );

  const diagnostics: ZodSchemaFormDiagnostic[] = [];
  const visitedPaths = new Set<string>();
  const shouldShowError = (path: readonly NormalizedZodPathSegment[]) => {
    if (
      validationState.status === "unvalidated" ||
      validationState.status === "validating"
    ) {
      return false;
    }

    if (latestSourceRef.current !== "blur" || !validationModes.has("touched")) {
      return true;
    }

    const pathKey = formatValidationPath(path);
    return [...touchedFields].some(
      (touched) =>
        touched === pathKey ||
        touched.startsWith(`${pathKey}/`) ||
        pathKey.startsWith(`${touched}/`),
    );
  };

  const renderField = (
    descriptor: NormalizedZodDescriptor,
    actualPath: readonly NormalizedZodPathSegment[],
  ): ReactNode => {
    const pathKey = formatValidationPath(actualPath);
    const fieldConfig = resolveConfig(fields, actualPath);
    const label = labelForDescriptor(descriptor, fieldConfig);
    const description = descriptionForDescriptor(descriptor, fieldConfig);

    if (fieldConfig?.hidden) {
      visitedPaths.add(pathKey);
      return null;
    }

    const metadataType = descriptor.metadata.fieldType;
    const typeKey =
      typeof metadataType === "string" ? metadataType : descriptor.type;
    const typeRenderer =
      fieldTypes?.[typeKey] ??
      (descriptor.type === "string" ? fieldTypes?.text : undefined) ??
      (typeKey === descriptor.type ? undefined : fieldTypes?.[descriptor.type]);
    const renderer = fieldConfig?.render ?? typeRenderer;
    const rawValue = getValueAtPath(valueRef.current, actualPath);
    const messages = getMessages(validationState.errors, actualPath);
    const visibleMessages = shouldShowError(actualPath) ? messages : [];
    const disabledField = disabled || fieldConfig?.disabled === true;
    const readOnlyField =
      readOnly || descriptor.readOnly || fieldConfig?.readOnly === true;
    const required = !descriptor.optional && !descriptor.defaulted;
    const optional = descriptor.optional || descriptor.defaulted;

    visitedPaths.add(pathKey);

    if (renderer) {
      const context: ZodSchemaFieldContext = {
        schema: descriptor,
        value: rawValue,
        path: actualPath,
        key: toFieldKey(actualPath) || "value",
        type: typeKey,
        required,
        optional,
        nullable: descriptor.nullable,
        disabled: disabledField,
        readOnly: readOnlyField,
        error: visibleMessages[0],
        errors: visibleMessages,
        description,
        label,
        constraints: descriptor.constraints,
        onChange: (nextValue) => emitFieldChange(actualPath, nextValue),
      };

      return <Fragment key={pathKey}>{renderer(context)}</Fragment>;
    }

    if (typeKey !== descriptor.type) {
      return renderUnsupportedField(
        descriptor,
        actualPath,
        label,
        `No renderer is registered for the custom field type "${typeKey}".`,
      );
    }

    if (descriptor.type === "object") {
      return renderObject(descriptor, actualPath);
    }

    if (descriptor.type === "array") {
      return renderArray(descriptor, actualPath, label, description);
    }

    if (descriptor.type === "unsupported") {
      return renderUnsupportedField(
        descriptor,
        actualPath,
        label,
        descriptor.reason === "recursive_schema"
          ? "Recursive schema fields cannot be expanded safely."
          : "This schema type does not have a built-in renderer.",
      );
    }

    const fieldError = renderMessages(visibleMessages);
    const control = (() => {
      switch (descriptor.type) {
        case "string":
        case "email":
        case "url": {
          const multiline = descriptor.metadata.multiline === true;
          const currentValue = typeof rawValue === "string" ? rawValue : "";
          const sharedProps = {
            value: currentValue,
            placeholder:
              typeof descriptor.metadata.placeholder === "string"
                ? descriptor.metadata.placeholder
                : undefined,
            disabled: disabledField,
            readOnly: readOnlyField,
            required,
            minLength: descriptor.constraints.minLength,
            maxLength: descriptor.constraints.maxLength,
            onBlur: () => markTouched(actualPath),
            "aria-invalid": visibleMessages.length > 0 || undefined,
          };

          return multiline ? (
            <TextAreaInput
              {...sharedProps}
              onChange={(event) =>
                emitFieldChange(actualPath, event.currentTarget.value)
              }
            />
          ) : (
            <TextInput
              {...sharedProps}
              type={getTextInputType(descriptor)}
              onChange={(event) =>
                emitFieldChange(actualPath, event.currentTarget.value)
              }
            />
          );
        }
        case "number": {
          const numberValue = typeof rawValue === "number" ? rawValue : null;
          const integer = descriptor.constraints.integer === true;

          return (
            <NumberInput
              value={numberValue}
              min={descriptor.constraints.minValue}
              max={descriptor.constraints.maxValue}
              step={integer ? 1 : 0.01}
              fractionDigits={integer ? 0 : 12}
              disabled={disabledField}
              readOnly={readOnlyField}
              required={required}
              onBlur={() => markTouched(actualPath)}
              aria-invalid={visibleMessages.length > 0 || undefined}
              onValueChange={(nextValue) =>
                emitFieldChange(
                  actualPath,
                  nextValue === null
                    ? descriptor.nullable
                      ? null
                      : undefined
                    : nextValue,
                )
              }
            />
          );
        }
        case "boolean":
          return (
            <Checkbox
              checked={rawValue === true}
              disabled={disabledField || readOnlyField}
              required={required}
              aria-readonly={readOnlyField || undefined}
              aria-invalid={visibleMessages.length > 0 || undefined}
              onBlur={() => markTouched(actualPath)}
              onChange={(event) =>
                emitFieldChange(actualPath, event.currentTarget.checked)
              }
            />
          );
        case "enum":
        case "literal": {
          const options = descriptor.options.map((option) => ({
            value: option.value,
            label: option.label || formatOptionLabel(option.value),
          }));

          return (
            <Select<unknown>
              options={options}
              value={rawValue}
              placeholder={
                typeof descriptor.metadata.placeholder === "string"
                  ? descriptor.metadata.placeholder
                  : "Select an option"
              }
              disabled={disabledField || readOnlyField}
              required={required}
              aria-readonly={readOnlyField || undefined}
              aria-invalid={visibleMessages.length > 0 || undefined}
              onChange={(nextValue) =>
                emitFieldChange(
                  actualPath,
                  nextValue === undefined && descriptor.nullable
                    ? null
                    : nextValue,
                )
              }
              onBlur={() => markTouched(actualPath)}
            />
          );
        }
        case "date": {
          const currentValue = rawValue instanceof Date ? rawValue : null;

          return (
            <DatePicker
              value={currentValue}
              minDate={dateConstraint(descriptor.constraints.minDate)}
              maxDate={dateConstraint(descriptor.constraints.maxDate)}
              placeholder={
                typeof descriptor.metadata.placeholder === "string"
                  ? descriptor.metadata.placeholder
                  : "Select date"
              }
              disabled={disabledField || readOnlyField}
              required={required}
              clearable={optional || descriptor.nullable}
              aria-readonly={readOnlyField || undefined}
              aria-invalid={visibleMessages.length > 0 || undefined}
              onChange={(nextValue) =>
                emitFieldChange(
                  actualPath,
                  nextValue === null
                    ? descriptor.nullable
                      ? null
                      : undefined
                    : nextValue,
                )
              }
              onBlur={() => markTouched(actualPath)}
            />
          );
        }
        default:
          return null;
      }
    })();

    if (control === null) {
      return renderUnsupportedField(
        descriptor,
        actualPath,
        label,
        "No built-in control is available for this normalized field type.",
      );
    }

    return (
      <FormField
        label={label}
        description={description}
        error={fieldError}
        invalid={visibleMessages.length > 0}
        required={required}
        optional={optional}
        disabled={disabledField}
      >
        {control}
      </FormField>
    );
  };

  const renderUnsupportedField = (
    descriptor: NormalizedZodDescriptor,
    path: readonly NormalizedZodPathSegment[],
    label: ReactNode,
    explanation: string,
  ) => {
    const pathKey = formatValidationPath(path);
    const detectedType =
      descriptor.type === "unsupported"
        ? descriptor.sourceType
        : descriptor.type;
    const message = `${String(label)} (${pathKey}) is ${detectedType}: ${explanation} Register a renderer with fieldTypes or fields[path].render.`;

    diagnostics.push(diagnostic("unsupported_field", path, message));

    return (
      <div
        key={pathKey}
        className="puzzle-zod-schema-form__unsupported"
        role="alert"
      >
        <strong>{label}</strong>
        <span>{message}</span>
      </div>
    );
  };

  const renderArray = (
    descriptor: Extract<NormalizedZodDescriptor, { type: "array" }>,
    actualPath: readonly NormalizedZodPathSegment[],
    label: ReactNode,
    description: ReactNode,
  ) => {
    const pathKey = formatValidationPath(actualPath);
    const config = resolveConfig(fields, actualPath)?.array;
    const rawValue = getValueAtPath(valueRef.current, actualPath);
    const items = Array.isArray(rawValue) ? rawValue : [];
    const arrayMessages = shouldShowError(actualPath)
      ? getMessages(validationState.errors, actualPath)
      : [];
    const constraintMin = descriptor.constraints.minLength ?? 0;
    const minItems = Math.max(0, Math.trunc(config?.minItems ?? constraintMin));
    const maxItems = config?.maxItems ?? descriptor.constraints.maxLength;
    const hasStableObjectKeys =
      items.length > 0 &&
      items.every((item) => getStableItemId(item) !== undefined);
    const getItemKey =
      config?.getItemKey ??
      (hasStableObjectKeys
        ? (item: unknown, index: number) => getStableItemId(item) ?? index
        : undefined);
    const reorderable =
      getItemKey !== undefined && (config?.reorderable ?? true);
    const fieldError = renderMessages(arrayMessages);

    visitedPaths.add(pathKey);

    if (config?.reorderable === true && getItemKey === undefined) {
      diagnostics.push(
        diagnostic(
          "unsupported_field",
          actualPath,
          `Reordering is disabled for ${pathKey} because no stable item key is available. Provide fields["${pathKey}"].array.getItemKey.`,
        ),
      );
    }

    if (
      rawValue !== undefined &&
      rawValue !== null &&
      !Array.isArray(rawValue)
    ) {
      diagnostics.push(
        diagnostic(
          "unsupported_field",
          actualPath,
          `${String(label)} (${pathKey}) has a non-array raw value; render uses an empty list until the controlled value is corrected.`,
        ),
      );
    }

    return (
      <FieldArray
        key={pathKey}
        className="puzzle-zod-schema-form__array"
        label={label}
        description={description}
        error={fieldError}
        invalid={arrayMessages.length > 0}
        items={items}
        onChange={(nextItems) => emitFieldChange(actualPath, nextItems)}
        createItem={
          config?.createItem ?? (() => createEmptyValue(descriptor.element))
        }
        getItemKey={getItemKey}
        itemLabel={config?.itemLabel ?? ((_item, index) => `Item ${index + 1}`)}
        minItems={minItems}
        maxItems={maxItems}
        reorderable={reorderable}
        addLabel={config?.addLabel}
        emptyMessage={config?.emptyMessage}
        disabled={disabled || readOnly}
        renderItem={({ item, index }) => {
          const itemPath = [...actualPath, index];

          return renderField(descriptor.element, itemPath);
        }}
      />
    );
  };

  const renderObject = (
    descriptor: Extract<NormalizedZodDescriptor, { type: "object" }>,
    actualPath: readonly NormalizedZodPathSegment[],
  ) => {
    const pathKey = formatValidationPath(actualPath);
    const config = resolveObjectConfig(objects, actualPath);
    const label =
      config?.label ??
      descriptor.label ??
      (actualPath.length > 0
        ? getPropertyName(descriptor)
          ? toHumanLabel(getPropertyName(descriptor)!)
          : "Object"
        : undefined);
    const description = config?.description ?? descriptor.description;
    const objectMessages =
      actualPath.length > 0 && shouldShowError(actualPath)
        ? getMessages(validationState.errors, actualPath)
        : [];
    const objectErrorId = `${generatedId}-${encodeURIComponent(pathKey)}-error`;
    const assignedKeys = new Set<string>();
    const grouped: {
      group: ZodSchemaFormGroup;
      descriptors: NormalizedZodDescriptor[];
    }[] = [];
    const objectGroups = actualPath.length === 0 ? groups : config?.groups;

    visitedPaths.add(pathKey);

    for (const group of objectGroups ?? []) {
      const groupDescriptors: NormalizedZodDescriptor[] = [];

      for (const key of group.keys) {
        const property = descriptor.properties.find(
          (candidate) => getPropertyName(candidate) === key,
        );

        if (!property) {
          diagnostics.push(
            diagnostic(
              "unknown_group_key",
              [...actualPath, key],
              `Group "${group.id}" references unknown field "${key}" at ${pathKey}.`,
            ),
          );
          continue;
        }

        if (assignedKeys.has(key)) {
          diagnostics.push(
            diagnostic(
              "duplicate_group_key",
              [...actualPath, key],
              `Field "${key}" is assigned to more than one group at ${pathKey}; the first assignment is used.`,
            ),
          );
          continue;
        }

        assignedKeys.add(key);
        groupDescriptors.push(property);
      }

      grouped.push({ group, descriptors: groupDescriptors });
    }

    const ungrouped = descriptor.properties.filter((property) => {
      const name = getPropertyName(property);
      return name !== undefined && !assignedKeys.has(name);
    });

    if (unassignedFields === "error" && ungrouped.length > 0) {
      diagnostics.push(
        diagnostic(
          "unassigned_field",
          actualPath,
          `${ungrouped.length} field(s) in ${pathKey} are not assigned to a group.`,
        ),
      );
    }

    const renderProperty = (property: NormalizedZodDescriptor) => {
      const propertyPath = resolveRelativePath(
        descriptor.path,
        actualPath,
        property.path,
      );

      return (
        <Fragment key={formatValidationPath(propertyPath)}>
          {renderField(property, propertyPath)}
        </Fragment>
      );
    };

    const groupedContent = grouped.map(
      ({ group, descriptors: entries }, groupIndex) => {
        const groupLabelId = `${generatedId}-${encodeURIComponent(pathKey)}-${encodeURIComponent(group.id)}-${groupIndex}-label`;
        const groupDescriptionId = `${groupLabelId}-description`;

        return (
          <fieldset
            key={group.id}
            className="puzzle-zod-schema-form__group"
            aria-describedby={
              group.description !== undefined ? groupDescriptionId : undefined
            }
          >
            {group.label !== undefined && (
              <legend
                id={groupLabelId}
                className="puzzle-zod-schema-form__group-label"
              >
                {group.label}
              </legend>
            )}
            {group.description !== undefined && (
              <p
                id={groupDescriptionId}
                className="puzzle-zod-schema-form__description"
              >
                {group.description}
              </p>
            )}
            <Grid
              columns={{
                mobile: 1,
                tablet: 1,
                desktop: group.columns ?? config?.columns ?? 2,
              }}
              gap="md"
            >
              {entries.map(renderProperty)}
            </Grid>
          </fieldset>
        );
      },
    );

    const unassignedContent =
      unassignedFields === "hide" || ungrouped.length === 0 ? null : (
        <Stack className="puzzle-zod-schema-form__unassigned" gap="md">
          {ungrouped.map(renderProperty)}
        </Stack>
      );
    const content = (
      <Stack className="puzzle-zod-schema-form__object-content" gap="md">
        {renderMessages(objectMessages) !== undefined && (
          <div
            id={objectErrorId}
            className="puzzle-zod-schema-form__object-error"
            role="alert"
          >
            {renderMessages(objectMessages)}
          </div>
        )}
        {groupedContent}
        {unassignedContent}
      </Stack>
    );

    if (unassignedFields === "hide") {
      for (const property of ungrouped) {
        visitedPaths.add(
          formatValidationPath(
            resolveRelativePath(descriptor.path, actualPath, property.path),
          ),
        );
      }
    }

    const hasHeader = config?.showHeader ?? actualPath.length > 0;
    const hasBorder = config?.border ?? actualPath.length > 0;
    const hasPadding = config?.padding ?? actualPath.length > 0;
    const objectClassName = [
      "puzzle-zod-schema-form__object",
      hasBorder && "puzzle-zod-schema-form__object--bordered",
      hasPadding && "puzzle-zod-schema-form__object--padded",
      objectMessages.length > 0 && "puzzle-zod-schema-form__object--invalid",
    ]
      .filter(Boolean)
      .join(" ");

    if (config?.collapsible) {
      return (
        <details
          key={pathKey}
          open
          className={objectClassName}
          aria-describedby={
            objectMessages.length > 0 ? objectErrorId : undefined
          }
        >
          <summary className="puzzle-zod-schema-form__summary">
            {label ?? "Object"}
          </summary>
          {description !== undefined && (
            <p className="puzzle-zod-schema-form__description">{description}</p>
          )}
          {content}
        </details>
      );
    }

    if (hasHeader || hasBorder || hasPadding) {
      return (
        <fieldset
          key={pathKey}
          className={objectClassName}
          aria-label={
            !hasHeader && typeof label === "string" ? label : undefined
          }
          aria-describedby={
            objectMessages.length > 0 ? objectErrorId : undefined
          }
          aria-invalid={objectMessages.length > 0 || undefined}
        >
          {hasHeader && label !== undefined && (
            <legend className="puzzle-zod-schema-form__object-label">
              {label}
            </legend>
          )}
          {description !== undefined && (
            <p className="puzzle-zod-schema-form__description">{description}</p>
          )}
          {content}
        </fieldset>
      );
    }

    return <div key={pathKey}>{content}</div>;
  };

  const rootFields = renderObject(normalized, []);
  const rootMessages = shouldShowError([])
    ? getMessages(validationState.errors, [])
    : [];
  const unmappedMessages =
    validationState.result && !validationState.result.success
      ? validationState.result.issues.filter(
          (issue) => !visitedPaths.has(formatValidationPath(issue.path)),
        )
      : [];
  const touchedKeys = [...touchedFields];
  const formDiagnostics: ZodSchemaFormDiagnostic[] = [
    ...normalized.diagnostics,
    ...diagnostics,
  ];
  const unresolvedFields = formDiagnostics.filter(
    (entry) => !("severity" in entry) || entry.severity === "warning",
  );
  const formState: ZodSchemaFormState<Schema> = {
    ...validationState,
    fields: rootFields,
    touchedFields: touchedKeys,
    unresolvedFields,
    diagnostics: formDiagnostics,
    validate,
    resetValidation,
  };
  const renderedContent = render ? render(formState) : rootFields;

  return (
    <form
      className={["puzzle-zod-schema-form", className]
        .filter(Boolean)
        .join(" ")}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      noValidate
      onSubmit={handleSubmit}
      data-validation-status={validationState.status}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
    >
      {renderedContent}
      {renderMessages(rootMessages) !== undefined && (
        <div className="puzzle-zod-schema-form__form-error" role="alert">
          {renderMessages(rootMessages)}
        </div>
      )}
      {unmappedMessages.length > 0 && (
        <ul className="puzzle-zod-schema-form__form-error" role="alert">
          {unmappedMessages.map((issue, index) => (
            <li key={`${formatValidationPath(issue.path)}-${index}`}>
              {formatValidationPath(issue.path)}: {issue.message}
            </li>
          ))}
        </ul>
      )}
      {diagnostics.some((entry) => entry.code !== "unsupported_field") && (
        <ul
          className="puzzle-zod-schema-form__diagnostics"
          aria-label="Form configuration diagnostics"
        >
          {diagnostics
            .filter((entry) => entry.code !== "unsupported_field")
            .map((entry, index) => (
              <li
                key={`${entry.code}-${formatValidationPath(entry.path)}-${index}`}
              >
                {entry.message}
              </li>
            ))}
        </ul>
      )}
    </form>
  );
};

export {
  ZodSchemaForm,
  type DeepPartial,
  type ZodSchemaArrayConfig,
  type ZodSchemaFieldConfig,
  type ZodSchemaFieldContext,
  type ZodSchemaFieldRenderer,
  type ZodSchemaFormDiagnostic,
  type ZodSchemaFormGroup,
  type ZodSchemaFormProps,
  type ZodSchemaFormState,
  type ZodSchemaFormValidationMode,
  type ZodSchemaFormValidationState,
  type ZodSchemaFormValidationStatus,
  type ZodSchemaObjectConfig,
};
