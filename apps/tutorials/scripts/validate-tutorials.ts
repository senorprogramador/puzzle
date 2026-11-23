import { validateTutorials } from "../src/tutorials/validate";
import { tutorialDurationSeconds } from "../src/types";

const validated = await validateTutorials();
for (const tutorial of validated) {
  console.log(
    `Validated ${tutorial.id}: ${tutorial.scenes.length} scenes, ${tutorialDurationSeconds(tutorial)} seconds`,
  );
}
