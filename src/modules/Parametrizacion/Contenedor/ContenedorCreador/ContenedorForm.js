import React, {useEffect, useState} from 'react';
import {Box, Button } from '@material-ui/core';
import {Form} from 'formik';
import {makeStyles} from '@material-ui/core/styles';
import Scrollbar from '../../../../@crema/core/Scrollbar';
import IntlMessages from '../../../../@crema/utility/IntlMessages';
import {Fonts} from '../../../../shared/constants/AppEnums';
import MyTextField from 'shared/components/MyTextField';
import MyRadioField from 'shared/components/MyRadioField';
import MySelectField from 'shared/components/MySelectField';
import { useDigitoVerificacion } from 'shared/hooks/useDigitoVerificacion';
import MyAutocomplete from 'shared/components/MyAutoComplete';

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
    gridTemplateColumns: '2fr 1fr',
  },
  inputs_2_2: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
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

const ContenedorForm = (props) => {
  const {
    handleOnClose, 
    accion, 
    initialValues, 
    titulo,
    tiposContenedor,
    setFieldValue,
    errors,
    user,
    clientes
  } = props;

  const [disabled, setDisabled] = useState(false);
  const {getDigitoVerificacion, digito, isLoading} = useDigitoVerificacion();

  useEffect(() => {
    if (accion === 'ver' || initialValues.estado === '0') {
      setDisabled(true);
    }
    if(accion === 'editar'){
      setFieldValue('is_loading', true);
    }
  }, [initialValues.estado, accion]); // eslint-disable-line

  useEffect(() => {
    if(digito || digito === 0){
      setFieldValue('digito_verificacion', digito);
    }
  },[digito]); // eslint-disable-line

  useEffect(() => {
    if(!isLoading){
      setFieldValue('is_loading', !isLoading);
    }
  },[isLoading]); // eslint-disable-line

  const onBlur = (contenedor) => {
    const length = contenedor.length;
    if((length === 10 || length === 11) && !errors.numero_contenedor){
      getDigitoVerificacion(contenedor.substring(0, 10).toUpperCase())
    }
  }
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
            { user?.rol?.tipo === 'IN' && (
              <Box className={classes.inputs_2}>
                <MyAutocomplete
                  className={classes.myTextField}
                  label='Cliente'
                  name='cliente_id'
                  required
                  disabled={disabled || user?.rol?.tipo !== 'IN'}
                  options={clientes}
                />
            </Box>
            )}
            <Box className={classes.inputs_2}>
              <MyTextField
                className={classes.myTextField}
                label='Contenedor'
                name='numero_contenedor'
                disabled={disabled}
                onBlur={(e) => {
                  onBlur(e.target.value)
                }}
              />
              <MyTextField
                className={classes.myTextField}
                label='Dígito Verificación'
                name='digito_verificacion'
                disabled
              />
            </Box>
            <Box className={classes.inputs_2}>
              <MySelectField
                className={classes.myTextField} 
                label='Tipo Contenedor' 
                name='tipo_contenedor_id' 
                disabled={disabled}
                options={tiposContenedor}
              />
            </Box>
            <Box marginTop='15px' className={classes.inputs_2_2}>
              <MyRadioField
                label='En Reparación'
                name='indicativo_contenedor_reparacion'
                disabled={disabled}
                options={options2}
              />
              <MyRadioField
                label='Estado'
                name='estado'
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

export default ContenedorForm;
