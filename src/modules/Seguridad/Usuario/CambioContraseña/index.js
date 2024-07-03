import React, {useEffect, useRef, useState} from 'react';
import Dialog from '@material-ui/core/Dialog';
import {Formik} from 'formik';
import * as yup from 'yup';
import {useDispatch, useSelector} from 'react-redux';
import {Scrollbar} from '@crema';
import {
  onShow,
  onChangePassword,
} from 'redux/actions/UsuarioAction';
import Slide from '@material-ui/core/Slide';
import CambioContraseñaForm from './CambioContraseñaForm';
import {Fonts} from 'shared/constants/AppEnums';
import {makeStyles} from '@material-ui/core/styles/index';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='down' ref={ref} {...props} />;
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

let validationSchema = yup.object({
  id: yup.number().required('Requerido'),
  password: yup.string().required('Requerido').min(4, 'Debe ser de al menos 4 caracteres'),
  confirm_password: yup.string().required('Requerido').oneOf([yup.ref('password')], 'Las contraseñas no coinciden'),
});

const CambioContraseña = (props) => {
  const {
    usuario,
    handleOnClose, 
    accion, 
    titulo
  } = props;

  const [showForm, setShowForm] = useState(false);
  let selectedRow = useRef();
  selectedRow = useSelector(({usuarioReducer}) => usuarioReducer.selectedRow);
  const dispatch = useDispatch();
  const classes = useStyles(props);

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

  useEffect(() => {
    initializeSelectedRow();
  }, []); // eslint-disable-line

  const initializeSelectedRow = () => {
    selectedRow = null;
  };

  if (accion === 'crear') {
    initializeSelectedRow();
  }

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
              id: usuario,
              password: '',
              confirm_password: '',
            }}
            validationSchema={validationSchema}
            onSubmit={(data, {setSubmitting, resetForm}) => {
              setSubmitting(true);
              dispatch(onChangePassword(data, handleOnClose));
              setSubmitting(false);
            }}>
            {({values, initialValues, setFieldValue}) => (
              <CambioContraseñaForm
                values={values}
                setFieldValue={setFieldValue}
                handleOnClose={handleOnClose}
                titulo={titulo}
                initialValues={initialValues}
              />
            )}
          </Formik>
        </Scrollbar>
      </Dialog>
    )
  );
};

export default CambioContraseña;
