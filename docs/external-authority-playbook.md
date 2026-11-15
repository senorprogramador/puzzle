# External Authority Playbook

This playbook prioritizes accurate, verifiable references to Puzzle from
independent sources. It avoids purchased links, fabricated credentials,
undisclosed exchanges, mass-generated submissions, and claims that cannot be
substantiated. External authority is earned over time; no action here
guarantees rankings or AI citations.

## Current baseline

- The GitHub repository has a project description, homepage, MIT license, and
  relevant topics. No GitHub releases were listed during the audit; tags
  include `v0.6.0` and earlier.
- Public npm metadata was missing keywords for 13 packages, and several
  package descriptions were generic. The local manifests for `core`, `ui`,
  `theme`, `hooks`, `icons`, `pieces`, `seo`, `auth`, `session`, `storage`,
  `storage-d1`, `storage-mongodb`, `fullstack`, and `create` now have
  package-specific homepages and keywords; some descriptions were clarified.
- These manifest changes affect future publication only. No packages were
  published and no external profile, listing, or release was created as part
  of this work.

## Priorities

### 1. Keep first-party facts consistent

- Use the same project name, canonical website, repository, license, and
  package purpose across the site, GitHub, npm, and future release notes.
- Keep author and organization profiles accurate and link only profiles
  controlled by the named entity.
- Describe what each package does and who it is for; avoid keyword lists that
  do not match its functionality.
- Publish package metadata updates only as part of a reviewed, authorized
  release. Verify the npm package page after publication.

### 2. Make releases citable

- For each real release, publish a GitHub release with a concise summary,
  compatibility notes, migration guidance when needed, and links to the
  relevant documentation.
- Keep the changelog and package versions aligned. Link to source code,
  examples, API documentation, and issues that substantiate noteworthy
  changes.
- Do not create a release solely to obtain a backlink or to make the project
  appear more active.

### 3. Earn useful third-party references

- Contribute complete, technically useful examples to communities and
  ecosystems where Puzzle is relevant. Follow their editorial and disclosure
  rules and link to Puzzle only when it helps readers reproduce or understand
  the example.
- Ask maintainers to correct or add a listing only when the project meets
  their published criteria. Provide a short factual description and relevant
  links; do not request exact-match anchor text or reciprocal links.
- Prefer independent reviews, tutorials, integrations, and package-directory
  listings that explain actual use over generic directories with no audience
  or editorial standards.
- Correct inaccurate references politely with a verifiable source. Do not
  treat an unlinked mention as an error that must be converted into a link.

### 4. Publish evidence-rich documentation

- Keep tutorials runnable and aligned with current public APIs.
- Include concrete installation, usage, accessibility, and compatibility
  details where relevant. Link examples to source or tests when those provide
  evidence for a claim.
- Keep documentation pages connected through contextual internal links, and
  preserve canonical URLs and stable source references.
- Avoid unsupported superlatives, benchmark claims without reproducible
  methodology, and statements that imply external adoption or endorsement.

### 5. Treat crawler access as a separate policy decision

- Review search indexing, model-training crawlers, and user-triggered fetchers
  as distinct publisher concerns; do not assume one robots.txt rule controls
  all uses.
- Robots.txt is a crawl preference for compliant crawlers, not access control.
  Protect private material with actual authentication and authorization.
- Do not add or remove crawler rules without an explicit publishing decision.
  Recheck the live robots file and its sitemap reference after any authorized
  policy change.

## Measurement and cadence

Maintain a lightweight record of changes and evidence:

| Cadence | Action |
|---|---|
| Each release | Verify npm metadata, versions, changelog, GitHub release notes, and documentation links. |
| Monthly | Review npm and GitHub referrals, relevant third-party mentions, and broken external references. |
| Quarterly | Review search performance and available field data; record impressions, clicks, referring domains, and citations separately. |
| After site or crawler-policy changes | Rerun the endpoint checks in the [SEO/GEO validation report](./seo-geo-validation-report.md). |

Record source, date, and method for every metric. Separate observed traffic and
citations from hypotheses; do not infer a ranking or model-citation effect
from a metadata change or a link count alone.

## Guardrails

- No paid or automated link schemes, fabricated reviews, fake accounts,
  undisclosed endorsements, or mass unsolicited outreach.
- No publication, package release, or external contact without the
  repository owner's normal review and authorization.
- No claims of ranking, citation, or field-performance improvement without
  suitable before-and-after evidence.

