import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import clsx from 'clsx';

import styles from './index.module.css';

type FeatureItem = {
  title: string;
  icon: string;
  description: ReactNode;
};

const features: FeatureItem[] = [
  {
    title: '12-Page Dashboard',
    icon: '🖥️',
    description: (
      <>
        An embedded React SPA directly inside VS Code. Manage agents, teams,
        skills, and context packs without leaving your editor.
      </>
    ),
  },
  {
    title: 'Agent Wizard',
    icon: '🤖',
    description: (
      <>
        Create fully configured agents in 6 guided steps — identity, scope,
        workflow, skills, rules, and output format.
      </>
    ),
  },
  {
    title: 'Smart Router',
    icon: '🔀',
    description: (
      <>
        Use <code>@router</code> and let the system automatically pick the best
        agent based on your message, intent, and active file.
      </>
    ),
  },
  {
    title: 'Teams & Kits',
    icon: '👥',
    description: (
      <>
        Group agents into teams with 4 merge strategies. Bundle reusable
        configurations into kits for portability across projects.
      </>
    ),
  },
  {
    title: 'Skills Registry',
    icon: '🧩',
    description: (
      <>
        Browse 9 categories of skills, install from the community registry, and
        attach them to any agent in seconds.
      </>
    ),
  },
  {
    title: 'Context Packs',
    icon: '📦',
    description: (
      <>
        Dynamic context injection with variables, conditionals, and loops.
        Attach packs at project, team, or agent level.
      </>
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
            Get Started
          </Link>
          <Link
            className="button button--secondary button--lg"
            href="https://github.com/egdev6/agent-teams"
          >
            View on GitHub
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
          Everything you need to build an AI agent team
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
          <Heading as="h2">Quick Install</Heading>
          <p>
            Download the <code>.vsix</code> from the{' '}
            <Link href="https://github.com/egdev6/agent-teams-docs/releases">
              Releases page
            </Link>{' '}
            and install it directly in VS Code.
          </p>
          <div className={styles.installSteps}>
            <div className={styles.installStep}>
              <span className={styles.stepNumber}>1</span>
              <span>
                Open <strong>Extensions</strong> panel{' '}
                <code>Ctrl+Shift+X</code>
              </span>
            </div>
            <div className={styles.installStep}>
              <span className={styles.stepNumber}>2</span>
              <span>
                Click <strong>···</strong> → <strong>Install from VSIX…</strong>
              </span>
            </div>
            <div className={styles.installStep}>
              <span className={styles.stepNumber}>3</span>
              <span>Select the downloaded file and reload VS Code</span>
            </div>
          </div>
          <div className={styles.installReqs}>
            <span>
              Requires <strong>VS Code ≥ 1.85.0</strong> and{' '}
              <strong>Node.js ≥ 18.0.0</strong>
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
          Ideal Agent Architecture
        </Heading>
        <p className={styles.architectureSubtitle}>
          Agent Teams is designed around a clean 4-layer pipeline
        </p>
        <div className={styles.pipeline}>
          {[
            { label: 'User Prompt', desc: 'Natural language via @router', icon: '💬' },
            { label: 'Router', desc: 'Scores & delegates to best agent', icon: '🔀' },
            { label: 'Orchestrator', desc: 'Decomposes task into steps', icon: '🧠' },
            { label: 'Workers', desc: 'Domain specialists execute tasks', icon: '⚙️' },
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
            Read Architecture Guide →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="AI Agent Orchestration for VS Code"
      description="Build, manage, and orchestrate AI agents with GitHub Copilot inside VS Code. Create reusable agent kits, configure project profiles, and run an embedded 12-page dashboard."
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
