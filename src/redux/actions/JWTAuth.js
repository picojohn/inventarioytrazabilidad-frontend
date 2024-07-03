import {
  FETCH_START,
  FETCH_ERROR,
  SHOW_MESSAGE,
  FETCH_SUCCESS,
  SET_AUTH_TOKEN,
  SIGNOUT_AUTH_SUCCESS,
  UPDATE_AUTH_USER,
} from '../../shared/constants/ActionTypes';
import jwtAxios from '../../@crema/services/auth/jwt-auth/jwt-api';
import {fetchError, fetchStart, fetchSuccess} from './Common';
import {AuthType} from '../../shared/constants/AppEnums';

export const onJwtUserSignUp = ({email, password, name}) => {
  return async (dispatch) => {
    dispatch(fetchStart());
    const body = {email, name, password};
    try {
      const res = await jwtAxios.post('users', body);
      localStorage.setItem('token', res.data.token);
      dispatch(setJWTToken(res.data.token));
      dispatch(loadJWTUser());
    } catch (err) {
      console.log('error!!!!', err.response.data.error);
      dispatch(fetchError(err.response.data.error));
    }
  };
};

export const onJwtSignIn = ({username, password, latitud, longitud}) => {
  return async (dispatch) => {
    dispatch(fetchStart());
    const body = {username, password, latitud, longitud};
    try {
      const res = await jwtAxios.post('users/token', body);
      localStorage.setItem('token', res.data.access_token);
      dispatch(setJWTToken(res.data.access_token));
      dispatch(loadJWTUser());
    } catch (err) {
      dispatch(fetchError(err.response.data.messages));
    }
  };
};

export const loadJWTUser = () => {
  return async (dispatch) => {
    dispatch(fetchStart());
    try {
      const res = await jwtAxios.get('users/current/session');
      dispatch(fetchSuccess());
      dispatch({
        type: UPDATE_AUTH_USER,
        payload: {
          authType: AuthType.JWT_AUTH,
          email: res.data.usuario.email,
          role: 'user',
          token: res.data.usuario._id,
          photoURL: res.data.usuario.avatar,
          id: res.data.usuario.id,
          displayName: res.data.usuario.nombre,
          correo_electronico: res.data.usuario.correo_electronico,
          identificacion_usuario: res.data.usuario.identificacion_usuario,
          rol: res.data.usuario.rol,
          permisos: res.data.usuario.permisos,
          asociado: res.data.usuario.asociado
        },
      });
    } catch (err) {
      console.log('error!!!!', err.response.error);
      dispatch(fetchError(err.response.error));
    }
  };
};

export const setJWTToken = (token) => {
  return async (dispatch) => {
    dispatch({
      type: SET_AUTH_TOKEN,
      payload: token,
    });
  };
};

export const onResetCognitoPassword = (email, history) => {
  return (dispatch) => {
    const params = {email: email};
    dispatch({type: FETCH_START});
    jwtAxios
      .post('forgot-password', params)
      .then((data) => {
        if (data) {
          dispatch({type: FETCH_SUCCESS});
          dispatch({
            type: SHOW_MESSAGE,
            payload: data.data.mensajes,
          });
          // history.push('/reset-password', {email: email});
          history.push('/signin');
        } else {
          dispatch({type: FETCH_ERROR, payload: data.mensajes});
        }
      })
      .catch(function (error) {
        dispatch({type: FETCH_ERROR, payload: error.response.data.mensajes[0]});
      });
  };
};

export const onJWTAuthSignout = () => {
  return (dispatch) => {
    dispatch({type: FETCH_START});
    setTimeout(() => {
      dispatch({type: SIGNOUT_AUTH_SUCCESS});
      dispatch({type: FETCH_SUCCESS});
      localStorage.removeItem('token');
    }, 500);
  };
};
