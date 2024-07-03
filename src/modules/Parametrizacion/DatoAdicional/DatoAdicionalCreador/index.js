import React, {useEffect, useRef, useState} from 'react';
import {Dialog, Slide, makeStyles} from '@material-ui/core';
import {Formik} from 'formik';
import * as yup from 'yup';
import {useDispatch, useSelector} from 'react-redux';
import {Scrollbar} from '@crema';
import {
  onShow,
  onUpdate,
  onCreate,
} from 'redux/actions/DatoAdicionalAction';
import DatoAdicionalForm from './DatoAdicionalForm';
import {Fonts} from 'shared/constants/AppEnums';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='down' ref={ref} {...props} />;
});

const validationSchema = yup.object({
  cliente_id: yup
    .number()
    .required('Requerido'),
  nombre: yup
    .string()
    .required('Requerido')
    .max('128', 'Debe tener máximo 128 Caracteres'),
  numero_consecutivo: yup
    .number()
    .required('Requerido')
    .integer('Debe ser un entero')
    .min(0, 'Debe ser un número positivo')
    .typeError('Debe ser un valor numérico'),
  nivel: yup
    .string()
    .required('Requerido'),
  tipo_dato: yup
    .string()
    .required('Requerido'),
});

const useStyles = makeStyles((theme) => ({
  dialogBox: {
    position: 'relative',
    '& .MuiDialog-paperWidthMd': {
      maxWidth: 750,
      width: '100%',
      // maxHeight:'fit-content'
    },
    '& .MuiTypography-h6': {
      fontWeight: Fonts.LIGHT,
    },
  },
}));

const DatoAdicionalCreador = (props) => {
  const {
    datoAdicional,
    handleOnClose,
    accion,
    updateColeccion,
    titulo,
    user,
    clientes
  } = props;

  const dispatch = useDispatch();

  const classes = useStyles(props);

  const [showForm, setShowForm] = useState(false);
  let selectedRow = useRef();
  selectedRow = useSelector(
    ({datoAdicionalReducer}) => datoAdicionalReducer.selectedRow,
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
      dispatch(onShow(datoAdicional));
    }
  }, [accion, dispatch, datoAdicional]);

  return (
    showForm && (
      <Dialog
        open={showForm}
        onClose={handleOnClose}
        aria-labelledby='simple-modal-title'
        TransitionComponent={Transition}
        aria-describedby='simple-modal-description'
        className={classes.dialogBox}
        maxWidth={'md'}>
        <Scrollbar>
          <Formik
            initialStatus={true}
            enableReinitialize={true}
            validateOnBlur={false}
            initialValues={{
              id: selectedRow ? selectedRow.id : '',
              nombre: selectedRow ? selectedRow.nombre : '',
              numero_consecutivo: selectedRow?.numero_consecutivo??'',
              nivel: selectedRow?.nivel??'',
              tipo_dato: selectedRow?.tipo_dato??'',
              cliente_id: selectedRow?.cliente?.id ?? (user?.rol?.tipo !== 'IN' ? user?.asociado?.id : ''),
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
              <DatoAdicionalForm
                setFieldValue={setFieldValue}
                handleOnClose={handleOnClose}
                titulo={titulo}
                accion={accion}
                initialValues={initialValues}
                clientes={clientes}
                user={user}
              />
            )}
          </Formik>
        </Scrollbar>
      </Dialog>
    )
  );
};

export default DatoAdicionalCreador;
