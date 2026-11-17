import {
  VideoSection,
  type VideoSectionVariant,
  type VideoItem,
} from "@puzzle-ui/pieces";
import {
  SectionVariantPreviews,
  type SectionVariantPreview,
} from "../shared/section-variant-previews";

const videos: VideoItem[] = [
  {
    id: "studio-film",
    title: "A film about thoughtful spaces",
    sources: [
      {
        src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        type: "video/mp4",
      },
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=960&q=80",
    duration: "00:30",
    description:
      "A short preview for the Northstar Studio launch film. The application supplies its production media and caption tracks.",
    quote: "A calm, clear introduction to the work behind the product.",
    actor: "Northstar Studio",
  },
  {
    id: "team-story",
    title: "How the team works",
    sources: [
      {
        src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
        type: "video/mp4",
      },
    ],
    thumbnail:
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=960&q=80",
    duration: "02:18",
    description: "Meet the small team building Northstar.",
  },
];

const variants: SectionVariantPreview<VideoSectionVariant>[] = [
  { variant: "featured", useCase: "Give one production video the main focus." },
  { variant: "split", useCase: "Pair the video with supporting editorial content." },
  { variant: "background", useCase: "Use a muted, inline video as a backdrop." },
  { variant: "carousel", useCase: "Browse a horizontal set of playable videos." },
  { variant: "grid", useCase: "Show several videos in a responsive collection." },
  { variant: "playlist", useCase: "Select a video from a keyboard-accessible playlist." },
  { variant: "cinematic", useCase: "Give a wide-format film more visual room." },
  { variant: "browser", useCase: "Frame a product walkthrough like an application window." },
  { variant: "phone", useCase: "Present vertical mobile footage." },
  { variant: "testimonials", useCase: "Pair customer video with a quote and speaker." },
  { variant: "tutorial", useCase: "Show instructional footage with captions." },
  { variant: "lightbox", useCase: "Open a selected video in an accessible dialog." },
];

export const VideoSectionVariantsExample = () => (
  <SectionVariantPreviews
    componentName="VideoSection"
    variants={variants}
    buildCode={(variant) =>
      `<VideoSection variant="${variant}" videos={videos} controls />`
    }
    renderVariant={(variant) => (
      <VideoSection
        title="Stories from Northstar Studio"
        description="A small collection of product and team films."
        variant={variant}
        videos={videos}
        controls
        muted={variant === "background"}
        autoplay={variant === "background"}
      />
    )}
  />
);

export const VideoSectionControlsExample = () => (
  <VideoSection
    title="Studio film"
    description="Use the native controls to play, pause, adjust volume, or enable captions."
    variant="featured"
    videos={videos.slice(0, 1).map((item) => ({
      ...item,
      captions: [
        {
          src: "/captions/studio-film.en.vtt",
          srclang: "en",
          label: "English",
          default: true,
        },
      ],
    }))}
    controls
    preload="none"
  />
);
