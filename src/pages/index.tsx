import Link from '@docusaurus/Link';
import Translate, { translate } from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import clsx from 'clsx';

import styles from './index.module.css';

type FeatureItem = {
  title: string;
  icon: string;
  description: React.ReactNode;
};

const features: FeatureItem[] = [
  {
    title: translate({ id: 'homepage.feature.dashboard.title', message: '12-Page Dashboard' }),
    icon: '🖥️',
    description: (
      <Translate id="homepage.feature.dashboard.desc">
        An embedded React SPA directly inside VS Code. Manage agents, teams,
        skills, and context packs without leaving your editor.
      </Translate>
    ),
  },
  {
    title: translate({ id: 'homepage.feature.wizard.title', message: 'Agent Wizard' }),
    icon: '🤖',
    description: (
      <Translate id="homepage.feature.wizard.desc">
        Create fully configured agents in 6 guided steps — identity, scope,
        workflow, skills, rules, and output format.
      </Translate>
    ),
  },
  {
    title: translate({ id: 'homepage.feature.router.title', message: 'Smart Router' }),
    icon: '🔀',
    description: (
      <Translate id="homepage.feature.router.desc">
        Use @router and let the system automatically pick the best agent based
        on your message, intent, and active file.
      </Translate>
    ),
  },
  {
    title: translate({ id: 'homepage.feature.teams.title', message: 'Teams & Kits' }),
    icon: '👥',
    description: (
      <Translate id="homepage.feature.teams.desc">
        Group agents into teams with 4 merge strategies. Bundle reusable
        configurations into kits for portability across projects.
      </Translate>
    ),
  },
  {
    title: translate({ id: 'homepage.feature.skills.title', message: 'Skills Registry' }),
    icon: '🧩',
    description: (
      <Translate id="homepage.feature.skills.desc">
        Browse 9 categories of skills, install from the community registry, and
        attach them to any agent in seconds.
      </Translate>
    ),
  },
  {
    title: translate({ id: 'homepage.feature.context.title', message: 'Context Packs' }),
    icon: '📦',
    description: (
      <Translate id="homepage.feature.context.desc">
        Dynamic context injection with variables, conditionals, and loops.
        Attach packs at project, team, or agent level.
      </Translate>
    ),
  },
];

function Feature({ title, icon, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4', styles.feature)}>
      <div className={styles.featureIcon}>{icon}</div>
      <div className="padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

function HomepageHero() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero', styles.heroBanner)}>
      <div className="container">
        <div className={styles.betaBadge}>🧪 Beta</div>
        <Heading as="h1" className={styles.heroTitle}>
          {siteConfig.title}
        </Heading>
        <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/installation"
          >
            <Translate id="homepage.hero.cta.getStarted">Get Started</Translate>
          </Link>
          <Link
            className="button button--secondary button--lg"
            href="https://github.com/egdev6/agent-teams"
          >
            <Translate id="homepage.hero.cta.viewOnGitHub">View on GitHub</Translate>
          </Link>
        </div>
      </div>
    </header>
  );
}

function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <Heading as="h2" className={styles.featuresTitle}>
          <Translate id="homepage.features.title">Everything you need to build an AI agent team</Translate>
        </Heading>
        <div className="row">
          {features.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

function HomepageInstall() {
  return (
    <section className={styles.installSection}>
      <div className="container">
        <div className={styles.installCard}>
          <Heading as="h2"><Translate id="homepage.install.title">Quick Install</Translate></Heading>
          <p>
            <Translate
              id="homepage.install.desc"
              values={{
                releasesLink: (
                  <Link href="https://github.com/egdev6/agent-teams-docs/releases">
                    <Translate id="homepage.install.releasesPage">Releases page</Translate>
                  </Link>
                ),
              }}
            >
              {'Download the .vsix from the {releasesLink} and install it directly in VS Code.'}
            </Translate>
          </p>
          <div className={styles.installSteps}>
            <div className={styles.installStep}>
              <span className={styles.stepNumber}>1</span>
              <span>
                <Translate id="homepage.install.step1">Open Extensions panel (Ctrl+Shift+X)</Translate>
              </span>
            </div>
            <div className={styles.installStep}>
              <span className={styles.stepNumber}>2</span>
              <span>
                <Translate id="homepage.install.step2">Click ··· → Install from VSIX…</Translate>
              </span>
            </div>
            <div className={styles.installStep}>
              <span className={styles.stepNumber}>3</span>
              <span><Translate id="homepage.install.step3">Select the downloaded file and reload VS Code</Translate></span>
            </div>
          </div>
          <div className={styles.installReqs}>
            <span>
              <Translate id="homepage.install.reqs">Requires VS Code ≥ 1.85.0 and Node.js ≥ 18.0.0</Translate>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomepageArchitecture() {
  return (
    <section className={styles.architectureSection}>
      <div className="container">
        <Heading as="h2" className={styles.featuresTitle}>
          <Translate id="homepage.arch.title">Ideal Agent Architecture</Translate>
        </Heading>
        <p className={styles.architectureSubtitle}>
          <Translate id="homepage.arch.subtitle">Agent Teams is designed around a clean 4-layer pipeline</Translate>
        </p>
        <div className={styles.pipeline}>
          {[
            { label: translate({ id: 'homepage.arch.step1.label', message: 'User Prompt' }), desc: translate({ id: 'homepage.arch.step1.desc', message: 'Natural language via @router' }), icon: '💬' },
            { label: translate({ id: 'homepage.arch.step2.label', message: 'Router' }), desc: translate({ id: 'homepage.arch.step2.desc', message: 'Scores & delegates to best agent' }), icon: '🔀' },
            { label: translate({ id: 'homepage.arch.step3.label', message: 'Orchestrator' }), desc: translate({ id: 'homepage.arch.step3.desc', message: 'Decomposes task into steps' }), icon: '🧠' },
            { label: translate({ id: 'homepage.arch.step4.label', message: 'Workers' }), desc: translate({ id: 'homepage.arch.step4.desc', message: 'Domain specialists execute tasks' }), icon: '⚙️' },
          ].map((step, i, arr) => (
            <div key={step.label} className={styles.pipelineWrapper}>
              <div className={styles.pipelineStep}>
                <div className={styles.pipelineIcon}>{step.icon}</div>
                <div className={styles.pipelineLabel}>{step.label}</div>
                <div className={styles.pipelineDesc}>{step.desc}</div>
              </div>
              {i < arr.length - 1 && (
                <div className={styles.pipelineArrow}>→</div>
              )}
            </div>
          ))}
        </div>
        <div className={styles.architectureCta}>
          <Link className="button button--outline button--primary" to="/docs/agent-architecture">
            <Translate id="homepage.arch.cta">Read Architecture Guide →</Translate>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home(): React.ReactNode {
  return (
    <Layout
      title={translate({ id: 'homepage.layout.title', message: 'AI Agent Orchestration for VS Code' })}
      description={translate({ id: 'homepage.layout.description', message: 'Build, manage, and orchestrate AI agents with GitHub Copilot, Claude code or Codex inside VS Code. Create reusable agent kits, configure project profiles, and run an embedded 12-page dashboard.' })}
    >
      <HomepageHero />
      <main>
        <HomepageFeatures />
        <HomepageArchitecture />
        <HomepageInstall />
      </main>
    </Layout>
  );
}
