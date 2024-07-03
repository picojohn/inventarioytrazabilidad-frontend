import React, {useEffect, useState} from 'react';
import {Box, Button } from '@material-ui/core';
import {Form} from 'formik';
import {makeStyles} from '@material-ui/core/styles';
import Scrollbar from '../../../../@crema/core/Scrollbar';
import IntlMessages from '../../../../@crema/utility/IntlMessages';
import {Fonts} from '../../../../shared/constants/AppEnums';
import MyRadioField from 'shared/components/MyRadioField';
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
    gridTemplateColumns: '1fr 1fr',
  },
  inputs_2_2: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '1fr',
  },
}));

const options = [
  {value: '1', label: 'Activo'},
  {value: '0', label: 'Inactivo'},
];

const LugarUsuarioForm = (props) => {
  const {
    handleOnClose, 
    accion, 
    initialValues, 
    titulo,
    values,
    lugares,
    clientes,
    usuarios,
    user
  } = props;

  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (accion === 'ver' || initialValues.estado === '0') {
      setDisabled(true);
    }
  }, [initialValues.estado, accion]);

  const classes = useStyles(props);

  return (
    <Form className='' autoComplete='off' noValidate>
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
            <Box className={classes.inputs_2_2}>
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
              <MyAutocomplete
                className={classes.myTextField} 
                label='Usuario' 
                name='usuario_id' 
                disabled={disabled}
                options={usuarios.filter((usuario) => usuario.asociado_id === parseInt(values.cliente_id))}
              />
              <MyAutocomplete
                className={classes.myTextField} 
                label='Lugar' 
                name='lugar_id' 
                disabled={disabled}
                options={lugares.filter((lugar) => lugar.cliente_id === parseInt(values.cliente_id))}
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

export default LugarUsuarioForm;
