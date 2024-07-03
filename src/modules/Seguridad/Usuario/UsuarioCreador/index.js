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
} from '../../../../redux/actions/UsuarioAction';
import { onGetColeccionLigera as onGetClientes } from 'redux/actions/ClienteAction';
import Slide from '@material-ui/core/Slide';
import UsuarioForm from './UsuarioForm';
import {Fonts} from '../../../../shared/constants/AppEnums';
import {makeStyles} from '@material-ui/core/styles/index';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='down' ref={ref} {...props} />;
});

let validationSchema = yup.object({
  nombre: yup.string().required('Requerido'),
  identificacion_usuario: yup.string().required('Requerido'),
  rol_id: yup.number().required('Requerido'),
  asociado_id: yup.number().required('Requerido'),
  correo_electronico: yup
    .string()
    .email('Formato de Email No Válido')
    .required('Requerido'),
});

const UsuarioCreador = (props) => {
  const {usuario, handleOnClose, accion, updateColeccion, roles, titulo} =
    props;

  const dispatch = useDispatch();

  if (accion === 'crear') {
    validationSchema = yup.object({
      nombre: yup.string().required('Requerido'),
      identificacion_usuario: yup.string().required('Requerido'),
      rol_id: yup.number().required('Requerido'),
      asociado_id: yup.number().required('Requerido'),
      correo_electronico: yup
        .string()
        .email('Formato de Email No Válido')
        .required('Requerido'),
      clave: yup.string().required('Requerido'),
    });
  }

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

  const classes = useStyles(props);

  const [showForm, setShowForm] = useState(false);
  let selectedRow = useRef();
  selectedRow = useSelector(({usuarioReducer}) => usuarioReducer.selectedRow);
  const clientes = useSelector(({clienteReducer}) => clienteReducer.ligera);

  const initializeSelectedRow = () => {
    selectedRow = null;
  };
  useEffect(() => {
    initializeSelectedRow();
    dispatch(onGetClientes());
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
      dispatch(onShow(usuario));
    }
  }, [accion, dispatch, usuario]);

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
            initialStatus={false}
            enableReinitialize={true}
            validateOnBlur={false}
            initialValues={{
              id: selectedRow ? selectedRow.id : '',
              identificacion_usuario: selectedRow
                ? selectedRow.identificacion_usuario
                : '',
              nombre: selectedRow ? selectedRow.nombre : '',
              rol_id: selectedRow ? selectedRow.rol_id : '',
              asociado_id: selectedRow?.asociado_id??'',
              correo_electronico: selectedRow ? selectedRow.email : '',
              estado: selectedRow
                ? selectedRow.estado === 1
                  ? '1'
                  : '0'
                : '1',
              clave: '',
            }}
            validationSchema={validationSchema}
            onSubmit={(data, {setSubmitting, resetForm}) => {
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
            {({values, initialValues, setFieldValue}) => (
              <UsuarioForm
                values={values}
                setFieldValue={setFieldValue}
                handleOnClose={handleOnClose}
                titulo={titulo}
                accion={accion}
                roles={roles}
                initialValues={initialValues}
                clientes={clientes}
              />
            )}
          </Formik>
        </Scrollbar>
      </Dialog>
    )
  );
};

export default UsuarioCreador;
