import React from 'react';
import {authRole} from '../../shared/constants/AppConst';

export const inventarioConfigs = [
  {
    auth: authRole.user,
    routes: [
      {
        exact: true,
        path: '/carga-inventario',
        component: React.lazy(() => import('./CargaInventario')),
      },
      {
        exact: true,
        path: '/consulta-inventario',
        component: React.lazy(() => import('./ConsultaInventario')),
      },
      {
        exact: true,
        path: '/informe-inventario',
        component: React.lazy(() => import('./InformeInventario')),
      },
      {
        exact: true,
        path: '/inventario',
        component: React.lazy(() => import('./ConsultaInventarioMinimo')),
      },
    ],
  },
];
