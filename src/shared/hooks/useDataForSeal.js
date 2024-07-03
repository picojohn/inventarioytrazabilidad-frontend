import {useState} from 'react'
import jwtAxios from '@crema/services/auth/jwt-auth/jwt-api';

export const useDataForSeal = () => {
  const [state, setState] = useState({
    isLoading: true,
    data: null,
  });

  const getInfoSeal = async (data) => {
    setState({
      isLoading: true,
      data: null
    });
    
    const dataPromise = jwtAxios.get('pedidos-detalle/'+data.pedido_id, {
      params: {
        informacion: true,
        ...data
      }
    });
  
    const [
      dataResp,
    ] = await Promise.all([
      dataPromise,
    ]);

    setState({
      isLoading: false,
      data: dataResp.data,
    })
  };

  return {...state, getInfoSeal}
}
