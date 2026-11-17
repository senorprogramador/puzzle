

export const sectionPreviewImages = {
  workspace:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=85",
  team:
    "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85",
  dashboard:
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=85",
  product:
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85",
  mobile:
    "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=900&q=85",
  landscape:
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85",
  portraitOne:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=85",
  portraitTwo:
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=85",
  portraitThree:
    "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=160&q=85",
  portraitFour:
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=85",
} as const;

export const SectionPreviewImage = ({
  src,
  alt,
  aspectRatio = "16 / 9",
}: {
  src: string;
  alt: string;
  aspectRatio?: string;
}) => (
  <img
    src={src}
    alt={alt}
    loading="eager"
    decoding="async"
    style={{
      display: "block",
      width: "100%",
      aspectRatio,
      borderRadius: "var(--puzzle-radius-md, 0.5rem)",
      objectFit: "cover",
    }}
  />
);

export const SectionPreviewVideo = () => (
  <video
    aria-label="Short video preview"
    controls
    muted
    playsInline
    preload="none"
    poster={sectionPreviewImages.team}
    style={{
      display: "block",
      width: "100%",
      aspectRatio: "16 / 9",
      borderRadius: "var(--puzzle-radius-md, 0.5rem)",
      objectFit: "cover",
    }}
  >
    <source
      src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      type="video/mp4"
    />
    Your browser does not support embedded video.
  </video>
);
