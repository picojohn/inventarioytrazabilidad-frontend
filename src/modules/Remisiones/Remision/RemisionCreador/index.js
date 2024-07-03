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
} from 'redux/actions/RemisionAction';
import { onGetColeccionLigera as onGetUsuarios } from 'redux/actions/UsuarioAction';
import { onGetColeccionLigera as onGetLugaresUsuario } from 'redux/actions/LugarUsuarioAction';
import { onGetColeccionLigera as onGetLugares } from 'redux/actions/LugarAction';
import { onGetColeccionLigera as onGetClientes } from 'redux/actions/ClienteAction';
import { onGetColeccionLigera as onGetEmpresasTransporte } from 'redux/actions/ClienteEmpresaTransporteAction';
import RemisionForm from './RemisionForm';
import {Fonts} from 'shared/constants/AppEnums';
import {makeStyles} from '@material-ui/core/styles/index';
import { useParams } from 'react-router-dom';
import { Box } from '@material-ui/core';
import RemisionDetalle from './RemisionDetalle';
import { history } from 'redux/store';

const validationSchema = yup.object({
  numero_remision: yup
    .number()
    .nullable(),
  cliente_envio_id: yup
    .number()
    .required('Requerido'),
  cliente_destino_id: yup
    .number()
    .required('Requerido'),
  lugar_envio_id: yup
    .number()
    .required('Requerido'),
  lugar_destino_id: yup
    .number()
    .required('Requerido'),
  user_envio_id: yup
    .number()
    .required('Requerido'),
  user_destino_id: yup
    .number()
    .required('Requerido')
    .test({
      name: 'diferentes',
      exclusive: false,
      message: 'El usuario de destino debe ser diferente al de origen', 
      test: function(value){
        return value == null || value != this.parent.user_envio_id // eslint-disable-line
      }
    }),
  hora_estimada_envio: yup
    .string()
    .required('Requerido'),
  fecha_remision: yup
    .date()
    .required('Requerido'),
  transportador: yup
    .string()
    .nullable(),
  guia_transporte: yup
    .string()
    .nullable(),
  observaciones_remision: yup
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

const RemisionCreador = (props) => {
  const { accion, id } = useParams();
  const dispatch = useDispatch();
  const classes = useStyles(props);
  const [created, setCreated] = useState(false);
  const selectedRow = useSelector(
    ({remisionReducer}) => remisionReducer.selectedRow,
  );
  const {user} = useSelector(({auth}) => auth);
  const lugaresUsuarios = useSelector(({lugarUsuarioReducer}) => lugarUsuarioReducer.ligera);
  const lugares = useSelector(({lugarReducer}) => lugarReducer.ligera);
  const usuarios = useSelector(({usuarioReducer}) => usuarioReducer.ligera);
  const clientes = useSelector(({clienteReducer}) => clienteReducer.ligera);
  const empresasTransporte = useSelector(({clienteEmpresaTransporteReducer}) => clienteEmpresaTransporteReducer.ligera);
  
  useEffect(() => {
    if(accion === 'crear'){
      initializeSelectedRow();
    }
    dispatch(onGetUsuarios());
    dispatch(onGetLugaresUsuario());
    dispatch(onGetLugares());
    dispatch(onGetClientes());
    dispatch(onGetEmpresasTransporte());
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
    history.push('/remisiones');
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
              numero_remision: selectedRow?.numero_remision??'',
              cliente_envio_id: selectedRow?.clienteEnvio?.id??user?.asociado?.id??'',
              cliente_destino_id: selectedRow?.clienteDestino?.id??user?.asociado?.id??'',
              lugar_envio_id: selectedRow?.lugarEnvio?.id??'',
              lugar_destino_id: selectedRow?.lugarDestino?.id??'',
              user_envio_id: selectedRow?.usuarioEnvio?.id??'',
              user_destino_id: selectedRow?.usuarioDestino?.id??'',
              hora_estimada_envio: selectedRow?.hora_estimada_envio??'',
              fecha_remision: selectedRow?.fecha_remision??'',
              transportador: selectedRow?.transportador??'',
              empresaTransportadora: '',
              guia_transporte: selectedRow?.guia_transporte??'',
              indicativo_confirmacion_recepcion: selectedRow?.indicativo_confirmacion_recepcion??'S',
              observaciones_remision: selectedRow?.observaciones_remision??'',
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
              <RemisionForm
                setFieldValue={setFieldValue}
                accion={accion}
                initialValues={initialValues}
                handleSubmit={handleSubmit}
                values={values}
                created={created}
                user={user}
                handleOnClose={handleOnClose}
                lugaresUsuarios={lugaresUsuarios}
                lugares={lugares}
                usuarios={usuarios}
                clientes={clientes}
                empresasTransporte={empresasTransporte}
              />
            )}
          </Formik>
        </Scrollbar>
      </Box>
      { created && 
        <RemisionDetalle
          data={selectedRow??[]}
          protegido={accion==='ver'?true:false}
        />
      }
    </>
  );
};

export default RemisionCreador;
