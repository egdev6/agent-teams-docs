import React from 'react';
import { useQuery } from '@tanstack/react-query';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';

const GITHUB_REPO = 'egdev6/agent-teams-docs';

type Release = { tag_name: string; html_url: string };

async function fetchLatestRelease(): Promise<Release | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases`, {
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const releases: Array<Release & { draft: boolean; prerelease: boolean }> = await res.json();
    return releases.find(r => !r.draft && !r.prerelease) ?? null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export default function VersionBanner() {
  const { i18n } = useDocusaurusContext();
  const locale = i18n.currentLocale;

  const { data: release } = useQuery<Release | null>({
    queryKey: ['latest-release'],
    queryFn: fetchLatestRelease,
    staleTime: 1000 * 60 * 10,
    retry: false,
  });

  if (!release) return null;

  const content =
    locale === 'es' ? (
      <>
        🚀 <b>¡Nueva versión disponible!</b> Descubre{' '}
        <Link href={release.html_url} target="_blank" rel="noopener noreferrer">
          Agent Teams {release.tag_name}
        </Link>{' '}
        con el nuevo Router inteligente e integración con Orquestador.
      </>
    ) : (
      <>
        🚀 <b>New Version Available!</b> Check out{' '}
        <Link href={release.html_url} target="_blank" rel="noopener noreferrer">
          Agent Teams {release.tag_name}
        </Link>{' '}
        with the new Smart Router and Orchestrator integration.
      </>
    );

  return (
    <div
      className="version-banner"
      style={{
        backgroundColor: '#0d0d0d',
        color: '#ffffff',
        textAlign: 'center',
        padding: '8px 16px',
        fontSize: '14px',
        lineHeight: 1.5,
      }}
    >
      {content}
    </div>
  );
}
