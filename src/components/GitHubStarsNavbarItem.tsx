import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import Link from '@docusaurus/Link';

export default function GitHubStarsNavbarItem() {
  const { data: stars } = useQuery<number>({
    queryKey: ['github-stars-agent-teams'],
    queryFn: async () => {
      const res = await fetch('https://api.github.com/repos/egdev6/agent-teams-docs');
      if (!res.ok) throw new Error('GitHub API error');
      const data = await res.json();
      return data.stargazers_count as number;
    },
    staleTime: 1000 * 60 * 10,
    retry: false,
  });

  const formatted =
    stars === undefined
      ? null
      : stars >= 1000
      ? `${(stars / 1000).toFixed(1)}k`
      : stars.toLocaleString();

  return (
    <Link
      href="https://github.com/egdev6/agent-teams-docs"
      target="_blank"
      rel="noopener noreferrer"
      className="navbar-github-stars"
      aria-label="Star agent-teams-docs on GitHub"
    >
      <span className="navbar-github-stars__left">
        <Star size={15} strokeWidth={2} fill="currentColor" className="navbar-github-stars__icon" />
        <span>Star</span>
      </span>
      <span className="navbar-github-stars__divider" />
      <span className="navbar-github-stars__count">
        {formatted ?? '—'}
      </span>
    </Link>
  );
}
