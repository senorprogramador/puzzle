"use client";

import { useState } from "react";

const DeferredMap = () => {
  const [zoom, setZoom] = useState(1);

  return (
    <section>
      <h2>Interactive map mock</h2>
      <div
        role="region"
        aria-label="Interactive map mock"
        data-testid="interactive-map"
      >
        Map viewport at zoom {zoom}
      </div>
      <output data-testid="map-zoom">Map zoom: {zoom}</output>
      <button
        type="button"
        onClick={() => setZoom((currentZoom) => currentZoom + 1)}
      >
        Zoom in map
      </button>
    </section>
  );
};

export default DeferredMap;
