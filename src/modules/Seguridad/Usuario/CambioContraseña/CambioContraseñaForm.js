import React, {useState} from 'react';
import {Box, Button, InputAdornment} from '@material-ui/core';
import {Form} from 'formik';
import {makeStyles} from '@material-ui/core/styles';
import Scrollbar from '@crema/core/Scrollbar';
import IntlMessages from '@crema/utility/IntlMessages';
import MyTextField from 'shared/components/MyTextField';
import { Visibility, VisibilityOff } from '@material-ui/icons';

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

const CambioContraseñaForm = (props) => {
  const {
    handleOnClose, 
    titulo, 
  } = props;

  const [showPass, setShowPass] = useState({
    password: false,
    confirm_password: false, 
  });

  const toogleSeePass = (key) => {
    setShowPass({
      ...showPass,
      [key]: !showPass[key]
    })
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
            fontWeight='bold'>
            {titulo}
          </Box>

          <Box px={{md: 5, lg: 8, xl: 10}}>
            <MyTextField
              className={classes.myTextField}
              label='Nueva Clave'
              name='password'
              type={showPass.password?'text':'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment 
                    position='end'
                    className={classes.pointer}
                    onClick={() => {
                      toogleSeePass('password')
                    }}
                  >
                    {showPass.password ? (
                      <VisibilityOff
                        style={{
                          color: 'gray'
                        }}
                      />
                    ): (
                      <Visibility
                        style={{
                          color: 'gray'
                        }}
                      />
                    )}
                  </InputAdornment>
                )
              }}
              required
            />
            <MyTextField
              className={classes.myTextField}
              label='Confirmar Nueva Clave'
              name='confirm_password'
              type={showPass.confirm_password?'text':'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment 
                    position='end'
                    className={classes.pointer}
                    onClick={() => {
                      toogleSeePass('confirm_password')
                    }}
                  >
                    {showPass.confirm_password ? (
                      <VisibilityOff
                        style={{
                          color: 'gray'
                        }}
                      />
                    ): (
                      <Visibility
                        style={{
                          color: 'gray'
                        }}
                      />
                    )}
                  </InputAdornment>
                )
              }}
              required
            />
          </Box>
        </Box>
      </Scrollbar>
      <Box className={classes.bottomsGroup}>
        <Button
          className={`${classes.btnRoot} ${classes.btnPrymary}`}
          variant='contained'
          type='submit'>
          <IntlMessages id='boton.submit' />
        </Button>
        <Button
          className={`${classes.btnRoot} ${classes.btnSecundary}`}
          onClick={handleOnClose}>
          <IntlMessages id='boton.cancel' />
        </Button>
      </Box>
    </Form>
  );
};

export default CambioContraseñaForm;
