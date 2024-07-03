import {
  GET_COLECCION_FORMATO_INSPECCION_UNIDAD,
  GET_COLECCION_LIGERA_FORMATO_INSPECCION_UNIDAD,
  SHOW_FORMATO_INSPECCION_UNIDAD,
  UPDATE_FORMATO_INSPECCION_UNIDAD,
  DELETE_FORMATO_INSPECCION_UNIDAD,
  CREATE_FORMATO_INSPECCION_UNIDAD,
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

const FormatoInspeccionUnidadReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COLECCION_FORMATO_INSPECCION_UNIDAD:
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

    case GET_COLECCION_LIGERA_FORMATO_INSPECCION_UNIDAD:
      return {
        ...state,
        ligera: action.payload.data,
      };

    case SHOW_FORMATO_INSPECCION_UNIDAD:
      return {
        ...state,
        selectedRow: action.payload,
      };

    case UPDATE_FORMATO_INSPECCION_UNIDAD:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    case DELETE_FORMATO_INSPECCION_UNIDAD:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    case CREATE_FORMATO_INSPECCION_UNIDAD:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    default:
      return state;
  }
};
export default FormatoInspeccionUnidadReducer;
