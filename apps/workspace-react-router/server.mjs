import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const appRoot = fileURLToPath(new URL(".", import.meta.url));
const clientRoot = resolve(appRoot, "dist/client");
const port = Number(process.env.PORT ?? 4173);
const host = process.env.HOST ?? "127.0.0.1";
const manifest = JSON.parse(
  await readFile(resolve(clientRoot, ".vite/manifest.json"), "utf8"),
);
const clientEntry = manifest["index.html"]?.file;

if (!clientEntry) {
  throw new Error("The client entry is missing from the Vite build manifest.");
}

const serverEntry = await import(
  pathToFileURL(resolve(appRoot, "dist/server/entry.server.js")).href
);
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

const server = createServer(async (incoming, outgoing) => {
  try {
    const url = new URL(incoming.url ?? "/", `http://${incoming.headers.host ?? host}`);

    if (url.pathname.startsWith("/assets/")) {
      const assetPath = resolve(clientRoot, `.${decodeURIComponent(url.pathname)}`);
      if (!assetPath.startsWith(`${clientRoot}${sep}`)) {
        outgoing.writeHead(400).end("Invalid asset path.");
        return;
      }

      const asset = await readFile(assetPath);
      outgoing.writeHead(200, {
        "content-type": contentTypes[extname(assetPath)] ?? "application/octet-stream",
        "cache-control": "public, max-age=31536000, immutable",
      });
      outgoing.end(asset);
      return;
    }

    const headers = new Headers();
    for (const [name, value] of Object.entries(incoming.headers)) {
      if (Array.isArray(value)) headers.set(name, value.join(", "));
      else if (value) headers.set(name, value);
    }

    const method = incoming.method ?? "GET";
    let body;
    if (method !== "GET" && method !== "HEAD") {
      const chunks = [];
      for await (const chunk of incoming) chunks.push(chunk);
      body = Buffer.concat(chunks);
    }

    const request = new Request(url, {
      method,
      headers,
      ...(body ? { body } : {}),
    });
    const response = await serverEntry.renderRequest(request);

    if (response instanceof Response) {
      outgoing.writeHead(response.status, Object.fromEntries(response.headers));
      outgoing.end(await response.text());
      return;
    }

    const html = response.html.replace("/src/entry.client.tsx", `/${clientEntry}`);
    outgoing.writeHead(response.status, { "content-type": "text/html; charset=utf-8" });
    outgoing.end(html);
  } catch (error) {
    console.error(error);
    outgoing.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    outgoing.end("Internal server error.");
  }
});

server.listen(port, host, () => {
  console.log(`React Router fixture listening on http://${host}:${port}`);
});
