import { GET_COLECCION_PARAMETRO_CORREO,
         GET_COLECCION_LIGERA_PARAMETRO_CORREO,
         SHOW_PARAMETRO_CORREO,
         UPDATE_PARAMETRO_CORREO,
         DELETE_PARAMETRO_CORREO,
         CREATE_PARAMETRO_CORREO,
       } from '../../shared/constants/ActionTypes';

const initialState = { rows: [],
                       ligera: [],
                       selectedRow: null,
                       desde: 1,
                       hasta: 1,
                       por_pagina: 1,
                       pagina_actual: 1,
                       ultima_pagina: 1,
                       total: 1,
                      };

const ParametroCorreoReducer = (state = initialState, action) => 
{
  switch (action.type) {
    case GET_COLECCION_PARAMETRO_CORREO: return { ...state, rows: action.payload.data.datos, desde: action.payload.data.desde, hasta: action.payload.data.hasta, por_pagina: action.payload.data.por_pagina, pagina_actual: action.payload.data.pagina_actual, ultima_pagina: action.payload.data.ultima_pagina, total: action.payload.data.total, };
    case GET_COLECCION_LIGERA_PARAMETRO_CORREO: return { ...state, ligera: action.payload.data, };
    case SHOW_PARAMETRO_CORREO: return { ...state, selectedRow: action.payload, };
    case UPDATE_PARAMETRO_CORREO: return { ...state, selectedRow: action.payload.datos, };
    case DELETE_PARAMETRO_CORREO: return { ...state, selectedRow: action.payload.datos, };
    case CREATE_PARAMETRO_CORREO: return { ...state, selectedRow: action.payload.datos, };
    default: return state;
  }
};

export default ParametroCorreoReducer;
