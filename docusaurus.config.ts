import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const GITHUB_REPO = 'egdev6/agent-teams-docs';

async function fetchLatestRelease(): Promise<{ tag_name: string; html_url: string } | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases`);
    if (!res.ok) return null;
    const releases: Array<{ tag_name: string; html_url: string; draft: boolean; prerelease: boolean }> = await res.json();
    return releases.find(r => !r.draft && !r.prerelease) ?? null;
  } catch {
    return null;
  }
}

export default async function createConfig(): Promise<Config> {
  const latest = await fetchLatestRelease();

  const locale = process.env.DOCUSAURUS_CURRENT_LOCALE ?? 'en';

  const announcementContent = latest
    ? locale === 'es'
      ? `🚀 <b>¡Nueva versión disponible!</b> Descubre <a target="_blank" rel="noopener noreferrer" href="${latest.html_url}">Agent Teams ${latest.tag_name}</a> con el nuevo Router inteligente e integración con Orquestador.`
      : `🚀 <b>New Version Available!</b> Check out <a target="_blank" rel="noopener noreferrer" href="${latest.html_url}">Agent Teams ${latest.tag_name}</a> with the new Smart Router and Orchestrator integration.`
    : null;

  return {
  title: 'Agent Teams',
  tagline: 'Build, manage, and orchestrate AI agents with GitHub Copilot, Claude code or Codex inside VS Code',
  favicon: 'img/logo.svg',

  url: 'https://agent-teams-docs.netlify.app',
  baseUrl: '/',

  organizationName: 'egdev6',
  projectName: 'agent-teams-docs',

  onBrokenLinks: 'warn',

  // Prevents Docusaurus locale switcher from generating href="//" at the root
  trailingSlash: false,

  // Disable webpack's filesystem cache to prevent the build process from
  // hanging after completion (IdleFileCachePlugin keeps Node.js open handles).
  plugins: [
    function disableWebpackCache() {
      return {
        name: 'disable-webpack-cache',
        configureWebpack() {
          return { cache: false };
        },
      };
    },
  ],

  headTags: [
    // Fallback meta description for pages without explicit description
    {
      tagName: 'meta',
      attributes: {
        name: 'description',
        content: 'Build, manage, and orchestrate AI agents with GitHub Copilot, Claude Code or Codex inside VS Code. Create reusable agent kits, configure project profiles, and run an embedded 12-page dashboard.',
      },
    },
    // Preconnect to GitHub CDN for avatars/assets used in docs
    {
      tagName: 'link',
      attributes: { rel: 'preconnect', href: 'https://github.com' },
    },
    {
      tagName: 'link',
      attributes: { rel: 'dns-prefetch', href: 'https://github.com' },
    },
    // Preconnect to VS Code marketplace
    {
      tagName: 'link',
      attributes: { rel: 'dns-prefetch', href: 'https://marketplace.visualstudio.com' },
    },
  ],

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    localeConfigs: {
      en: { label: 'English', direction: 'ltr' },
      es: { label: 'Español', direction: 'ltr' },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/egdev6/agent-teams-docs/edit/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.png',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    ...(announcementContent ? {
      announcementBar: {
        id: 'new_release',
        content: announcementContent,
        backgroundColor: '#0d0d0d',
        textColor: '#ffffff',
        isCloseable: false,
      },
    } : {}),
    navbar: {
      title: 'Agent Teams',
      logo: {
        alt: 'Agent Teams Logo',
        src: 'img/logo.svg',
        srcDark: 'img/logo.svg',
        width: 32,
        height: 32,
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
          {
            to: '/releases',
            label: 'Releases',
            position: 'left',
          },
        {
          type: 'custom-GitHubStars',
          position: 'right',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            { label: 'Installation', to: '/docs/installation' },
            { label: 'Dashboard', to: '/docs/dashboard' },
            { label: 'Agents', to: '/docs/agents' },
            { label: 'Agent Architecture', to: '/docs/agent-architecture' },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub Issues',
              href: 'https://github.com/egdev6/agent-teams-docs/issues',
            },
            {
              label: 'VS Code Marketplace',
              href: 'https://marketplace.visualstudio.com',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/egdev6/agent-teams-docs',
            },
            {
              label: 'Changelog',
              href: 'https://github.com/egdev6/agent-teams-docs/blob/main/CHANGELOG.md',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Enrique Gomez. MIT License.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['yaml', 'bash', 'typescript'],
    },
    algolia: undefined,
  } satisfies Preset.ThemeConfig,
  };
}
