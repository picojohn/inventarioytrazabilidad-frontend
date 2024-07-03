import {
  GET_COLECCION_LIGERA_PRODUCTO,
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

const ProductoReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COLECCION_LIGERA_PRODUCTO:
      return {
        ...state,
        ligera: action.payload.data,
      };

    default:
      return state;
  }
};
export default ProductoReducer;
