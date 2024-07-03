import React, {useEffect, useState} from 'react';
import {Box, Button, Tooltip } from '@material-ui/core';
import {Form} from 'formik';
import {makeStyles} from '@material-ui/core/styles';
import Scrollbar from '../../../../@crema/core/Scrollbar';
import {Fonts} from '../../../../shared/constants/AppEnums';
import MyTextField from 'shared/components/MyTextField';
import { ArrowBackIos, ChevronRight } from '@material-ui/icons';
import IntlMessages from '@crema/utility/IntlMessages';
import MyAutocomplete from 'shared/components/MyAutoComplete';
import MyRadioField from 'shared/components/MyRadioField';
import MySelectField from 'shared/components/MySelectField';

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

const options = [
  {value: 'S', label: 'Sí'},
  {value: 'N', label: 'No'},
];

const RemisionForm = (props) => {
  const {
    accion, 
    initialValues, 
    handleSubmit,
    values,
    setFieldValue,
    created,
    user,
    handleOnClose,
    lugaresUsuarios,
    lugares,
    usuarios,
    clientes,
    empresasTransporte
  } = props;

  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (accion === 'ver' || initialValues.estado === '0') {
      setDisabled(true);
    }
  }, [initialValues.estado, accion]);

  useEffect(() => {
    if(user && lugaresUsuarios && lugares){
      if(!initialValues.user_envio_id){
        setFieldValue('user_envio_id', user.id);
        const lugarUsuario = lugaresUsuarios.find((lU) => lU.usuario_id === user.id);
        if(lugarUsuario){
          setFieldValue('lugar_envio_id', lugarUsuario.lugar_id);
        }
      }
    }
  },[user, lugaresUsuarios, lugares]); // eslint-disable-line

  useEffect(() => {
    if(values.lugar_destino_id && lugaresUsuarios){
      if(values.lugar_destino_id !== initialValues.lugar_destino_id){
        setFieldValue('user_destino_id', '');
      }
    } else {
      setFieldValue('user_destino_id', '');
    }
  },[values.lugar_destino_id, lugaresUsuarios]) // eslint-disable-line

  useEffect(() => {
    if(values.empresaTransportadora){
      const empresa = empresasTransporte.find((emp) => emp.id === values.empresaTransportadora);
      if(empresa){
        setFieldValue('transportador', empresa.nombre);
      }
    }
  },[values.empresaTransportadora]) // eslint-disable-line

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
                Remisiones
              </Box>
            </Box>

            <Box>
              <Box className={classes.inputs_2}>
                <MyTextField
                  className={classes.myTextField}
                  label='Número Remisión'
                  name='numero_remision'
                  required
                  disabled
                />
                <MySelectField
                  className={classes.myTextField} 
                  label='Cliente' 
                  name='cliente_destino_id' 
                  disabled={disabled || user.rol.tipo !== 'IN'}
                  options={clientes}
                  variant='standard'
                  required 
                />
                <MyRadioField
                  label='Confirmar Recepción'
                  name='indicativo_confirmacion_recepcion'
                  disabled={disabled}
                  options={options}
                />
              </Box>
              <Box className={classes.inputs_3}>
                <MyAutocomplete
                  className={classes.myTextField}  
                  label='Lugar Origen' 
                  style={{
                    paddingRight: 10
                  }}
                  name='lugar_envio_id' 
                  disabled
                  options={lugares}
                  required 
                />
                <MyAutocomplete
                  className={classes.myTextField}  
                  label='Usuario Envia' 
                  style={{
                    paddingRight: 10
                  }}
                  name='user_envio_id' 
                  disabled
                  options={usuarios}
                  required 
                />
                <MyAutocomplete
                  className={classes.myTextField}  
                  label='Lugar Destino' 
                  style={{
                    paddingRight: 10
                  }}
                  name='lugar_destino_id' 
                  disabled={disabled}
                  options={lugares.filter((lu) => lu.cliente_id === parseInt(values.cliente_destino_id) && lu.indicativo_lugar_remision === 'S')}
                  required 
                />
                <MyAutocomplete
                  className={classes.myTextField}  
                  label='Usuario Recibe' 
                  style={{
                    paddingRight: 10
                  }}
                  name='user_destino_id' 
                  disabled={disabled}
                  options={lugaresUsuarios.reduce((result, data) => {
                    if(data.lugar_id === parseInt(values.lugar_destino_id)){
                      const array = [{
                        id: data.usuario_id,
                        nombre: data.nombre,
                        estado: data.usuario_estado
                      }]
                      result = [...result, ...array];
                    }
                    return result;
                  }, [])}
                  required 
                />
                <MyTextField
                  className={classes.myTextField}
                  label='Fecha Envío'
                  name='fecha_remision'
                  type='date'
                  InputLabelProps={{
                    shrink: true
                  }}
                  required
                  disabled={disabled}
                />
                <MyTextField
                  className={classes.myTextField}
                  label='Hora Estimada Envío'
                  name='hora_estimada_envio'
                  type='time'
                  InputLabelProps={{
                    shrink: true
                  }}
                  required
                  disabled={disabled}
                />
              </Box>
              <Box className={classes.inputs_3}>
                <MyAutocomplete
                  className={classes.myTextField}  
                  label='Transportadoras Disponibles' 
                  style={{
                    paddingRight: 10
                  }}
                  name='empresaTransportadora' 
                  disabled={disabled}
                  options={empresasTransporte.filter((lu) => lu.cliente_id === parseInt(user?.asociado?.id??0))}
                />
                <MyTextField
                  className={classes.myTextField}
                  label='Empresa Transporte'
                  name='transportador'
                  disabled={disabled}
                />
                <MyTextField
                  className={classes.myTextField}
                  label='Guía Transporte'
                  name='guia_transporte'
                  disabled={disabled}
                />
              </Box>
              <Box className={classes.inputs_3}>
              </Box>
              <Box>
                <MyTextField
                  className={classes.myTextField}
                  label='Observaciones'
                  name='observaciones_remision'
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
                  <h2>Sellos</h2>
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

export default RemisionForm;
