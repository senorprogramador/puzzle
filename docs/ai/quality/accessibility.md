# Accessibility checks

Use semantic HTML and native browser behavior first. Automated checks catch
some structural and interaction regressions, but do not replace keyboard,
visual-contrast, or screen-reader-oriented inspection.

## Automated checks

The reference-site Playwright suite checks:

- A skip link, header, primary navigation, one main landmark, and a contentinfo
  footer.
- A single level-one page heading and accessible names for navigation,
  breadcrumbs, search, buttons, and form controls.
- Keyboard operation of the skip link, mobile navigation, feature tabs, and FAQ
  accordion.
- Native required-field validation and an announced form confirmation.
- Reduced-motion browser context and responsive layout behavior.

The app's Storybook config includes `@storybook/addon-a11y`, but its setting is
currently `test: "todo"`. Inspect its findings in Storybook; it is not a CI
failure gate. Do not describe this as an enforced automated accessibility
suite.

## Manual review

For each affected interactive flow:

1. Navigate using only the keyboard. Check logical order, visible focus,
   activation, dismissal, and return of focus where relevant.
2. Inspect landmarks, heading hierarchy, accessible names, form instructions,
   invalid states, and status announcements with browser accessibility tools.
3. Check text and control contrast in the actual active theme. Theme tokens are
   the source of truth, but token use alone does not prove sufficient contrast.
4. Check reduced-motion behavior and browser zoom/reflow.
5. Perform screen-reader-oriented inspection when the change affects complex
   semantics, dynamic updates, dialogs, or custom keyboard behavior.

Record which manual checks were performed and note any limitations. Automated
role queries are not equivalent to testing with a screen reader.

## Application-specific scope

Test only controls and states the application actually implements. The
reference site has a mobile menu, tabs, accordion, search/filter controls, and a
client-only contact form; it has no dialogs, authentication, or server
validation. Its contact success message explicitly explains that no data is
sent or stored.
