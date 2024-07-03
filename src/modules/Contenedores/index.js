import React from 'react';
import {authRole} from '../../shared/constants/AppConst';

export const contendoresConfig = [
  {
    auth: authRole.user,
    routes: [
      {
        exact: true,
        path: '/sellos-bitacora',
        component: React.lazy(() => import('./BitacoraSellos')),
      },
      {
        exact: true,
        path: '/instalar',
        component: React.lazy(() => import('./Instalacion')),
      },
      {
        exact: true,
        path: '/actualizar-estado',
        component: React.lazy(() => import('./ActualizarEstado')),
      },
      {
        exact: true,
        path: '/consulta-totales',
        component: React.lazy(() => import('./ConsultaTotales')),
      },
    ],
  },
];
