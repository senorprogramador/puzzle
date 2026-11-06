# @puzzle/ui

## Tests

Three layers, selected by file name and run by Vitest projects (see `vitest.config.ts`):

| Layer     | File pattern          | Environment      | Script                   |
| --------- | --------------------- | ---------------- | ------------------------ |
| Unit      | `*.unit.test.ts`      | Node, no DOM     | `bun run test:unit`      |
| Component | `*.test.tsx` / `.ts`  | jsdom            | `bun run test:component` |
| Browser   | `*.browser.test.tsx`  | Chromium (Playwright) | `bun run test:browser` |

- **Unit**: pure logic (utilities, normalizers).
- **Component**: rendering, ARIA and interaction with Testing Library.
- **Browser**: behavior that needs real layout, computed styles, focus or pointer input.

`bun run vitest` runs unit and component; `bun run test:all` runs everything. The first browser run needs `bunx playwright install chromium`.
