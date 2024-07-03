import {
  GET_COLECCION_PEDIDO_DETALLE,
  GET_COLECCION_PEDIDO_DETALLE_KIT,
  GET_COLECCION_LIGERA_PEDIDO_DETALLE,
  SHOW_PEDIDO_DETALLE,
  UPDATE_PEDIDO_DETALLE,
  DELETE_PEDIDO_DETALLE,
  CREATE_PEDIDO_DETALLE,
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
  kit: {
    rows: [],
    desde: 1,
    hasta: 1,
    por_pagina: 1,
    pagina_actual: 1,
    ultima_pagina: 1,
    total: 1,
  }
};

const PedidoDetalleReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COLECCION_PEDIDO_DETALLE:
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
    
      case GET_COLECCION_PEDIDO_DETALLE_KIT:
      return {
        ...state,
        kit: {
          rows: action.payload.data.datos,
          desde: action.payload.data.desde,
          hasta: action.payload.data.hasta,
          por_pagina: action.payload.data.por_pagina,
          pagina_actual: action.payload.data.pagina_actual,
          ultima_pagina: action.payload.data.ultima_pagina,
          total: action.payload.data.total,
        }
      };

    case GET_COLECCION_LIGERA_PEDIDO_DETALLE:
      return {
        ...state,
        ligera: action.payload.data,
      };

    case SHOW_PEDIDO_DETALLE:
      return {
        ...state,
        selectedRow: action.payload,
      };

    case UPDATE_PEDIDO_DETALLE:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    case DELETE_PEDIDO_DETALLE:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    case CREATE_PEDIDO_DETALLE:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    default:
      return state;
  }
};
export default PedidoDetalleReducer;
