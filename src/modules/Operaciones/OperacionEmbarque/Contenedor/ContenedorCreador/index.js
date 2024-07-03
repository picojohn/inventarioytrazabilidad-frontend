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
} from 'redux/actions/OperacionEmbarqueContenedorAction';
import { onGetColeccionLigera as onGetContenedores } from 'redux/actions/ContenedorAction';
import ContenedorEmbarqueForm from './ContenedorForm';
import {Fonts} from 'shared/constants/AppEnums';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='down' ref={ref} {...props} />;
});

const validationSchema = yup.object({
  numero_contenedor: yup
    .string()
    .required('Requerido')
    .min('10', 'Debe tener mínimo 10 Caracteres')
    .max('11', 'Debe tener máximo 11 Caracteres')
    .matches(/^[a-zA-Z]{3}[u|U|j|J|z|Z][0-9]/, 'Número contenedor inválido')
    .test({
      name: 'digito',
      exclusive: false,
      params: {},
      message: 'Dígito verificacion inválido', // eslint-disable-line
      test: function(value){
        return (value && value.length === 11 && this.parent.digito_verificacion === parseInt(value.substring(10, 11))) || (value && value.length === 10) || value === undefined;
      }
    }),
  digito_verificacion: yup
    .number()
    .required('Requerido'),
  operacion_embarque_id: yup
    .number()
    .required('Requerido'),
  estado_contenedor: yup
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

const ContenedorEmbarqueCreador = (props) => {
  const {
    contenedorEmbarque,
    operacionEmbarque,
    handleOnClose,
    accion,
    updateColeccion,
    titulo,
  } = props;

  const dispatch = useDispatch();

  const classes = useStyles(props);

  const [showForm, setShowForm] = useState(false);
  let selectedRow = useRef();
  selectedRow = useSelector(
    ({operacionEmbarqueContenedorReducer}) => operacionEmbarqueContenedorReducer.selectedRow,
  );

  const contenedores = useSelector(({contenedorReducer}) => contenedorReducer.ligera);

  useEffect(() => {
    initializeSelectedRow();
    if(operacionEmbarque){
      dispatch(onGetContenedores(operacionEmbarque?.cliente_id));
    }
  }, [operacionEmbarque]); // eslint-disable-line
  
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
    if (((accion === 'editar') || (accion === 'ver')) && operacionEmbarque) {
      dispatch(onShow(contenedorEmbarque, operacionEmbarque?.id));
    }
  }, [accion, dispatch, contenedorEmbarque, operacionEmbarque]);

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
            initialStatus={true}
            enableReinitialize={true}
            validateOnBlur={false}
            initialValues={{
              id: selectedRow?.id??'',
              operacion_embarque: operacionEmbarque?.nombre??'',
              operacion_embarque_id: operacionEmbarque?.id??'',
              numero_contenedor: selectedRow?.contenedor?.numero_contenedor??'',
              digito_verificacion: selectedRow?.contenedor?.digito_verificacion??'',
              estado_contenedor: selectedRow?.estado_contenedor??'ACT',
              observaciones: selectedRow?.observaciones??'',
              is_loading: ''
            }}
            validationSchema={validationSchema}
            onSubmit={(data, {setSubmitting}) => {
              setSubmitting(true);
              if (accion === 'crear') {
                data.numero_contenedor = data.numero_contenedor.substring(0,10);
                dispatch(onCreate(data, handleOnClose, updateColeccion));
              } else if (accion === 'editar') {
                if (selectedRow) {
                  dispatch(onUpdate(data, handleOnClose, updateColeccion));
                }
              }
              setSubmitting(false);
            }}>
            {({initialValues, setFieldValue, errors, values}) => (
              <ContenedorEmbarqueForm
                setFieldValue={setFieldValue}
                handleOnClose={handleOnClose}
                titulo={titulo}
                accion={accion}
                initialValues={initialValues}
                contenedores={contenedores}
                errors={errors}
                values={values}
              />
            )}
          </Formik>
        </Scrollbar>
      </Dialog>
    )
  );
};

export default ContenedorEmbarqueCreador;
