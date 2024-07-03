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
} from '../../../../redux/actions/ProductoClienteAction';
import { onGetColeccionLigera as onGetClientes } from 'redux/actions/ClienteAction';
import Slide from '@material-ui/core/Slide';
import ProductoClienteForm from './ProductoClienteForm';
import {Fonts} from '../../../../shared/constants/AppEnums';
import {makeStyles} from '@material-ui/core/styles/index';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='down' ref={ref} {...props} />;
});
const operators = ['+', '-', '*'];

const validationSchema = yup.object().shape({
  producto_s3_id: yup
    .number()
    .required('Requerido'),
  cliente_id: yup
    .number()
    .required('Requerido'),
  nombre_producto_cliente: yup
    .string()
    .required('Requerido'),
  codigo_externo_producto: yup
    .string()
    .nullable(),
  valor_serial_interno: yup
    .number()
    .integer('Debe ser un entero')
    .nullable()
    .when('operador_serial_interno', {
      is: (operador_serial_interno) => !operador_serial_interno,
      then: yup.number().integer('Debe ser un entero').nullable(),
      otherwise: yup.number().integer('Debe ser un entero').required('Debe especificar un valor'),
    }),
  operador_serial_interno: yup
    .string()
    .oneOf(operators, 'Debe ser un operador')
    .nullable()
    .when('valor_serial_interno', {
      is: (valor_serial_interno) => !valor_serial_interno,
      then: yup.string().oneOf(operators, 'Debe ser un operador').nullable(),
      otherwise: yup.string().oneOf(operators, 'Debe ser un operador').required('Debe especificar un operador'),
    }),
  valor_serial_qr: yup
    .number()
    .integer('Debe ser un entero')
    .nullable()
    .when('operador_serial_qr', {
      is: (operador_serial_qr) => !operador_serial_qr,
      then: yup.number().integer('Debe ser un entero').nullable(),
      otherwise: yup.number().integer('Debe ser un entero').required('Debe especificar un valor'),
    }),
  operador_serial_qr: yup
    .string()
    .oneOf(operators, 'Debe ser un operador')
    .nullable()
    .when('valor_serial_qr', {
      is: (valor_serial_qr) => !valor_serial_qr,
      then: yup.string().oneOf(operators, 'Debe ser un operador').nullable(),
      otherwise: yup.string().oneOf(operators, 'Debe ser un operador').required('Debe especificar un operador'),
    }),
  valor_serial_datamatrix: yup
    .number()
    .integer('Debe ser un entero')
    .nullable()
    .when('operador_serial_datamatrix', {
      is: (operador_serial_datamatrix) => !operador_serial_datamatrix,
      then: yup.number().integer('Debe ser un entero').nullable(),
      otherwise: yup.number().integer('Debe ser un entero').required('Debe especificar un valor'),
    }),
  operador_serial_datamatrix: yup
    .string()
    .oneOf(operators, 'Debe ser un operador')
    .nullable()
    .when('valor_serial_datamatrix', {
      is: (valor_serial_datamatrix) => !valor_serial_datamatrix,
      then: yup.string().oneOf(operators, 'Debe ser un operador').nullable(),
      otherwise: yup.string().oneOf(operators, 'Debe ser un operador').required('Debe especificar un operador'),
    }),
  valor_serial_pdf: yup
    .number()
    .integer('Debe ser un entero')
    .nullable()
    .when('operador_serial_pdf', {
      is: (operador_serial_pdf) => !operador_serial_pdf,
      then: yup.number().integer('Debe ser un entero').nullable(),
      otherwise: yup.number().integer('Debe ser un entero').required('Debe especificar un valor'),
    }),
  operador_serial_pdf: yup
    .string()
    .oneOf(operators, 'Debe ser un operador')
    .nullable()
    .when('valor_serial_pdf', {
      is: (valor_serial_pdf) => !valor_serial_pdf,
      then: yup.string().oneOf(operators, 'Debe ser un operador').nullable(),
      otherwise: yup.string().oneOf(operators, 'Debe ser un operador').required('Debe especificar un operador'),
    }),
},[
  ['valor_serial_interno','operador_serial_interno'],
  ['valor_serial_qr','operador_serial_qr'],
  ['valor_serial_datamatrix','operador_serial_datamatrix'],
  ['valor_serial_pdf','operador_serial_pdf'],
]);

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

const ProductoClienteCreador = (props) => {
  const {
    productoCliente,
    handleOnClose,
    accion,
    updateColeccion,
    titulo,
    productos,
  } = props;

  const dispatch = useDispatch();

  const classes = useStyles(props);

  const [showForm, setShowForm] = useState(false);
  let selectedRow = useRef();
  selectedRow = useSelector(
    ({productoClienteReducer}) => productoClienteReducer.selectedRow,
  );
  const clientes = useSelector(({clienteReducer}) => clienteReducer.ligera);

  const initializeSelectedRow = () => {
    selectedRow = null;
  };
  useEffect(() => {
    initializeSelectedRow();
    dispatch(onGetClientes());
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
      dispatch(onShow(productoCliente));
    }
  }, [accion, dispatch, productoCliente]);

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
              id: selectedRow ? selectedRow.id : '',
              producto_s3_id: selectedRow?.producto_s3_id??'',
              nombre_producto_s3:'',
              cliente_id: selectedRow?.cliente_id??'',
              nombre_producto_cliente: selectedRow?.nombre_producto_cliente??'',
              codigo_externo_producto: selectedRow?.codigo_externo_producto??'',
              valor_serial_interno: selectedRow?.valor_serial_interno??'',
              operador_serial_interno: selectedRow?.operador_serial_interno??'',
              valor_serial_qr: selectedRow?.valor_serial_qr??'',
              operador_serial_qr: selectedRow?.operador_serial_qr??'',
              valor_serial_datamatrix: selectedRow?.valor_serial_datamatrix??'',
              operador_serial_datamatrix: selectedRow?.operador_serial_datamatrix??'',
              valor_serial_pdf: selectedRow?.valor_serial_pdf??'',
              operador_serial_pdf: selectedRow?.operador_serial_pdf??'',
              indicativo_producto_externo: selectedRow? selectedRow.indicativo_producto_externo === 'S'
                  ? 'S'
                  : 'N'
                : 'N',
              indicativo_producto_empaque: selectedRow? selectedRow.indicativo_producto_empaque === 'S'
                  ? 'S'
                  : 'N'
                : 'N',
              estado: selectedRow? selectedRow.estado === 1
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
            {({initialValues, setFieldValue, values}) => (
              <ProductoClienteForm
                setFieldValue={setFieldValue}
                handleOnClose={handleOnClose}
                titulo={titulo}
                accion={accion}
                initialValues={initialValues}
                productos={productos}
                clientes={clientes}
                values={values}
              />
            )}
          </Formik>
        </Scrollbar>
      </Dialog>
    )
  );
};

export default ProductoClienteCreador;
