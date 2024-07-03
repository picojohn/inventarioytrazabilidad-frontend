import {
  GET_COLECCION_CLASE_INSPECCION_LISTA_FOTOS,
  GET_COLECCION_LIGERA_CLASE_INSPECCION_LISTA_FOTOS,
  SHOW_CLASE_INSPECCION_LISTA_FOTOS,
  UPDATE_CLASE_INSPECCION_LISTA_FOTOS,
  DELETE_CLASE_INSPECCION_LISTA_FOTOS,
  CREATE_CLASE_INSPECCION_LISTA_FOTOS,
  GET_HEADERS_CLASE_INSPECCION_LISTA_FOTOS,
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

const ClaseInspeccionListaFotosReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_HEADERS_CLASE_INSPECCION_LISTA_FOTOS:
      return {
        ...state,
        ligera: action.payload.data,
      };
    case GET_COLECCION_CLASE_INSPECCION_LISTA_FOTOS:
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

    case GET_COLECCION_LIGERA_CLASE_INSPECCION_LISTA_FOTOS:
      return {
        ...state,
        ligera: action.payload.data,
      };

    case SHOW_CLASE_INSPECCION_LISTA_FOTOS:
      return {
        ...state,
        selectedRow: action.payload,
      };

    case UPDATE_CLASE_INSPECCION_LISTA_FOTOS:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    case DELETE_CLASE_INSPECCION_LISTA_FOTOS:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    case CREATE_CLASE_INSPECCION_LISTA_FOTOS:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    default:
      return state;
  }
};
export default ClaseInspeccionListaFotosReducer;
