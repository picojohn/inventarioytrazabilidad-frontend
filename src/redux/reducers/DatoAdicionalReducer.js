import {
  GET_COLECCION_DATO_ADICIONAL,
  GET_COLECCION_LIGERA_DATO_ADICIONAL,
  SHOW_DATO_ADICIONAL,
  UPDATE_DATO_ADICIONAL,
  DELETE_DATO_ADICIONAL,
  CREATE_DATO_ADICIONAL,
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

const DatoAdicionalReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COLECCION_DATO_ADICIONAL:
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
    
    case GET_COLECCION_LIGERA_DATO_ADICIONAL:
      return {
        ...state,
        ligera: action.payload.data,
      };

    case SHOW_DATO_ADICIONAL:
      return {
        ...state,
        selectedRow: action.payload,
      };

    case UPDATE_DATO_ADICIONAL:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    case DELETE_DATO_ADICIONAL:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    case CREATE_DATO_ADICIONAL:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    default:
      return state;
  }
};
export default DatoAdicionalReducer;
