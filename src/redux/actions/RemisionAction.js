import {
  GET_COLECCION_REMISION,
  GET_COLECCION_LIGERA_REMISION,
  SHOW_REMISION,
  UPDATE_REMISION,
  DELETE_REMISION,
  CREATE_REMISION,
  FETCH_ERROR,
  FETCH_START,
  FETCH_SUCCESS,
  SHOW_MESSAGE,
  CONFIRM_REMISION,
  UPDATING_CONTENT,
} from '../../shared/constants/ActionTypes';
import jwtAxios from '../../@crema/services/auth/jwt-auth/jwt-api';

import {appIntl} from '../../@crema/utility/Utils';

export const onGetColeccion = (
  currentPage,
  rowsPerPage,
  orderByToSend,
  numero,
  fecha,
  guia,
  cliente
) => {
  const {messages} = appIntl();
  const page = currentPage ? currentPage : 0;
  const ordenar_por = orderByToSend ? orderByToSend : '';

  return (dispatch) => {
    dispatch({type: FETCH_START});
    jwtAxios
      .get('remisiones', {
        params: {
          page: page,
          limite: rowsPerPage,
          numero: numero??'',
          fecha: fecha??'',
          guia: guia??'',
          cliente: cliente??'',
          ordenar_por: ordenar_por,
        },
      })
      .then((data) => {
        if (data.status === 200) {
          dispatch({type: FETCH_SUCCESS});
          dispatch({type: GET_COLECCION_REMISION, payload: data});
        } else {
          dispatch({
            type: FETCH_ERROR,
            payload: messages['message.somethingWentWrong'],
          });
        }
      })
      .catch((error) => {
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const onGetColeccionSellos = (
  currentPage,
  rowsPerPage,
  orderByToSend,
  numero,
  user_envio_id,
  lugar_envio_id,
  serieI,
  serieF,
  soloSeleccionados,
  numeroPedido,
  cliente_destino_id
) => {
  const {messages} = appIntl();
  const page = currentPage ? currentPage : 0;
  const ordenar_por = orderByToSend ? orderByToSend : '';

  return (dispatch) => {
    dispatch({type: FETCH_START});
    jwtAxios
      .get('remisiones', {
        params: {
          page: page,
          sellos: true,
          limite: rowsPerPage,
          numero_remision: numero??'',
          user_envio_id: user_envio_id??'',
          lugar_envio_id: lugar_envio_id??'',
          serial_inicial: serieI??'',
          serial_final: serieF??'',
          soloSeleccionados: soloSeleccionados?1:0,
          numero_pedido: numeroPedido??'',
          cliente_destino_id: cliente_destino_id??0,
          ordenar_por: ordenar_por,
        },
      })
      .then((data) => {
        if (data.status === 200) {
          dispatch({type: FETCH_SUCCESS});
          dispatch({type: GET_COLECCION_REMISION, payload: data});
        } else {
          dispatch({
            type: FETCH_ERROR,
            payload: messages['message.somethingWentWrong'],
          });
        }
      })
      .catch((error) => {
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const onGetColeccionSellosRemisionados = (
  currentPage,
  rowsPerPage,
  orderByToSend,
  numero,
  user_envio_id,
  lugar_envio_id,
  serieI,
  serieF,
  soloSeleccionados,
  numeroPedido,
  cliente_destino_id
) => {
  const {messages} = appIntl();
  const page = currentPage ? currentPage : 0;
  const ordenar_por = orderByToSend ? orderByToSend : '';

  return (dispatch) => {
    dispatch({type: FETCH_START});
    jwtAxios
      .get('remisiones', {
        params: {
          page: page,
          sellos: true,
          remisionados: true,
          limite: rowsPerPage,
          numero_remision: numero??'',
          user_envio_id: user_envio_id??'',
          lugar_envio_id: lugar_envio_id??'',
          serial_inicial: serieI??'',
          serial_final: serieF??'',
          soloSeleccionados: soloSeleccionados?1:0,
          numero_pedido: numeroPedido??'',
          cliente_destino_id: cliente_destino_id??0,
          ordenar_por: ordenar_por,
        },
      })
      .then((data) => {
        if (data.status === 200) {
          dispatch({type: FETCH_SUCCESS});
          dispatch({type: GET_COLECCION_REMISION, payload: data});
        } else {
          dispatch({
            type: FETCH_ERROR,
            payload: messages['message.somethingWentWrong'],
          });
        }
      })
      .catch((error) => {
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const onGetColeccionLigera = () => {
  const {messages} = appIntl();
  return (dispatch) => {
    dispatch({type: FETCH_START});
    jwtAxios
      .get('remisiones', {
        params: {
          ligera: true,
        },
      })
      .then((data) => {
        if (data.status === 200) {
          dispatch({type: FETCH_SUCCESS});
          dispatch({type: GET_COLECCION_LIGERA_REMISION, payload: data});
        } else {
          dispatch({
            type: FETCH_ERROR,
            payload: messages['message.somethingWentWrong'],
          });
        }
      })
      .catch((error) => {
        dispatch({type: FETCH_ERROR, payload: error.message});
      });
  };
};

export const onShow = (id) => {
  const {messages} = appIntl();
  return (dispatch) => {
    if (id !== 0) {
      dispatch({type: FETCH_START});
      jwtAxios
        .get('remisiones/' + id)
        .then((data) => {
          if (data.status === 200) {
            dispatch({type: FETCH_SUCCESS});
            dispatch({type: SHOW_REMISION, payload: data.data});
          } else {
            dispatch({
              type: FETCH_ERROR,
              payload: messages['message.somethingWentWrong'],
            });
          }
        })
        .catch((error) => {
          dispatch({type: FETCH_ERROR, payload: error.message});
        });
    }
  };
};

export const onUpdate = (params, handleOnClose) => {
  return (dispatch) => {
    dispatch({type: FETCH_START});
    jwtAxios
      .put('remisiones/' + params.id, params)
      .then((data) => {
        if (data.status === 200) {
          dispatch({type: FETCH_SUCCESS});
          dispatch({
            type: UPDATE_REMISION,
            payload: data.data,
          });
          handleOnClose();
          dispatch({
            type: SHOW_MESSAGE,
            payload: [data.data.mensajes[0], data.data.mensajes[1]],
          });
        } else {
          dispatch({
            type: FETCH_ERROR,
            payload: data.data.mensajes[0],
          });
        }
      })
      .catch((error) => {
        dispatch({type: FETCH_ERROR, payload: error.response.data.mensajes[0]});
      });
  };
};

export const onConfirmOrReject = (id, params, callback) => {
  return (dispatch) => {
    dispatch({type: FETCH_START});
    dispatch({type: UPDATING_CONTENT});
    jwtAxios
      .post('remisiones/'+id, params)
      .then((data) => {
        if (data.status === 200) {
          dispatch({type: FETCH_SUCCESS});
          dispatch({
            type: SHOW_MESSAGE,
            payload: [data.data.mensajes[0], data.data.mensajes[1]],
          });
          if(params.action === 'Reject'){
            callback();
          }
          dispatch({type: CONFIRM_REMISION, payload: data.data});
        } else {
          dispatch({type: FETCH_ERROR, payload: data.data.mensajes[0]});
        }
      })
      .catch((error) => {
        if (error.response.data.mensajes) {
          dispatch({
            type: FETCH_ERROR,
            payload: error.response.data.mensajes[0],
          });
        } else {
          dispatch({type: FETCH_ERROR, payload: error.message});
        }
      });
  };
};
export const onDelete = (id, params) => {
  return (dispatch) => {
    dispatch({type: FETCH_START});
    jwtAxios
      .put('remisiones/anular/' + id, params)
      .then((data) => {
        if (data.status === 200) {
          dispatch({type: FETCH_SUCCESS});
          dispatch({
            type: SHOW_MESSAGE,
            payload: [data.data.mensajes[0], data.data.mensajes[1]],
          });
          dispatch({type: DELETE_REMISION, payload: data.data});
        } else {
          dispatch({type: FETCH_ERROR, payload: data.data.mensajes[0]});
        }
      })
      .catch((error) => {
        if (error.response.data.mensajes) {
          dispatch({
            type: FETCH_ERROR,
            payload: error.response.data.mensajes[0],
          });
        } else {
          dispatch({type: FETCH_ERROR, payload: error.message});
        }
      });
  };
};

export const onCreate = (params, callback) => {
  return (dispatch) => {
    dispatch({type: FETCH_START});
    jwtAxios
      .post('remisiones', params)
      .then((data) => {
        if (data.status === 201) {
          dispatch({type: FETCH_SUCCESS});
          dispatch({
            type: CREATE_REMISION,
            payload: data.data,
          });
          dispatch({
            type: SHOW_MESSAGE,
            payload: [data.data.mensajes[0], data.data.mensajes[1]],
          });
          callback();
        } else {
          dispatch({type: FETCH_ERROR, payload: data.data.mensajes[0]});
        }
      })
      .catch((error) => {
        dispatch({type: FETCH_ERROR, payload: error.response.data.mensajes[0]});
      });
  };
};

export const toogleRemisionDetalle = (params, callback) => {
  return (dispatch) => {
    dispatch({type: FETCH_START});
    jwtAxios
      .post('remisiones-detalle', params)
      .then((data) => {
        if (data.status === 201) {
          dispatch({type: FETCH_SUCCESS});
          callback();
          dispatch({
            type: SHOW_MESSAGE,
            payload: [data.data.mensajes[0], data.data.mensajes[1]],
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

export const toogleRemisionarTodos = (params, callback) => {
  return (dispatch) => {
    dispatch({type: FETCH_START});
    jwtAxios
      .post('remisiones-detalle/todos', params)
      .then((data) => {
        if (data.status === 201) {
          dispatch({type: FETCH_SUCCESS});
          callback();
          dispatch({
            type: SHOW_MESSAGE,
            payload: [data.data.mensajes[0], data.data.mensajes[1]],
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

export const unSelect = () => {
  return (dispatch) => {
    dispatch({type: 'UNSELECTREMISION'});
  }
}