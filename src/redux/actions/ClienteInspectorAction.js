import {   
   GET_HEADERS_CLIENTE_INSPECTOR,
   GET_COLECCION_CLIENTE_INSPECTOR,
   GET_COLECCION_LIGERA_CLIENTE_INSPECTOR,
   SHOW_CLIENTE_INSPECTOR,
   CREATE_CLIENTE_INSPECTOR,
   UPDATE_CLIENTE_INSPECTOR,
   DELETE_CLIENTE_INSPECTOR,
   FETCH_ERROR,
   FETCH_START,
   FETCH_SUCCESS,
   SHOW_MESSAGE,
} from '../../shared/constants/ActionTypes';
import jwtAxios from '../../@crema/services/auth/jwt-auth/jwt-api';

import {appIntl} from '../../@crema/utility/Utils';

export const onGetHeaders = (cliente_id) => {
   const {messages} = appIntl();
   return (dispatch) => {
      dispatch({type: FETCH_START});
      jwtAxios.get('clientes-inspectores/' + cliente_id, {
         params: {
            headerInfo: true,
         },
      }).then((data) => {
         if (data.status === 200) {
            dispatch({type: FETCH_SUCCESS});
            dispatch({type: GET_HEADERS_CLIENTE_INSPECTOR, payload: data});
         } else {
            dispatch({type: FETCH_ERROR, payload: messages['message.somethingWentWrong']});            
         }
      }).catch((error) => {
         dispatch({type: FETCH_ERROR, payload: error.message});
      });
   };
 };
  
export const onGetColeccion = (
   currentPage,
   rowsPerPage,
   orderByToSend,
   cliente_id,
) => {
   const { messages } = appIntl();
   const page = currentPage ? currentPage : 0;
   const ordenar_por = orderByToSend ? orderByToSend : '';
   const cliente_id_Aux = cliente_id ? cliente_id : 0;

   return (dispatch) => {
      dispatch({type: FETCH_START});
      jwtAxios.get('clientes-inspectores/' + cliente_id, { 
         params: {
            page: page,
            limite: rowsPerPage,
            ordenar_por: ordenar_por,
            cliente_id: cliente_id_Aux,
         },
      }).then((data) => { 
         if (data.status === 200) {                      
            dispatch({type: FETCH_SUCCESS});
            dispatch({type: GET_COLECCION_CLIENTE_INSPECTOR, payload: data});
         } else {
            dispatch({ type: FETCH_ERROR, payload: messages['message.somethingWentWrong']});
         } 
      }).catch((error) => { 
         dispatch({ 
            type: FETCH_ERROR, 
            payload: error.message 
         }); 
      });
   };
};

export const onGetColeccionLigera = () => {
   const {messages} = appIntl();
   return (dispatch) => {
      dispatch({type: FETCH_START});
      jwtAxios.get('clientes-inspectores', {
         params: {
            ligera: true, 
         }, 
      }).then((data) => { 
         if (data.status === 200) {                      
            dispatch({type: FETCH_SUCCESS});
            dispatch({type: GET_COLECCION_LIGERA_CLIENTE_INSPECTOR, payload: data});
         } else {
            dispatch({type: FETCH_ERROR, payload: messages['message.somethingWentWrong']});
         } 
      }).catch((error) => { 
         dispatch({type: FETCH_ERROR, payload: error.message}); 
      });
   };
};

export const onShow = (cliente_id, id) => {
   const {messages} = appIntl();
   return (dispatch) => {
      if (id !== 0) {
         dispatch({type: FETCH_START});
         jwtAxios.get('clientes-inspectores/'+cliente_id+'/'+id)
            .then((data) => {
               if (data.status === 200) {
                  dispatch({type: FETCH_SUCCESS});
                  dispatch({type: SHOW_CLIENTE_INSPECTOR, payload: data.data});                           
               } else {
                  dispatch({type: FETCH_ERROR, payload: messages['message.somethingWentWrong']});
               } 
            })
            .catch ((error) => { 
               dispatch({type: FETCH_ERROR, payload: error.message}); 
            });
      }
   };
};

export const onCreate = (params, handleOnClose, updateColeccion) => {
   return (dispatch) => {
      dispatch({type: FETCH_START});
      jwtAxios.post('clientes-inspectores/'+params.cliente_id, params)
         .then((data) => { 
            if (data.status === 201) {
               dispatch({type: FETCH_SUCCESS});
               dispatch({type: CREATE_CLIENTE_INSPECTOR, payload: data.data});
               updateColeccion();    
               handleOnClose();    
               dispatch({
                  type: SHOW_MESSAGE, 
                  payload: [
                     data.data.mensajes[0], 
                     data.data.mensajes[1]
                  ], 
               });
            } else {
               dispatch({type: FETCH_ERROR, payload: data.data.mensajes[0]});
            } 
         })
         .catch((error) => { 
            dispatch({type: FETCH_ERROR, payload: error.response.data.mensajes[0]}); 
         });
   };
};

export const onUpdate = (params, handleOnClose, updateColeccion) => {
   return (dispatch) => {
      dispatch({type: FETCH_START});
      jwtAxios.put('clientes-inspectores/'+params.cliente_id+'/'+params.id, params)
         .then((data) => { 
            if (data.status === 200) {                      
               dispatch({type: FETCH_SUCCESS});
               dispatch({type: UPDATE_CLIENTE_INSPECTOR, payload: data.data});
               updateColeccion();
               handleOnClose();    
               dispatch({
                  type: SHOW_MESSAGE, 
                  payload: [
                     data.data.mensajes[0], 
                     data.data.mensajes[1]
                  ], 
               });     
            } else {
               dispatch({type: FETCH_ERROR, payload: data.data.mensajes[0]});
            } 
         })
         .catch((error) => { 
            dispatch({type: FETCH_ERROR, payload: error.response.data.mensajes[0]}); 
         });
   };
};

export const onDelete = (id) => {
   return (dispatch) => {
      dispatch({type: FETCH_START});
      jwtAxios.delete('clientes-inspectores/'+id)
         .then((data) => { 
            if (data.status === 200) {                   
               dispatch({type: FETCH_SUCCESS});                      
               dispatch({
                  type: SHOW_MESSAGE, 
                  payload: [
                     data.data.mensajes[0], 
                     data.data.mensajes[1]], 
                  });                   
               dispatch({type: DELETE_CLIENTE_INSPECTOR, payload: data.data});                     
            } else {
               dispatch({type: FETCH_ERROR, payload: data.data.mensajes[0]});
            } 
         })
         .catch((error) => { 
            if (error.response.data.mensajes) {
               dispatch({type: FETCH_ERROR, payload: error.response.data.mensajes[0]});
            } else {
               dispatch({type: FETCH_ERROR, payload: error.message});
            }
         });
   };
};

