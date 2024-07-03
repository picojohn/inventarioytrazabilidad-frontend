import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import {Auth as awsAuth, Hub} from 'aws-amplify';
import {UPDATE_AUTH_USER} from '../../shared/constants/ActionTypes';
import {auth as firebaseAuth} from '../services/auth/firebase/firebase';
import {fetchStart, fetchSuccess, setJWTToken} from '../../redux/actions';
import {AuthType} from '../../shared/constants/AppEnums';
import {defaultUser} from '../../shared/constants/AppConst';
import jwtAxios from '../services/auth/jwt-auth/jwt-api';

export const useAuthToken = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const {user} = useSelector(({auth}) => auth);

  useEffect(() => {
    const awsAuthUser = () =>
      new Promise((resolve) => {
        awsAuth
          .currentAuthenticatedUser()
          .then((user) => {
            resolve();
            if (user) {
              dispatch({
                type: UPDATE_AUTH_USER,
                payload: {
                  authType: AuthType.AWS_COGNITO,
                  uid: user.username,
                  displayName: user.attributes.name,
                  email: user.attributes.email,
                  role: defaultUser.role,
                  photoURL: user.photoURL,
                  token: user.signInUserSession.accessToken.jwtToken,
                },
              });
            }
          })
          .catch(function (error) {
            resolve();
          });
        return Promise.resolve();
      });

    const firebaseCheck = () =>
      new Promise((resolve) => {
        firebaseAuth.onAuthStateChanged((authUser) => {
          if (authUser) {
            dispatch({
              type: UPDATE_AUTH_USER,
              payload: {
                authType: AuthType.FIREBASE,
                uid: authUser.uid,
                displayName: authUser.displayName,
                email: authUser.email,
                role: defaultUser.role,
                photoURL: authUser.photoURL,
                token: authUser.refreshToken,
              },
            });
          }
          resolve();
        });
        return Promise.resolve();
      });

    const validateAuth = async () => {
      dispatch(fetchStart());
      const token = localStorage.getItem('token');
      if (!token) {
        dispatch(fetchSuccess());
        return;
      }
      dispatch(setJWTToken(token));
      try {
        const res = await jwtAxios.get('/users/current/session');
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
        return;
      } catch (err) {
        dispatch(fetchSuccess());
        return;
      }
    };

    const checkAuth = () => {
      Promise.all([firebaseCheck(), awsAuthUser(), validateAuth()]).then(() => {
        setLoading(false);
      });
      Hub.listen('auth', ({payload: {event, data}}) => {
        switch (event) {
          case 'signIn':
            // dispatch(onGetLoggedInCognitoUser());
            break;
          case 'signOut':
            dispatch({type: UPDATE_AUTH_USER, payload: null});
            break;
          default:
            return false;
        }
      });
    };
    checkAuth();
  }, [dispatch]);

  return [loading, user];
};

export const useAuthUser = () => {
  const {user} = useSelector(({auth}) => auth);

  if (user) {
    return {id: 1, ...user};
  }
  return [null];
};
