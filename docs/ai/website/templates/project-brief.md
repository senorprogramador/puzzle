# Project brief

> Duplicate this template per project. Mark each statement as a user-provided
> fact, externally verified fact (with a source), AI-generated suggestion, or
> unknown. Suggestions are not approved requirements. Use `[Unknown — confirm
> with owner]` instead of inventing facts or filling gaps with plausible copy.

## Project

- **Project name:** [User-provided or unknown]
- **Purpose:** [Verified purpose; cite source or mark unknown]
- **Business / organization context:** [User-provided facts and source; no inferred claims]
- **Website type:** [Marketing / product / commerce / content / dashboard / other / unknown]
- **Current site or repository:** [URL/path or none]

## Audience and outcomes

- **Target audience(s):** [Known audience or unknown]
- **Main conversion goal(s):** [User-approved action and measurable outcome]
- **Secondary goals:** [Known goals or unknown]
- **Success measures:** [Metric, baseline if known, target, owner]

## Project configuration

- **Required framework:** [Next.js / TanStack Start / React Router / Basic React (Vite) / other verified choice / undecided]
- **Framework source:** [Existing repository, user requirement, or compatibility guide]
- **Deployment target/runtime:** [Verified target or unknown]
- **Package manager:** [Existing lockfile / user preference / undecided]
- **Styling preference:** [Puzzle Theme / Tailwind / existing system / other / unknown]
- **Languages/locales:** [Required locales and owner / unknown]

The current Create CLI choices are Next.js App Router, TanStack Start,
React Router framework mode, and Basic React (Vite + TypeScript). Verify
capabilities in the [framework matrix](../../frameworks/compatibility.md);
do not treat scaffold availability as production support certification.

## Auth, data, and integrations

- **Auth requirement:** [None / Puzzle Auth / existing provider / other / unknown]
- **Database requirement:** [None / justified persistence need / undecided]
- **Database rationale:** [What behavior requires persistence; no database by default]
- **Candidate adapter:** [MongoDB / Cloudflare D1 / custom / other verified option / undecided]
- **Required integrations:** [Name, owner, purpose, data exchanged, source / unknown]
- **Environment constraints:** [Runtime, hosting, secrets, network, compliance / unknown]

Do not select a database solely because it appears in the CLI. See
[database planning](../database-planning.md).

## Content and design

- **Content sources:** [User-provided material, CMS, verified public sources, or unknown]
- **Content owner/approver:** [Role or unknown]
- **Design references:** [URLs/files and what should be learned from each]
- **Brand assets:** [Verified files and usage rights / unknown]
- **Functional requirements:** [Link to requirements table below]
- **Constraints:** [Accessibility, performance, legal, timeline, existing architecture]

## Requirements

| ID | Requirement | Source/status | Acceptance evidence | Priority |
| --- | --- | --- | --- | --- |
| R-01 | [Describe observable behavior] | [User fact / verified source / suggestion / unknown] | [How it will be tested] | [Must / should / could] |

## Fact and suggestion register

| Claim or proposal | Classification | Source / evidence | Approved by | Allowed use |
| --- | --- | --- | --- | --- |
| [Claim] | [User-provided fact / externally verified fact / AI suggestion / unknown] | [Source or none] | [Person / pending] | [Approved copy / planning only / do not use] |

Never fabricate company facts, prices, testimonials, customer identities, legal
claims, product specifications, ratings, statistics, or contact details. Keep
AI-generated suggestions clearly labeled until approved.

## Unknown information

| Unknown | Why it matters | Decision affected | Owner | Needed by |
| --- | --- | --- | --- | --- |
| [Unknown — confirm with owner] | [Impact] | [Business / content / security / data / architecture / low impact] | [Owner / unknown] | [Milestone] |

Clarify only unknowns that materially change business requirements, content
truth, security, data ownership, or the resulting application. Record reversible
technical assumptions rather than blocking on minor choices.
