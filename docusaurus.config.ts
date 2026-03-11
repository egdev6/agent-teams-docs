import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Agent Teams',
  tagline: 'Build, manage, and orchestrate AI agents with GitHub Copilot inside VS Code',
  favicon: 'img/favicon.ico',

  url: 'https://agent-teams.netlify.app',
  baseUrl: '/',

  organizationName: 'egdev6',
  projectName: 'agent-teams-docs',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

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
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Agent Teams',
      logo: {
        alt: 'Agent Teams Logo',
        src: 'img/logo.svg',
        srcDark: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/egdev6/agent-teams',
          label: 'GitHub',
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
              href: 'https://github.com/egdev6/agent-teams',
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

export default config;
