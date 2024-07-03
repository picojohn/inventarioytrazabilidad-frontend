import {useState} from 'react'
import jwtAxios from '@crema/services/auth/jwt-auth/jwt-api';

export const usePerteneceASecSel = () => {
  const [state, setState] = useState({
    isLoading: true,
    pertenece: false,
  });

  const consultarPertenece = async (lugar_id) => {
    const consultaPromise = jwtAxios.get('parametros-constantes/consultar-lugar-interno', {
      params: {
        lugar_id
      }
    });

    const [
      consultaResp,
    ] = await Promise.all([
      consultaPromise,
    ]);

    setState({
      isLoading: false,
      pertenece: consultaResp.data,
    })
  };

  return {...state, consultarPertenece}
}
