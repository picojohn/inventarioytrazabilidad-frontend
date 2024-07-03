import { 
   GET_HEADERS_CLIENTE_VEHICULO,
   GET_COLECCION_CLIENTE_VEHICULO,
   GET_COLECCION_LIGERA_CLIENTE_VEHICULO,
   SHOW_CLIENTE_VEHICULO,
   CREATE_CLIENTE_VEHICULO,
   UPDATE_CLIENTE_VEHICULO,
   DELETE_CLIENTE_VEHICULO,
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

const ClienteVehiculoReducer = (
   state = initialState, 
   action
) => {
   switch (action.type) {
      case GET_HEADERS_CLIENTE_VEHICULO:
         return {
           ...state,
           ligera: action.payload.data,
         };
   
      case GET_COLECCION_CLIENTE_VEHICULO: 
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

      case GET_COLECCION_LIGERA_CLIENTE_VEHICULO: 
         return { 
            ...state, 
            ligera: action.payload.data, 
         };

      case SHOW_CLIENTE_VEHICULO: 
         return { 
            ...state, 
            selectedRow: action.payload, 
         };

      case CREATE_CLIENTE_VEHICULO: 
         return { 
            ...state, 
            selectedRow: action.payload.datos, 
         };

      case UPDATE_CLIENTE_VEHICULO: 
         return { 
            ...state, 
            selectedRow: action.payload.datos, 
         };

      case DELETE_CLIENTE_VEHICULO: 
         return { 
            ...state, 
            selectedRow: action.payload.datos, 
         };
      
      default: 
         return state;
   }
};

export default ClienteVehiculoReducer;