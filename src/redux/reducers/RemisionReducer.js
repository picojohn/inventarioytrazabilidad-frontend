import {
  GET_COLECCION_REMISION,
  GET_COLECCION_LIGERA_REMISION,
  SHOW_REMISION,
  UPDATE_REMISION,
  CONFIRM_REMISION,
  DELETE_REMISION,
  CREATE_REMISION,
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
  seleccionados: 0,
  seleccionadosSobreFiltro: 0,
};

const RemisionReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COLECCION_REMISION:
      return {
        ...state,
        rows: action.payload.data.datos,
        desde: action.payload.data.desde,
        hasta: action.payload.data.hasta,
        por_pagina: action.payload.data.por_pagina,
        pagina_actual: action.payload.data.pagina_actual,
        ultima_pagina: action.payload.data.ultima_pagina,
        total: action.payload.data.total,
        seleccionados: action.payload.data.seleccionados,
        seleccionadosSobreFiltro: action.payload.data.seleccionadosSobreFiltro,
      };

    case GET_COLECCION_LIGERA_REMISION:
      return {
        ...state,
        ligera: action.payload.data,
      };

    case SHOW_REMISION:
      return {
        ...state,
        selectedRow: action.payload,
      };

    case UPDATE_REMISION:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    case CONFIRM_REMISION:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    case DELETE_REMISION:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    case CREATE_REMISION:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };
    
    case 'UNSELECTREMISION':
      return {
        ...state,
        selectedRow: null
      }

    default:
      return state;
  }
};
export default RemisionReducer;
