"use client";

import { useEffect, useRef } from "react";

import type { HeroVideoSource } from "./hero.types";

type HeroVideoProps = {
  source: HeroVideoSource;
  className?: string;
};

const HeroVideo = ({ source, className }: HeroVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const synchronizePlayback = () => {
      if (motionPreference.matches) {
        video.pause();
        return;
      }

      const playback = video.play();

      playback?.catch(() => {
        // Autoplay can be blocked by browser policies.
      });
    };

    synchronizePlayback();

    motionPreference.addEventListener("change", synchronizePlayback);

    return () => {
      motionPreference.removeEventListener("change", synchronizePlayback);
      video.pause();
    };
  }, [source.src]);

  return (
    <video
      ref={videoRef}
      className={className}
      muted
      loop
      playsInline
      preload="metadata"
      poster={source.poster}
      controls={false}
      disablePictureInPicture
      tabIndex={-1}
      aria-hidden="true"
    >
      <source src={source.src} type={source.type} />
    </video>
  );
};

export { HeroVideo };
