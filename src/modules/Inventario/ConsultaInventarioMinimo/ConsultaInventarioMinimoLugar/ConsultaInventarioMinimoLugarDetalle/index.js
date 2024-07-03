import React, {useEffect, useState} from 'react';
import Dialog from '@material-ui/core/Dialog';
import {Formik} from 'formik';
import * as yup from 'yup';
import {Scrollbar} from '@crema';
import {
//  onShow,
} from 'redux/actions/SelloAction';
import Slide from '@material-ui/core/Slide';
import ConsultaInventarioForm from './ConsultaInventarioMinimoLugarDetalleForm';
import {Fonts} from 'shared/constants/AppEnums';
import {makeStyles} from '@material-ui/core/styles/index';
import mensajeValidacion from 'shared/functions/MensajeValidacion';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='down' ref={ref} {...props} />;
});

const validationSchema = yup.object({
  nombre: yup.string().required('Requerido'),
  modulo_id: yup.string().required('Requerido'),
  posicion: yup
    .number()
    .typeError(mensajeValidacion('numero'))
    .required('Requerido'),
  icono_menu: yup.string().nullable(),
  url: yup.string().required('Requerido'),
  url_ayuda: yup.string().nullable(),
});

const ConsultaInventarioCreador = (props) => {
  const {
    consultaInventario,
    handleOnClose,
    accion,
    modulos,
    titulo,
  } = props;

  const [showForm, setShowForm] = useState(false);
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

    useEffect(() => {
    if (consultaInventario) {
      setShowForm(true);
    } else if (accion === 'crear') {
      setShowForm(true);
    } else {
      setShowForm(false);
    }
  }, [consultaInventario, accion]);

  return (
    showForm && (
      <Dialog
        open={showForm}
        onClose={handleOnClose}
        aria-labelledby='simple-modal-title'
        TransitionComponent={Transition}
        aria-describedby='simple-modal-description'
        className={classes.dialogBox}
        maxWidth={'xl'}>
        <Scrollbar>
          <Formik
            initialStatus={true}
            enableReinitialize={true}
            validateOnBlur={false}
            initialValues={{
              lugar: consultaInventario ? consultaInventario.lugar : '',
              usuario: consultaInventario ? consultaInventario.usuario : '',
              nombre: consultaInventario ? consultaInventario.nombre : '',
              cantidad: consultaInventario ? consultaInventario.cantidad : '',
              seriales: consultaInventario ? consultaInventario.seriales : '',
              serie: consultaInventario ? consultaInventario.serie : '',
            }}
            validationSchema={validationSchema}
            onSubmit={({setSubmitting}) => {
              setSubmitting(true);
              setSubmitting(false);
            }}>
            {({values, initialValues, setFieldValue}) => (
              <ConsultaInventarioForm
                values={values}
                setFieldValue={setFieldValue}
                handleOnClose={handleOnClose}
                titulo={titulo}
                accion={accion}
                initialValues={initialValues}
                modulos={modulos}
              />
            )}
          </Formik>
        </Scrollbar>
      </Dialog>
    )
  );
};

export default ConsultaInventarioCreador;
