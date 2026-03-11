import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/es/docs',
    component: ComponentCreator('/es/docs', '8a8'),
    routes: [
      {
        path: '/es/docs',
        component: ComponentCreator('/es/docs', '342'),
        routes: [
          {
            path: '/es/docs',
            component: ComponentCreator('/es/docs', '665'),
            routes: [
              {
                path: '/es/docs/agent-architecture',
                component: ComponentCreator('/es/docs/agent-architecture', 'b39'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/es/docs/agents',
                component: ComponentCreator('/es/docs/agents', 'db1'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/es/docs/context-packs',
                component: ComponentCreator('/es/docs/context-packs', '121'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/es/docs/dashboard',
                component: ComponentCreator('/es/docs/dashboard', '9c8'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/es/docs/installation',
                component: ComponentCreator('/es/docs/installation', '274'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/es/docs/profiles',
                component: ComponentCreator('/es/docs/profiles', '45d'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/es/docs/skills-browser',
                component: ComponentCreator('/es/docs/skills-browser', '0ba'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/es/docs/teams',
                component: ComponentCreator('/es/docs/teams', 'df1'),
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
    path: '/es/',
    component: ComponentCreator('/es/', 'f57'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
