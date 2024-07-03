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
} from 'redux/actions/OperacionEmbarqueAction';
import OperacionEmbarqueForm from './OperacionEmbarqueForm';
import {Fonts} from 'shared/constants/AppEnums';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='down' ref={ref} {...props} />;
});

const validationSchema = yup.object({
  nombre: yup
    .string()
    .required('Requerido')
    .max('128', 'Debe tener máximo 128 Caracteres'),
  estado: yup
    .string()
    .required('Requerido'),
  indicativo_requiere_instalacion_previaje: yup
    .string()
    .required('Requerido'),
  fecha_inicio: yup
    .date()
    .required('Requerido'),
  fecha_fin: yup
    .date()
    .min(yup.ref('fecha_inicio'), 'Debe ser mayor o igual que fecha inicio')
    .required('Requerido'),
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

const OperacionEmbarqueCreator = (props) => {
  const {
    operacionEmbarque,
    handleOnClose,
    accion,
    updateColeccion,
    titulo,
    clientes,
    user
  } = props;

  const dispatch = useDispatch();

  const classes = useStyles(props);

  const [showForm, setShowForm] = useState(false);
  let selectedRow = useRef();
  selectedRow = useSelector(
    ({operacionEmbarqueReducer}) => operacionEmbarqueReducer.selectedRow,
  );

  const initializeSelectedRow = () => {
    selectedRow = null;
  };
  useEffect(() => {
    initializeSelectedRow();
  }, []);

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
      dispatch(onShow(operacionEmbarque));
    }
  }, [accion, dispatch, operacionEmbarque]);

  return (
    showForm && (
      <Dialog
        open={showForm}
        onClose={handleOnClose}
        aria-labelledby='simple-modal-title'
        TransitionComponent={Transition}
        aria-describedby='simple-modal-description'
        className={classes.dialogBox}
        maxWidth={'sm'}>
        <Scrollbar>
          <Formik
            initialStatus={true}
            enableReinitialize={true}
            validateOnBlur={false}
            initialValues={{
              id: selectedRow?.id??'',
              nombre: selectedRow?.nombre??'',
              fecha_inicio: selectedRow?.fecha_inicio??'',
              fecha_fin: selectedRow?.fecha_fin??'',
              cliente_id: selectedRow?.cliente?.id ?? (user?.rol?.tipo !== 'IN' ? user?.asociado?.id : ''),
              indicativo_requiere_instalacion_previaje: selectedRow?.indicativo_requiere_instalacion_previaje??'',
              observaciones: selectedRow?.observaciones??'',
              estado: selectedRow?.estado??'VIG',
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
              <OperacionEmbarqueForm
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

export default OperacionEmbarqueCreator;
