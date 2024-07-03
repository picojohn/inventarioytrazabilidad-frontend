import {
  GET_COLECCION_CONSULTA_AUDITORIA,
  FETCH_ERROR,
  FETCH_START,
  FETCH_SUCCESS,
} from '../../shared/constants/ActionTypes';
import jwtAxios from '../../@crema/services/auth/jwt-auth/jwt-api';

import {appIntl} from '../../@crema/utility/Utils';

export const onGetColeccion = (
  currentPage,
  rowsPerPage,
  orderByToSend,
  nombre_recurso,
  descripcion_recurso,
  fecha_desde,
  fecha_hasta,
  accion,
) => {
  const {messages} = appIntl();
  const page = currentPage ? currentPage : 0;
  const ordenar_por = orderByToSend ? orderByToSend : '';
  const nombre_recursoAux = nombre_recurso ? nombre_recurso : '';
  const descripcion_recursoAux = descripcion_recurso ? descripcion_recurso : '';
  const fecha_desdeAux = fecha_desde ? fecha_desde : '';
  const fecha_hastaAux = fecha_hasta ? fecha_hasta : '';
  const accionAux = accion ? accion : '';

  return (dispatch) => {
    dispatch({type: FETCH_START});
    jwtAxios
      .get('auditoria-tablas', {
        params: {
          page: page,
          limite: rowsPerPage,
          ordenar_por: ordenar_por,
          nombre_recurso: nombre_recursoAux,
          descripcion_recurso: descripcion_recursoAux,
          fecha_desde: fecha_desdeAux,
          fecha_hasta: fecha_hastaAux,
          accion: accionAux,
        },
      })
      .then((data) => {
        if (data.status === 200) {
          dispatch({type: FETCH_SUCCESS});
          dispatch({type: GET_COLECCION_CONSULTA_AUDITORIA, payload: data});
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
