import tutorialManifest from "../generated/tutorial-manifest.json";
import "./tutorial-video.css";

type TutorialVideoMetadata = (typeof tutorialManifest)[number];

type TutorialVideoProps = {
  id: string;
  externalUrl?: string;
};

const formatDuration = (durationSeconds: number) => {
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

const getTutorial = (id: string): TutorialVideoMetadata => {
  const tutorial = tutorialManifest.find((entry) => entry.id === id);
  if (!tutorial) {
    throw new Error(`No rendered video tutorial is registered for "${id}".`);
  }
  return tutorial;
};

export const TutorialVideo = ({ id, externalUrl }: TutorialVideoProps) => {
  const tutorial = getTutorial(id);
  if (externalUrl && !/^https?:\/\//i.test(externalUrl)) {
    throw new Error("TutorialVideo externalUrl must use HTTP or HTTPS.");
  }

  const titleId = `tutorial-video-${tutorial.id}-title`;
  const descriptionId = `tutorial-video-${tutorial.id}-description`;

  return (
    <section className="puzzle-tutorial-video" aria-labelledby={titleId}>
      <h2 id={titleId}>Watch the tutorial</h2>
      <p className="puzzle-tutorial-video__description" id={descriptionId}>
        {tutorial.description}
      </p>
      <p className="puzzle-tutorial-video__meta">
        {formatDuration(tutorial.durationSeconds)} ·{" "}
        {tutorial.language.toUpperCase()} captions
      </p>
      <video
        aria-describedby={descriptionId}
        aria-label={tutorial.title}
        controls
        preload="none"
        poster={tutorial.thumbnailUrl}
        width={1920}
        height={1080}
      >
        <source src={tutorial.videoUrl} type="video/mp4" />
        <track
          default
          kind="captions"
          label={`${tutorial.language.toUpperCase()} captions`}
          src={tutorial.captionsUrl}
          srcLang={tutorial.language}
        />
        Your browser does not support embedded video.{" "}
        <a href={tutorial.videoUrl}>Open the MP4 tutorial</a>.
      </video>
      <div className="puzzle-tutorial-video__links">
        <a href={tutorial.videoUrl} download>
          Download the MP4
        </a>
        {externalUrl ? (
          <a href={externalUrl} rel="noreferrer" target="_blank">
            Watch on the external video host
          </a>
        ) : null}
      </div>
    </section>
  );
};
