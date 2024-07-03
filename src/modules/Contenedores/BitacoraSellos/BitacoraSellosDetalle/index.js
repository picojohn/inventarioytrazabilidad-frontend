import React, {useEffect, useState} from 'react';
import Dialog from '@material-ui/core/Dialog';
import {Formik} from 'formik';
import {Scrollbar} from '../../../../@crema';
import {
  onShow,
} from '../../../../redux/actions/SelloAction';
import Slide from '@material-ui/core/Slide';
import BitacoraSellosDetalleForm from './BitacoraSellosDetalleForm';
import {Fonts} from '../../../../shared/constants/AppEnums';
import {makeStyles} from '@material-ui/core/styles/index';
import { useDispatch } from 'react-redux';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { ESTADOS_SELLOS, TIPOS_EMPAQUES } from 'shared/constants/ListaValores';

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

const BitacoraSellosDetalle = (props) => {
  const {
    bitacoraDetalle,
    handleOnClose,
    accion,
    titulo,
    onSeeLocation,
  } = props;

  const [showForm, setShowForm] = useState(false);
  const classes = useStyles(props);
  const dispatch = useDispatch();
  let selectedRow = useRef();

  selectedRow = useSelector(
    ({selloReducer}) => selloReducer.bitacora.selectedRow,
  );

  const initializeSelectedRow = () => {
    selectedRow = null;
  };

  useEffect(() => {
    initializeSelectedRow();
  }, []); // eslint-disable-line
  
  useEffect(() => {
    if (selectedRow) {
      setShowForm(true);
    } else {
      setShowForm(false);
    }
  }, [selectedRow, accion]);

  useEffect(() => {
    if (accion === 'ver') {
      dispatch(onShow(bitacoraDetalle));
    }
  }, [bitacoraDetalle]); // eslint-disable-line

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
            validateOnBlur={false}
            initialValues={{
              producto: selectedRow?.producto?.nombre??'',
              serial: selectedRow?.sello?.serial??'',
              evento: selectedRow?.tipoEvento?.nombre??'',
              fecha_evento: selectedRow?.fecha_evento??'',
              estado_sello: ESTADOS_SELLOS.find((state) => state.id === selectedRow?.tipoEvento?.estado??'').nombre??'',
              tipo_empaque: TIPOS_EMPAQUES.find((typ) => typ.id === selectedRow?.sello?.tipo_empaque??'').nombre??'',
              producto_empaque: selectedRow?.productoEmpaque?.serial??'',
              numero_pedido: selectedRow?.numero_pedido??'',
              numero_remision: selectedRow?.numero_remision??'',
              usuario_origen: selectedRow?.usuario_origen??'',
              lugar_origen: selectedRow?.lugarOrigen?.nombre??'',
              lugar_destino: selectedRow?.lugarDestino?.nombre??'',
              usuario_destino: selectedRow?.usuarioDestino?.nombre??'',
              documento_referencia: selectedRow?.documento_referencia??'',
              lugar_instalacion: selectedRow?.lugarInstalacion?.nombre??'',
              zona_instalacion: selectedRow?.zonaInstalacion?.nombre??'',
              contenedor: selectedRow?.contenedor?.numero_contenedor??'',
              operacion_embarque_id: selectedRow?.operacion_embarque_id??'',
              observaciones_evento: selectedRow?.observaciones_evento??'',
              ubicacion: selectedRow?.ubicacion??'',
              evidencias: selectedRow?.evidencias?.evidencias??[],
            }}
            onSubmit={() => {}}>
            {({values}) => (
              <BitacoraSellosDetalleForm
                handleOnClose={handleOnClose}
                titulo={titulo}
                onSeeLocation={onSeeLocation}
                values={values}
              />
            )}
          </Formik>
        </Scrollbar>
      </Dialog>
    )
  );
};

export default BitacoraSellosDetalle;
