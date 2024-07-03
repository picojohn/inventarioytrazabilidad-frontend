import React, { useEffect, useRef, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { Formik } from 'formik';
import * as yup from 'yup';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { Scrollbar } from '@crema';
import {
  onCreate,
} from 'redux/actions/PedidoDetalleAction';
import { onGetColeccionLigera as onGetKits} from 'redux/actions/KitAction';
import { onGetColeccionLigera as onGetProductos} from 'redux/actions/ProductoClienteAction';
import Slide from '@material-ui/core/Slide';
import PedidoDetalleForm from './PedidoDetalleForm';
import { Fonts } from 'shared/constants/AppEnums';
import { makeStyles } from '@material-ui/core/styles/index';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='down' ref={ref} {...props} />;
});

const validationSchema = yup.object({
  pedido_id: yup.number().required('Requerido'),
  producto_id: yup
    .number()
    .nullable()
    .when('tipo', {
      is: 'P',
      then: yup.number().required('Requerido')
    }),
  kit_id: yup
    .number()
    .nullable()
    .when('tipo', {
      is: 'K',
      then: yup.number().required('Requerido')
    }),
  cantidad: yup.number().required('Requerido'),
  tipo: yup.string().required('Requerido'),
});

const PedidoDetalleCreador = (props) => {
  const {
    handleOnClose,
    accion,
    updateColeccion,
    titulo,
    pedido,
  } = props;

  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const useStyles = makeStyles(
    (theme) => ({
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
    })
  );

  const classes = useStyles(props);

  let selectedRow = useRef();
  selectedRow = useSelector(
    ({ pedidoDetalleReducer }) => pedidoDetalleReducer.selectedRow,
  );
  const kits = useSelector(({kitReducer}) => kitReducer.ligera);
  const productos = useSelector(({productoClienteReducer}) => productoClienteReducer.ligera);

  const initializeSelectedRow = () => {
    selectedRow = null;
  };
  useEffect(() => {
    initializeSelectedRow();
    dispatch(onGetKits());
    dispatch(onGetProductos());
  }, []); // eslint-disable-line

  if (accion === 'crear') {
    initializeSelectedRow();
  }

  useEffect(() => {
    if (selectedRow)
      setShowForm(true);
    else
      if (accion === 'crear')
        setShowForm(true);
      else
        setShowForm(false);
  }, [selectedRow, accion]);

  return (
    showForm && (
      <Dialog
        open={showForm}
        onClose={handleOnClose}
        aria-labelledby='simple-modal-title'
        TransitionComponent={Transition}
        aria-describedby='simple-modal-description'
        className={classes.dialogBox}
        maxWidth={'md'}
        fullWidth>
        <Scrollbar>
          <Formik
            initialStatus={true}
            enableReinitialize={true}
            validateOnBlur={false}
            initialValues={{
              pedido_id: pedido?.id??'',
              numero_pedido: pedido?.numero_pedido??'',
              fecha_pedido: pedido?.fecha_pedido??'',
              cliente: pedido?.cliente??'',
              cliente_id: pedido?.cliente_id??'',
              producto_id: selectedRow?.producto_id??'',
              kit_id: selectedRow?.kit_id??'',
              cantidad: selectedRow?.cantidad??'',
              estado: '1',
              tipo: selectedRow?.tipo??'',
            }}
            validationSchema={validationSchema}
            onSubmit={
              (data, { setSubmitting }) => {
                if(data.tipo === 'K' && data.producto_id){
                  data.producto_id = '';
                }
                if(data.tipo === 'P' && data.kit_id){
                  data.kit_id = '';
                }
                setSubmitting(true);
                if (accion === 'crear') {
                  dispatch(onCreate(data, handleOnClose, updateColeccion));
                }
                setSubmitting(false);
              }
            }>{({ initialValues, values }) => (
              <PedidoDetalleForm
                handleOnClose={handleOnClose}
                titulo={titulo}
                accion={accion}
                values={values}
                initialValues={initialValues}
                kits={kits}
                productos={productos}
              />
            )}
          </Formik>
        </Scrollbar>
      </Dialog>
    )
  );
};

export default PedidoDetalleCreador;
