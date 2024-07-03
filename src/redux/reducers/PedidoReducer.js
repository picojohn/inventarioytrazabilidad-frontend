import {
  GET_COLECCION_PEDIDO,
  GET_COLECCION_LIGERA_PEDIDO,
  SHOW_PEDIDO,
  UPDATE_PEDIDO,
  CONFIRM_PEDIDO,
  DELETE_PEDIDO,
  CREATE_PEDIDO,
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

const PedidoReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COLECCION_PEDIDO:
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

    case GET_COLECCION_LIGERA_PEDIDO:
      return {
        ...state,
        ligera: action.payload.data,
      };

    case SHOW_PEDIDO:
      return {
        ...state,
        selectedRow: action.payload,
      };

    case UPDATE_PEDIDO:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    case CONFIRM_PEDIDO:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    case DELETE_PEDIDO:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    case CREATE_PEDIDO:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    case 'UNSELECTPEDIDO':
      return {
        ...state,
        selectedRow: null
      }

    default:
      return state;
  }
};
export default PedidoReducer;
