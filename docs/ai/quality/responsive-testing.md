# Responsive testing

Test actual behavior and visual composition at representative widths. A
viewport list is a minimum sample, not proof that every intermediate width
works.

## Required viewport matrix

| Device class | Width × height |
| --- | --- |
| Mobile | 375 × 812 |
| Mobile | 390 × 844 |
| Tablet | 768 × 1024 |
| Tablet | 1024 × 768 |
| Desktop | 1280 × 800 |
| Desktop | 1440 × 900 |
| Wide desktop | 1920 × 1080 |

The reference-site Playwright suite visits every implemented route at all seven
sizes and fails on horizontal document or body overflow. The documentation
site's preview-layout validator separately checks embedded previews at 320,
390, 768, 1280, and 1920 pixels:

```sh
bun run --filter "@puzzle-ui/site" test:preview-layout
```

## What to inspect

- Check fluid behavior between the listed sizes, especially around navigation,
  grid, and section-layout changes.
- Confirm sections stack and align intentionally, content remains readable,
  and controls stay usable without clipping.
- Check long headings, card rows, form fields, footer columns, and translated
  or unusually long content where relevant.
- Confirm images keep their intended crop and aspect ratio and do not exceed
  their container.
- Exercise the mobile navigation and interactive controls at touch-sized
  widths, then confirm desktop navigation behavior at wider sizes.
- Review both screenshots and the live page. No-overflow assertions cannot
  detect poor hierarchy, cramped content, or awkward wrapping.

If a breakpoint changes the design, inspect at least one width on either side
of it. Add widths when the actual layout requires more coverage; do not replace
the required matrix with a single “mobile” and “desktop” screenshot.
