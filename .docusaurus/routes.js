import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', '9d7'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', '6fa'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', 'ddd'),
            routes: [
              {
                path: '/docs/agent-architecture',
                component: ComponentCreator('/docs/agent-architecture', 'b36'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/docs/agents',
                component: ComponentCreator('/docs/agents', '96f'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/docs/context-packs',
                component: ComponentCreator('/docs/context-packs', 'dfc'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/docs/dashboard',
                component: ComponentCreator('/docs/dashboard', 'ae7'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/docs/installation',
                component: ComponentCreator('/docs/installation', '034'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/docs/profiles',
                component: ComponentCreator('/docs/profiles', 'ce5'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/docs/skills-browser',
                component: ComponentCreator('/docs/skills-browser', '7c5'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/docs/teams',
                component: ComponentCreator('/docs/teams', '948'),
                exact: true,
                sidebar: "docsSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', 'e5f'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
