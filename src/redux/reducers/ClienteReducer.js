import {
  GET_COLECCION_CLIENTE,
  GET_COLECCION_LIGERA_CLIENTE,
  SHOW_CLIENTE,
  UPDATE_CLIENTE,
  DELETE_CLIENTE,
  CREATE_CLIENTE,
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

const ClienteReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COLECCION_CLIENTE:
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

    case GET_COLECCION_LIGERA_CLIENTE:
      return {
        ...state,
        ligera: action.payload.data,
      };

    case SHOW_CLIENTE:
      return {
        ...state,
        selectedRow: action.payload,
      };

    case UPDATE_CLIENTE:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    case DELETE_CLIENTE:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    case CREATE_CLIENTE:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    default:
      return state;
  }
};
export default ClienteReducer;
