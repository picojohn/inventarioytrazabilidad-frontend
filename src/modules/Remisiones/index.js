import React from 'react';
import {authRole} from '../../shared/constants/AppConst';

export const remisionesConfigs = [
  {
    auth: authRole.user,
    routes: [
      {
        exact: true,
        path: '/remisiones',
        component: React.lazy(() => import('./Remision')),
      },
      {
        exact: true,
        path: '/remisiones/:accion',
        component: React.lazy(() => import('./Remision/RemisionCreador')),
      },
      {
        exact: true,
        path: '/remisiones/:accion/:id',
        component: React.lazy(() => import('./Remision/RemisionCreador')),
      },
    ],
  },
];
