"use client";

import { useId, useState, type ElementType } from "react";
import { useReducedMotion } from "@puzzle-ui/hooks";
import {
  Button,
  Carousel,
  CarouselController,
  Dialog,
  Heading,
  Text,
} from "@puzzle-ui/ui";

import {
  MarketingSection,
  type MarketingSectionBaseProps,
} from "../../marketing/shared";
import { validateContentIds } from "../shared";
import { EmptyStatePanel } from "../../data-display/empty-state-panel";
import type {
  VideoItem,
  VideoSectionAspectRatio,
  VideoSectionProps,
  VideoSectionVariant,
} from "./video-section.types";

import "./video-section.css";

const getVideoLabel = (video: VideoItem) =>
  video.accessibleLabel ??
  (typeof video.title === "string" ? `Video: ${video.title}` : `Video ${video.id}`);

const VideoPlayer = ({
  video,
  controls,
  autoplay,
  muted,
  loop,
  preload,
  aspectRatio,
  prefersReducedMotion,
}: {
  video: VideoItem;
  controls: boolean;
  autoplay: boolean;
  muted: boolean;
  loop: boolean;
  preload: "none" | "metadata";
  aspectRatio: VideoSectionAspectRatio;
  prefersReducedMotion: boolean;
}) => {
  const autoPlayAllowed = autoplay && muted && !prefersReducedMotion;

  return (
    <div
      className="puzzle-video-section__player"
      style={{ aspectRatio }}
      data-aspect-ratio={aspectRatio}
    >
      <video
        controls={controls}
        autoPlay={autoPlayAllowed}
        muted={muted}
        loop={loop}
        playsInline
        preload={preload}
        poster={video.poster ?? video.thumbnail}
        aria-label={getVideoLabel(video)}
      >
        {video.sources.map((source) => (
          <source
            key={`${video.id}-${source.src}`}
            src={source.src}
            type={source.type}
          />
        ))}
        {video.captions?.map((caption) => (
          <track
            key={`${video.id}-${caption.srclang}-${caption.src}`}
            kind="captions"
            src={caption.src}
            srcLang={caption.srclang}
            label={caption.label}
            default={caption.default}
          />
        ))}
      </video>
    </div>
  );
};

const VideoDetails = ({ video }: { video: VideoItem }) => (
  <div className="puzzle-video-section__details">
    <Heading level="headline3" as="h3">{video.title}</Heading>
    {video.duration ? (
      <span className="puzzle-video-section__duration">{video.duration}</span>
    ) : null}
    {video.description ? <Text as="p">{video.description}</Text> : null}
    {video.quote ? (
      <blockquote>
        <Text as="p">{video.quote}</Text>
        {video.actor ? <footer>{video.actor}</footer> : null}
      </blockquote>
    ) : null}
  </div>
);

const VideoCard = ({
  video,
  controls,
  autoplay,
  muted,
  loop,
  preload,
  aspectRatio,
  prefersReducedMotion,
}: {
  video: VideoItem;
  controls: boolean;
  autoplay: boolean;
  muted: boolean;
  loop: boolean;
  preload: "none" | "metadata";
  aspectRatio: VideoSectionAspectRatio;
  prefersReducedMotion: boolean;
}) => (
  <article className="puzzle-video-section__item">
    <VideoPlayer
      video={video}
      controls={controls}
      autoplay={autoplay}
      muted={muted}
      loop={loop}
      preload={preload}
      aspectRatio={aspectRatio}
      prefersReducedMotion={prefersReducedMotion}
    />
    <VideoDetails video={video} />
  </article>
);

const VideoSection = <C extends ElementType = "section">({
  variant = "featured",
  videos,
  featuredVideoId,
  selectedVideoId,
  onVideoSelect,
  controls = true,
  autoplay = false,
  muted = false,
  loop = false,
  preload = "none",
  aspectRatio = "16 / 9",
  children,
  className,
  ...sectionProps
}: VideoSectionProps<C>) => {
  validateContentIds(videos, "Video");
  const [uncontrolledVideoId, setUncontrolledVideoId] = useState(
    featuredVideoId ?? videos[0]?.id,
  );
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxVideoId, setLightboxVideoId] = useState<string>();
  const lightboxId = useId();
  const prefersReducedMotion = useReducedMotion();
  const activeVideoId =
    selectedVideoId ??
    (featuredVideoId && videos.some((video) => video.id === featuredVideoId)
      ? featuredVideoId
      : uncontrolledVideoId);
  const activeVideo =
    videos.find((video) => video.id === activeVideoId) ?? videos[0];
  const lightboxVideo =
    videos.find((video) => video.id === lightboxVideoId) ?? activeVideo;
  const nativeProps = sectionProps as MarketingSectionBaseProps<C>;

  const chooseVideo = (videoId: string) => {
    if (selectedVideoId === undefined) {
      setUncontrolledVideoId(videoId);
    }
    onVideoSelect?.(videoId);
  };

  const renderPlayer = (video: VideoItem) => (
    <VideoPlayer
      video={video}
      controls={controls}
      autoplay={autoplay && video.id === activeVideoId}
      muted={muted}
      loop={loop}
      preload={preload}
      aspectRatio={aspectRatio}
      prefersReducedMotion={prefersReducedMotion}
    />
  );

  let content = null;

  if (!videos.length) {
    content = (
      <EmptyStatePanel
        title="No videos available"
        variant="minimal"
        className="puzzle-video-section__empty"
      >
        Add video content to display it here.
      </EmptyStatePanel>
    );
  } else if (variant === "carousel") {
    content = (
      <CarouselController<VideoItem> items={[...videos]}>
        <Carousel<VideoItem>
          ariaLabel="Video collection"
          getItemKey={(video) => video.id}
          renderItem={(video) => (
            <VideoCard
              video={video}
              controls={controls}
              autoplay={false}
              muted={muted}
              loop={loop}
              preload={preload}
              aspectRatio={aspectRatio}
              prefersReducedMotion={prefersReducedMotion}
            />
          )}
          backButton={
            <Button variant="outline" aria-label="Previous video">
              Previous
            </Button>
          }
          nextButton={
            <Button variant="outline" aria-label="Next video">
              Next
            </Button>
          }
        />
      </CarouselController>
    );
  } else if (variant === "grid") {
    content = (
      <div className="puzzle-video-section__grid">
        {videos.map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            controls={controls}
            autoplay={false}
            muted={muted}
            loop={loop}
            preload={preload}
            aspectRatio={aspectRatio}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}
      </div>
    );
  } else if (variant === "playlist") {
    content = (
      <div className="puzzle-video-section__playlist">
        {activeVideo ? (
          <VideoCard
            video={activeVideo}
            controls={controls}
            autoplay={autoplay}
            muted={muted}
            loop={loop}
            preload={preload}
            aspectRatio={aspectRatio}
            prefersReducedMotion={prefersReducedMotion}
          />
        ) : null}
        <ol aria-label="Video playlist">
          {videos.map((video) => (
            <li key={video.id}>
              <button
                type="button"
                aria-pressed={video.id === activeVideo?.id}
                onClick={() => chooseVideo(video.id)}
              >
                {video.title}
                {video.duration ? <span>{video.duration}</span> : null}
              </button>
            </li>
          ))}
        </ol>
      </div>
    );
  } else if (variant === "lightbox") {
    content = (
      <>
        <div className="puzzle-video-section__thumbnails">
          {videos.map((video) => (
            <button
              key={video.id}
              type="button"
              className="puzzle-video-section__thumbnail"
              aria-label={`Open ${getVideoLabel(video)} in a dialog`}
              aria-haspopup="dialog"
              aria-controls={lightboxId}
              onClick={() => {
                chooseVideo(video.id);
                setLightboxVideoId(video.id);
                setLightboxOpen(true);
              }}
            >
              {video.thumbnail || video.poster ? (
                <img
                  src={video.thumbnail ?? video.poster}
                  alt=""
                  loading="lazy"
                />
              ) : null}
              <span>{video.title}</span>
            </button>
          ))}
        </div>
        <Dialog
          open={lightboxOpen}
          onOpenChange={setLightboxOpen}
          id={lightboxId}
          title={lightboxVideo?.title ?? "Video"}
          description={
            typeof lightboxVideo?.description === "string"
              ? lightboxVideo.description
              : undefined
          }
          size="xl"
        >
          {lightboxOpen && lightboxVideo ? renderPlayer(lightboxVideo) : null}
        </Dialog>
      </>
    );
  } else if (activeVideo) {
    content = (
      <div className="puzzle-video-section__featured">
        {renderPlayer(activeVideo)}
        <VideoDetails video={activeVideo} />
      </div>
    );
  }

  return (
    <MarketingSection<C>
      {...nativeProps}
      className={`puzzle-video-section ${className ?? ""}`.trim()}
      family="video"
      variant={variant satisfies VideoSectionVariant}
    >
      {content}
      {children}
    </MarketingSection>
  );
};

export { VideoSection };
