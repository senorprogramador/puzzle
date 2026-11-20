import { Button } from "@puzzle-ui/ui";
import {
  aiReadiness,
  aiReadinessAgents,
  aiReadinessCommands,
  aiReadinessFeatures,
  aiReadinessLinks,
  aiReadinessPackages,
} from "@/lib/homepage";

const ArrowIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const HomeAiReadiness = () => (
  <section
    id="ai-development"
    className="home-ai home-below-fold"
    aria-labelledby="home-ai-title"
  >
    <div className="home-ai__container">
      <div className="home-ai__top">
        <div className="home-ai__intro">
          <p className="home-ai__eyebrow">{aiReadiness.eyebrow}</p>
          <h2 id="home-ai-title">
            {aiReadiness.title.firstLine}
            <br />
            <span>{aiReadiness.title.secondLine}</span>
          </h2>
          <p>{aiReadiness.description}</p>
          <a className="home-ai__text-link" href={aiReadinessLinks[2].href}>
            {aiReadinessLinks[2].label} <ArrowIcon />
          </a>
        </div>

        <figure
          className="home-ai__flow"
          aria-label="Puzzle turns installed package guidance into context for supported coding agents"
        >
          <figcaption className="home-ai__sr-only">
            Installed Puzzle packages provide published instructions for your
            selected coding agent.
          </figcaption>

          <div className="home-ai__project">
            <div className="home-ai__flow-heading">
              <span className="home-ai__flow-dot" aria-hidden="true" />
              <span>Example project dependencies</span>
              <code>package.json</code>
            </div>
            <div className="home-ai__packages">
              {aiReadinessPackages.map((packageName) => (
                <code key={packageName}>{packageName}</code>
              ))}
            </div>
            <p>Guidance ships with each installed package</p>
          </div>

          <div className="home-ai__connector" aria-hidden="true">
            <span>package-aware instructions</span>
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 12h15m-6-6 6 6-6 6" />
            </svg>
          </div>

          <div className="home-ai__context">
            <div className="home-ai__context-heading">
              <span>Published package guidance</span>
              <span>AI CONTEXT</span>
            </div>
            <div className="home-ai__context-row">
              <code>@puzzle-ui/ui</code>
              <span>Public exports / documented props</span>
            </div>
            <div className="home-ai__context-row">
              <code>@puzzle-ui/theme</code>
              <span>Semantic tokens / typed overrides</span>
            </div>
            <div className="home-ai__context-row">
              <code>@puzzle-ui/pieces</code>
              <span>Composable sections / supported variants</span>
            </div>
          </div>

          <div className="home-ai__agents">
            <span className="home-ai__agents-label">Choose your agent</span>
            <ul>
              {aiReadinessAgents.map((agent) => (
                <li key={agent}>{agent}</li>
              ))}
            </ul>
          </div>
        </figure>
      </div>

      <ul className="home-ai__features">
        {aiReadinessFeatures.map((feature) => (
          <li key={feature.id}>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </li>
        ))}
      </ul>

      <div className="home-ai__setup">
        <div className="home-ai__setup-copy">
          <p className="home-ai__eyebrow">ADD PACKAGE CONTEXT, NOT ANOTHER AGENT</p>
          <p>
            Initialize instructions for the Puzzle packages in your project,
            then update or check them as those packages change.
          </p>
          <div className="home-ai__actions">
            <Button variant="primary" href={aiReadinessLinks[0].href}>
              {aiReadinessLinks[0].label} <ArrowIcon />
            </Button>
            <Button variant="outline" href={aiReadinessLinks[1].href}>
              {aiReadinessLinks[1].label}
            </Button>
          </div>
        </div>

        <div className="home-ai__terminal">
          <div className="home-ai__terminal-heading">
            <span>Terminal</span>
            <span>Initialize / update / check</span>
          </div>
          <ol aria-label="Puzzle AI instruction commands">
            {aiReadinessCommands.map((command) => (
              <li key={command}>
                <span aria-hidden="true">$</span>
                <code>{command}</code>
              </li>
            ))}
          </ol>
        </div>

        <p className="home-ai__note">
          These commands run locally once installed. <code>npx</code> may need
          network access to fetch the CLI.
        </p>
      </div>
    </div>
  </section>
);
