import React, {useEffect, useState} from 'react';
import {Box, Button, Tooltip } from '@material-ui/core';
import {Form} from 'formik';
import {makeStyles} from '@material-ui/core/styles';
import Scrollbar from '../../../../@crema/core/Scrollbar';
import {Fonts} from '../../../../shared/constants/AppEnums';
import MyTextField from 'shared/components/MyTextField';
import MySelectField from 'shared/components/MySelectField';
import { ArrowBackIos, ChevronRight } from '@material-ui/icons';
import MyAutocompletePedidoS3 from 'shared/components/MyAutoCompletePedidoS3';
import IntlMessages from '@crema/utility/IntlMessages';

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
    paddingRight: 20
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
    gridTemplateColumns: '1fr 2fr 1fr',
  },
  inputs_3: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(4,1fr)',
  },
}));

let pedidosS3Filtered = [];

const PedidoForm = (props) => {
  const {
    accion, 
    initialValues, 
    clientes,
    handleSubmit,
    pedidosS3,
    values,
    setFieldValue,
    created,
    rol,
    handleOnClose
  } = props;

  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (accion === 'ver' || initialValues.estado === '0') {
      setDisabled(true);
    }
  }, [initialValues.estado, accion]);

  useEffect(() => {
    if(values.cliente_id){
      const cliente = clientes.find((cust) => cust.id === parseInt(values.cliente_id));
      if(cliente){
        pedidosS3Filtered = pedidosS3.filter((pedido) => pedido.asociado_id === cliente.asociado_id);
      }
    }
  },[values.cliente_id, clientes, pedidosS3]);

  useEffect(() => {
    if(values.numero_pedido_s3){
      const pedido = pedidosS3Filtered.find((req) => req.numero_pedido === values.numero_pedido_s3);
      if(pedido){
        setFieldValue('fecha_pedido', pedido.fecha_pedido);
        setFieldValue('fecha_entrega_pedido', pedido.fecha_entrega_pedido);
      }
    }
  },[values.numero_pedido_s3]); // eslint-disable-line

  const classes = useStyles(props);

  return (
    <>
      <Form className='' noValidate autoComplete='off'>
        <Scrollbar style={{maxHeight: 600}}>
          <Box py={5} px={{xs: 5, lg: 8, xl: 10}}>
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
              mb={{xs: 4, xl: 6}}
            >
              <Tooltip title='Volver'>
                <ArrowBackIos
                  style={{
                    cursor: 'pointer', 
                    fontSize: 30 
                  }}
                  onClick={handleOnClose }
                />
              </Tooltip>
              <Box
                component='h6'
                fontSize={20}
                fontWeight={Fonts.BOLD}>
                Pedidos - Sellos
              </Box>
            </Box>

            <Box>
              <Box className={classes.inputs_2}>
                <MyTextField
                  className={classes.myTextField}
                  label='Número Pedido'
                  name='numero_pedido'
                  required
                  disabled
                />
                {clientes && 
                  <MySelectField
                    className={classes.myTextField} 
                    label='Cliente' 
                    name='cliente_id' 
                    disabled={disabled || accion === 'editar' || rol !== 'IN'}
                    options={clientes}
                  />
                }
              </Box>
              <Box className={classes.inputs_3}>
                <MyAutocompletePedidoS3 
                  className={classes.myTextField}  
                  label='Pedido S3' 
                  style={{
                    paddingRight: 10
                  }}
                  name='numero_pedido_s3' 
                  disabled={disabled}
                  options={pedidosS3Filtered}
                  required 
                />
                <MyTextField
                  className={classes.myTextField}
                  label='Fecha'
                  name='fecha_pedido'
                  required
                  InputLabelProps={{
                    shrink: true
                  }}
                  type='date'
                  disabled={disabled}
                />
                <MyTextField
                  className={classes.myTextField}
                  label='Fecha Entrega'
                  name='fecha_entrega_pedido'
                  required
                  InputLabelProps={{
                    shrink: true
                  }}
                  type='date'
                  disabled={disabled}
                />
              </Box>
              <Box className={classes.inputs_3}>
                <MyTextField
                  className={classes.myTextField}
                  label='Número OdeC'
                  name='orden_compra_cliente'
                  required
                  disabled={disabled}
                />
                <MyTextField
                  className={classes.myTextField}
                  label='Número Lote'
                  name='numero_lote'
                  required
                  disabled
                />
              </Box>
              <Box>
                <MyTextField
                  className={classes.myTextField}
                  label='Observaciones'
                  name='observaciones'
                  disabled={disabled}
                />
              </Box>
              { !created && 
                <Box
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    cursor: 'pointer',
                    marginTop: 15
                  }}
                  onClick={handleSubmit}
                >
                  <h2>Detalles</h2>
                  <ChevronRight/>
                </Box>
              }
              {
                (accion === 'editar' || accion === 'ver') &&
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
              }
            </Box>
          </Box>
        </Scrollbar>
        
      </Form>
    </>
  );
};

export default PedidoForm;
