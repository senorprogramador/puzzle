import { useState } from "react";
import { Autocomplete, Stack } from "@puzzle-ui/ui";
import { fruitOptions } from "../shared/form-options";

export const AutocompleteExample = () => {
  const [value, setValue] = useState<string | undefined>();

  return (
    <Stack>
      <Autocomplete
        label="Fruit"
        options={fruitOptions}
        value={value}
        onChange={setValue}
      />
      <span role="status">Selected: {value ?? "none"}</span>
    </Stack>
  );
};
