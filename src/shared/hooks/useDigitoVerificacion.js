import {useState} from 'react'
import jwtAxios from '@crema/services/auth/jwt-auth/jwt-api';

export const useDigitoVerificacion = () => {
  const [state, setState] = useState({
    isLoading: true,
    digito: null,
  });

  const getDigitoVerificacion = async (contenedor) => {
    const digitoPromise = jwtAxios.get('contenedores', {
      params: {
        digito: true,
        contenedor: contenedor??''
      }
    });

    const [
      digitoResp
    ] = await Promise.all([
      digitoPromise,
    ]);

    setState({
      isLoading: false,
      digito: digitoResp.data,
    })
  };

  return {...state, getDigitoVerificacion}
}
