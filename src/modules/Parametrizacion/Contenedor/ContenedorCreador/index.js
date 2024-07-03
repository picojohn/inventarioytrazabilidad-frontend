import React, {useEffect, useRef, useState} from 'react';
import Dialog from '@material-ui/core/Dialog';
import {Formik} from 'formik';
import * as yup from 'yup';
import {useDispatch, useSelector} from 'react-redux';
import {Scrollbar} from '@crema';
import {
  onShow,
  onUpdate,
  onCreate
} from 'redux/actions/ContenedorAction';
import { onGetColeccionLigera as onGetTiposContenedor } from 'redux/actions/TipoContenedorAction';
import Slide from '@material-ui/core/Slide';
import ContenedorForm from './ContenedorForm';
import {Fonts} from 'shared/constants/AppEnums';
import {makeStyles} from '@material-ui/core/styles/index';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='down' ref={ref} {...props} />;
});

const validationSchema = yup.object({
  numero_contenedor: yup
    .string()
    .required('Requerido')
    .max('10', 'Debe tener 10 Caracteres')
    .min('10', 'Debe tener 10 Caracteres')
    .matches(/^[a-zA-Z]{3}[u|U|j|J|z|Z][0-9]{6}/, 'Número contenedor inválido'),
  digito_verificacion: yup
    .number()
    .required('Requerido'),
  cliente_id: yup
    .number()
    .nullable(),
  tipo_contenedor_id: yup
    .number()
    .required('Requerido'),
  indicativo_contenedor_reparacion: yup
    .string()
    .required('Requerido'),
  is_loading: yup
    .bool()
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

const ContenedorCreador = (props) => {
  const {
    contenedor,
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
    ({contenedorReducer}) => contenedorReducer.selectedRow,
  );

  const tiposContenedor = useSelector(({tipoContenedorReducer}) => tipoContenedorReducer.ligera);

  const initializeSelectedRow = () => {
    selectedRow = null;
  };
  useEffect(() => {
    initializeSelectedRow();
    dispatch(onGetTiposContenedor());
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
      dispatch(onShow(contenedor));
    }
  }, [accion, dispatch, contenedor]);

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
        maxWidth={'sm'}>
        <Scrollbar>
          <Formik
            initialStatus={true}
            enableReinitialize={true}
            validateOnBlur={false}
            initialValues={{
              id: selectedRow?.id??'',
              numero_contenedor: selectedRow?.numero_contenedor??'',
              digito_verificacion: selectedRow?.digito_verificacion??'',
              cliente_id: selectedRow?.cliente?.id ?? (user?.rol?.tipo !== 'IN' ? user?.asociado?.id : ''),
              tipo_contenedor_id: selectedRow?.tipo_contenedor?.id??'',
              indicativo_contenedor_reparacion: selectedRow
                ? selectedRow.indicativo_contenedor_reparacion === 'S'
                  ? 'S'
                  : 'N'
                : 'N',
              estado: selectedRow
                ? selectedRow.estado === 1
                  ? '1'
                  : '0'
                : '1',
              is_loading: ''
            }}
            validationSchema={validationSchema}
            onSubmit={(data, {setSubmitting}) => {
              setSubmitting(true);
              data.numero_contenedor = data.numero_contenedor.substring(0, 10).toUpperCase();
              if (accion === 'crear') {
                dispatch(onCreate(data, handleOnClose, updateColeccion));
              } else if (accion === 'editar') {
                if (selectedRow) {
                  dispatch(onUpdate(data, handleOnClose, updateColeccion));
                }
              }
              setSubmitting(false);
            }}>
            {({initialValues, setFieldValue, values, errors}) => (
              <ContenedorForm
                setFieldValue={setFieldValue}
                handleOnClose={handleOnClose}
                titulo={titulo}
                accion={accion}
                initialValues={initialValues}
                tiposContenedor={tiposContenedor}
                values={values}
                errors={errors}
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

export default ContenedorCreador;
