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
} from 'redux/actions/LugarUsuarioAction';
import { onGetColeccionLigera as onGetLugares } from 'redux/actions/LugarAction';
import { onGetColeccionLigera as onGetUsuarios } from 'redux/actions/UsuarioAction';
import Slide from '@material-ui/core/Slide';
import LugarUsuarioForm from './LugarUsuarioForm';
import {Fonts} from 'shared/constants/AppEnums';
import {makeStyles} from '@material-ui/core/styles/index';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='down' ref={ref} {...props} />;
});

const validationSchema = yup.object({
  cliente_id: yup
    .number()
    .required('Requerido'),
  lugar_id: yup
    .number()
    .required('Requerido'),
  usuario_id: yup
    .number()
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

const LugarUsuarioCreador = (props) => {
  const {
    lugarUsuario,
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
    ({lugarUsuarioReducer}) => lugarUsuarioReducer.selectedRow,
  );

  const usuarios = useSelector(({usuarioReducer}) => usuarioReducer.ligera);
  const lugares = useSelector(({lugarReducer}) => lugarReducer.ligera);

  const initializeSelectedRow = () => {
    selectedRow = null;
  };
  useEffect(() => {
    initializeSelectedRow();
    dispatch(onGetLugares());
    dispatch(onGetUsuarios());
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
      dispatch(onShow(lugarUsuario));
    }
  }, [accion, dispatch, lugarUsuario]);

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
              cliente_id: selectedRow?.cliente?.id ?? (user?.rol?.tipo !== 'IN' ? user?.asociado?.id : ''),
              lugar_id: selectedRow?.lugar?.id??'',
              usuario_id: selectedRow?.usuario?.id??'',
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
            {({initialValues, values}) => (
              <LugarUsuarioForm
                handleOnClose={handleOnClose}
                titulo={titulo}
                accion={accion}
                initialValues={initialValues}
                lugares={lugares}
                clientes={clientes}
                usuarios={usuarios}
                user={user}
                values={values}
              />
            )}
          </Formik>
        </Scrollbar>
      </Dialog>
    )
  );
};

export default LugarUsuarioCreador;
