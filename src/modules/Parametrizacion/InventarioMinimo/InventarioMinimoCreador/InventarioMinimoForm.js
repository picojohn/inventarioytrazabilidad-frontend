import React, {useEffect, useState} from 'react';
import {Box, Button } from '@material-ui/core';
import {Form} from 'formik';
import {makeStyles} from '@material-ui/core/styles';
import Scrollbar from '../../../../@crema/core/Scrollbar';
import IntlMessages from '../../../../@crema/utility/IntlMessages';
import {Fonts} from '../../../../shared/constants/AppEnums';
import MyRadioField from 'shared/components/MyRadioField';
import MySelectField from 'shared/components/MySelectField';
import MyAutocomplete from 'shared/components/MyAutoComplete';
import MyTextField from 'shared/components/MyTextField';

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
    paddingRight: 20,
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
    gridTemplateColumns: '1fr 1fr',
  },
  inputs_2_2: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
  },
}));

const options = [
  {value: '1', label: 'Activo'},
  {value: '0', label: 'Inactivo'},
];

const options2 = [
  {value: 'K', label: 'Kit'},
  {value: 'P', label: 'Producto'},
];

let kitsFiltro = [];
let productosFiltro = [];

const InventarioMinimoForm = (props) => {
  const {
    handleOnClose, 
    accion, 
    initialValues, 
    titulo,
    values,
    lugares,
    clientes,
    productos,
    kits,
    productosS3,
    setFieldValue,
    user
  } = props;

  const [disabled, setDisabled] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    if (accion === 'ver' || initialValues.estado === '0') {
      setDisabled(true);
    }
  }, [initialValues.estado, accion]);

  useEffect(() => {
    if(values.cliente_id){
      kitsFiltro = kits.filter((kit) => kit.cliente_id === parseInt(values.cliente_id));
      productosFiltro = productos.filter((producto) => producto.cliente_id === parseInt(values.cliente_id));
      if(accion === 'crear' || initialValues.cliente_id !== values.cliente_id){
        setFieldValue('lugar_id', '');
        setFieldValue('kit_id', '');
        setFieldValue('producto_cliente_id', '');
      }
    } else {
      kitsFiltro = [];
      productosFiltro = [];
    }
  },[values.cliente_id, lugares, kits, productos]) // eslint-disable-line
  
  useEffect(() => {
    if(values.indicativo_k_p){
      setShowOptions(true)
    }
  },[values.indicativo_k_p])

  useEffect(() => {
    if(values.producto_cliente_id){
      const producto = productos.find((product) => product.id === parseInt(values.producto_cliente_id));
      if(producto){
        const productoS3 = productosS3.find((s3Prod) => s3Prod.id === producto.producto_s3_id);
        if(productoS3){
          setFieldValue('producto_s3', productoS3.alias_producto);
        }
      }
    } else {
      setFieldValue('producto_s3', '');
    }
  },[values.producto_cliente_id]) // eslint-disable-line

  const classes = useStyles(props);

  return (
    <Form className='' autoComplete='off'>
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
            <MyRadioField
              label='Seleccione Tipo'
              name='indicativo_k_p'
              disabled={accion !== 'crear'}
              options={options2}
            />
            { showOptions && 
              <Box>
                <Box className={classes.inputs_2}>
                  { user?.rol?.tipo === 'IN' && (
                    <MyAutocomplete
                      className={classes.myTextField}
                      label='Cliente'
                      name='cliente_id'
                      required
                      disabled={disabled || user?.rol?.tipo !== 'IN'}
                      options={clientes}
                    />
                  )}
                  { values.indicativo_k_p === 'K' &&
                  <MyAutocomplete
                    label='Kit'
                    style={{
                      paddingRight: '10px'
                    }}
                    className={classes.myTextField}
                    name='kit_id'
                    disabled={disabled}
                    options={kitsFiltro}
                  /> }
                  { values.indicativo_k_p === 'P' &&
                  <>
                    <MyAutocomplete
                      label='Producto Cliente'
                      style={{
                        paddingRight: '10px'
                      }}
                      className={classes.myTextField}
                      name='producto_cliente_id'
                      disabled={disabled}
                      options={productosFiltro}
                    />
                    <MyTextField 
                      className={classes.myTextField}  
                      label='Producto S3' 
                      name='producto_s3' 
                      disabled
                    />
                  </>
                  }
                </Box>
                <Box className={classes.inputs_2_2}>
                  <MySelectField
                    className={classes.myTextField} 
                    label='Lugar' 
                    name='lugar_id' 
                    disabled={disabled}
                    options={lugares.filter((lugar) => lugar.cliente_id === parseInt(values.cliente_id))}
                  />
                  <MyTextField 
                    className={classes.myTextField}  
                    label='Inventario Mínimo' 
                    name='cantidad_inventario_minimo' 
                    disabled={disabled}
                  />
                </Box>
                <Box marginTop='15px' className={classes.inputs_2_2}>
                  <MyRadioField
                    label='Estado'
                    name='estado'
                    disabled={accion === 'ver'}
                    options={options}
                  />
                </Box>
              </Box> 
            }
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

export default InventarioMinimoForm;
