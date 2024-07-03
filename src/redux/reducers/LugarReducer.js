import { 
   GET_HEADERS_LUGAR,
   GET_COLECCION_LUGAR,
   GET_COLECCION_LIGERA_LUGAR,
   SHOW_LUGAR,
   CREATE_LUGAR,
   UPDATE_LUGAR,
   DELETE_LUGAR,
} from '../../shared/constants/ActionTypes';

const initialState = { 
   rows: [],
   ligera: [],
   headers: [],
   selectedRow: null,
   desde: 1,
   hasta: 1,
   por_pagina: 1,
   pagina_actual: 1,
   ultima_pagina: 1,
   total: 1,
};

const LugarReducer = (
   state = initialState, 
   action
) => {
   switch (action.type) {
      case GET_HEADERS_LUGAR:
         return {
           ...state,
           headers: action.payload.data,
         };
   
      case GET_COLECCION_LUGAR: 
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

      case GET_COLECCION_LIGERA_LUGAR: 
         return { 
            ...state, 
            ligera: action.payload.data, 
         };

      case SHOW_LUGAR: 
         return { 
            ...state, 
            selectedRow: action.payload, 
         };

      case CREATE_LUGAR: 
         return { 
            ...state, 
            selectedRow: action.payload.datos, 
         };

      case UPDATE_LUGAR: 
         return { 
            ...state, 
            selectedRow: action.payload.datos, 
         };

      case DELETE_LUGAR: 
         return { 
            ...state, 
            selectedRow: action.payload.datos, 
         };
      
      default: 
         return state;
   }
};

export default LugarReducer;
