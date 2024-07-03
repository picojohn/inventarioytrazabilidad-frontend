import {
  GET_COLECCION_SELLO,
  GET_COLECCION_ORDEN_LECTURA,
  GET_COLECCION_SELLO_CONSULTA,
  // SHOW_KIT,
  // UPDATE_KIT,
  DELETE_SELLO,
  READ_SELLO,
  READ_SELLO_INDIVIDUAL,
  FETCH_ERROR,
  FETCH_START,
  FETCH_SUCCESS,
  SHOW_MESSAGE,
  GET_COLECCION_INVENTARIO,
  GET_COLECCION_INVENTARIO_LUGAR,
  GET_COLECCION_BITACORA,
  SHOW_BITACORA,
  READ_FOR_INSTALL_SELLO,
  GET_COLECCION_INSTALACION,
  UPDATING_CONTENT,
  GET_COLECCION_ACTULIZACION,
  GET_DATA_PARA_CONSULTA_IPP,
  GET_DATA_PARA_CONSULTA_ILP,
  GET_DATA_PARA_CONSULTA_EPL,
} from '../../shared/constants/ActionTypes';
import jwtAxios from '../../@crema/services/auth/jwt-auth/jwt-api';

import {appIntl} from '../../@crema/utility/Utils';

export const onGetColeccion = (
  currentPage,
  rowsPerPage,
  orderByToSend,
  numero_pedido,
  serial,
) => {
  const {messages} = appIntl();
  const page = currentPage ? currentPage : 0;
  const serialAux = serial??'';
  const numeroPedidoAux = numero_pedido??'';
  const ordenar_por = orderByToSend ? orderByToSend : '';

  return (dispatch) => {
    // dispatch({type: FETCH_START});
    jwtAxios
      .get('sellos/'+numeroPedidoAux, {
        params: {
          page: page,
          limite: rowsPerPage,
          serial: serialAux,
          ordenar_por: ordenar_por,
        },
      })
      .then((data) => {
        if (data.status === 200) {
          dispatch({type: FETCH_SUCCESS});
          dispatch({type: GET_COLECCION_SELLO, payload: data});
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

export const onGetOrdenLectura = (numeroPedido, kitId) => {
  const {messages} = appIntl();
  return (dispatch) => {
    dispatch({type: FETCH_START});
    jwtAxios
      .get('sellos/'+numeroPedido, {
        params: {
          ligera: true,
          kit_id: kitId??''
        },
      })
      .then((data) => {
        if (data.status === 200) {
          dispatch({type: FETCH_SUCCESS});
          dispatch({type: GET_COLECCION_ORDEN_LECTURA, payload: data});
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

// export const onShow = (id) => {
//   const {messages} = appIntl();
//   return (dispatch) => {
//     if (id !== 0) {
//       dispatch({type: FETCH_START});
//       jwtAxios
//         .get('kits/' + id)
//         .then((data) => {
//           if (data.status === 200) {
//             dispatch({type: FETCH_SUCCESS});
//             dispatch({type: SHOW_KIT, payload: data.data});
//           } else {
//             dispatch({
//               type: FETCH_ERROR,
//               payload: messages['message.somethingWentWrong'],
//             });
//           }
//         })
//         .catch((error) => {
//           dispatch({type: FETCH_ERROR, payload: error.message});
//         });
//     }
//   };
// };

// export const onUpdate = (params, handleOnClose, updateColeccion) => {
//   return (dispatch) => {
//     dispatch({type: FETCH_START});
//     jwtAxios
//       .put('kits/' + params.id, params)
//       .then((data) => {
//         if (data.status === 200) {
//           dispatch({type: FETCH_SUCCESS});
//           dispatch({
//             type: UPDATE_KIT,
//             payload: data.data,
//           });
//           updateColeccion();
//           handleOnClose();
//           dispatch({
//             type: SHOW_MESSAGE,
//             payload: [data.data.mensajes[0], data.data.mensajes[1]],
//           });
//         } else {
//           dispatch({
//             type: FETCH_ERROR,
//             payload: data.data.mensajes[0],
//           });
//         }
//       })
//       .catch((error) => {
//         dispatch({type: FETCH_ERROR, payload: error.response.data.mensajes[0]});
//       });
//   };
// };

export const onDelete = (id) => {
  return (dispatch) => {
    dispatch({type: FETCH_START});
    jwtAxios
      .delete('sellos/' + id)
      .then((data) => {
        if (data.status === 200) {
          dispatch({type: FETCH_SUCCESS});
          dispatch({
            type: SHOW_MESSAGE,
            payload: [data.data.mensajes[0], data.data.mensajes[1]],
          });
          dispatch({type: DELETE_SELLO, payload: data.data});
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

export const onRead = (params, updateColeccion, resetForm, voiceNot) => {
  return (dispatch) => {
    dispatch({type: FETCH_START});
    jwtAxios
      .post('sellos', params)
      .then((data) => {
        if (data.status === 201) {
          dispatch({type: FETCH_SUCCESS});
          dispatch({
            type: READ_SELLO_INDIVIDUAL,
            payload: data.data,
          });
          updateColeccion();
          resetForm();
          dispatch({
            type: SHOW_MESSAGE,
            payload: [data.data.mensajes[0], data.data.mensajes[1]],
          });
          voiceNot(data.data.mensajes[0]);
        } else {
          dispatch({type: FETCH_ERROR, payload: data.data.mensajes[0]});
        }
      })
      .catch((error) => {
        dispatch({type: FETCH_ERROR, payload: error.response.data.mensajes[0]});
      });
  };
};

export const onReadKitInitial = (params, resetForm) => {
  return (dispatch) => {
    dispatch({type: FETCH_START});
    jwtAxios
      .post('sellos', params)
      .then((data) => {
        if (data.status === 200) {
          dispatch({type: FETCH_SUCCESS});
          dispatch({
            type: READ_SELLO,
            payload: data.data,
          });
          resetForm();
          setTimeout(() => {
            dispatch({type: 'UNREAD'});
          },500)
        } else {
          dispatch({type: FETCH_ERROR, payload: data.data.mensajes[0]});
        }
      })
      .catch((error) => {
        dispatch({type: FETCH_ERROR, payload: error.response.data.mensajes[0]});
      });
  };
};

export const onReadKit = (params, resetForm, updateColeccion, voiceNot) => {
  return (dispatch) => {
    dispatch({type: FETCH_START});
    jwtAxios
      .post('sellos', {
        tipo: 'K',
        total: true,
        data: [
          ...params
        ]
      })
      .then((data) => {
        if (data.status === 201) {
          dispatch({type: FETCH_SUCCESS});
          dispatch({
            type: READ_SELLO_INDIVIDUAL,
            payload: data.data,
          });
          resetForm();
          updateColeccion();
          dispatch({
            type: SHOW_MESSAGE,
            payload: [data.data.mensajes[0], data.data.mensajes[1]],
          });
          voiceNot(data.data.mensajes[0]);
        } else {
          dispatch({type: FETCH_ERROR, payload: data.data.mensajes[0]});
        }
      })
      .catch((error) => {
        dispatch({type: FETCH_ERROR, payload: error.response.data.mensajes[0]});
      });
  };
};

export const onImport = (params, setActiveStep, setRows,usuario) => {
  return (dispatch) => {
    var formData = new FormData();
    formData.append('archivo', params['archivo']);
    formData.append('usuario', usuario);
    dispatch({type: FETCH_START});
    jwtAxios
      .post('sellos/importar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((data) => {
        if (data.status === 201) {
          dispatch({type: FETCH_SUCCESS});
          setRows(data.data.datos);
          setActiveStep(1);
          dispatch({
            type: SHOW_MESSAGE,
            payload: data.data.mensajes[0],
          });
        } else {
          dispatch({
            type: FETCH_ERROR,
            payload: data.data.mensajes[0],
          });
        }
      })
      .catch((error) => {
        try {
          dispatch({
            type: FETCH_ERROR,
            payload: error.response.data.mensajes[0],
          });
        } catch {
          try {
            dispatch({
              type: FETCH_ERROR,
              payload: error,
            });
          } catch {
            dispatch({
              type: FETCH_ERROR,
              payload: 'Error',
            });
          }
        }
      });
  };
};

export const onConsulta = (
  currentPage,
  rowsPerPage,
  lugar,
  orderByToSend,
  usuario,
  cliente
) => {
  const {messages} = appIntl();
  const page = currentPage ? currentPage : 0;
  const lugarAux = lugar??'';
  const usuarioAux = usuario??'';
  const ordenar_por = orderByToSend ? orderByToSend : '';

  return (dispatch) => {
    // dispatch({type: FETCH_START});
    jwtAxios
      .get('sellos/consulta-inventario', {
        params: {
          page: page,
          limite: rowsPerPage,
          lugar: lugarAux,
          cliente: cliente??'',
          usuario: usuarioAux,
          ordenar_por: ordenar_por,
        },
      })
      .then((data) => {
        if (data.status === 200) {
          dispatch({type: FETCH_SUCCESS});
          dispatch({type: GET_COLECCION_SELLO_CONSULTA, payload: data});
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

export const onGetInventario = (
  currentPage,
  rowsPerPage,
  orderByToSend,
  lugar,
  cliente
) => {
  const {messages} = appIntl();
  return (dispatch) => {
    // dispatch({type: FETCH_START});
    jwtAxios
      .get('inventario', {
        params: {
          page: currentPage??0,
          limite: rowsPerPage,
          lugar: lugar??'',
          cliente: cliente??'',
          ordenar_por: orderByToSend??'',
        },
      })
      .then((data) => {
        if (data.status === 200) {
          dispatch({type: FETCH_SUCCESS});
          dispatch({type: GET_COLECCION_INVENTARIO, payload: data});
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

export const onGetInventarioLugar = (
  currentPage,
  rowsPerPage,
  orderByToSend,
  lugar,
  producto_kit,
  tipo
) => {
  const {messages} = appIntl();
  return (dispatch) => {
    // dispatch({type: FETCH_START});
    jwtAxios
      .get('inventario/lugar', {
        params: {
          page: currentPage??0,
          limite: rowsPerPage,
          lugar: lugar??'',
          producto_kit: producto_kit??'',
          tipo: tipo??'',
          ordenar_por: orderByToSend??'',
        },
      })
      .then((data) => {
        if (data.status === 200) {
          dispatch({type: FETCH_SUCCESS});
          dispatch({type: GET_COLECCION_INVENTARIO_LUGAR, payload: data});
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

export const onGetBitacora = (
  currentPage,
  rowsPerPage,
  orderByToSend,
  fechaInicial,
  fechaFinal,
  evento,
  serial,
  contenedor,
  documentoRef,
  lugar,
  usuario,
  operacionEmbarque,
  cliente
) => {
  const {messages} = appIntl();
  return (dispatch) => {
    // dispatch({type: FETCH_START});
    jwtAxios
      .get('sellos-bitacora', {
        params: {
          page: currentPage??0,
          limite: rowsPerPage,
          fechaInicial: fechaInicial??'',
          fechaFinal: fechaFinal??'',
          evento: evento??'',
          serial: serial??'',
          contenedor: contenedor??'',
          documentoRef: documentoRef??'',
          lugar: lugar??'',
          cliente: cliente??'',
          usuario: usuario??'',
          ordenar_por: orderByToSend??'',
          operacionEmbarque: operacionEmbarque??''
        },
      })
      .then((data) => {
        if (data.status === 200) {
          dispatch({type: FETCH_SUCCESS});
          dispatch({type: GET_COLECCION_BITACORA, payload: data});
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
        .get('sellos-bitacora/' + id)
        .then((data) => {
          if (data.status === 200) {
            dispatch({type: FETCH_SUCCESS});
            dispatch({type: SHOW_BITACORA, payload: data.data});
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

export const onLeaveBitacora = () => {
  return (dispatch) => {
    dispatch({type: 'RESETBITACORA'})
  }
}

export const onReadForInstall = (
  params, 
  // callback
  ) => {
  return (dispatch) => {
    dispatch({type: FETCH_START});
    jwtAxios
      .post('instalar-sellos/leer', params)
      .then((data) => {
        if (data.status === 200) {
          dispatch({type: FETCH_SUCCESS});
          dispatch({
            type: READ_FOR_INSTALL_SELLO,
            payload: data.data,
          });
          // callback();
          setTimeout(() => {
            dispatch({type: 'UNREAD'});
          },500)
        } else {
          dispatch({type: FETCH_ERROR, payload: data.data.mensajes[0]});
        }
      })
      .catch((error) => {
        dispatch({type: FETCH_ERROR, payload: error.response.data.mensajes[0]});
      });
  };
};

export const onInstall = (params, resetForm, resetSeals) => {
  return (dispatch) => {
    const formData = new FormData();
    for(let i = 0; i < params['evidencias'].length; i++){
      formData.append('evidencias[]', params['evidencias'][i]);
    }
    formData.append('rows', JSON.stringify(params['rows']));
    formData.append('cliente_id', params['cliente_id']);
    formData.append('operacion_embarque_id', params['operacion_embarque_id']);
    formData.append('contenedor_id', params['contenedor_id']);
    formData.append('documento_referencia', params['documento_referencia']);
    formData.append('lugar_instalacion_id', params['lugar_instalacion_id']);
    formData.append('zona_instalacion_id',params['zona_instalacion_id']);
    dispatch({type: FETCH_START});
    dispatch({type: UPDATING_CONTENT});
    jwtAxios
      .post('instalar-sellos/instalar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((data) => {
        if (data.status === 201) {
          dispatch({type: FETCH_SUCCESS});
          resetForm();
          resetSeals();
          dispatch(onGetColeccionInstalacion());
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

export const onGetColeccionInstalacion = (producto_id) => {
  const {messages} = appIntl();
  return (dispatch) => {
    dispatch({type: FETCH_START});
    jwtAxios
      .get('instalar-sellos', {
        params: {
          producto_id: producto_id??'',
        },
      })
      .then((data) => {
        if (data.status === 200) {
          dispatch({type: FETCH_SUCCESS});
          dispatch({type: GET_COLECCION_INSTALACION, payload: data});
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

export const onGetRandomSeal = (producto_id) => {
  const {messages} = appIntl();
  return (dispatch) => {
    dispatch({type: FETCH_START});
    jwtAxios
      .get('instalar-sellos', {
        params: {
          automatico: true,
          producto_id: producto_id??'',
        },
      })
      .then((data) => {
        if (data.status === 200) {
          dispatch({type: FETCH_SUCCESS});
          dispatch({
            type: READ_FOR_INSTALL_SELLO,
            payload: data.data,
          });
        } else {
          dispatch({
            type: FETCH_ERROR,
            payload: messages['message.somethingWentWrong'],
          });
        }
      })
      .catch((error) => {
        dispatch({type: FETCH_ERROR, payload: error.response.data.mensajes[0]});
      });
  };
};

export const onGetColeccionActualizacion = (
  currentPage,
  rowsPerPage,
  orderByToSend,
  serial,
  contenedor,
  documentoRef,
  lugar,
  usuario,
  operacionEmbarque,
  cliente
) => {
  const {messages} = appIntl();
  return (dispatch) => {
    // dispatch({type: FETCH_START});
    jwtAxios
      .get('actualizar-estado', {
        params: {
          page: currentPage??0,
          limite: rowsPerPage,
          serial: serial??'',
          contenedor: contenedor??'',
          documentoRef: documentoRef??'',
          lugar: lugar??'',
          cliente: cliente??'',
          usuario: usuario??'',
          operacionEmbarque: operacionEmbarque??'',
          ordenar_por: orderByToSend??'',
        },
      })
      .then((data) => {
        if (data.status === 200) {
          dispatch({type: FETCH_SUCCESS});
          dispatch({type: GET_COLECCION_ACTULIZACION, payload: data});
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

export const onActualizarEstado = (params, updateColeccion, handleOnClose) => {
  return (dispatch) => {
    dispatch({type: FETCH_START});
    jwtAxios
      .post('actualizar-estado', params)
      .then((data) => {
        if (data.status === 201) {
          dispatch({type: FETCH_SUCCESS});
          updateColeccion();
          handleOnClose();
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

export const onGetDataForConsulta = (tipo, fechaInicial, fechaFinal, cliente) => {
  const {messages} = appIntl();
  return (dispatch) => {
    dispatch({type: FETCH_START});
    jwtAxios
      .get('sellos-bitacora/consulta-totales', {
        params: {
          tipo: tipo??'',
          fechaInicial: fechaInicial??'',
          fechaFinal: fechaFinal??'',
          cliente: cliente??''
        },
      })
      .then((data) => {
        if (data.status === 200) {
          dispatch({type: FETCH_SUCCESS});
          switch (tipo) {
            case 'ipp':
              dispatch({
                type: GET_DATA_PARA_CONSULTA_IPP,
                payload: data.data,
              });
              break;
            case 'ilp':
              dispatch({
                type: GET_DATA_PARA_CONSULTA_ILP,
                payload: data.data,
              });
              break;
            case 'epl':
              dispatch({
                type: GET_DATA_PARA_CONSULTA_EPL,
                payload: data.data,
              });
              break;
            default:
              break;
          }
        } else {
          dispatch({
            type: FETCH_ERROR,
            payload: messages['message.somethingWentWrong'],
          });
        }
      })
      .catch((error) => {
        dispatch({type: FETCH_ERROR, payload: error.response.data.mensajes[0]});
      });
  };
};