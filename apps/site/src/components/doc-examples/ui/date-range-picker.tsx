import { useState } from "react";
import {
  DateRangePicker,
  Stack,
  type DateRange,
} from "@puzzle-ui/ui";

const ControlledDateRangeExample = () => {
  const [range, setRange] = useState<DateRange>({
    start: new Date(2025, 2, 15),
    end: new Date(2025, 2, 18),
  });

  return (
    <Stack direction="col" gap="sm">
      <DateRangePicker
        label="Stay dates"
        locale="en-GB"
        value={range}
        onChange={setRange}
        clearable
        months={2}
        fullWidth
      />
      <span role="status">
        {range.start && range.end
          ? `Selected ${range.start.toLocaleDateString("en-GB")} to ${range.end.toLocaleDateString("en-GB")}`
          : "Choose a complete range"}
      </span>
    </Stack>
  );
};

const DateRangePickerExamples = () => (
  <Stack direction="col" gap="lg">
    <DateRangePicker
      label="Basic range"
      locale="en-GB"
      defaultValue={{ start: new Date(2025, 2, 15), end: null }}
      placeholder="Choose a stay"
      fullWidth
    />
    <DateRangePicker
      label="Disabled dates"
      locale="en-GB"
      defaultValue={{ start: new Date(2025, 2, 14), end: new Date(2025, 2, 18) }}
      disabledDates={[new Date(2025, 2, 16), new Date(2025, 2, 17)]}
      months={2}
      fullWidth
    />
    <ControlledDateRangeExample />
  </Stack>
);

export { ControlledDateRangeExample, DateRangePickerExamples };
