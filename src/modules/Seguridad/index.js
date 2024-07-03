import React from 'react';
import {authRole} from '../../shared/constants/AppConst';

export const seguridadConfigs = [
  {
    auth: authRole.user,
    routes: [
      {
        exact: true,
        path: '/roles',
        component: React.lazy(() => import('./Rol')),
      },
      {
        path: '/aplicaciones',
        component: React.lazy(() => import('./Aplicacion')),
      },
      {
        path: '/modulos',
        component: React.lazy(() => import('./Modulo')),
      },
      {
        path: '/usuarios',
        component: React.lazy(() => import('./Usuario')),
      },
      {
        path: '/opciones-del-sistema',
        component: React.lazy(() => import('./OpcionSistema')),
      },
      {
        path: '/permisos',
        component: React.lazy(() => import('./Permiso')),
      },
      {
        exact: true,
        path: ['/roles/permisos/:rol_id'],
        component: React.lazy(() => import('./Permissions')),
      },
      {
        path: '/auditoria-tablas',
        component: React.lazy(() => import('./ConsultaAuditoria')),
      },
      {
        path: '/solicitudes-acceso',
        component: React.lazy(() => import('./SolicitudAcceso')),
      },
    ],
  },
];
