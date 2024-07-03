import React from 'react';
import {Box, Button } from '@material-ui/core';
import {Form} from 'formik';
import {makeStyles} from '@material-ui/core/styles';
import Scrollbar from '@crema/core/Scrollbar';
import IntlMessages from '@crema/utility/IntlMessages';
import {Fonts} from 'shared/constants/AppEnums';
import MyTextField from 'shared/components/MyTextField';
import MyRadioField from 'shared/components/MyRadioField';
import { DATO_BOOLEAN_RADIO } from 'shared/constants/ListaValores';

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

const ContenedorForm = (props) => {
  const {
    handleOnClose, 
  } = props;

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
            Inspeccion
          </Box>

          <Box px={{md: 5, lg: 8, xl: 10}}>
            <Box className={classes.inputs_2_2}>
              <MyTextField
                className={classes.myTextField}
                label='Unidad de Carga'
                name='unidadCarga'
                disabled
              />
              <MyTextField
                className={classes.myTextField}
                label='Tipo Lista Chequeo'
                name='lista'
                disabled
              />
            </Box>
            <MyTextField
              className={classes.myTextField}
              label='Tipo Chequeo'
              name='tipoChequeo'
              disabled
            />
            <Box className={classes.inputs_2_2}>
              <MyRadioField
                label='Tipo Alerta'
                name='tipo_alerta'
                options={DATO_BOOLEAN_RADIO}
              />
              <MyTextField
                className={classes.myTextField}
                label='Numero'
                name='numero'
              />
            </Box>
            <Box>
              <MyTextField
                className={classes.myTextField}
                label='Observaciones'
                name='observaciones'
              />
            </Box>
            <Box>
              <MyTextField
                className={classes.myTextField}
                label='Anexar Evidencias'
                name='evidencias'
              />
            </Box>
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

export default ContenedorForm;
