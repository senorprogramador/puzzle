import { useState } from "react";
import { JsonEditor, Stack } from "@puzzle-ui/ui";

const initialPreferences = `{
  "title": "Puzzle workspace",
  "features": ["forms", "editors"],
  "enabled": true
}`;

export const JsonEditorExample = () => {
  const [source, setSource] = useState(initialPreferences);
  const [validationMessage, setValidationMessage] =
    useState("Not validated yet.");

  return (
    <Stack>
      <JsonEditor
        label="Workspace preferences"
        description="Edit JSON, then validate or format it."
        value={source}
        onChange={setSource}
        validate={(value) =>
          typeof value === "object" &&
          value !== null &&
          !Array.isArray(value) &&
          typeof value.title === "string"
            ? null
            : "Expected an object with a string title."
        }
        onValidate={(result) => {
          setValidationMessage(
            result.valid
              ? "Workspace preferences are valid."
              : result.error.message,
          );
        }}
      />
      <span role="status">{validationMessage}</span>
    </Stack>
  );
};
