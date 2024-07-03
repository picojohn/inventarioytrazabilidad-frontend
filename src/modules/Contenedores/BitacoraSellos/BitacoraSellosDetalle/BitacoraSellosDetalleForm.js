import React from 'react';
import {Box, Button, InputAdornment} from '@material-ui/core';
import {Form} from 'formik';
import {makeStyles} from '@material-ui/core/styles';
import Scrollbar from '@crema/core/Scrollbar';
import IntlMessages from '@crema/utility/IntlMessages';
import MyTextField from 'shared/components/MyTextField';
import { LocationOnOutlined } from '@material-ui/icons';

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
    gap: '15px',
    marginBottom: 15,
  },
  inputs_3: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(3,1fr)',
    gap: '15px',
    marginBottom: 15,
  },
  thumbInner: {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
  },
  thumb: {
    display: 'inline-flex',
    maxWidth: 200,
    maxHeight: 200,
    padding: 4,
    boxSizing: 'border-box',
    '&:hover': {
      maxWidth: 500,
      maxHeight: 500,
    },
  },
  thumbContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
  },
  img: {
    display: 'block',
    width: 'auto',
    height: '100%'
  }
}));

const BitacoraSellosDetalleForm = (props) => {
  const {
    handleOnClose, 
    titulo,
    onSeeLocation,
    values
  } = props;

  const classes = useStyles(props);

  const thumbs = values.evidencias.map((img, index) => (
    <div className={classes.thumb} key={index}>
      <div className={classes.thumbInner}>
        <img
          src={img}
          alt='thumb'
          className={classes.img}
          // Revoke data uri after image is loaded
          onLoad={() => { URL.revokeObjectURL(img) }}
        />
      </div>
    </div>
  ))

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
              <MyTextField
                className={classes.myTextField}
                label='Serial'
                name='serial'
                disabled
              />
              <MyTextField
                className={classes.myTextField}
                label='Tipo Evento'
                name='evento'
                disabled
              />
              <MyTextField
                className={classes.myTextField}
                label='Fecha Evento'
                name='fecha_evento'
                type='date'
                InputLabelProps={{
                  shrink: true
                }}
                disabled
              />
              <MyTextField
                className={classes.myTextField}
                label='Estado Sello'
                name='estado_sello'
                disabled
              />
            </Box>
            <Box className={classes.inputs_2}>
              <MyTextField
                className={classes.myTextField}
                label='Tipo Empaque'
                name='tipo_empaque'
                disabled
              />
              <MyTextField
                className={classes.myTextField}
                label='Serial Empaque Kit'
                name='producto_empaque'
                disabled
              />
              <MyTextField
                className={classes.myTextField}
                label='Número Pedido'
                name='numero_pedido'
                disabled
              />
              <MyTextField
                className={classes.myTextField}
                label='Número Remisión'
                name='numero_remision'
                disabled
              />
            </Box>
            <Box className={classes.inputs_2}>
              <MyTextField
                className={classes.myTextField}
                label='Lugar Origen'
                name='lugar_origen'
                disabled
              />
              <MyTextField
                className={classes.myTextField}
                label='Usuario Origen'
                name='usuario_origen'
                disabled
              />
              <MyTextField
                className={classes.myTextField}
                label='Lugar Destino'
                name='lugar_destino'
                disabled
              />
              <MyTextField
                className={classes.myTextField}
                label='Usuario Destino'
                name='usuario_destino'
                disabled
              />
              <MyTextField
                className={classes.myTextField}
                label='Documento Referencia'
                name='documento_referencia'
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
              <MyTextField
                className={classes.myTextField}
                label='Contenedor'
                name='contenedor'
                disabled
              />
              <MyTextField
                className={classes.myTextField}
                label='Operacion Embarque'
                name='operacion_embarque_id'
                disabled
              />
              <MyTextField
                className={`${classes.myTextField}`}
                label='Ubicación'
                name='ubicacion'
                InputProps={{
                  endAdornment: (
                    <InputAdornment 
                      position='end'
                      className={classes.pointer}
                      onClick={() => {
                        onSeeLocation(values.ubicacion)
                      }}
                    >
                      <LocationOnOutlined
                        style={{
                          color: '#48ac33'
                        }}
                      />
                    </InputAdornment>
                  )
                }}
                disabled
              />
            </Box>
            <MyTextField
              className={classes.myTextField}
              label='Observaciones Evento'
              name='observaciones_evento'
              disabled
            />
            <Box
              component='h6'
              mb={{xs: 4, xl: 6}}
              mt={{xs: 4, xl: 6}}
              fontSize={18}
              fontWeight='bold'>
              Evidencias:
            </Box>
            <Box className={classes.inputs_3}>
              {values.evidencias && thumbs}
            </Box>
          </Box>
        </Box>
      </Scrollbar>
      <Box className={classes.bottomsGroup}>
        <Button
          className={`${classes.btnRoot} ${classes.btnSecundary}`}
          onClick={handleOnClose}>
          <IntlMessages id='boton.cancel' />
        </Button>
      </Box>
    </Form>
  );
};

export default BitacoraSellosDetalleForm;
