import {
  GET_COLECCION_KIT,
  GET_COLECCION_LIGERA_KIT,
  SHOW_KIT,
  UPDATE_KIT,
  DELETE_KIT,
  CREATE_KIT,
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

const KitReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COLECCION_KIT:
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

    case GET_COLECCION_LIGERA_KIT:
      return {
        ...state,
        ligera: action.payload.data,
      };

    case SHOW_KIT:
      return {
        ...state,
        selectedRow: action.payload,
      };

    case UPDATE_KIT:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    case DELETE_KIT:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    case CREATE_KIT:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    default:
      return state;
  }
};
export default KitReducer;
