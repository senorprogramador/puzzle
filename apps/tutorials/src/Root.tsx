import { Composition, Folder } from "remotion";
import { ComponentTutorial } from "./compositions/ComponentTutorial";
import { tutorials } from "./tutorials";
import { tutorialDurationSeconds } from "./types";

const fps = 30;

export const RemotionRoot = () => (
  <>
    {tutorials.map((tutorial) => (
      <Folder key={tutorial.id} name={tutorial.componentName}>
        <Composition
          id={tutorial.id}
          component={ComponentTutorial}
          defaultProps={{ tutorialId: tutorial.id }}
          durationInFrames={tutorialDurationSeconds(tutorial) * fps}
          fps={fps}
          width={1920}
          height={1080}
        />
        <Composition
          id={`${tutorial.id}-vertical`}
          component={ComponentTutorial}
          defaultProps={{ tutorialId: tutorial.id }}
          durationInFrames={tutorialDurationSeconds(tutorial) * fps}
          fps={fps}
          width={1080}
          height={1920}
        />
      </Folder>
    ))}
  </>
);
