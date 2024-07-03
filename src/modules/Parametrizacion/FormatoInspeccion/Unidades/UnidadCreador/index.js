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
} from 'redux/actions/FormatoInspeccionUnidadAction';
import { onGetColeccionLigera as onGetUnidades } from 'redux/actions/UnidadCargaTransporteAction';
import UnidadCreadorForm from './UnidadCreadorForm';
import {Fonts} from 'shared/constants/AppEnums';
import { fetchError } from 'redux/actions';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='down' ref={ref} {...props} />;
});

const validationSchema = yup.object({
  unidad_id: yup
    .number()
    .required('Requerido'),
  formato_id: yup
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

const UnidadCreador = (props) => {
  const {
    unidadFormato,
    formatoInspeccion,
    handleOnClose,
    accion,
    updateColeccion,
    titulo,
  } = props;

  const dispatch = useDispatch();
  const classes = useStyles(props);
  const [selected, setSelected] = useState([]);
  const [showForm, setShowForm] = useState(false);
  let selectedRow = useRef();
  selectedRow = useSelector(
    ({formatoInspeccionUnidadReducer}) => formatoInspeccionUnidadReducer.selectedRow,
  );
  const unidades = useSelector(({unidadCargaTransporteReducer}) => unidadCargaTransporteReducer.ligera);
  const listas = useSelector(({listaChequeoReducer}) => listaChequeoReducer.ligera);

  useEffect(() => {
    initializeSelectedRow();
    dispatch(onGetUnidades());
  }, []); // eslint-disable-line

  useEffect(() => {
    if(unidadFormato.listas){
      const list = unidadFormato.listas.reduce((result, data) => {
        result.push(data.tipo_lista_id)
        return result;
      }, []);
      setSelected(list);
    }
  },[unidadFormato])
  
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
    if (((accion === 'editar') || (accion === 'ver')) && formatoInspeccion && unidadFormato) {
      dispatch(onShow(unidadFormato.id, formatoInspeccion?.id));
    }
  }, [accion, dispatch, unidadFormato, formatoInspeccion]);

  const initializeSelectedRow = () => {
    selectedRow = null;
  };

  if (accion === 'crear') {
    initializeSelectedRow();
  }

  const setSelectedLists = (list) => {
    setSelected(list)
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
              tipo_unidad: selectedRow?.unidad?.tipo_unidad??'',
              unidad_id: selectedRow?.unidad?.id??'',
              formato: formatoInspeccion?.nombre??'',
              clase_inspeccion: formatoInspeccion?.clase_inspeccion??'',
              formato_id: formatoInspeccion?.id??'',
            }}
            validationSchema={validationSchema}
            onSubmit={(data, {setSubmitting}) => {
              setSubmitting(true);
              if(selected.length === 0){
                dispatch(fetchError('Debe seleccionar al menos una lista'))
                return;
              }
              data.listas = selected;
              if (accion === 'crear') {
                dispatch(onCreate(data, handleOnClose, updateColeccion));
              } else if (accion === 'editar') {
                if (selectedRow) {
                  dispatch(onUpdate(data, handleOnClose, updateColeccion));
                }
              }
              setSubmitting(false);
            }}>
            {({initialValues, setFieldValue, values}) => (
              <UnidadCreadorForm
                setFieldValue={setFieldValue}
                handleOnClose={handleOnClose}
                titulo={titulo}
                accion={accion}
                initialValues={initialValues}
                unidades={unidades}
                values={values}
                dispatch={dispatch}
                listas={listas}
                selected={selected}
                setSelected={setSelectedLists}
                formatoInspeccion={formatoInspeccion}
              />
            )}
          </Formik>
        </Scrollbar>
      </Dialog>
    )
  );
};

export default UnidadCreador;
