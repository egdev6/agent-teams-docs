import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    {
      type: 'doc',
      id: 'installation',
      label: 'Installation',
    },
    {
      type: 'doc',
      id: 'dashboard',
      label: 'Dashboard',
    },
    {
      type: 'doc',
      id: 'profiles',
      label: 'Profile Editor',
    },
    {
      type: 'doc',
      id: 'teams',
      label: 'Teams',
    },
    {
      type: 'doc',
      id: 'context-packs',
      label: 'Context Packs',
    },
    {
      type: 'category',
      label: 'Agents',
      className: 'sidebar-new-badge',
      collapsed: false,
      items: [
        { type: 'doc', id: 'agents', label: 'Agent Manager' },
        { type: 'doc', id: 'agent-architecture', label: 'Architecture Guide' },
      ],
    },
    {
      type: 'doc',
      id: 'skills-browser',
      label: 'Skills Browser',
    },
    {
      type: 'category',
      label: 'AI Tooling',
      className: 'sidebar-new-badge',
      collapsed: false,
      items: [
        { type: 'doc', id: 'ai-setup-flow', label: 'AI Setup Flow' },
        { type: 'doc', id: 'agent-designer', label: 'Agent Designer' },
      ],
    },
  ],
};

export default sidebars;
