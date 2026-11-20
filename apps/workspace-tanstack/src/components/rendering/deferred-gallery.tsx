import { useState } from "react";

const DeferredGallery = () => {
  const [count, setCount] = useState(0);

  return (
    <section data-testid="dynamic-gallery">
      <h2>Deferred gallery</h2>
      <img
        src="/favicon.ico"
        width={64}
        height={64}
        alt="Puzzle gallery preview"
        loading="lazy"
        data-testid="gallery-preview"
      />
      <output data-testid="gallery-count">Gallery count: {count}</output>
      <button
        type="button"
        onClick={() => setCount((currentCount) => currentCount + 1)}
      >
        Increase gallery count
      </button>
    </section>
  );
};

export default DeferredGallery;
