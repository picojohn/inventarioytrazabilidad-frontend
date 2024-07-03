import {   
   GET_HEADERS_CLASE_INSPECCION_LISTA_FOTOS,
   GET_COLECCION_CLASE_INSPECCION_LISTA_FOTOS,
   GET_COLECCION_LIGERA_CLASE_INSPECCION_LISTA_FOTOS,
   SHOW_CLASE_INSPECCION_LISTA_FOTOS,
   CREATE_CLASE_INSPECCION_LISTA_FOTOS,
   UPDATE_CLASE_INSPECCION_LISTA_FOTOS,
   DELETE_CLASE_INSPECCION_LISTA_FOTOS,
   FETCH_ERROR,
   FETCH_START,
   FETCH_SUCCESS,
   SHOW_MESSAGE,
} from '../../shared/constants/ActionTypes';
import jwtAxios from '../../@crema/services/auth/jwt-auth/jwt-api';

import {appIntl} from '../../@crema/utility/Utils';

export const onGetHeaders = (clase_inspeccion_id) => {
   const {messages} = appIntl();
   return (dispatch) => {
      dispatch({type: FETCH_START});
      jwtAxios.get('clases-inspeccion-lista-fotos/' + clase_inspeccion_id, {
         params: {
            headerInfo: true,
         },
      }).then((data) => {
         if (data.status === 200) {
            dispatch({type: FETCH_SUCCESS});
            dispatch({type: GET_HEADERS_CLASE_INSPECCION_LISTA_FOTOS, payload: data});
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
   clase_inspeccion_id,
) => {
   const { messages } = appIntl();
   const page = currentPage ? currentPage : 0;
   const ordenar_por = orderByToSend ? orderByToSend : '';
   const clase_inspeccion_id_Aux = clase_inspeccion_id ? clase_inspeccion_id : 0;

   return (dispatch) => {
      dispatch({type: FETCH_START});
      jwtAxios.get('clases-inspeccion-lista-fotos/' + clase_inspeccion_id, { 
         params: {
            page: page,
            limite: rowsPerPage,
            ordenar_por: ordenar_por,
            clase_inspeccion_id: clase_inspeccion_id_Aux,
         },
      }).then((data) => { 
         if (data.status === 200) {                      
            dispatch({type: FETCH_SUCCESS});
            dispatch({type: GET_COLECCION_CLASE_INSPECCION_LISTA_FOTOS, payload: data});
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
      jwtAxios.get('clases-inspeccion-lista-fotos', {
         params: {
            ligera: true, 
         }, 
      }).then((data) => { 
         if (data.status === 200) {                      
            dispatch({type: FETCH_SUCCESS});
            dispatch({type: GET_COLECCION_LIGERA_CLASE_INSPECCION_LISTA_FOTOS, payload: data});
         } else {
            dispatch({type: FETCH_ERROR, payload: messages['message.somethingWentWrong']});
         } 
      }).catch((error) => { 
         dispatch({type: FETCH_ERROR, payload: error.message}); 
      });
   };
};

export const onShow = (clase_inspeccion_id, id) => {
   const {messages} = appIntl();
   return (dispatch) => {
      if (id !== 0) {
         dispatch({type: FETCH_START});
         jwtAxios.get('clases-inspeccion-lista-fotos/'+clase_inspeccion_id+'/'+id)
            .then((data) => {
               if (data.status === 200) {
                  dispatch({type: FETCH_SUCCESS});
                  dispatch({type: SHOW_CLASE_INSPECCION_LISTA_FOTOS, payload: data.data});                           
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
      jwtAxios.post('clases-inspeccion-lista-fotos/'+params.clase_inspeccion_id, params)
         .then((data) => { 
            if (data.status === 201) {
               dispatch({type: FETCH_SUCCESS});
               dispatch({type: CREATE_CLASE_INSPECCION_LISTA_FOTOS, payload: data.data});
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
      jwtAxios.put('clases-inspeccion-lista-fotos/'+params.clase_inspeccion_id+'/'+params.id, params)
         .then((data) => { 
            if (data.status === 200) {                      
               dispatch({type: FETCH_SUCCESS});
               dispatch({type: UPDATE_CLASE_INSPECCION_LISTA_FOTOS, payload: data.data});
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
      jwtAxios.delete('clases-inspeccion-lista-fotos/'+id)
         .then((data) => { 
            if (data.status === 200) {                   
               dispatch({type: FETCH_SUCCESS});                      
               dispatch({
                  type: SHOW_MESSAGE, 
                  payload: [
                     data.data.mensajes[0], 
                     data.data.mensajes[1]], 
                  });                   
               dispatch({type: DELETE_CLASE_INSPECCION_LISTA_FOTOS, payload: data.data});                     
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

