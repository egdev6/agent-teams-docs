import BrowserOnly from '@docusaurus/BrowserOnly';
import Translate from '@docusaurus/Translate';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';
import { Calendar, Download, Tag } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import styles from './index.module.css';

type GitHubRelease = {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  html_url: string;
  published_at: string;
  prerelease: boolean;
  draft: boolean;
};

const GITHUB_REPO = 'egdev6/agent-teams-docs';

async function fetchReleases(): Promise<GitHubRelease[]> {
  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases`);
  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
  const data: GitHubRelease[] = await res.json();
  return data.filter((r) => !r.draft && !r.prerelease);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function inlineMarkdown(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*|`(.+?)`|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[1]) parts.push(<strong key={match.index}>{match[1]}</strong>);
    else if (match[2]) parts.push(<code key={match.index}>{match[2]}</code>);
    else if (match[3])
      parts.push(
        <a key={match.index} href={match[4]} target='_blank' rel='noopener noreferrer'>
          {match[3]}
        </a>,
      );
    last = match.index + match[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length <= 1 ? (parts[0] ?? text) : parts;
}

function renderMarkdownBody(body: string): React.ReactNode {
  if (!body) return null;
  const nodes: React.ReactNode[] = [];
  let listItems: string[] = [];
  let key = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      nodes.push(
        <ul key={`list-${key++}`} className={styles.releaseBodyList}>
          {listItems.map((item, j) => (
            <li key={j}>{inlineMarkdown(item)}</li>
          ))}
        </ul>,
      );
      listItems = [];
    }
  };

  // Normalise CRLF (GitHub API returns \r\n) and trim both ends to handle indented lines
  const lines = body
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((l) => l.trim());

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s*(.*)/);
    const listMatch = line.match(/^(?:\d+\.|[-*])\s+(.*)/);

    if (line === '' || line === '\r') {
      flushList();
    } else if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) {
      flushList();
      nodes.push(<hr key={`hr-${key++}`} className={styles.releaseBodyHr} />);
    } else if (headingMatch && headingMatch[2].trim() !== '') {
      flushList();
      const level = headingMatch[1].length;
      const Tag = `h${Math.min(level + 2, 6)}` as React.ElementType;
      const headingClass =
        level <= 1
          ? styles.releaseBodyH1
          : level === 2
            ? styles.releaseBodyH2
            : styles.releaseBodyH3;
      nodes.push(
        <Tag key={`h-${key++}`} className={headingClass}>
          {inlineMarkdown(headingMatch[2].trim())}
        </Tag>,
      );
    } else if (listMatch) {
      listItems.push(listMatch[1]);
    } else {
      flushList();
      nodes.push(
        <p key={`p-${key++}`} className={styles.releaseBodyPara}>
          {inlineMarkdown(line)}
        </p>,
      );
    }
  }
  flushList();
  return nodes;
}

function getDescription(release: GitHubRelease): string {
  if (!release.body) return release.name;
  const firstLine = release.body
    .split('\n')
    .map((l) => l.trim())
    .find((l) => l.length > 0 && !l.startsWith('#'));
  return firstLine?.replace(/\*\*|__|\[([^\]]+)\]\([^)]+\)/g, '$1').trim() ?? release.name;
}

function ReleasesContent() {
  const [releases, setReleases] = useState<GitHubRelease[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    setIsLoading(true);
    setError(null);

    fetchReleases()
      .then((data) => {
        setReleases(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsLoading(false);
      });
  }, []);

  const [latestRelease, ...previousReleases] = releases;

  return (
    <>
      {/* Full-width hero flush to header */}
      {latestRelease && (
        <div className={styles.latestReleaseHero}>
          <div className={styles.latestReleaseHeroBg} aria-hidden='true' />
          <div className={styles.latestReleaseHeroInner}>
            <div className={styles.latestReleaseMeta}>
              <span className={styles.latestReleaseBadge}>
                🚀 <Translate id='homepage.hero.latestRelease'>Latest Release</Translate>
              </span>
              <span className={styles.latestReleaseBetaBadge}>Beta</span>
              <span className={styles.latestReleaseDate}>
                <Calendar size={14} />
                {formatDate(latestRelease.published_at)}
              </span>
            </div>
            <div className={styles.latestReleaseTitle}>
              <Tag size={28} />
              <span>Agent Teams {latestRelease.tag_name}</span>
            </div>
            <a
              href={latestRelease.html_url}
              target='_blank'
              rel='noopener noreferrer'
              className={styles.latestReleaseDownload}
            >
              <Download size={16} />
              <Translate id='homepage.releases.download'>Download</Translate>
            </a>
          </div>
        </div>
      )}

      <main className='container margin-vert--xl'>
        {isLoading && <p>Loading releases…</p>}
        {error && <p>Could not load releases from GitHub: {(error as Error).message}</p>}
        {!isLoading && !error && releases.length === 0 && <p>No releases found.</p>}

        {latestRelease && (
          <div className={styles.releaseNotesSection}>
            <Heading as='h2' className={styles.releaseNotesSectionTitle}>
              Release Notes — {latestRelease.tag_name}
            </Heading>
            <div className={styles.latestReleaseBody}>{renderMarkdownBody(latestRelease.body)}</div>
          </div>
        )}

        {previousReleases.length > 0 && (
          <>
            <Heading as='h2' className={styles.previousReleasesTitle}>
              Previous Releases
            </Heading>
            <ul className={styles.releaseList}>
              {previousReleases.map((release) => (
                <li key={release.id}>
                  <h3 className={styles.releaseVersion}>{release.tag_name}</h3>
                  <p className={styles.releaseDesc}>{getDescription(release)}</p>
                  <a
                    href={release.html_url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className={styles.releaseLink}
                  >
                    <Download size={14} className={styles.releaseLinkIcon} />
                    <Translate id='homepage.releases.download'>Download</Translate>
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </>
  );
}

export default function Releases() {
  return (
    <Layout title='Releases' description='Releases and changelog for Agent Teams'>
      <BrowserOnly>{() => <ReleasesContent />}</BrowserOnly>
    </Layout>
  );
}
