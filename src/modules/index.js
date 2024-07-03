import React from 'react';
import {Redirect} from 'react-router-dom';

import {createRoutes} from '../@crema/utility/Utils';
import {errorPagesConfigs} from './errorPages';
import {authRouteConfig} from './auth';
import {initialUrl} from '../shared/constants/AppConst';
import {seguridadConfigs} from './Seguridad';
import {parametrizacionConfigs} from './Parametrizacion';
import { pedidosConfigs } from './Pedidos';
import { inventarioConfigs } from './Inventario';
import { remisionesConfigs } from './Remisiones';
import { contendoresConfig } from './Contenedores';
import { operacionesConfig } from './Operaciones';

const routeConfigs = [
  ...authRouteConfig,
  ...errorPagesConfigs,
  ...seguridadConfigs,
  ...parametrizacionConfigs,
  ...pedidosConfigs,
  ...inventarioConfigs,
  ...remisionesConfigs,
  ...contendoresConfig,
  ...operacionesConfig,
];

const routes = [
  ...createRoutes(routeConfigs),
  {
    path: '/',
    exact: true,
    component: () => <Redirect to={initialUrl} />,
  },
  {
    component: () => <Redirect to='/error-pages/error-404' />,
  },
];

export default routes;
