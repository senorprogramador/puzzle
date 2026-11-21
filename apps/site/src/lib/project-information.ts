import auth from "../../../../packages/auth/package.json";
import cms from "../../../../packages/cms/package.json";
import core from "../../../../packages/core/package.json";
import create from "../../../../packages/create/package.json";
import fullstack from "../../../../packages/fullstack/package.json";
import hooks from "../../../../packages/hooks/package.json";
import i18n from "../../../../packages/i18n/package.json";
import icons from "../../../../packages/icons/package.json";
import media from "../../../../packages/media/package.json";
import pieces from "../../../../packages/pieces/package.json";
import seo from "../../../../packages/seo/package.json";
import session from "../../../../packages/session/package.json";
import storage from "../../../../packages/storage/package.json";
import storageD1 from "../../../../packages/storage-d1/package.json";
import storageMongodb from "../../../../packages/storage-mongodb/package.json";
import theme from "../../../../packages/theme/package.json";
import ui from "../../../../packages/ui/package.json";
import root from "../../../../package.json";

import { HOME_URL, SITE_NAME } from "./seo";

type PublicManifest = {
  name: string;
  description: string;
  homepage: string;
  license: string;
  peerDependencies?: Record<string, string>;
  engines?: { node?: string };
};

// Explicitly select public fields rather than serializing package manifests.
const manifests: PublicManifest[] = [
  auth, cms, core, create, fullstack, hooks, i18n, icons, media, pieces, seo, session, storage,
  storageD1, storageMongodb, theme, ui,
];

const repository = root.repository.url.replace(/^git\+/, "").replace(/\.git$/, "");
// Do not advertise npm URLs until these new workspace packages are released.
const unpublishedPackages = new Set([cms.name, i18n.name, media.name]);

const publicPeers = (manifest: PublicManifest): Record<string, string> =>
  Object.fromEntries(
    (["react", "next", "@tanstack/react-start"] as const)
      .filter((name) => manifest.peerDependencies?.[name])
      .map((name) => [name, manifest.peerDependencies![name]!]),
  );

export const projectInformationGET = (): Response =>
  Response.json(
    {
      name: SITE_NAME,
      site: HOME_URL,
      repository,
      license: "MIT",
      packages: manifests.map((manifest) => {
        const peers = publicPeers(manifest);
        return {
          name: manifest.name,
          description: manifest.description,
          documentation: manifest.homepage,
          ...(unpublishedPackages.has(manifest.name)
            ? { availability: "workspace" as const }
            : { npm: `https://www.npmjs.com/package/${manifest.name}` }),
          license: manifest.license,
          ...(manifest.engines?.node && { node: manifest.engines.node }),
          ...(Object.keys(peers).length > 0 && { peers }),
        };
      }),
      apiMaturity: {
        summary:
          "Button, ButtonGroup and ToggleGroup have Stable APIs. Storage adapters, Auth, Session, Fullstack and SEO surfaces described in the tutorials are Beta; other UI primitives have component-specific labels. Beta status does not guarantee production readiness.",
        documentation: `${HOME_URL}docs/tutorials#api-maturity`,
      },
      contributing: `${repository}/blob/main/CONTRIBUTING.md`,
      issues: `${repository}/issues`,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
        "X-Content-Type-Options": "nosniff",
      },
    },
  );
