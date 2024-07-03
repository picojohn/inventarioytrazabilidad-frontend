import {
  GET_COLECCION_ZONA_CONTENEDOR,
  GET_COLECCION_LIGERA_ZONA_CONTENEDOR,
  SHOW_ZONA_CONTENEDOR,
  UPDATE_ZONA_CONTENEDOR,
  DELETE_ZONA_CONTENEDOR,
  CREATE_ZONA_CONTENEDOR,
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

const ZonaContenedorReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COLECCION_ZONA_CONTENEDOR:
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

    case GET_COLECCION_LIGERA_ZONA_CONTENEDOR:
      return {
        ...state,
        ligera: action.payload.data,
      };

    case SHOW_ZONA_CONTENEDOR:
      return {
        ...state,
        selectedRow: action.payload,
      };

    case UPDATE_ZONA_CONTENEDOR:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    case DELETE_ZONA_CONTENEDOR:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    case CREATE_ZONA_CONTENEDOR:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    default:
      return state;
  }
};
export default ZonaContenedorReducer;
