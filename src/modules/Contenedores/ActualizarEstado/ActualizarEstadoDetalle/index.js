import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import {Formik} from 'formik';
import {Scrollbar} from '@crema';
import Slide from '@material-ui/core/Slide';
import ActualizarEstadoDetalleForm from './ActualizarEstadoDetalleForm';
import {Fonts} from 'shared/constants/AppEnums';
import {makeStyles} from '@material-ui/core/styles/index';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import {onGetColeccionLigera as getEventos} from 'redux/actions/TipoEventoAction';
import * as yup from 'yup'
import { onActualizarEstado } from 'redux/actions/SelloAction';
import { useLocation } from 'shared/hooks/useLocation';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='down' ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  dialogBox: {
    position: 'relative',
    '& .MuiDialog-paperWidthSm': {
      maxWidth: 1200,
      width: '100%',
      // maxHeight:'fit-content'
    },
    '& .MuiTypography-h6': {
      fontWeight: Fonts.LIGHT,
    },
  },
}));

const validationSchema = yup.object({
  evento_id: yup
    .number()
    .required('Requerido'),
  observaciones_evento: yup
    .string()
    .required('Requerido'),
});

const BitacoraSellosDetalle = (props) => {
  const {
    selloSelecionado,
    handleOnClose,
    titulo,
    showForm,
    getBitacora
  } = props;

  const eventos = useSelector(({tipoEventoReducer}) => tipoEventoReducer.ligera);
  const classes = useStyles(props);
  const {getLocation, latitude, longitude} = useLocation();
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getEventos());
    getLocation();
  },[]) // eslint-disable-line

  return (
    showForm && (
      <Dialog
        open={showForm}
        onClose={handleOnClose}
        aria-labelledby='simple-modal-title'
        TransitionComponent={Transition}
        aria-describedby='simple-modal-description'
        className={classes.dialogBox}
        fullWidth
        maxWidth={'md'}>
        <Scrollbar>
          <Formik
            initialStatus={true}
            enableReinitialize={true}
            validationSchema={validationSchema}
            validateOnBlur={false}
            initialValues={{
              id: selloSelecionado?.id??'',
              producto: selloSelecionado?.producto??'',
              serial: selloSelecionado?.serial??'',
              ultimo_evento: selloSelecionado?.ultimo_evento??'',
              fecha_ultimo_evento: selloSelecionado?.fecha_ultimo_evento??'',
              estado_sello: selloSelecionado?.estado_sello??'',
              numero_pedido: selloSelecionado?.numero_pedido??'',
              numero_ultima_remision: selloSelecionado?.numero_ultima_remision??'',
              usuario_origen: selloSelecionado?.usuario_origen??'',
              lugar_origen: selloSelecionado?.lugar_origen??'',
              documento_referencia: selloSelecionado?.documento_referencia??'',
              lugar_instalacion: selloSelecionado?.lugar_instalacion??'',
              zona_instalacion: selloSelecionado?.zona_instalacion??'',
              contenedor: selloSelecionado?.numero_contenedor??'',
              operacion_embarque_id: selloSelecionado?.operacion_embarque_id??'',
              evento_id: '',
              observaciones_evento: '',
              latitude,
              longitude,
            }}
            onSubmit={(data) => {
              dispatch(onActualizarEstado(data, getBitacora, handleOnClose))
            }}>
            {({values}) => (
              <ActualizarEstadoDetalleForm
                handleOnClose={handleOnClose}
                titulo={titulo}
                eventos={eventos}
              />
            )}
          </Formik>
        </Scrollbar>
      </Dialog>
    )
  );
};

export default BitacoraSellosDetalle;
