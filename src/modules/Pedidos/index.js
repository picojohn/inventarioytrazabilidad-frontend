import React from 'react';
import {authRole} from '../../shared/constants/AppConst';

export const pedidosConfigs = [
  {
    auth: authRole.user,
    routes: [
      {
        exact: true,
        path: '/pedidos',
        component: React.lazy(() => import('./Pedido')),
      },
      {
        exact: true,
        path: '/pedidos/:accion',
        component: React.lazy(() => import('./Pedido/PedidoCreador')),
      },
      {
        exact: true,
        path: '/pedidos/:accion/:id',
        component: React.lazy(() => import('./Pedido/PedidoCreador')),
      },
      {
        exact: true,
        path: '/pedidos-lectura',
        component: React.lazy(() => import('./PedidoLectura')),
      },
      {
        exact: true,
        path: '/pedidos-lectura/:accion/:pedido_id',
        component: React.lazy(() => import('./PedidoLectura/PedidoCreador')),
      },
    ],
  },
];
