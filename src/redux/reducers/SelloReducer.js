import {
  GET_COLECCION_SELLO,
  GET_COLECCION_ORDEN_LECTURA,
  GET_COLECCION_SELLO_CONSULTA,
  GET_COLECCION_INVENTARIO,
  GET_COLECCION_INVENTARIO_LUGAR,
  // SHOW_KIT,
  // UPDATE_KIT,
  DELETE_SELLO,
  READ_SELLO,
  READ_SELLO_INDIVIDUAL,
  GET_COLECCION_BITACORA,
  SHOW_BITACORA,
  READ_FOR_INSTALL_SELLO,
  GET_COLECCION_INSTALACION,
  GET_COLECCION_ACTULIZACION,
  GET_DATA_PARA_CONSULTA_IPP,
  GET_DATA_PARA_CONSULTA_ILP,
  GET_DATA_PARA_CONSULTA_EPL,
} from '../../shared/constants/ActionTypes';

const initialState = {
  rows: [],
  ligera: [],
  selectedRow: null,
  readedRow: null,
  desde: 1,
  hasta: 1,
  por_pagina: 1,
  pagina_actual: 1,
  ultima_pagina: 1,
  total: 1,
  inventario: {
    rows: [],
    desde: 1,
    hasta: 1,
    por_pagina: 1,
    pagina_actual: 1,
    ultima_pagina: 1,
    total: 1,
  },
  inventarioLugar: {
    rows: [],
    desde: 1,
    hasta: 1,
    por_pagina: 1,
    pagina_actual: 1,
    ultima_pagina: 1,
    total: 1,
  },
  bitacora: {
    rows: [],
    desde: 1,
    hasta: 1,
    por_pagina: 1,
    pagina_actual: 1,
    ultima_pagina: 1,
    total: 1,
    selectedRow: null
  },
  instalar: {
    read: null,
    ligera: []
  },
  actualizarEstado: {
    rows: [],
    desde: 1,
    hasta: 1,
    por_pagina: 1,
    pagina_actual: 1,
    ultima_pagina: 1,
    total: 1,
  },
  consultas : {
    ipp: {
      data: []
    },
    ilp: {
      data: []
    },
    epl: {
      data: []
    }
  }
};

const SelloReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COLECCION_SELLO:
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

    case GET_COLECCION_SELLO_CONSULTA:
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

    case GET_COLECCION_INVENTARIO:
      return {
        ...state,
        inventario: {
          rows: action.payload.data.datos,
          desde: action.payload.data.desde,
          hasta: action.payload.data.hasta,
          por_pagina: action.payload.data.por_pagina,
          pagina_actual: action.payload.data.pagina_actual,
          ultima_pagina: action.payload.data.ultima_pagina,
          total: action.payload.data.total,
        }
      };

    case GET_COLECCION_BITACORA:
      return {
        ...state,
        bitacora: {
          rows: action.payload.data.datos,
          desde: action.payload.data.desde,
          hasta: action.payload.data.hasta,
          por_pagina: action.payload.data.por_pagina,
          pagina_actual: action.payload.data.pagina_actual,
          ultima_pagina: action.payload.data.ultima_pagina,
          total: action.payload.data.total,
        }
      };
    
    case GET_COLECCION_INVENTARIO_LUGAR:
      return {
        ...state,
        inventarioLugar: {
          ...state.bitacora,
          rows: action.payload.data.datos,
          desde: action.payload.data.desde,
          hasta: action.payload.data.hasta,
          por_pagina: action.payload.data.por_pagina,
          pagina_actual: action.payload.data.pagina_actual,
          ultima_pagina: action.payload.data.ultima_pagina,
          total: action.payload.data.total,
        }
      };

    case GET_COLECCION_ACTULIZACION:
      return {
        ...state,
        actualizarEstado: {
          ...state.actualizarEstado,
          rows: action.payload.data.datos,
          desde: action.payload.data.desde,
          hasta: action.payload.data.hasta,
          por_pagina: action.payload.data.por_pagina,
          pagina_actual: action.payload.data.pagina_actual,
          ultima_pagina: action.payload.data.ultima_pagina,
          total: action.payload.data.total,
        }
      };

    case GET_COLECCION_ORDEN_LECTURA:
      return {
        ...state,
        ligera: action.payload.data,
      };

    case SHOW_BITACORA:
      return {
        ...state,
        bitacora: {
          ...state.bitacora,
          selectedRow: action.payload
        },
      };
    
    case 'RESETBITACORA': {
      return {
        ...state,
        bitacora: initialState.bitacora,
        actualizarEstado: initialState.actualizarEstado,
        consultas: initialState.consultas
      }
    }

    case GET_DATA_PARA_CONSULTA_IPP:
      return {
        ...state,
        consultas: {
          ...initialState.consultas,
          ipp: {
            data: action.payload
          }
        },
      };

    case GET_DATA_PARA_CONSULTA_ILP:
      return {
        ...state,
        consultas: {
          ...initialState.consultas,
          ilp: {
            data: action.payload
          }
        },
      };
    case GET_DATA_PARA_CONSULTA_EPL:
      return {
        ...state,
        consultas: {
          ...initialState.consultas,
          epl: {
            data: action.payload
          }
        },
      };

    case DELETE_SELLO:
      return {
        ...state,
        selectedRow: action.payload.datos,
      };

    case READ_SELLO_INDIVIDUAL:
      return {
        ...state,
        selectedRow: action.payload,
      };

    case READ_SELLO:
      return {
        ...state,
        readedRow: action.payload,
      };
    
    case READ_FOR_INSTALL_SELLO:
      return {
        ...state,
        instalar: {
          ...state.instalar,
          read: action.payload
        },
      };
    
    case GET_COLECCION_INSTALACION:
      return {
        ...state,
        instalar: {
          ...state.instalar,
          ligera: action.payload.data
        },
      };
    
    case 'UNREAD':
      return {
        ...state,
        readedRow: null,
        instalar : {
          ...state.instalar,
          read: null
        }
      };

    default:
      return state;
  }
};
export default SelloReducer;
