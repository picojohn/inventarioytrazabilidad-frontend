import React, { useEffect, useState } from 'react';
import {
  Box,
  Button
} from '@material-ui/core';
import { Form } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import Scrollbar from '@crema/core/Scrollbar';
import IntlMessages from '@crema/utility/IntlMessages';
import { Fonts } from 'shared/constants/AppEnums';
import MyTextField from 'shared/components/MyTextField';
import MyAutocomplete from 'shared/components/MyAutoComplete';
import MySelectField from 'shared/components/MySelectField';
import { useDataForSeal } from 'shared/hooks/useDataForSeal';
import { useMaximoARestar } from 'shared/hooks/useMaximoARestar';

// Estilos para utilizar en los diferentes componentes del formulario
const useStyles = makeStyles(
  (theme) => ({
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
      // marginBottom: 5,
      [theme.breakpoints.up('xl')]: {
        // marginBottom: 5,
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
    inputs_3: {
      width: '100%',
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
    },
  })
);

let filteredProductos = [];
let filteredKits = [];
let cuenta = 0;

const PedidoDetalleEditorForm = (props) => {
  const {
    handleOnClose,
    accion,
    initialValues,
    titulo,
    kit,
    kits,
    productos,
    values,
    productosS3,
    setFieldValue,
    colores,
    subProducto,
    handleReset
    // errors
  } = props;

  const [disabled, setDisabled] = useState(false);

  const {data, isLoading, getInfoSeal} = useDataForSeal();
  const {valor} = useMaximoARestar(values.producto_id);

  useEffect(() => {
    if (accion === 'ver' || initialValues.estado === '0')
      setDisabled(true);
  }, [initialValues.estado, accion]);

  useEffect(() => {
    if(valor){
      setFieldValue('minimo', valor-1);
    }
  },[valor]); // eslint-disable-line

  useEffect(() => {
    if(values.cliente_id){
      filteredKits = kits.filter((kit) => kit.cliente_id === parseInt(values.cliente_id));
      filteredProductos = productos.filter((producto) => producto.cliente_id === parseInt(values.cliente_id));
    }
  },[values.cliente_id, kits, productos]);

  useEffect(() => {
    if(values.producto_id){
      const producto = productos.find((product) => product.id === parseInt(values.producto_id));
      if(producto){
        const productoS3 = productosS3.find((s3Prod) => s3Prod.id === producto.producto_s3_id);
        if(productoS3){
          setFieldValue('producto_s3', productoS3.alias_producto);
        }
      }
    } else {
      setFieldValue('producto_s3', '');
    }
  },[values.producto_id, productos, productosS3]); // eslint-disable-line

  useEffect(() => {
    if(values.consecutivo_serie_inicial && values.cantidad){
      const end = parseInt(values.consecutivo_serie_inicial)+parseInt(values.cantidad);
      setFieldValue('consecutivo_serie_final', end);
      setFieldValue('longitud_final', end.toString().length);
    } else {
      setFieldValue('consecutivo_serie_final', '');
    }
  },[values.consecutivo_serie_inicial, values.cantidad]) // eslint-disable-line

  const classes = useStyles(props);

  useEffect(() => {
    if(values.tipo === 'P'){
      setSeries();
    }
  },[ // eslint-disable-line
    values.consecutivo_serie_inicial,
    values.cantidad,
    values.longitud_serial,
    values.prefijo,
    values.posfijo,
    values.tipo
  ]);

  useEffect(() => {
    if(initialValues.producto_id !== values.producto_id && values.producto_id){
      const producto = productos.find((product) => product.id === parseInt(values.producto_id));
      if(producto){
        const datos = {
          producto_id: values.producto_id,
          cliente_id: values.cliente_id,
          cantidad: values.cantidad === '' ? 0 : values.cantidad,
          pedido_id: values.pedido_id,
        }
        getInfoSeal(datos);
        cuenta +=1;
      }
    }
    if(cuenta > 0 && initialValues.producto_id === values.producto_id){
      handleReset();
    }
  },[ // eslint-disable-line
    values.producto_id, 
  ])
  
  useEffect(() => {
    if(!isLoading){
      setFieldValue('consecutivo_serie_inicial', data?.consecutivo_serie_inicial??'');
      setFieldValue('longitud_serial', data?.longitud_serial??'');
      setFieldValue('color_id', data?.color_id??'');
      setFieldValue('prefijo', data?.prefijo??'');
      setFieldValue('posfijo', data?.posfijo??'');
      setFieldValue('serie_inicial_articulo', data?.serie_inicial_articulo??'');
      setFieldValue('serie_final_articulo', data?.serie_final_articulo??'');
      setFieldValue('longitud_sello', data?.longitud_sello??'');
      setFieldValue('diametro', data?.diametro??'');
    }
  },[ // eslint-disable-line
    isLoading
  ])

  const setSeries = () => {
    const inicio = parseInt(values.consecutivo_serie_inicial===''?'1':values.consecutivo_serie_inicial);
    const cantidad = parseInt(values.cantidad);
    const longitud = values.longitud_serial??0;
    const prefijo = values.prefijo;
    const posfijo = values.posfijo;
    const final = (inicio+cantidad-1).toString().padStart(longitud, '0');
    const inicio_mod = inicio.toString().padStart(longitud, '0');
    const serie_inicial = prefijo+inicio_mod+posfijo;
    const serie_final = prefijo+final+posfijo;
    setFieldValue('serie_inicial_articulo', serie_inicial);
    setFieldValue('serie_final_articulo', serie_final);
  }

  return (
    <Form className='' noValidate autoComplete='off'>
      <Scrollbar style={{ maxHeight: 600 }}>
        <Box py={5} px={{ xs: 5, lg: 8, xl: 10 }}>
          <Box
            component='h6'
            mb={{ xs: 4, xl: 6 }}
            fontSize={20}
            fontWeight={Fonts.MEDIUM}>
            {titulo}
          </Box>

          <Box px={{ md: 5, lg: 8, xl: 10 }}>
            <Box className={classes.inputs_2}>
              <MyTextField
                className={classes.myTextField}
                label='Numero Pedido'
                name='numero_pedido'
                disabled
              />
              <MyTextField
                className={classes.myTextField}
                label='Fecha'
                name='fecha_pedido'
                type='date'
                InputLabelProps={{
                  shrink: true
                }}
                disabled
                required
              />
            </Box>
            <MyTextField
              className={classes.myTextField}
              label='Cliente'
              name='cliente'
              disabled
            />
            { !kit &&
              <MyAutocomplete
                label='Kit'
                className={classes.myTextField}
                style={{
                  paddingRight: 10
                }}
                name='kit_id'
                disabled={disabled}
                options={filteredKits}
              />
            }
            { kit && (
              <>
                <MyAutocomplete
                  label='Producto'
                  className={classes.myTextField}
                  style={{
                    paddingRight: 10
                  }}
                  name='producto_id'
                  disabled={disabled||subProducto}
                  options={filteredProductos}
                />
                <MyTextField
                  className={classes.myTextField}
                  label='Producto S3'
                  name='producto_s3'
                  disabled
                />
              </>
            )}
            <Box className={classes.inputs_2}>
              <MyTextField
                className={classes.myTextField}
                label='Cantidad'
                name='cantidad'
                disabled={disabled||subProducto}
              />
              { kit && (
                <>
                  <MyTextField
                    className={classes.myTextField}
                    label='Número inicial'
                    name='consecutivo_serie_inicial'
                    disabled={disabled}
                  />
                  <MyTextField
                    className={classes.myTextField}
                    label='Longitud Serial'
                    name='longitud_serial'
                    disabled={disabled}
                  />
                  <MySelectField
                    className={classes.myTextField} 
                    label='Color' 
                    name='color_id' 
                    ninguno='true'
                    disabled={disabled}
                    options={colores}
                  />
                  <MyTextField
                    className={classes.myTextField}
                    label='Prefijo'
                    name='prefijo'
                    disabled={disabled}
                  />
                  <MyTextField
                    className={classes.myTextField}
                    label='Posfijo'
                    name='posfijo'
                    disabled={disabled}
                  />
                  <MyTextField
                    className={classes.myTextField}
                    label='Serie Inicial'
                    name='serie_inicial_articulo'
                    disabled
                  />
                  <MyTextField
                    className={classes.myTextField}
                    label='Serie Final'
                    name='serie_final_articulo'
                    disabled
                  />
                  <MyTextField
                    className={classes.myTextField}
                    label='Longitud'
                    name='longitud_sello'
                    disabled={disabled}
                  />
                  <MyTextField
                    className={classes.myTextField}
                    label='Diámetro'
                    name='diametro'
                    disabled={disabled}
                  />
                </>
              )}
            </Box>
            <MyTextField
              className={classes.myTextField}
              label='Observaciones'
              name='observaciones'
              disabled={disabled}
            />
          </Box>
        </Box>
      </Scrollbar>
      <Box className={classes.bottomsGroup}>
        {accion !== 'ver'
          ? (<Button
            className={`${classes.btnRoot} ${classes.btnPrymary}`}
            variant='contained'
            type='submit'>
            <IntlMessages id='boton.submit' />
          </Button>)
          : ('')
        }
        <Button
          className={`${classes.btnRoot} ${classes.btnSecundary}`}
          onClick={handleOnClose}>
          <IntlMessages id='boton.cancel' />
        </Button>
      </Box>
    </Form>
  );
};

export default PedidoDetalleEditorForm;
