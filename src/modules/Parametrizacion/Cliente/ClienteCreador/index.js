import React, {useEffect, useRef, useState} from 'react';
import Dialog from '@material-ui/core/Dialog';
import {Formik} from 'formik';
import * as yup from 'yup';
import {useDispatch, useSelector} from 'react-redux';
import {Scrollbar} from '../../../../@crema';
import {
  onShow,
  onUpdate,
  onCreate,
} from '../../../../redux/actions/ClienteAction';
import Slide from '@material-ui/core/Slide';
import ClienteForm from './ClienteForm';
import {Fonts} from '../../../../shared/constants/AppEnums';
import {makeStyles} from '@material-ui/core/styles/index';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='down' ref={ref} {...props} />;
});

const validationSchema = yup.object({
  nombre: yup
    .string()
    .required('Requerido')
    .max('128', 'Debe tener máximo 128 Caracteres'),
  indicativo_lectura_sellos_externos: yup
    .string()
    .required('Requerido'),
  indicativo_instalacion_contenedor: yup
    .string()
    .required('Requerido'),
  indicativo_contenedor_exclusivo: yup
    .string()
    .required('Requerido'),
  asignacion_sellos_lectura: yup
    .string()
    .required('Requerido'),
  indicativo_documento_referencia: yup
    .string()
    .required('Requerido')
    .test({
      name: 'excluyente',
      exclusive: false,
      params: {},
      message: 'Instalación contenedor y/o este campo deben estar marcados como Sí', // eslint-disable-line
      test: function(value){
        return value === 'S' || this.parent.indicativo_instalacion_contenedor === 'S'
      }
    }),
  asociado_id: yup
    .number()
    .required('Requerido'),
  dias_vigencia_operacion_embarque	: yup
    .number()
    .integer('Debe ser un entero')
    .min(0, 'Debe ser mayor o igual a 0')
    .required('Requerido')
    .typeError('Debe ser un número'),
  observaciones: yup
    .string()
    .nullable()
    .max('128', 'Debe tener máximo 128 Caracteres'),
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
}));

const ClienteCreador = (props) => {
  const {
    cliente,
    handleOnClose,
    accion,
    updateColeccion,
    titulo,
    asociados,
  } = props;

  const dispatch = useDispatch();

  const classes = useStyles(props);

  const [showForm, setShowForm] = useState(false);
  let selectedRow = useRef();
  selectedRow = useSelector(
    ({clienteReducer}) => clienteReducer.selectedRow,
  );

  const initializeSelectedRow = () => {
    selectedRow = null;
  };
  useEffect(() => {
    initializeSelectedRow();
  }, []); // eslint-disable-line

  if (accion === 'crear') {
    initializeSelectedRow();
  }

  useEffect(() => {
    if (selectedRow) {
      setShowForm(true);
    } else if (accion === 'crear') {
      setShowForm(true);
    } else {
      setShowForm(false);
    }
  }, [selectedRow, accion]);

  useEffect(() => {
    if ((accion === 'editar') | (accion === 'ver')) {
      dispatch(onShow(cliente));
    }
  }, [accion, dispatch, cliente]);

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
              id: selectedRow ? selectedRow.id : '',
              indicativo_lectura_sellos_externos: selectedRow?.indicativo_lectura_sellos_externos??'N',
              indicativo_instalacion_contenedor: selectedRow?.indicativo_instalacion_contenedor??'N',
              indicativo_contenedor_exclusivo: selectedRow?.indicativo_contenedor_exclusivo??'N',
              indicativo_operaciones_embarque: selectedRow?.indicativo_operaciones_embarque??'N',
              indicativo_registro_lugar_instalacion: selectedRow?.indicativo_registro_lugar_instalacion??'N',
              indicativo_registro_zona_instalacion: selectedRow?.indicativo_registro_zona_instalacion??'N',
              indicativo_instalacion_automatica: selectedRow?.indicativo_instalacion_automatica??'N',
              indicativo_asignacion_serial_automatica: selectedRow?.indicativo_asignacion_serial_automatica??'N',
              indicativo_documento_referencia: selectedRow?.indicativo_documento_referencia??'N',
              asignacion_sellos_lectura: selectedRow?.asignacion_sellos_lectura??'N',
              dias_vigencia_operacion_embarque: selectedRow?.dias_vigencia_operacion_embarque??'',
              asociado_id: selectedRow?.asociado_id??'',
              nombre: selectedRow ? selectedRow.nombre : '',
              observaciones: selectedRow?.observaciones??'',
              estado: selectedRow
                ? selectedRow.estado === 1
                  ? '1'
                  : '0'
                : '1',
            }}
            validationSchema={validationSchema}
            onSubmit={(data, {setSubmitting}) => {
              setSubmitting(true);
              if (accion === 'crear') {
                dispatch(onCreate(data, handleOnClose, updateColeccion));
              } else if (accion === 'editar') {
                if (selectedRow) {
                  dispatch(onUpdate(data, handleOnClose, updateColeccion));
                }
              }
              setSubmitting(false);
            }}>
            {({initialValues, setFieldValue}) => (
              <ClienteForm
                setFieldValue={setFieldValue}
                handleOnClose={handleOnClose}
                titulo={titulo}
                accion={accion}
                initialValues={initialValues}
                asociados={asociados}
              />
            )}
          </Formik>
        </Scrollbar>
      </Dialog>
    )
  );
};

export default ClienteCreador;
