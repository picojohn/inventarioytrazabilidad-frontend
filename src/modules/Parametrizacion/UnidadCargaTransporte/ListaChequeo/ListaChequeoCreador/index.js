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
} from 'redux/actions/ListaChequeoAction';
import { onGetColeccionLigera as onGetClasesInspeccion } from 'redux/actions/ClaseInspeccionAction';
import ListaChequeoForm from './ListaChequeoForm';
import {Fonts} from 'shared/constants/AppEnums';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='down' ref={ref} {...props} />;
});

const validationSchema = yup.object({
  nombre: yup
    .string()
    .required('Requerido')
    .max('128', 'Debe tener máximo 128 Caracteres'),
  clase_inspeccion_id: yup
    .number()
    .required('Requerido')
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

const UnidadCargaTransporteCreator = (props) => {
  const {
    tipoListaChequeo,
    unidadCarga,
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
    ({listaChequeoReducer}) => listaChequeoReducer.selectedRow,
  );

  const clasesInspeccion = useSelector(({claseInspeccionReducer}) => claseInspeccionReducer.ligera);

  useEffect(() => {
    initializeSelectedRow();
    dispatch(onGetClasesInspeccion());
  }, []); // eslint-disable-line
  
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
    if (((accion === 'editar') || (accion === 'ver')) && unidadCarga) {
      dispatch(onShow(tipoListaChequeo, unidadCarga?.id));
    }
  }, [accion, dispatch, tipoListaChequeo, unidadCarga]);

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
              nombre: selectedRow?.nombre??'',
              clase_inspeccion_id: selectedRow?.claseInspeccion?.id??'',
              unidad_carga: unidadCarga?.nombre??'',
              unidad_carga_id: unidadCarga?.id??'',
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
              <ListaChequeoForm
                setFieldValue={setFieldValue}
                handleOnClose={handleOnClose}
                titulo={titulo}
                accion={accion}
                initialValues={initialValues}
                clasesInspeccion={clasesInspeccion}
              />
            )}
          </Formik>
        </Scrollbar>
      </Dialog>
    )
  );
};

export default UnidadCargaTransporteCreator;
