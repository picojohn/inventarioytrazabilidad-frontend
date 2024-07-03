import {
  GET_COLECCION_OPERACION_EMBARQUE,
  GET_COLECCION_LIGERA_OPERACION_EMBARQUE,
  SHOW_OPERACION_EMBARQUE,
  UPDATE_OPERACION_EMBARQUE,
  DELETE_OPERACION_EMBARQUE,
  CREATE_OPERACION_EMBARQUE,
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

const OperacionEmbarqueReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COLECCION_OPERACION_EMBARQUE:
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

    case GET_COLECCION_LIGERA_OPERACION_EMBARQUE:
      return {
        ...state,
        ligera: action.payload.data,
      };

    case SHOW_OPERACION_EMBARQUE:
      return {
        ...state,
        selectedRow: action.payload,
      };

    case UPDATE_OPERACION_EMBARQUE:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    case DELETE_OPERACION_EMBARQUE:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    case CREATE_OPERACION_EMBARQUE:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    default:
      return state;
  }
};
export default OperacionEmbarqueReducer;
