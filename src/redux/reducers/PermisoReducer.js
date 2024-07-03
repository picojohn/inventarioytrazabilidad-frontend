import {
  GET_COLECCION_PERMISO,
  GET_COLECCION_LIGERA_PERMISO,
  SHOW_PERMISO,
  UPDATE_PERMISO,
  DELETE_PERMISO,
  CREATE_PERMISO,
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
};

const PermisoReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COLECCION_PERMISO:
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

    case GET_COLECCION_LIGERA_PERMISO:
      return {
        ...state,
        ligera: action.payload.data,
      };

    case SHOW_PERMISO:
      return {
        ...state,
        selectedRow: action.payload,
      };

    case UPDATE_PERMISO:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    case DELETE_PERMISO:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    case CREATE_PERMISO:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    default:
      return state;
  }
};
export default PermisoReducer;
