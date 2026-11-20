import { createElement } from "react";
import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { describe, expect, it } from "bun:test";
import { SsrBoundary } from "./ssr";

describe("SsrBoundary streaming", () => {
  it("preserves the streamed server output", async () => {
    const markup = await new Promise((resolve, reject) => {
      const destination = new PassThrough();
      let output = "";
      destination.on("data", (chunk) => {
        output += chunk.toString();
      });
      destination.on("end", () => resolve(output));

      let stream;
      stream = renderToPipeableStream(
        createElement(
          SsrBoundary,
          null,
          createElement("article", null, "Streamed content"),
        ),
        {
          onAllReady: () => stream.pipe(destination),
          onShellError: reject,
        },
      );
    });

    expect(markup).toContain("<article>Streamed content</article>");
  });
});
