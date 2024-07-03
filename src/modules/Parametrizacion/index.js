import React from 'react';
import { authRole } from '../../shared/constants/AppConst';

export const parametrizacionConfigs = [
  {
    auth: authRole.user,
    routes: [
      {
        exact: true,
        path: '/parametros-correo',
        component: React.lazy(() => import('./ParametroCorreo')),
      },
      {
        exact: true,
        path: '/parametros-constantes',
        component: React.lazy(() => import('./ParametroConstante')),
      },
      {
        exact: true,
        path: '/tipos-alerta',
        component: React.lazy(() => import('./TipoAlerta')),
      },
      {
        exact: true,
        path: '/clientes',
        component: React.lazy(() => import('./Cliente')),
      },
      {
        exact: true,
        path: '/lugares/:cliente_id',
        component: React.lazy(() => import('./Lugar')),
      },
      {
        exact: true,
        path: '/clientes-alertas/:cliente_id',
        component: React.lazy(() => import('./ClienteAlerta')),
      },
      {
        exact: true,
        path: '/clientes-vehiculos/:cliente_id',
        component: React.lazy(() => import('./ClienteVehiculo')),
      },
      {
        exact: true,
        path: '/clientes-conductores/:cliente_id',
        component: React.lazy(() => import('./ClienteConductor')),
      },
      {
        exact: true,
        path: '/clientes-inspectores/:cliente_id',
        component: React.lazy(() => import('./ClienteInspector')),
      },
      {
        exact: true,
        path: '/clientes-empresas-transporte/:cliente_id',
        component: React.lazy(() => import('./ClienteEmpresaTransporte')),
      },
      {
        exact: true,
        path: '/productos-clientes',
        component: React.lazy(() => import('./ProductoCliente')),
      },
      {
        exact: true,
        path: '/zonas-contenedores',
        component: React.lazy(() => import('./ZonaContenedor')),
      },
      {
        exact: true,
        path: '/tipos-eventos',
        component: React.lazy(() => import('./TipoEvento')),
      },
      {
        exact: true,
        path: '/kits',
        component: React.lazy(() => import('./Kit')),
      },
      {
        exact: true,
        path: '/kits-componentes/:cliente_id/:kit_id',
        component: React.lazy(() => import('./KitProductos')),
      },
      {
        exact: true,
        path: '/tipos-contenedor',
        component: React.lazy(() => import('./TipoContenedor')),
      },
      {
        exact: true,
        path: '/contenedores',
        component: React.lazy(() => import('./Contenedor')),
      },
      {
        exact: true,
        path: '/lugares-usuarios',
        component: React.lazy(() => import('./LugarUsuario')),
      },
      {
        exact: true,
        path: '/inventario-minimo',
        component: React.lazy(() => import('./InventarioMinimo')),
      },
      {
        exact: true,
        path: '/tipos-chequeos',
        component: React.lazy(() => import('./TipoChequeo')),
      },
      {
        exact: true,
        path: '/unidades-carga-transporte',
        component: React.lazy(() => import('./UnidadCargaTransporte')),
      },
      {
        exact: true,
        path: '/clases-inspeccion',
        component: React.lazy(() => import('./ClaseInspeccion')),
      },
      {
        exact: true,
        path: '/lista-fotos/:clase_inspeccion_id',
        component: React.lazy(() => import('./ClaseInspeccionListaFotos')),
      },
      {
        exact: true,
        path: '/datos-adicionales',
        component: React.lazy(() => import('./DatoAdicional')),
      },
      {
        exact: true,
        path: '/formatos-inspeccion',
        component: React.lazy(() => import('./FormatoInspeccion')),
      },
    ],
  },    
];