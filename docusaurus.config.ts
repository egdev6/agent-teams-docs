import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

export default function createConfig(): Config {
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
