import { useState } from "react";
import { Button, Stack, Stepper } from "@puzzle-ui/ui";

export const ControlledStepperExample = () => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <Stack>
      <Stepper activeStep={activeStep} onStepChange={setActiveStep} clickable>
        <Stepper.Step label="Details" />
        <Stepper.Step label="Shipping" />
        <Stepper.Step label="Payment" />
      </Stepper>
      <Stack direction="row">
        <Button
          variant="outline"
          disabled={activeStep === 0}
          onClick={() => setActiveStep(activeStep - 1)}
        >
          Back
        </Button>
        <Button
          disabled={activeStep === 2}
          onClick={() => setActiveStep(activeStep + 1)}
        >
          Continue
        </Button>
      </Stack>
      <span role="status">Step {activeStep + 1} of 3</span>
    </Stack>
  );
};
