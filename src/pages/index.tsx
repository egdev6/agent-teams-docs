import Link from '@docusaurus/Link';
import Translate, { translate } from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import BrowserOnly from '@docusaurus/BrowserOnly';
import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import { Bot, Layers, Database, BrainCircuit, Blocks, Package, MessageSquareText, Workflow, Puzzle, Brain } from 'lucide-react';

import styles from './index.module.css';
import FeatureCard from '../components/FeatureCard';

function useFadeIn<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-visible');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function FadeInItem({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('fade-in-visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className="fade-in-section" style={{ transitionDelay: `${delay}ms`, height: '100%', ...style }}>
      {children}
    </div>
  );
}

type FeatureItem = {
  title: string;
  icon: React.ReactNode;
  description: string;
  bullets?: string[];
  href?: string;
  highlight?: boolean;
};

const features: FeatureItem[] = [
  {
    title: translate({ id: 'homepage.feature.models.title', message: 'Multi-Model Support' }),
    icon: <Layers size={22} className={styles.featureSvgIcon} />,
    description: translate({ id: 'homepage.feature.models.desc', message: 'Works with GitHub Copilot, Claude Code, Codex, Gemini, and any OpenAI-compatible model — no lock-in, one extension for all your agents.' }),
    bullets: [
      'GitHub Copilot, Claude Code & Codex ready',
      'OpenAI, Gemini & custom models supported',
    ],
    href: '/docs/installation',
  },
  {
    title: translate({ id: 'homepage.feature.wizard.title', message: 'AI-Guided Creation' }),
    icon: <Bot size={22} className={styles.featureSvgIcon} />,
    description: translate({ id: 'homepage.feature.wizard.desc', message: 'Four bundled AI agents guide the full setup lifecycle — auto-configure your profile, design the team, generate agent specs, and get advisory analysis — all from plain language.' }),
    bullets: ['@agent-designer & @team-builder built in', '@project-configurator & @consultant included'],
    href: '/docs/ai-setup-flow',
  },
  {
    title: translate({ id: 'homepage.feature.memory.title', message: 'Shared Memory' }),
    icon: <Database size={22} className={styles.featureSvgIcon} />,
    description: translate({ id: 'homepage.feature.memory.desc', message: 'Every agent — router, orchestrator, or worker — injects shared Engram memory automatically. Context survives conversations, context resets, and session changes.' }),
    bullets: ['Injected into router, orchestrator & workers', 'Context persists across sessions & resets'],
    href: '/docs/agent-architecture',
  },
  {
    title: translate({ id: 'homepage.feature.teams.title', message: 'Teams & Kits' }),
    icon: <Workflow size={22} className={styles.featureSvgIcon} />,
    description: translate({ id: 'homepage.feature.teams.desc', message: 'Bundle agents, skills, and config into a portable kit file. Drop it in any project and the full team loads instantly — no reconfiguration.' }),
    bullets: ['4 merge strategies: union, replace, append…', 'One kit, any workspace — instantly live'],
    href: '/docs/teams',
    highlight: true,
  },
  {
    title: translate({ id: 'homepage.feature.skills.title', message: 'Skills Registry' }),
    icon: <Puzzle size={22} className={styles.featureSvgIcon} />,
    description: translate({ id: 'homepage.feature.skills.desc', message: 'A plug-in instruction library for agents. Browse community skills across 9+ domains and install them in one click — no code needed.' }),
    bullets: ['9+ categories: testing, docs, arch…', 'Install via the built-in Skills Browser'],
    href: '/docs/skills-browser',
  },
  {
    title: translate({ id: 'homepage.feature.context.title', message: 'Context Packs' }),
    icon: <Package size={22} className={styles.featureSvgIcon} />,
    description: translate({ id: 'homepage.feature.context.desc', message: 'Inject dynamic data into agent prompts using {{variable}} syntax, conditionals, and loops. Scoped to an agent, team, or project.' }),
    bullets: ['{{vars}}, #if, #each in any template', 'Scope: agent, team, or project-wide'],
    href: '/docs/context-packs',
  },
];

// Using FeatureCard component for features

function StickyCtaBar({ buttonsRef }: { buttonsRef: React.RefObject<HTMLDivElement | null> }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = buttonsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 1.0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [buttonsRef]);

  return (
    <div className={clsx(styles.stickyCtaBar, visible && styles.stickyCtaBarVisible)}>
      <div className={styles.buttons}>
        <Link className="button button--primary button--lg" to="/docs/installation">
          <Translate id="homepage.hero.cta.getStarted">Get Started</Translate>
        </Link>
        <Link className="button button--secondary button--lg" href="https://github.com/egdev6/agent-teams-docs">
          <Translate id="homepage.hero.cta.viewOnGitHub">View on GitHub</Translate>
        </Link>
      </div>
    </div>
  );
}

function HomepageHero({ heroRef, buttonsRef }: { heroRef: React.RefObject<HTMLElement | null>; buttonsRef: React.RefObject<HTMLDivElement | null> }) {
  const { siteConfig } = useDocusaurusContext();
  const fadeRef = useFadeIn<HTMLElement>();

  return (
    <header
      ref={(el) => {
        (fadeRef as React.MutableRefObject<HTMLElement | null>).current = el;
        (heroRef as React.MutableRefObject<HTMLElement | null>).current = el;
      }}
      className={clsx('hero', styles.heroBanner, 'fade-in-section')}
    >
      <BrowserOnly>{() => {
        const HeroBokeh = require('../components/HeroBokeh').default;
        return <HeroBokeh />;
      }}</BrowserOnly>
      <div className={styles.heroGlow1} aria-hidden="true" />
      <div className={styles.heroGlow2} aria-hidden="true" />
      <div className={styles.heroSpot1} aria-hidden="true" />
      <div className={styles.heroSpot2} aria-hidden="true" />
      <div className={styles.heroOverlay} aria-hidden="true" />
      <div className={clsx("container", styles.heroContainer)}>
        
        <div className={styles.heroLogoRow}>
          <Bot size={56} className={styles.glowingLogo} />
          <h2 className={styles.heroLogoText}>Agent Teams</h2>
        </div>

        <Heading as="h1" className={styles.heroTitleBase}>
          <Translate id="homepage.hero.title">Orchestrate</Translate> <br />
          <span className={styles.heroTitleGradient}>
            <Translate id="homepage.hero.titleHighlight">AI Agents in VS Code</Translate>
          </span>
        </Heading>
        
        <p className={styles.heroSubtitle}>
          <Translate id="homepage.hero.tagline">
            Build, manage, and orchestrate AI agent teams directly inside VS Code.
          </Translate>
        </p>

        

        <div ref={buttonsRef} className={styles.buttons}>
          <Link
            className="button button--primary button--lg"
            to="/docs/installation"
          >
            <Translate id="homepage.hero.cta.getStarted">Get Started</Translate>
          </Link>
          <Link
            className="button button--secondary button--lg"
            href="https://github.com/egdev6/agent-teams-docs"
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
        <FadeInItem>
          <Heading as="h2" className={styles.featuresTitle}>
            <Translate id="homepage.features.title">Everything you need to build an AI agent team in VSCode</Translate>
          </Heading>
        </FadeInItem>
        <div className={styles.featuresGrid}>
          {features.map((props, idx) => (
            <FadeInItem key={idx} delay={idx * 80}>
              <FeatureCard icon={props.icon} title={props.title} description={props.description} href={props.href} highlight={props.highlight} />
            </FadeInItem>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomepagePoweredBy() {
  return (
    <section className={styles.poweredBy}>
      <div className="container">
        <FadeInItem style={{ height: 'auto' }}>
          <p className={styles.poweredByLabel}>
            <Translate id="homepage.poweredby.label">Powered by</Translate>
          </p>
        </FadeInItem>
        <div className={styles.techGrid}>
          {/* Engram */}
          <FadeInItem delay={0}>
            <a className={styles.techCard} href='https://github.com/Gentleman-Programming/engram?tab=readme-ov-file' target="_blank" rel="noopener noreferrer">
              <div className={styles.techLogoWrap}>
                <Brain size={70} stroke="#ff335e" />
              </div>
              <div className={styles.techName}>Engram</div>
              <div className={styles.techDesc}>
                <Translate id="homepage.tech.engram.desc">Persistent memory — state survives sessions and context resets</Translate>
              </div>
            </a>
          </FadeInItem>
          {/* VS Code */}
          <FadeInItem delay={100}>
            <a className={styles.techCard} href='https://code.visualstudio.com/' target="_blank" rel="noopener noreferrer">
              <div className={styles.techLogoWrap}>
                <img src="img/vscode.svg" alt="VS Code Logo" width={70} height={70} />
              </div>
              <div className={styles.techName}>VS Code</div>
              <div className={styles.techDesc}>
                <Translate id="homepage.tech.vscode.desc">Extension host — editors, commands, and webview panels</Translate>
              </div>
            </a>
          </FadeInItem>
          {/* Skills */}
          <FadeInItem delay={200}>
            <a className={styles.techCard} href='https://skills.lc/' target="_blank" rel="noopener noreferrer">
              <div className={styles.techLogoWrap}>
                <Puzzle size={70} stroke="#e60030" />
              </div>
              <div className={styles.techName}>Skills</div>
              <div className={styles.techDesc}>
                <Translate id="homepage.tech.skills.desc">Plugin instruction library — SKILL.md files for instant agent specialization</Translate>
              </div>
            </a>
          </FadeInItem>
        </div>
      </div>
    </section>
  );
}

type PipelineStepData = {
  label: string;
  desc: string;
  detailTitle: string;
  detail: string;
  icon: React.ReactNode;
};

function PipelineStepCard({ step }: { step: PipelineStepData }) {
  return (
    <div className={styles.pipelineStep}>
      <div className={styles.pipelineStepLeft}>
        <div className={styles.pipelineIconContainer}>{step.icon}</div>
        <div className={styles.pipelineLabel}>{step.label}</div>
        <div className={styles.pipelineDesc}>{step.desc}</div>
      </div>
      <div className={styles.pipelineStepRight}>
        <div className={styles.pipelineDetailLabel}>{step.detailTitle}</div>
        <div className={styles.pipelineDetailDesc}>{step.detail}</div>
      </div>
    </div>
  );
}

function HomepageArchitecture() {
  const mainArchitectureSteps = [
    {
      label: translate({ id: 'homepage.arch.step1.label', message: 'User Prompt' }),
      desc: translate({ id: 'homepage.arch.step1.desc', message: 'Natural language via @router' }),
      detailTitle: translate({ id: 'homepage.arch.step1.detailTitle', message: 'Single entry point' }),
      detail: translate({ id: 'homepage.arch.step1.detail', message: 'Write @router + any task in plain language. You can reference a file, describe a vague goal, or name a domain — the pipeline handles the rest. No agent knowledge required.' }),
      icon: <MessageSquareText size={32} />,
    },
    {
      label: translate({ id: 'homepage.arch.step2.label', message: 'Router' }),
      desc: translate({ id: 'homepage.arch.step2.desc', message: 'Scores & delegates to best agent' }),
      detailTitle: translate({ id: 'homepage.arch.step2.detailTitle', message: 'Intent-aware dispatcher' }),
      detail: translate({ id: 'homepage.arch.step2.detail', message: 'Scores every agent by intent keywords, domain vocabulary, and the active file path. Delegates single-domain tasks via handoff and fans out parallel domains simultaneously — without executing anything itself.' }),
      icon: <GitMerge size={32} />,
    },
    {
      label: translate({ id: 'homepage.arch.step3.label', message: 'Orchestrator' }),
      desc: translate({ id: 'homepage.arch.step3.desc', message: 'Decomposes task into steps' }),
      detailTitle: translate({ id: 'homepage.arch.step3.detailTitle', message: 'Planner, not executor' }),
      detail: translate({ id: 'homepage.arch.step3.detail', message: 'Breaks the delegated task into an ordered sequence of subtasks, assigns each to the right worker, and aggregates results. It never writes code or calls APIs directly — coordination is its only job.' }),
      icon: <BrainCircuit size={32} />,
    },
    {
      label: translate({ id: 'homepage.arch.step4.label', message: 'Workers' }),
      desc: translate({ id: 'homepage.arch.step4.desc', message: 'Domain specialists execute tasks' }),
      detailTitle: translate({ id: 'homepage.arch.step4.detailTitle', message: 'Narrow scope, full depth' }),
      detail: translate({ id: 'homepage.arch.step4.detail', message: 'Each worker owns exactly one domain — backend, testing, docs, and so on. It uses only the tools and skills defined in its spec, returns a structured result, and escalates if the subtask falls outside its scope.' }),
      icon: <Blocks size={32} />,
    },
  ];

  const architectureExamples = [
    {
      title: translate({ id: 'homepage.arch.examples.orchestrated.title', message: 'Orchestrator → Worker' }),
      subtitle: translate({
        id: 'homepage.arch.examples.orchestrated.subtitle',
        message: 'Planned handoff for multi-step work',
      }),
      steps: [
        {
          label: translate({ id: 'homepage.arch.step1.label', message: 'User Prompt' }),
          desc: translate({ id: 'homepage.arch.step1.desc', message: 'Natural language via @router' }),
          detailTitle: translate({ id: 'homepage.arch.examples.orchestrated.user.detailTitle', message: 'Complex request enters the system' }),
          detail: translate({
            id: 'homepage.arch.examples.orchestrated.user.detail',
            message: 'This pattern starts when the user asks for something that needs planning, decomposition, or coordination before execution.',
          }),
          icon: <MessageSquareText size={32} />,
        },
        {
          label: translate({ id: 'homepage.arch.examples.orchestrated.orchestrator.label', message: 'Orchestrator' }),
          desc: translate({ id: 'homepage.arch.examples.orchestrated.orchestrator.desc', message: 'Plans and delegates the work' }),
          detailTitle: translate({ id: 'homepage.arch.examples.orchestrated.orchestrator.detailTitle', message: 'Planner in the middle' }),
          detail: translate({
            id: 'homepage.arch.examples.orchestrated.orchestrator.detail',
            message: 'The orchestrator decides the sequence, splits the task into steps, and hands execution to the worker best suited for the job.',
          }),
          icon: <BrainCircuit size={32} />,
        },
        {
          label: translate({ id: 'homepage.arch.examples.orchestrated.worker.label', message: 'Worker' }),
          desc: translate({ id: 'homepage.arch.examples.orchestrated.worker.desc', message: 'Executes the delegated subtask' }),
          detailTitle: translate({ id: 'homepage.arch.examples.orchestrated.worker.detailTitle', message: 'Specialist execution' }),
          detail: translate({
            id: 'homepage.arch.examples.orchestrated.worker.detail',
            message: 'A worker with narrow scope performs the actual implementation, analysis, or update and returns the result upstream.',
          }),
          icon: <Blocks size={32} />,
        },
      ],
    },
    {
      title: translate({ id: 'homepage.arch.examples.direct.title', message: 'Only Worker' }),
      subtitle: translate({
        id: 'homepage.arch.examples.direct.subtitle',
        message: 'Direct execution for narrow tasks',
      }),
      steps: [
        {
          label: translate({ id: 'homepage.arch.step1.label', message: 'User Prompt' }),
          desc: translate({ id: 'homepage.arch.step1.desc', message: 'Natural language via @router' }),
          detailTitle: translate({ id: 'homepage.arch.examples.direct.user.detailTitle', message: 'Small, direct request' }),
          detail: translate({
            id: 'homepage.arch.examples.direct.user.detail',
            message: 'This flow is ideal when the task already maps cleanly to one specialist and does not need orchestration.',
          }),
          icon: <MessageSquareText size={32} />,
        },
        {
          label: translate({ id: 'homepage.arch.examples.direct.worker.label', message: 'Worker' }),
          desc: translate({ id: 'homepage.arch.examples.direct.worker.desc', message: 'Handles it end-to-end' }),
          detailTitle: translate({ id: 'homepage.arch.examples.direct.worker.detailTitle', message: 'Single specialist path' }),
          detail: translate({
            id: 'homepage.arch.examples.direct.worker.detail',
            message: 'The worker receives the request directly, executes it within its domain, and returns the final result without extra coordination layers.',
          }),
          icon: <Blocks size={32} />,
        },
      ],
    },
  ];

  return (
    <section className={styles.architectureSection}>
      <div className="container">
        <FadeInItem style={{ height: 'auto' }}>
          <Heading as="h2" className={styles.featuresTitle}>
            <Translate id="homepage.arch.title">Ideal Agent Architecture</Translate>
          </Heading>
        </FadeInItem>
        <FadeInItem delay={80} style={{ height: 'auto' }}>
          <p className={styles.architectureSubtitle}>
            <Translate id="homepage.arch.subtitle">Agent Teams is designed around a clean 4-layer pipeline</Translate>
          </p>
        </FadeInItem>
        <div
          className={styles.pipeline}
          style={{ '--pipeline-step-count': String(mainArchitectureSteps.length) } as React.CSSProperties}
        >
          {mainArchitectureSteps.map((step, i, arr) => (
            <React.Fragment key={step.label}>
              <FadeInItem delay={160 + i * 120} style={{ display: 'contents' }}>
              <div className={styles.pipelineWrapper}>
                <PipelineStepCard step={step} />
              </div>
              </FadeInItem>
              {i < arr.length - 1 && (
                <div className={styles.pipelineArrow}>→</div>
              )}
            </React.Fragment>
          ))}
        </div>
        <FadeInItem delay={620} style={{ height: 'auto' }}>
          <div className={styles.architectureExamples}>
            <Heading as="h3" className={styles.architectureExamplesTitle}>
              <Translate id="homepage.arch.examples.title">Other valid patterns</Translate>
            </Heading>
            <p className={styles.architectureExamplesSubtitle}>
              <Translate id="homepage.arch.examples.subtitle">
                Not every setup needs the full 4-layer flow. These lighter patterns are useful too.
              </Translate>
            </p>
            <div className={styles.architectureExamplesList}>
              {architectureExamples.map((example, exampleIndex) => (
                <div key={example.title} className={styles.architectureExampleGroup}>
                  <div className={styles.architectureExampleHeader}>
                    <div className={styles.architectureExampleTitle}>{example.title}</div>
                    <p className={styles.architectureExampleDesc}>{example.subtitle}</p>
                  </div>
                  <div
                    className={styles.pipeline}
                    style={{ '--pipeline-step-count': String(example.steps.length) } as React.CSSProperties}
                  >
                    {example.steps.map((step, stepIndex, arr) => (
                      <React.Fragment key={`${example.title}-${step.label}`}>
                        <FadeInItem delay={680 + exampleIndex * 120 + stepIndex * 80} style={{ display: 'contents' }}>
                          <div className={styles.pipelineWrapper}>
                            <PipelineStepCard step={step} />
                          </div>
                        </FadeInItem>
                        {stepIndex < arr.length - 1 && <div className={styles.pipelineArrow}>→</div>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeInItem>
        <FadeInItem delay={700} style={{ height: 'auto', marginTop: '80px' }}>
          <div className={styles.architectureCta}>
            <div className={styles.buttons}>
              <Link className="button button--secondary button--lg" to="/docs/agent-architecture">
                <Translate id="homepage.arch.cta">Read Architecture Guide →</Translate>
              </Link>
            </div>
          </div>
        </FadeInItem>
      </div>
    </section>
  );
}

export default function Home(): React.ReactNode {
  const heroRef = useRef<HTMLElement | null>(null);
  const buttonsRef = useRef<HTMLDivElement | null>(null);

  return (
    <Layout
      title={translate({ id: 'homepage.layout.title', message: 'AI Agent Orchestration for VS Code' })}
      description={translate({ id: 'homepage.layout.description', message: 'Build, manage, and orchestrate AI agents with GitHub Copilot, Claude code or Codex inside VS Code. Create reusable agent kits, configure project profiles, and run an embedded 12-page dashboard.' })}
    >
      <BrowserOnly>{() => <StickyCtaBar buttonsRef={buttonsRef} />}</BrowserOnly>
      <HomepageHero heroRef={heroRef} buttonsRef={buttonsRef} />
      <main>
        <HomepageFeatures />
        <HomepagePoweredBy />
        <HomepageArchitecture />
      </main>
    </Layout>
  );
}
