import React, {useEffect, useState} from 'react';
import {Formik} from 'formik';
import * as yup from 'yup';
import {useDispatch, useSelector} from 'react-redux';
import {Scrollbar} from '@crema';
import {
  onShow,
  onUpdate,
  onCreate,
  unSelect,
} from 'redux/actions/PedidoAction';
import { onGetColeccionLigera as onGetClientes } from 'redux/actions/ClienteAction';
import { onGetColeccionLigera as onGetPedidosS3 } from 'redux/actions/PedidoS3Action';
import PedidoForm from './PedidoForm';
import {Fonts} from 'shared/constants/AppEnums';
import {makeStyles} from '@material-ui/core/styles/index';
import { useLocation, useParams } from 'react-router-dom';
import { Box } from '@material-ui/core';
import PedidoDetalle from './PedidoDetalle';
import { history } from 'redux/store';

const validationSchema = yup.object({
  numero_pedido: yup
    .number()
    .nullable(),
  cliente_id: yup
    .number()
    .required('Requerido'),
  numero_pedido_s3: yup
    .number()
    .required('Requerido'),
  fecha_pedido: yup
    .date()
    .required('Requerido'),
  fecha_entrega_pedido: yup
    .date()
    .required('Requerido')
    .min(yup.ref('fecha_pedido'), 'Debe ser mayor o igual a fecha pedido'),
  orden_compra_cliente: yup
    .string()
    .required('Requerido')
    .matches(/^[a-zA-Z0-9]+$/, 'Debe ser un dato alfanumérico'),
  numero_lote: yup
    .number()
    .nullable(),
  observaciones: yup
    .string()
    .nullable(),
});

const useStyles = makeStyles((theme) => ({
  dialogBox: {
    position: 'relative',
    '& .MuiDialog-paperWidthSm': {
      maxWidth: 600,
      width: '100%',
      // maxHeight:'fit-content'
    },
    '& .MuiTypography-h6': {
      fontWeight: Fonts.LIGHT,
    },
  },
  marcoTabla: {
    backgroundColor: 'white',
    boxShadow: '0px 0px 5px 5px rgb(0 0 0 / 10%)',
    borderRadius: '4px',
    paddingLeft: '15px',
    paddingRight: '15px',
    marginTop: '5px',
  },
}));

const useQuery = () => {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const PedidoCreador = (props) => {
  const { accion, id } = useParams();
  let query = useQuery();
  const dispatch = useDispatch();
  const classes = useStyles(props);
  const [created, setCreated] = useState(false);
  
  const selectedRow = useSelector(
    ({pedidoReducer}) => pedidoReducer.selectedRow,
  );
  const {user} = useSelector(({auth}) => auth);
  const clientes = useSelector(({clienteReducer}) => clienteReducer.ligera);
  const pedidosS3 = useSelector(({pedidoS3Reducer}) => pedidoS3Reducer.ligera);
  
  useEffect(() => {
    if(accion === 'crear'){
      initializeSelectedRow();
    }
    dispatch(onGetClientes());
    dispatch(onGetPedidosS3());
  }, [accion]); // eslint-disable-line

  useEffect(() => {
    if ((accion === 'editar') | (accion === 'ver')) {
      dispatch(onShow(id));
      setCreated(true);
    }
  }, [accion, dispatch, id]);

  const initializeSelectedRow = () => {
    dispatch(unSelect());
  }

  const createPedido = () => {
    setCreated(true)
  }

  const handleOnClose = () => {
    if(query.get('lectura') === '1'){
      history.push('/pedidos-lectura');
    } else {
      history.push('/pedidos');
    }
  }
  
  return (
    <>
      <Box className={classes.marcoTabla}>
        <Scrollbar>
          <Formik
            initialStatus={true}
            enableReinitialize={true}
            validateOnBlur={false}
            initialValues={{
              id: selectedRow?.id??'',
              numero_pedido: selectedRow?.numero_pedido??'',
              cliente_id: selectedRow? selectedRow.cliente.id : user.rol.tipo !== 'IN' ? user.asociado.id : '',
              numero_pedido_s3: selectedRow?.numero_pedido_s3??'',
              fecha_pedido: selectedRow?.fecha_pedido??'',
              fecha_entrega_pedido: selectedRow?.fecha_entrega_pedido??'',
              orden_compra_cliente: selectedRow?.orden_compra_cliente??'',
              numero_lote: selectedRow?.numero_lote??'',
              observaciones: selectedRow?.observaciones??'',
              estado_pedido: selectedRow?.estado_pedido??'GRA',
              estado: '1'
            }}
            validationSchema={validationSchema}
            onSubmit={(data, {setSubmitting}) => {
              setSubmitting(true);
              if (accion === 'crear') {
                dispatch(onCreate(data, createPedido));
              } else if (accion === 'editar') {
                if (selectedRow) {
                  dispatch(onUpdate(data, handleOnClose));
                }
              }
              setSubmitting(false);
            }}>
            {({initialValues, setFieldValue, handleSubmit, values}) => (
              <PedidoForm
                setFieldValue={setFieldValue}
                accion={accion}
                initialValues={initialValues}
                clientes={clientes}
                pedidosS3={pedidosS3}
                handleSubmit={handleSubmit}
                values={values}
                created={created}
                rol={user?.rol?.tipo??'EX'}
                handleOnClose={handleOnClose}
              />
            )}
          </Formik>
        </Scrollbar>
      </Box>
      { created && 
        <PedidoDetalle
          pedido_id={selectedRow?.id??id??''}
          protegido={accion==='ver'?true:false}
        />
      }
    </>
  );
};

export default PedidoCreador;
