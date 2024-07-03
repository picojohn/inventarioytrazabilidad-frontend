import React, {useEffect, useState} from 'react';
import {Box, Button, makeStyles} from '@material-ui/core';
import {Form} from 'formik';
import Scrollbar from '@crema/core/Scrollbar';
import IntlMessages from '@crema/utility/IntlMessages';
import {Fonts} from 'shared/constants/AppEnums';
import MyTextField from 'shared/components/MyTextField';
import MySelectField from 'shared/components/MySelectField';
import { ESTADOS_CONTENEDORES_OPERACION_EMBARQUE } from 'shared/constants/ListaValores';
import MyAutocompleteContenedor from 'shared/components/MyAutoCompleteContenedor';
import { useDigitoVerificacion } from 'shared/hooks/useDigitoVerificacion';

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
    gridTemplateColumns: 'repeat(2,1fr)',
  },
}));

const ContenedorEmbarqueForm = (props) => {
  const {
    handleOnClose, 
    accion, 
    initialValues, 
    titulo,
    contenedores,
    setFieldValue,
    errors,
    values
  } = props;

  const [disabled, setDisabled] = useState(false);
  const {getDigitoVerificacion, digito, isLoading} = useDigitoVerificacion();

  useEffect(() => {
    if (accion === 'ver' || initialValues.estado === 'INA') {
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
            <MyTextField
              className={classes.myTextField}
              label='Operacion Embarque'
              name='operacion_embarque'
              disabled
            />
            <Box className={classes.inputs_2}>
              <MyAutocompleteContenedor
                className={classes.myTextField}
                label='Contenedor'
                name='numero_contenedor'
                required
                options={contenedores}
                disabled={accion !== 'crear'}
                onBlur={() => onBlur(values.numero_contenedor)}
              />
              <MyTextField
                className={classes.myTextField}
                label='Dígito Verificacion'
                name='digito_verificacion'
                disabled
              />
              <MySelectField
                className={classes.myTextField}
                label='Estado Contenedor'
                name='estado_contenedor'
                required
                options={ESTADOS_CONTENEDORES_OPERACION_EMBARQUE}
                disabled={disabled || accion === 'crear'}
              />
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

export default ContenedorEmbarqueForm;
