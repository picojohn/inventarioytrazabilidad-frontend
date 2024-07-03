import {
  GET_COLECCION_SOLICITUD_ACCESO,
  GET_COLECCION_LIGERA_SOLICITUD_ACCESO,
  SHOW_SOLICITUD_ACCESO,
  UPDATE_SOLICITUD_ACCESO,
  DELETE_SOLICITUD_ACCESO,
  CREATE_SOLICITUD_ACCESO,
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

const SolicitudAccesoReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COLECCION_SOLICITUD_ACCESO:
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

    case GET_COLECCION_LIGERA_SOLICITUD_ACCESO:
      return {
        ...state,
        ligera: action.payload.data,
      };

    case SHOW_SOLICITUD_ACCESO:
      return {
        ...state,
        selectedRow: action.payload,
      };

    case UPDATE_SOLICITUD_ACCESO:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    case DELETE_SOLICITUD_ACCESO:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    case CREATE_SOLICITUD_ACCESO:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    default:
      return state;
  }
};
export default SolicitudAccesoReducer;
