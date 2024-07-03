import React from 'react';
import {authRole} from '../../shared/constants/AppConst';

export const operacionesConfig = [
  {
    auth: authRole.user,
    routes: [
      {
        exact: true,
        path: '/operaciones-embarque',
        component: React.lazy(() => import('./OperacionEmbarque')),
      },
      {
        exact: true,
        path: '/inspecciones',
        component: React.lazy(() => import('./EjemploInspeccion')),
      },
    ],
  },
];
