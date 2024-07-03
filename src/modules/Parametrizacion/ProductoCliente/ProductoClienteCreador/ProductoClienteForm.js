import React, {useEffect, useState} from 'react';
import {Box, Button } from '@material-ui/core';
import {Form} from 'formik';
import {makeStyles} from '@material-ui/core/styles';
import Scrollbar from '../../../../@crema/core/Scrollbar';
import IntlMessages from '../../../../@crema/utility/IntlMessages';
import {Fonts} from '../../../../shared/constants/AppEnums';
import MyTextField from 'shared/components/MyTextField';
import MyRadioField from 'shared/components/MyRadioField';
import MyAutocomplete from 'shared/components/MyAutoComplete';
import MyAutocompleteProducto from 'shared/components/MyAutocompleteProducto';
import MySelectField from 'shared/components/MySelectField';
import { OPERADORES } from 'shared/constants/ListaValores';

const useStyles = makeStyles((theme) => ({
  bottomsGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingBottom: '20px',
    gap: '10px',
    backgroundColor: 'white',
    paddingRight: '20px',
    position: 'sticky',
    left: 0,
    bottom: 0,
  },
  myTextField: {
    width: '100%',
    marginBottom: 5,
    [theme.breakpoints.up('xl')]: {
      marginBottom: 5,
    },
    height: '60px',
    paddingRight: '20px',
  },
  MySelectField: {
    width: 'auto',
    marginBottom: 16,
    [theme.breakpoints.up('xl')]: {
      marginBottom: 24,
    },
    color: theme.palette.primary.main,
    '&:target': {
      color: theme.palette.primary.main,
    },
  },
  btnRoot: {
    paddingLeft: 15,
    paddingRight: 15,
    color: 'white',
    '&:hover': {
      backgroundColor: theme.palette.colorHover,
      cursor: 'pointer',
    },
  },
  btnPrymary: {
    backgroundColor: theme.palette.primary.main,
  },
  btnSecundary: {
    backgroundColor: theme.palette.grayBottoms,
  },
  widthFull: {
    width: '100%',
  },
  pointer: {
    cursor: 'pointer',
  },
  inputs_2: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(2,1fr)',
  },
}));

const options = [
  {value: '1', label: 'Activo'},
  {value: '0', label: 'Inactivo'},
];

const options2 = [
  {value: 'S', label: 'Sí'},
  {value: 'N', label: 'No'},
];

const ProductoClienteForm = (props) => {
  const {
    handleOnClose, 
    accion, 
    initialValues, 
    titulo, 
    productos,
    clientes,
    values,
    setFieldValue
  } = props;

  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    if (accion === 'ver' || initialValues.estado === '0') {
      setDisabled(true);
    }
  }, [initialValues.estado, accion]);

  useEffect(() => {
    if(values.producto_s3_id){
      const producto = productos.find((producto) => producto.id === values.producto_s3_id);
      if(producto){
        setFieldValue('nombre_producto_s3', producto.alias_producto);
        if(initialValues.producto_s3_id !== values.producto_s3_id || !initialValues.producto_s3_id)
        setFieldValue('indicativo_producto_empaque', producto.producto_empaque);
      }
    } else {
      setFieldValue('nombre_producto_s3', '');
      setFieldValue('indicativo_producto_empaque', 'N');
    }
  },[values.producto_s3_id]) // eslint-disable-line

  const classes = useStyles(props);

  return (
    <Form className='' noValidate autoComplete='off'>
      <Scrollbar style={{maxHeight: 600}}>
        <Box py={5} px={{xs: 5, lg: 8, xl: 10}}>
          <Box
            component='h6'
            mb={{xs: 4, xl: 6}}
            fontSize={20}
            fontWeight={Fonts.MEDIUM}>
            {titulo}
          </Box>

          <Box px={{md: 5, lg: 8, xl: 10}}>
            <Box className={classes.inputs_2}>
              <MyAutocompleteProducto
                label='Código Producto Interno'
                completeid='true'
                style={{
                  paddingRight: '10px'
                }}
                className={classes.myTextField}
                name='producto_s3_id'
                disabled={disabled}
                options={productos}
              />
              <MyTextField
                className={classes.myTextField}
                label='Nombre Producto Interno'
                name='nombre_producto_s3'
                disabled
              />
              <MyAutocomplete
                label='Cliente'
                style={{
                  paddingRight: '10px'
                }}
                className={classes.myTextField}
                name='cliente_id'
                disabled={disabled}
                options={clientes}
              />
            </Box>
            <Box>
              <MyTextField
                className={classes.myTextField}
                label='Nombre Producto Cliente'
                name='nombre_producto_cliente'
                disabled={disabled}
              />
            </Box>
            <Box className={classes.inputs_2}>
              <MyTextField
                className={classes.myTextField}
                label='Código Externo'
                name='codigo_externo_producto'
                disabled={disabled}
              />
              <MyRadioField
                label='Producto Externo'
                name='indicativo_producto_externo'
                required
                disabled={disabled}
                options={options2}
              />
              <MyRadioField
                label='Empaque'
                name='indicativo_producto_empaque'
                required
                disabled={disabled}
                options={options2}
              />
            </Box>
            <Box
              mb={{xs: 4, xl: 6}}
              fontSize={14}
              fontWeight={Fonts.BOLD}>
              Datos Encriptación
            </Box>
            <Box className={classes.inputs_2}>
              <MyTextField
                className={classes.myTextField}
                label='Valor Serial Interno'
                name='valor_serial_interno'
                disabled={disabled}
              />
              <MySelectField
                className={classes.myTextField} 
                label='Operador Serial Interno' 
                name='operador_serial_interno' 
                disabled={disabled}
                ninguno='true' 
                options={OPERADORES}
              />
              <MyTextField
                className={classes.myTextField}
                label='Valor Serial QR'
                name='valor_serial_qr'
                disabled={disabled}
              />
              <MySelectField
                className={classes.myTextField} 
                label='Operador Serial QR' 
                name='operador_serial_qr' 
                disabled={disabled}
                ninguno='true' 
                options={OPERADORES}
              />
              <MyTextField
                className={classes.myTextField}
                label='Valor Serial Datamatrix'
                name='valor_serial_datamatrix'
                disabled={disabled}
              />
              <MySelectField
                className={classes.myTextField} 
                label='Operador Serial Datamatrix' 
                name='operador_serial_datamatrix' 
                disabled={disabled}
                ninguno='true' 
                options={OPERADORES}
              />
              <MyTextField
                className={classes.myTextField}
                label='Valor Serial PDF'
                name='valor_serial_pdf'
                disabled={disabled}
              />
              <MySelectField
                className={classes.myTextField} 
                label='Operador Serial PDF' 
                name='operador_serial_pdf' 
                disabled={disabled}
                ninguno='true' 
                options={OPERADORES}
              />
            </Box>
            <Box>
              <MyRadioField
                label='Estado'
                name='estado'
                required
                disabled={accion === 'ver'}
                options={options}
              />
            </Box>
          </Box>
        </Box>
      </Scrollbar>
      <Box className={classes.bottomsGroup}>
        {accion !== 'ver' ? (
          <Button
            className={`${classes.btnRoot} ${classes.btnPrymary}`}
            variant='contained'
            type='submit'>
            <IntlMessages id='boton.submit' />
          </Button>
        ) : (
          ''
        )}
        <Button
          className={`${classes.btnRoot} ${classes.btnSecundary}`}
          onClick={handleOnClose}>
          <IntlMessages id='boton.cancel' />
        </Button>
      </Box>
    </Form>
  );
};

export default ProductoClienteForm;
