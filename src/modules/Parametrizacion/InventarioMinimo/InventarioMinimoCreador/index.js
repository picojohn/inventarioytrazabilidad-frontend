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
} from 'redux/actions/InventarioMinimoAction';
import { onGetColeccionLigera as onGetProductos } from 'redux/actions/ProductoClienteAction';
import { onGetColeccionLigera as onGetKits } from 'redux/actions/KitAction';
import { onGetColeccionLigera as onGetProductosS3 } from 'redux/actions/ProductoAction';
import Slide from '@material-ui/core/Slide';
import InventarioMinimoForm from './InventarioMinimoForm';
import {Fonts} from 'shared/constants/AppEnums';
import {makeStyles} from '@material-ui/core/styles/index';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='down' ref={ref} {...props} />;
});

const validationSchema = yup.object({
  indicativo_k_p: yup
    .string()
    .required('Requerido'),
  cliente_id: yup
    .number()
    .required('Requerido'),
  lugar_id: yup
    .number()
    .required('Requerido'),
  kit_id: yup
    .number()
    .nullable()
    .when('indicativo_k_p', {
      is: 'K',
      then: yup.number().required('Requerido')
    }),
  producto_cliente_id: yup
    .number()
    .nullable()
    .when('indicativo_k_p', {
      is: 'P',
      then: yup.number().required('Requerido')
    }),
  cantidad_inventario_minimo: yup
    .number()
    .min(1, 'Debe ser mayor que 0')
    .integer('Debe ser un entero')
    .typeError('Debe ser un número')
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

const InventarioMinimoCreador = (props) => {
  const {
    inventarioMinimo,
    handleOnClose,
    accion,
    updateColeccion,
    titulo,
    user,
    clientes,
    lugares
  } = props;

  const dispatch = useDispatch();

  const classes = useStyles(props);

  const [showForm, setShowForm] = useState(false);
  let selectedRow = useRef();
  selectedRow = useSelector(
    ({inventarioMinimoReducer}) => inventarioMinimoReducer.selectedRow,
  );
  const productos = useSelector(({productoClienteReducer}) => productoClienteReducer.ligera);
  const kits = useSelector(({kitReducer}) => kitReducer.ligera);
  const productosS3 = useSelector(({productoReducer}) => productoReducer.ligera);

  const initializeSelectedRow = () => {
    selectedRow = null;
  };
  useEffect(() => {
    initializeSelectedRow();
    dispatch(onGetProductos());
    dispatch(onGetKits());
    dispatch(onGetProductosS3());
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
      dispatch(onShow(inventarioMinimo));
    }
  }, [accion, dispatch, inventarioMinimo]);

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
        maxWidth={'md'}>
        <Scrollbar>
          <Formik
            initialStatus={true}
            enableReinitialize={true}
            validateOnBlur={false}
            initialValues={{
              id: selectedRow?.id??'',
              cliente_id: selectedRow?.cliente?.id ?? (user?.rol?.tipo !== 'IN' ? user?.asociado?.id : ''),
              indicativo_k_p: selectedRow ? selectedRow.kit ? 'K' : 'P' : '',
              lugar_id: selectedRow?.lugar?.id??'',
              kit_id: selectedRow?.kit?.id??'',
              producto_cliente_id: selectedRow?.producto?.id??'',
              cantidad_inventario_minimo: selectedRow?.cantidad_inventario_minimo??'',
              producto_s3: '',
              estado: selectedRow
                ? selectedRow.estado === 1
                  ? '1'
                  : '0'
                : '1',
            }}
            validationSchema={validationSchema}
            onSubmit={(data, {setSubmitting}) => {
              setSubmitting(true);
              if(data.indicativo_k_p === 'P' && data.kit_id){
                data.kit_id = '';
              }
              if(data.indicativo_k_p === 'K' && data.producto_cliente_id){
                data.producto_cliente_id = '';
              }
              if (accion === 'crear') {
                dispatch(onCreate(data, handleOnClose, updateColeccion));
              } else if (accion === 'editar') {
                if (selectedRow) {
                  dispatch(onUpdate(data, handleOnClose, updateColeccion));
                }
              }
              setSubmitting(false);
            }}>
            {({initialValues, values, setFieldValue}) => (
              <InventarioMinimoForm
                handleOnClose={handleOnClose}
                titulo={titulo}
                accion={accion}
                initialValues={initialValues}
                productos={productos}
                kits={kits}
                clientes={clientes}
                lugares={lugares}
                values={values}
                productosS3={productosS3}
                setFieldValue={setFieldValue}
                user={user}
              />
            )}
          </Formik>
        </Scrollbar>
      </Dialog>
    )
  );
};

export default InventarioMinimoCreador;
