import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CodeEditor } from "../components/CodeEditor";
import { PuzzlePreview } from "../components/PuzzlePreview";
import { getTutorial } from "../tutorials";
import type { TutorialDefinition, TutorialScene } from "../types";

type ComponentTutorialProps = {
  tutorialId: string;
};

const getSceneStartFrame = (
  tutorial: TutorialDefinition,
  sceneIndex: number,
  fps: number,
) =>
  tutorial.scenes
    .slice(0, sceneIndex)
    .reduce((total, scene) => total + scene.durationSeconds * fps, 0);

const StepsPanel = ({
  steps,
  portrait,
}: {
  steps: readonly string[];
  portrait: boolean;
}) => (
  <div
    style={{
      alignContent: "center",
      background: "linear-gradient(145deg, #10243d, #0d1728)",
      border: "1px solid #29415e",
      borderRadius: 18,
      display: "grid",
      gap: portrait ? 18 : 14,
      minHeight: portrait ? 360 : 430,
      padding: portrait ? 28 : 32,
    }}
  >
    {steps.map((step, index) => (
      <div
        key={step}
        style={{
          alignItems: "center",
          background: "rgba(255,255,255,.045)",
          border: "1px solid rgba(148,163,184,.22)",
          borderRadius: 13,
          color: "#e2e8f0",
          display: "flex",
          fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
          fontSize: portrait ? 25 : 21,
          gap: 18,
          minHeight: portrait ? 82 : 68,
          padding: "12px 18px",
        }}
      >
        <span
          style={{
            alignItems: "center",
            background: "#1d4ed8",
            borderRadius: "50%",
            color: "#fff",
            display: "inline-flex",
            flexShrink: 0,
            fontSize: portrait ? 20 : 17,
            fontWeight: 700,
            height: 34,
            justifyContent: "center",
            width: 34,
          }}
        >
          {index + 1}
        </span>
        {step}
      </div>
    ))}
  </div>
);

const Scene = ({
  tutorial,
  scene,
  index,
  portrait,
}: {
  tutorial: TutorialDefinition;
  scene: TutorialScene;
  index: number;
  portrait: boolean;
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({ frame, fps, config: { damping: 22, stiffness: 100 } });
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(entrance, [0, 1], [22, 0]);
  const hasCodeAndPreview = Boolean(scene.code && scene.preview);

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 75% 4%, rgba(37,99,235,.22), transparent 34%), linear-gradient(135deg, #08111f 0%, #0c1728 58%, #101a2b 100%)",
        color: "#f8fafc",
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        opacity,
        padding: portrait ? "40px 42px 44px" : "42px 76px 38px",
      }}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          gap: 14,
          justifyContent: "space-between",
        }}
      >
        <div style={{ alignItems: "center", display: "flex", gap: 12 }}>
          <span
            style={{
              alignItems: "center",
              background: "#2563eb",
              borderRadius: 10,
              color: "#fff",
              display: "inline-flex",
              fontSize: portrait ? 25 : 21,
              fontWeight: 800,
              height: portrait ? 44 : 38,
              justifyContent: "center",
              width: portrait ? 44 : 38,
            }}
          >
            P
          </span>
          <span style={{ fontSize: portrait ? 24 : 20, fontWeight: 700 }}>
            Puzzle <span style={{ color: "#93c5fd", fontWeight: 500 }}>Developer Tutorials</span>
          </span>
        </div>
        <div
          style={{
            color: "#9db0c8",
            fontSize: portrait ? 18 : 15,
            letterSpacing: ".08em",
            textTransform: "uppercase",
          }}
        >
          {String(index + 1).padStart(2, "0")} / {String(tutorial.scenes.length).padStart(2, "0")}
        </div>
      </div>

      <div
        style={{
          background: "rgba(148,163,184,.18)",
          borderRadius: 99,
          height: 4,
          marginTop: portrait ? 24 : 18,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: "linear-gradient(90deg, #38bdf8, #6366f1)",
            borderRadius: 99,
            height: "100%",
            transform: `scaleX(${Math.max(0.02, (index + (frame / (scene.durationSeconds * fps))) / tutorial.scenes.length)})`,
            transformOrigin: "left",
          }}
        />
      </div>

      <div
        style={{
          marginTop: portrait ? 44 : 32,
          opacity: entrance,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <div
          style={{
            color: "#7dd3fc",
            fontSize: portrait ? 18 : 15,
            fontWeight: 700,
            letterSpacing: ".12em",
            textTransform: "uppercase",
          }}
        >
          {tutorial.componentName} · {tutorial.packageName}
        </div>
        <h1
          style={{
            fontSize: portrait ? 46 : 48,
            fontWeight: 720,
            letterSpacing: "-.035em",
            lineHeight: 1.12,
            margin: "10px 0 10px",
          }}
        >
          {scene.title}
        </h1>
        <p
          style={{
            color: "#b7c5d8",
            fontSize: portrait ? 25 : 21,
            lineHeight: 1.45,
            margin: 0,
            maxWidth: 1500,
          }}
        >
          {scene.body}
        </p>
      </div>

      <div
        style={{
          alignItems: "stretch",
          display: "grid",
          flex: 1,
          gap: portrait ? 20 : 28,
          gridTemplateColumns: "minmax(0, 1fr)",
          marginTop: portrait ? 30 : 26,
          minHeight: 0,
        }}
      >
        <div
          style={{
            alignSelf: "start",
            display: hasCodeAndPreview ? "grid" : "block",
            gap: portrait ? 20 : 24,
            gridTemplateColumns:
              hasCodeAndPreview && !portrait
                ? "minmax(0, 1.05fr) minmax(0, .95fr)"
                : "minmax(0, 1fr)",
          }}
        >
          {scene.code ? (
            <CodeEditor
              code={scene.code}
              filename={scene.codeFilename}
              language={scene.codeLanguage}
              highlightedLines={scene.highlightedLines}
              portrait={portrait}
            />
          ) : scene.preview ? (
            <PuzzlePreview component={scene.preview} sceneId={scene.id} />
          ) : (
            <StepsPanel steps={scene.steps ?? tutorial.objectives} portrait={portrait} />
          )}
          {scene.code && scene.preview ? (
            <div>
              <PuzzlePreview component={scene.preview} sceneId={scene.id} />
              <div
                style={{
                  color: "#9db0c8",
                  fontSize: portrait ? 17 : 14,
                  marginTop: 10,
                  textAlign: "right",
                }}
              >
                Live component render · demo data only
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div
        style={{
          alignItems: "center",
          borderTop: "1px solid rgba(148,163,184,.22)",
          display: "flex",
          gap: 16,
          marginTop: portrait ? 24 : 18,
          paddingTop: portrait ? 20 : 16,
        }}
      >
        <span
          style={{
            color: "#7dd3fc",
            flexShrink: 0,
            fontSize: portrait ? 15 : 12,
            fontWeight: 800,
            letterSpacing: ".11em",
          }}
        >
          CAPTIONS
        </span>
        <p
          style={{
            color: "#e2e8f0",
            fontSize: portrait ? 21 : 18,
            lineHeight: 1.35,
            margin: 0,
          }}
        >
          {scene.narration}
        </p>
        <span
          style={{
            color: "#94a3b8",
            flexShrink: 0,
            fontSize: portrait ? 13 : 11,
            marginLeft: "auto",
            whiteSpace: "nowrap",
          }}
        >
          SILENT · EN
        </span>
      </div>
    </AbsoluteFill>
  );
};

export const ComponentTutorial = ({ tutorialId }: ComponentTutorialProps) => {
  const tutorial = getTutorial(tutorialId);
  const { fps, height, width } = useVideoConfig();
  if (!tutorial) throw new Error(`Unknown tutorial: ${tutorialId}`);

  const portrait = height > width;
  return (
    <AbsoluteFill>
      {tutorial.scenes.map((scene, index) => (
        <Sequence
          key={scene.id}
          from={getSceneStartFrame(tutorial, index, fps)}
          durationInFrames={scene.durationSeconds * fps}
        >
          <Scene
            tutorial={tutorial}
            scene={scene}
            index={index}
            portrait={portrait}
          />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
