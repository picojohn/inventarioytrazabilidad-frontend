import {useEffect, useState} from 'react'
import jwtAxios from '@crema/services/auth/jwt-auth/jwt-api';

export const useMaximoARestar = (id) => {
  const [state, setState] = useState({
    isLoading: true,
    valor: null,
  });

  const getMaximoARestar = async () => {
    const valorPromise = jwtAxios.get('productos-clientes', {
      params: {
        maximo: true,
        id: id??''
      }
    });

    const [
      valorResp
    ] = await Promise.all([
      valorPromise,
    ]);

    setState({
      isLoading: false,
      valor: valorResp.data,
    })
  };

  useEffect(() => {
    getMaximoARestar();
  },[]) // eslint-disable-line

  return {...state}
}
