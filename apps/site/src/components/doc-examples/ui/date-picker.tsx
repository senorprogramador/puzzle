import { useState } from "react";
import { Button, DatePicker, Stack } from "@puzzle-ui/ui";

export const ControlledDatePickerExample = () => {
  const [date, setDate] = useState<Date | null>(new Date(2025, 2, 15));

  return (
    <Stack>
      <DatePicker
        label="Appointment"
        locale="en-GB"
        value={date}
        onChange={setDate}
        clearable
      />
      <span role="status">
        {date
          ? `Selected: ${date.toLocaleDateString("en-GB")}`
          : "No date selected"}
      </span>
    </Stack>
  );
};

export const DatePickerFormExample = () => {
  const [submittedDate, setSubmittedDate] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setSubmittedDate(String(data.get("appointment")));
      }}
    >
      <Stack>
        <DatePicker
          label="Appointment date"
          name="appointment"
          locale="en-GB"
          defaultValue={new Date(2025, 2, 15)}
          required
        />
        <Button type="submit">Submit appointment</Button>
        <span role="status">
          {submittedDate ? `Submitted: ${submittedDate}` : "Not submitted"}
        </span>
      </Stack>
    </form>
  );
};
