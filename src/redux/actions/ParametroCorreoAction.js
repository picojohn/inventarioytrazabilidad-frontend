import {  GET_COLECCION_PARAMETRO_CORREO,
          GET_COLECCION_LIGERA_PARAMETRO_CORREO,
          SHOW_PARAMETRO_CORREO,
          UPDATE_PARAMETRO_CORREO,
          DELETE_PARAMETRO_CORREO,
          CREATE_PARAMETRO_CORREO,
          FETCH_ERROR,
          FETCH_START,
          FETCH_SUCCESS,
          SHOW_MESSAGE,
        } from '../../shared/constants/ActionTypes';
import jwtAxios from '../../@crema/services/auth/jwt-auth/jwt-api';

import {appIntl} from '../../@crema/utility/Utils';

export const onGetColeccion = (
  currentPage,
  rowsPerPage,
  nombre,
  asunto,
  orderByToSend,
) => {
  const {messages} = appIntl();
  const page = currentPage ? currentPage : 0;
  const nombreAux = nombre ? nombre : '';
  const asuntoAux = asunto ? asunto : '';
  const ordenar_por = orderByToSend ? orderByToSend : '';

  return (dispatch) => {
    dispatch({ type: FETCH_START });
    jwtAxios
      .get('parametros-correo', { params: { page: page,
                                            limite: rowsPerPage,
                                            nombre: nombreAux,
                                            asunto: asuntoAux,
                                            ordenar_por: ordenar_por,
                                          },
                                })
      .then((data) => { if (data.status === 200) {
                           dispatch({ type: FETCH_SUCCESS });
                           dispatch({ type: GET_COLECCION_PARAMETRO_CORREO, payload: data });
                          } 
                        else 
                           dispatch({ type: FETCH_ERROR, payload: messages['message.somethingWentWrong'], });
                      })
      .catch((error) => { dispatch({ type: FETCH_ERROR, payload: error.message }); });
  };
};

export const onGetColeccionLigera = () => {
  const {messages} = appIntl();
  return (dispatch) => {
    dispatch({ type: FETCH_START });
    jwtAxios
      .get('parametros-correo', { params: { ligera: true, }, })
      .then((data) => { if (data.status === 200) {
                           dispatch({ type: FETCH_SUCCESS });
                           dispatch({ type: GET_COLECCION_LIGERA_PARAMETRO_CORREO, payload: data });
                          } 
                        else 
                           dispatch({ type: FETCH_ERROR, payload: messages['message.somethingWentWrong'], });
                      })
      .catch((error) => { dispatch({ type: FETCH_ERROR, payload: error.message }); });
  };
};

export const onShow = (id) => {
  const {messages} = appIntl();
  return (dispatch) => {
    if (id !== 0) {
      dispatch({ type: FETCH_START });
      jwtAxios
        .get('parametros-correo/' + id)
        .then((data) => { if (data.status === 200) {
                             dispatch({ type: FETCH_SUCCESS });
                             dispatch({ type: SHOW_PARAMETRO_CORREO, payload: data.data });
                            } 
                          else 
                             dispatch({ type: FETCH_ERROR, payload: messages['message.somethingWentWrong'], });
                        })
        .catch((error) => { dispatch({ type: FETCH_ERROR, payload: error.message }); });
    }
  };
};

export const onUpdate = (params, handleOnClose, updateColeccion) => {
  return (dispatch) => {
    dispatch({ type: FETCH_START });
    jwtAxios
      .put('parametros-correo/' + params.id, params)
      .then((data) => { if (data.status === 200) {
                           dispatch({ type: FETCH_SUCCESS });
                           dispatch({ type: UPDATE_PARAMETRO_CORREO, payload: data.data, });
                           updateColeccion();
                           handleOnClose();
                           dispatch({ type: SHOW_MESSAGE, payload: [data.data.mensajes[0], data.data.mensajes[1]], });
                          } 
                        else 
                           dispatch({ type: FETCH_ERROR, payload: data.data.mensajes[0], });
                      })
      .catch((error) => { dispatch({ type: FETCH_ERROR, payload: error.response.data.mensajes[0] }); });
  };
};

export const onDelete = (id) => {
  return (dispatch) => {
    dispatch({ type: FETCH_START });
    jwtAxios
      .delete('parametros-correo/' + id)
      .then((data) => { if (data.status === 200) {
                           dispatch({ type: FETCH_SUCCESS });
                           dispatch({ type: SHOW_MESSAGE, payload: [data.data.mensajes[0], data.data.mensajes[1]], });
                           dispatch({ type: DELETE_PARAMETRO_CORREO, payload: data.data });
                          } 
                        else 
                           dispatch({ type: FETCH_ERROR, payload: data.data.mensajes[0] });
                      })
      .catch((error) => { if (error.response.data.mensajes) 
                             dispatch({ type: FETCH_ERROR, payload: error.response.data.mensajes[0], });
                          else 
                             dispatch({ type: FETCH_ERROR, payload: error.message });
                        });
  };
};

export const onCreate = (params, handleOnClose, updateColeccion) => {
  return (dispatch) => {
    dispatch({ type: FETCH_START });
    jwtAxios
      .post('parametros-correo', params)
      .then((data) => { if (data.status === 201) {
                           dispatch({ type: FETCH_SUCCESS });
                           dispatch({ type: CREATE_PARAMETRO_CORREO, payload: data.data, });
                           updateColeccion();
                           handleOnClose();
                           dispatch({ type: SHOW_MESSAGE, payload: [data.data.mensajes[0], data.data.mensajes[1]], });
                          } 
                        else 
                           dispatch({ type: FETCH_ERROR, payload: data.data.mensajes[0] });
                      })
      .catch((error) => { dispatch({ type: FETCH_ERROR, payload: error.response.data.mensajes[0] }); });
  };
};
