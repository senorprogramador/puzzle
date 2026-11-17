import { useState } from "react";
import { Select, Stack } from "@puzzle-ui/ui";
import { fruitOptions } from "../shared/form-options";

export const ControlledSelectExample = () => {
  const [fruit, setFruit] = useState<string | undefined>("apple");

  return (
    <Stack>
      <Select
        label="Favorite fruit"
        options={fruitOptions}
        value={fruit}
        onChange={setFruit}
      />
      <span role="status">Selected: {fruit ?? "none"}</span>
    </Stack>
  );
};

export { fruitOptions };
