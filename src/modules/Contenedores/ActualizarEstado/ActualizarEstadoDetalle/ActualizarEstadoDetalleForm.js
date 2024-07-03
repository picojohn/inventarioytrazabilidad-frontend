import React from 'react';
import {Box, Button} from '@material-ui/core';
import {Form} from 'formik';
import {makeStyles} from '@material-ui/core/styles';
import Scrollbar from '@crema/core/Scrollbar';
import IntlMessages from '@crema/utility/IntlMessages';
import MyTextField from 'shared/components/MyTextField';
import MySelectField from 'shared/components/MySelectField';
import { ESTADOS_SELLOS } from 'shared/constants/ListaValores';

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
    marginBottom: 0,
    [theme.breakpoints.up('xl')]: {
      marginBottom: 0,
    },
    height: '50px',
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
  pointer: {
    cursor: 'pointer',
  },
  inputs_2: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(2,1fr)',
    gap: '10px',
    marginBottom: 10,
  },
}));

const ActualizarEstadoDetalleForm = (props) => {
  const {
    handleOnClose, 
    titulo,
    eventos
  } = props;

  const classes = useStyles(props);

  return (
    <Form className='' noValidate autoComplete='off'>
      <Scrollbar style={{maxHeight: 1200}}>
        <Box py={5} px={{xs: 5, lg: 8, xl: 10}}>
          <Box
            component='h6'
            mb={{xs: 4, xl: 6}}
            fontSize={20}
            fontWeight='bold'>
            {titulo}
          </Box>

          <Box px={{md: 5, lg: 8, xl: 10}}>
            <Box className={classes.inputs_2}>
              <MyTextField
                className={classes.myTextField}
                label='Producto Cliente'
                name='producto'
                disabled
              />
              <Box className={classes.inputs_2}>
                <MyTextField
                  className={classes.myTextField}
                  label='Serial'
                  name='serial'
                  disabled
                />
                <MyTextField
                  className={classes.myTextField}
                  label='Número Última Remisión'
                  name='numero_ultima_remision'
                  disabled
                />
              </Box>
              <MyTextField
                className={classes.myTextField}
                label='Tipo Último Evento'
                name='ultimo_evento'
                disabled
              />
              <Box className={classes.inputs_2}>
                <MyTextField
                  className={classes.myTextField}
                  label='Fecha Último Evento'
                  name='fecha_ultimo_evento'
                  type='date'
                  InputLabelProps={{
                    shrink: true
                  }}
                  disabled
                />
                <MySelectField
                  className={classes.myTextField}
                  label='Estado Sello'
                  name='estado_sello'
                  disabled
                  options={ESTADOS_SELLOS}
                />
              </Box>
            </Box>
            {/* <Box className={classes.inputs_2}>
              <Box className={classes.inputs_2}>
                <MyTextField
                  className={classes.myTextField}
                  label='Número Pedido'
                  name='numero_pedido'
                  disabled
                />
              </Box>
            </Box> */}
            <Box className={classes.inputs_2}>
              <MyTextField
                className={classes.myTextField}
                label='Lugar'
                name='lugar_origen'
                disabled
              />
              <MyTextField
                className={classes.myTextField}
                label='Usuario'
                name='usuario_origen'
                disabled
              />
            </Box>
            <Box className={classes.inputs_2}>
              <MyTextField
                className={classes.myTextField}
                label='Lugar Instalación'
                name='lugar_instalacion'
                disabled
              />
              <MyTextField
                className={classes.myTextField}
                label='Zona Instalación'
                name='zona_instalacion'
                disabled
              />
              <Box className={classes.inputs_2}>
                <MyTextField
                  className={classes.myTextField}
                  label='Documento Referencia'
                  name='documento_referencia'
                  disabled
                />
                <MyTextField
                  className={classes.myTextField}
                  label='Contenedor'
                  name='contenedor'
                  disabled
                />
              </Box>
              <Box className={classes.inputs_2}>
                <MyTextField
                  className={classes.myTextField}
                  label='Operacion Embarque'
                  name='operacion_embarque_id'
                  disabled
                />
              </Box>
            </Box>
            <Box className={classes.inputs_2}>
              <MySelectField
                className={classes.myTextField}
                label='Evento'
                name='evento_id'
                options={eventos.filter((ev) => ev.indicativo_evento_manual === 'S')}
              />
            </Box>
            <MyTextField
              className={classes.myTextField}
              label='Observaciones Evento'
              name='observaciones_evento'
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

export default ActualizarEstadoDetalleForm;
