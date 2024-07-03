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
  onShow,
  onUpdate,
} from 'redux/actions/PedidoDetalleAction';
import { onGetColeccionLigera as onGetKits} from 'redux/actions/KitAction';
import { onGetColeccionLigera as onGetProductos} from 'redux/actions/ProductoClienteAction';
import { onGetColeccionLigera as onGetColores} from 'redux/actions/ColorAction';
import Slide from '@material-ui/core/Slide';
import PedidoDetalleEditorForm from './PedidoDetalleEditorForm';
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
  cantidad: yup
    .number()
    .integer('Debe ser un entero')
    .required('Requerido')
    .typeError('Debe ser un número')
    .min(1, 'Debe ser mayor que 0'),
  color_id: yup.number().nullable(),
  prefijo: yup.string().nullable().max(15, 'Máximo 15 caracteres'),
  posfijo: yup.string().nullable().max(15, 'Máximo 15 caracteres'),
  longitud_serial: yup
    .number()
    .integer('Debe ser un entero')
    .nullable()
    .typeError('Debe ser un número')
    .test({
      name: 'minimo',
      exclusive: false,
      params: {
        ref: yup.ref('longitud_final')
      },
      message: 'Debe ser al menos ${ref}', // eslint-disable-line
      test: function(value){
        return value == null || value >= parseInt(this.parent.longitud_final??'0')
      }
    }),
  consecutivo_serie_inicial: yup
    .number()
    .integer('Debe ser un entero')
    .nullable()
    .typeError('Solo debe contener números')
    .min(yup.ref('minimo'), 'Este consecutivo inicial generará seriales negativas'),
  serie_inicial_articulo: yup.string().nullable(),
  serie_final_articulo: yup.string().nullable(),
  longitud_sello: yup.string().nullable(),
  diametro: yup.string().nullable(),
  observaciones: yup.string().nullable(),
  consecutivo_serie_final: yup.number().nullable(),
  longitud_final: yup.number().nullable(),
  minimo: yup.number().nullable(),
});

const PedidoDetalleEditor = (props) => {
  const {
    detalle,
    handleOnClose,
    accion,
    updateColeccion,
    titulo,
    pedido,
    kit,
    subProducto,
    productosS3
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
  const kits = useSelector(({kitReducer}) => kitReducer.ligera);
  const productos = useSelector(({productoClienteReducer}) => productoClienteReducer.ligera);
  const colores = useSelector(({colorReducer}) => colorReducer.ligera);

  let selectedRow = useRef();
  selectedRow = useSelector(
    ({ pedidoDetalleReducer }) => pedidoDetalleReducer.selectedRow,
  );

  const initializeSelectedRow = () => {
    selectedRow = null;
  };
  useEffect(() => {
    initializeSelectedRow();
    dispatch(onGetKits());
    dispatch(onGetProductos());
    dispatch(onGetColores());
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

  useEffect(() => {
    if ((accion === 'editar') | (accion === 'ver'))
      dispatch(onShow(pedido.id, detalle));
    // eslint-disable-next-line
  }, [accion, dispatch, detalle]);

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
              id: selectedRow?.id??'',
              pedido_id: pedido?.id??'',
              numero_pedido: pedido?.numero_pedido??'',
              fecha_pedido: pedido?.fecha_pedido??'',
              cliente: pedido?.cliente??'',
              cliente_id: pedido?.cliente_id??'',
              producto_id: selectedRow?.producto?.id?? '',
              kit_id: selectedRow?.kit?.id?? '',
              cantidad: selectedRow?.cantidad??'',
              color_id: selectedRow?.color_id??'',
              prefijo: selectedRow?.prefijo??'',
              posfijo: selectedRow?.posfijo??'',
              longitud_serial: selectedRow?.longitud_serial??'',
              consecutivo_serie_inicial: selectedRow?.consecutivo_serie_inicial??'',
              consecutivo_serie_final: '',
              longitud_final: '',
              serie_inicial_articulo: selectedRow?.serie_inicial_articulo??'',
              serie_final_articulo: selectedRow?.serie_final_articulo??'',
              longitud_sello: selectedRow?.longitud_sello??'',
              diametro: selectedRow?.diametro??'',
              observaciones: selectedRow?.observaciones??'',
              tipo: kit?'P':'K',
              producto_s3: '',
              estado: '1',
              minimo: ''
            }}
            validationSchema={validationSchema}
            onSubmit={
              (data, { setSubmitting }) => {
                setSubmitting(true);
                if (accion === 'editar') {
                  if (selectedRow) {
                    dispatch(onUpdate(data, handleOnClose, updateColeccion));
                  }
                }
                setSubmitting(false);
              }
            }>{({ initialValues, values, setFieldValue, errors, handleReset }) => (
              <PedidoDetalleEditorForm
                handleOnClose={handleOnClose}
                titulo={titulo}
                accion={accion}
                values={values}
                initialValues={initialValues}
                kit={kit}
                kits={kits}
                productos={productos}
                productosS3={productosS3}
                setFieldValue={setFieldValue}
                colores={colores}
                subProducto={subProducto}
                errors={errors}
                handleReset={handleReset}
              />
            )}
          </Formik>
        </Scrollbar>
      </Dialog>
    )
  );
};

export default PedidoDetalleEditor;
