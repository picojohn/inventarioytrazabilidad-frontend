import {
  GET_COLECCION_LIGERA_PEDIDO_S3,
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

const PedidoS3Reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COLECCION_LIGERA_PEDIDO_S3:
      return {
        ...state,
        ligera: action.payload.data,
      };

    default:
      return state;
  }
};
export default PedidoS3Reducer;
