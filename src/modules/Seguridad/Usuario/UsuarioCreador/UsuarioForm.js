import React, {useEffect, useState} from 'react';
import {Box, Button} from '@material-ui/core';
import {Form} from 'formik';
import {makeStyles} from '@material-ui/core/styles';
import Scrollbar from '../../../../@crema/core/Scrollbar';
import IntlMessages from '../../../../@crema/utility/IntlMessages';
import MyAutocomplete from '../../../../shared/components/MyAutoComplete';
import MyTextField from 'shared/components/MyTextField';
import MyRadioField from 'shared/components/MyRadioField';

const options = [
  {value: '1', label: 'Activo'},
  {value: '0', label: 'Inactivo'},
];

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

const UsuarioForm = (props) => {
  const {
    handleOnClose, 
    accion, 
    roles, 
    values, 
    initialValues, 
    titulo, 
    clientes
  } = props;

  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    if (accion === 'ver' || initialValues.estado === '0') {
      setDisabled(true);
    }
  }, [initialValues.estado, accion]);

  const classes = useStyles(props);

  return (
    <Form className='' noValidate autoComplete='off'>
      <Scrollbar style={{maxHeight: 600}}>
        <Box py={5} px={{xs: 5, lg: 8, xl: 10}}>
          <Box
            component='h6'
            mb={{xs: 4, xl: 6}}
            fontSize={20}
            fontWeight='bold'>
            {titulo}
          </Box>

          <Box px={{md: 5, lg: 8, xl: 10}}>
            <MyTextField
              className={classes.myTextField}
              label='Nombre'
              name='nombre'
              disabled={disabled}
              required
            />
            <MyTextField
              className={classes.myTextField}
              label='Identificación'
              name='identificacion_usuario'
              disabled={disabled}
              required
            />
            <Box className={classes.inputs_2}>
              <MyAutocomplete
                options={roles}
                name='rol_id'
                inputValue={initialValues.rol_id}
                label='Rol'
                style={{
                  paddingRight: '10px'
                }}
                autoHighlight
                className={classes.myTextField}
                required
                disabled={disabled}
              />            
              <MyAutocomplete
                options={clientes}
                name='asociado_id'
                inputValue={initialValues.asociado_id}
                label='Cliente'
                className={classes.myTextField}
                required
                disabled={disabled}
              />            
            </Box>

            <MyTextField
              className={classes.myTextField}
              label='E-mail'
              name='correo_electronico'
              disabled={disabled}
              required
            />

            {accion === 'crear' ? (
              <MyTextField
                className={classes.myTextField}
                label='Clave'
                name='clave'
                required
              />
            ) : (
              ''
            )}

            <MyRadioField
              label='Estado'
              name='estado'
              required
              disabled={disabled}
              options={options}
            />
          </Box>
        </Box>
      </Scrollbar>
      <Box className={classes.bottomsGroup}>
        {accion !== 'ver' && values ? (
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

export default UsuarioForm;
