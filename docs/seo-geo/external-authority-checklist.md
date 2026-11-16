# External authority checklist

This checklist is for human-managed publication and profile work. It does not
authorize automated account creation, mass outreach, package publication, or
claims about rankings and citations.

## Verified first-party identity

- [ ] Keep the project name, canonical site (`https://puzzle-ui.com`), GitHub
  repository (`senorprogramador/puzzle`), and MIT license consistent.
- [ ] Use package-specific descriptions and keywords that match each package's
  actual API and maturity.
- [ ] Link only official profiles controlled by Puzzle or its maintainer.
- [ ] Keep release notes, package changelogs, and documentation aligned.

The repository README already describes the published package ecosystem and
links to the website and documentation. Package manifest metadata is maintained
in the repository, but npm changes only when packages are published through the
normal release process.

## GitHub settings to verify manually

The current environment has no authenticated GitHub CLI session; these settings
were not changed or verified during this work.

- [ ] Description accurately states that Puzzle is an open-source,
  TypeScript-first React design system and developer ecosystem.
- [ ] Website is `https://puzzle-ui.com`.
- [ ] Topics reflect maintained functionality, for example `react`,
  `typescript`, `design-system`, `ui-components`, `accessibility`,
  `design-tokens`, `authentication`, and `seo`.
- [ ] Remove topics that overstate framework or product support.
- [ ] Confirm private vulnerability reporting availability and keep the
  repository's security policy current.
- [ ] Create GitHub releases only for actual releases; link migration notes,
  compatibility information, and relevant documentation.

## npm and release process

- [ ] Before release, review each changed package's description, keywords,
  license, repository, homepage, bugs URL, exports, and README.
- [ ] Verify the package names and versions against the lockstep release plan.
- [ ] Publish only through the maintainer's reviewed release process; do not
  publish as an SEO experiment.
- [ ] After publication, verify the npm package page and installation metadata.
- [ ] Do not fabricate download counts, users, compatibility, or support
  guarantees.

## Independent references and articles

- [ ] Prefer runnable technical articles, integrations, and directory listings
  with relevant audiences and editorial standards.
- [ ] Suggested article themes: TypeScript-first React design systems;
  accessible component interaction; framework-independent authentication;
  TOTP and WebAuthn integration boundaries; typed Schema.org metadata; and
  reusable page-section composition.
- [ ] For each proposed article, record its audience, search intent, verified
  claims, outline, runnable example, and links to the corresponding Puzzle
  docs.
- [ ] Submit to directories only when Puzzle meets their published criteria.
- [ ] Disclose relationships and correct factual errors using verifiable
  sources.
- [ ] Do not buy links, request exact-match anchor text, exchange links, post
  unsolicited mass submissions, or imply endorsement.

## Evidence log

For each completed action, record the date, destination, change, and public
evidence. Separate repository changes from external profile updates and
independent mentions. No external profile or distribution action was performed
as part of this repository task.
