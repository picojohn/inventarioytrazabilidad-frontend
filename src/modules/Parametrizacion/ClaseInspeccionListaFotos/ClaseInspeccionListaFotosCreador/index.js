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
} from '../../../../redux/actions/ClaseInspeccionListaFotosAction';
import Slide from '@material-ui/core/Slide';
import ClienteConductorForm from './ClaseInspeccionListaFotosForm';
import {Fonts} from '../../../../shared/constants/AppEnums';
import {makeStyles} from '@material-ui/core/styles/index';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='down' ref={ref} {...props} />;
});

const validationSchema = yup.object({
  cliente_id: yup.number().required('Requerido'),
  numero_orden: yup.number().required('Requerido').typeError('Debe ser un número'),
  nombre: yup.string().required('Requerido'),
  estado: yup.string().required('Requerido'),
});

const ClaseInspeccionListaFotosCreador = (props) => {
  const {
    selected,
    handleOnClose,
    accion,
    updateColeccion,
    titulo,
    headers,
  } = props;

  const dispatch = useDispatch();
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

  let selectedRow = useRef();
  selectedRow = useSelector(
    ({claseInspeccionListaFotosReducer}) => claseInspeccionListaFotosReducer.selectedRow,
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
    if (selectedRow) setShowForm(true);
    else if (accion === 'crear') setShowForm(true);
    else setShowForm(false);
  }, [selectedRow, accion]);

  useEffect(() => {
    if ((accion === 'editar') | (accion === 'ver'))
      dispatch(onShow(headers?.clase_inspeccion?.id, selected));
    // eslint-disable-next-line
  }, [accion, dispatch, selected]);

  return (
    showForm && (
      <Dialog
        open={showForm}
        onClose={handleOnClose}
        aria-labelledby='simple-modal-title'
        TransitionComponent={Transition}
        aria-describedby='simple-modal-description'
        className={classes.dialogBox}
        maxWidth={'sm'}
        fullWidth>
        <Scrollbar>
          <Formik
            initialStatus={true}
            enableReinitialize={true}
            validateOnBlur={false}
            initialValues={{
              id: selectedRow?.id ?? '',
              clase_inspeccion_id: headers?.clase_inspeccion?.id ?? '',
              cliente_id: headers?.cliente?.id ?? '',
              nombre_cliente: headers?.cliente?.nombre ?? '',
              nombre_clase_inspeccion: headers?.clase_inspeccion?.nombre ?? '',
              nombre: selectedRow?.nombre ?? '',
              numero_orden: selectedRow?.numero_orden ?? '',
              estado: selectedRow
                ? selectedRow.estado === 1
                  ? '1'
                  : '0'
                : '1',
            }}
            validationSchema={validationSchema}
            onSubmit={(data, {setSubmitting}) => {
              setSubmitting(true);
              if (accion === 'crear')
                dispatch(onCreate(data, handleOnClose, updateColeccion));
              else if (accion === 'editar')
                if (selectedRow)
                  dispatch(onUpdate(data, handleOnClose, updateColeccion));
              setSubmitting(false);
            }}>
            {({initialValues, values}) => (
              <ClienteConductorForm
                handleOnClose={handleOnClose}
                titulo={titulo}
                accion={accion}
                values={values}
                initialValues={initialValues}
              />
            )}
          </Formik>
        </Scrollbar>
      </Dialog>
    )
  );
};

export default ClaseInspeccionListaFotosCreador;
