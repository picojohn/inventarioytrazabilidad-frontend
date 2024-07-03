import {useEffect, useState} from 'react'
import jwtAxios from '@crema/services/auth/jwt-auth/jwt-api';

export const usePedido = () => {
  const [state, setState] = useState({
    isLoading: true,
    numeroPedido: null,
    numeroLote: null,
  });

  const getPedidoInfo = async () => {
    const numeroPedidoPromise = jwtAxios.get('parametros-constantes/consultar', {
      params: {
        codigo_parametro: 'CONSECUTIVO_PEDIDO'
      }
    });
    const numeroLotePromise = jwtAxios.get('parametros-constantes/consultar', {
      params: {
        codigo_parametro: 'CONSECUTIVO_LOTE'
      }
    });

    const [
      numeroPedidoResp,
      numeroLoteResp,
    ] = await Promise.all([
      numeroPedidoPromise,
      numeroLotePromise,
    ]);

    setState({
      isLoading: false,
      numeroPedido: numeroPedidoResp.data.valor_parametro,
      numeroLote: numeroLoteResp.data.valor_parametro,
    })
  };

  useEffect(() => {
    getPedidoInfo();
  },[]);

  return {...state}
}
