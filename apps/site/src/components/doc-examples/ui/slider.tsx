import { useState } from "react";
import { FormField, Slider, Stack } from "@puzzle-ui/ui";

export const ControlledSliderExample = () => {
  const [volume, setVolume] = useState(40);

  return (
    <Stack>
      <FormField label="Volume">
        <Slider
          value={volume}
          onChange={setVolume}
          showValue
          formatValue={(value) => value + "%"}
        />
      </FormField>
      <span role="status">Selected volume: {volume}%</span>
    </Stack>
  );
};
