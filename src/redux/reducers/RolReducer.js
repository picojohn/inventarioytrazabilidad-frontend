import {
  GET_COLECCION_ROL,
  GET_COLECCION_LIGERA_ROL,
  GET_PERMISOS,
  SHOW_ROL,
  UPDATE_ROL,
  DELETE_ROL,
  CREATE_ROL,
  OTORGAR_PERMISO,
  REVOCAR_PERMISO,
} from '../../shared/constants/ActionTypes';

const initialState = {
  rows: [],
  ligera: [],
  selectedRow: null,
  desde: 1,
  hasta: 1,
  por_pagina: 1,
  pagina_actual: 1,
  ultima_pagina: 1,
  total: 1,
  permisos: [],
};

const RolReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COLECCION_ROL:
      return {
        ...state,
        rows: action.payload.data.datos,
        desde: action.payload.data.desde,
        hasta: action.payload.data.hasta,
        por_pagina: action.payload.data.por_pagina,
        pagina_actual: action.payload.data.pagina_actual,
        ultima_pagina: action.payload.data.ultima_pagina,
        total: action.payload.data.total,
      };

    case GET_COLECCION_LIGERA_ROL:
      return {
        ...state,
        ligera: action.payload.data,
      };

    case SHOW_ROL:
      return {
        ...state,
        selectedRow: action.payload,
      };

    case GET_PERMISOS:
      return {
        ...state,
        permisos: action.payload,
      };

    case OTORGAR_PERMISO:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    case REVOCAR_PERMISO:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    case UPDATE_ROL:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    case DELETE_ROL:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    case CREATE_ROL:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    default:
      return state;
  }
};
export default RolReducer;
