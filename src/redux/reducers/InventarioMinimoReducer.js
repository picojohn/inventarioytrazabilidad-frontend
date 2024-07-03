import {
  GET_COLECCION_INVENTARIO_MINIMO,
  GET_COLECCION_LIGERA_INVENTARIO_MINIMO,
  SHOW_INVENTARIO_MINIMO,
  UPDATE_INVENTARIO_MINIMO,
  DELETE_INVENTARIO_MINIMO,
  CREATE_INVENTARIO_MINIMO,
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

const InventarioMinimoReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COLECCION_INVENTARIO_MINIMO:
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

    case GET_COLECCION_LIGERA_INVENTARIO_MINIMO:
      return {
        ...state,
        ligera: action.payload.data,
      };

    case SHOW_INVENTARIO_MINIMO:
      return {
        ...state,
        selectedRow: action.payload,
      };

    case UPDATE_INVENTARIO_MINIMO:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    case DELETE_INVENTARIO_MINIMO:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    case CREATE_INVENTARIO_MINIMO:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    default:
      return state;
  }
};
export default InventarioMinimoReducer;
