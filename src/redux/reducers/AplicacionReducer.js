import {
  GET_COLECCION_APLICACION,
  GET_COLECCION_LIGERA_APLICACION,
  SHOW_APLICACION,
  UPDATE_APLICACION,
  DELETE_APLICACION,
  CREATE_APLICACION,
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

const AplicacionReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COLECCION_APLICACION:
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

    case GET_COLECCION_LIGERA_APLICACION:
      return {
        ...state,
        ligera: action.payload.data,
      };

    case SHOW_APLICACION:
      return {
        ...state,
        selectedRow: action.payload,
      };

    case UPDATE_APLICACION:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    case DELETE_APLICACION:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    case CREATE_APLICACION:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    default:
      return state;
  }
};
export default AplicacionReducer;
