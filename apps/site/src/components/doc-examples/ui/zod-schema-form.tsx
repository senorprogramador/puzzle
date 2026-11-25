import { useState } from "react";
import { FormField, Stack, TextInput } from "@puzzle-ui/ui";
import { ZodSchemaForm } from "@puzzle-ui/ui/zod";
import { z } from "zod";

const profileSchema = z
  .object({
    displayName: z
      .string()
      .trim()
      .min(2, "Use at least two characters.")
      .meta({ label: "Display name", description: "Shown on your profile." }),
    email: z.email(),
    plan: z.enum(["starter", "team"]),
    profile: z.object({
      city: z.string().min(2, "Enter a city.").meta({ label: "City" }),
    }),
    interests: z
      .array(z.string().min(1))
      .min(1, "Add at least one interest.")
      .meta({ label: "Interests" }),
  })
  .refine(
    (profile) =>
      profile.plan !== "team" || profile.email.endsWith("@example.com"),
    {
      path: ["email"],
      message: "Team plans require an @example.com address.",
    },
  );

type ProfileFormValue = {
  displayName?: string;
  email?: string;
  plan?: "starter" | "team";
  profile?: { city?: string };
  interests?: readonly string[];
};

export const ZodSchemaFormExample = () => {
  const [value, setValue] = useState<ProfileFormValue>({
    profile: { city: "" },
    interests: [],
  });
  const [validationStatus, setValidationStatus] = useState("unvalidated");
  const [parsed, setParsed] = useState<z.output<typeof profileSchema> | null>(
    null,
  );

  return (
    <ZodSchemaForm
      schema={profileSchema}
      value={value}
      onChange={setValue}
      onValidationChange={({ status }) => setValidationStatus(status)}
      validationMode={["blur", "submit"]}
      groups={[
        {
          id: "account",
          label: "Account",
          keys: ["displayName", "email", "plan"],
          columns: 3,
        },
        {
          id: "profile",
          label: "Profile",
          keys: ["profile", "interests"],
        },
      ]}
      objects={{ profile: { label: "Location", columns: 2 } }}
      fields={{
        displayName: {
          render: ({
            value,
            onChange,
            label,
            description,
            required,
            disabled,
            readOnly,
            error,
          }) => (
            <FormField
              label={label}
              description={description}
              required={required}
              disabled={disabled}
              error={error}
            >
              <TextInput
                value={typeof value === "string" ? value : ""}
                onChange={(event) => onChange(event.currentTarget.value)}
                disabled={disabled}
                readOnly={readOnly}
              />
            </FormField>
          ),
        },
      }}
      render={({ fields, validate, resetValidation, result, status }) => (
        <div>
          {fields}
          <button
            type="button"
            onClick={async () => {
              const next = await validate();
              setParsed(next.success ? next.data : null);
            }}
          >
            Validate profile
          </button>{" "}
          <button
            type="button"
            onClick={() => {
              resetValidation();
              setParsed(null);
            }}
          >
            Reset validation
          </button>
          <Stack
            gap="sm"
            style={{ marginBlockStart: "var(--puzzle-space-4, 1rem)" }}
          >
            <p aria-live="polite">
              Validation: {status}; callback: {validationStatus}
            </p>
            <details>
              <summary>Controlled raw values</summary>
              <pre>{JSON.stringify(value, null, 2)}</pre>
            </details>
            {result && !result.success && (
              <details>
                <summary>Validation messages</summary>
                <pre>{JSON.stringify(result.messages, null, 2)}</pre>
              </details>
            )}
            {parsed && (
              <details open>
                <summary>Parsed output</summary>
                <pre>{JSON.stringify(parsed, null, 2)}</pre>
              </details>
            )}
          </Stack>
        </div>
      )}
    />
  );
};
