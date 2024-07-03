import React, { useEffect } from 'react';
import {
  Box, Button,
} from '@material-ui/core';
import { Form } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import Scrollbar from '@crema/core/Scrollbar';
import MyTextField from 'shared/components/MyTextField';

// Estilos para utilizar en los diferentes componentes del formulario
const useStyles = makeStyles(
  (theme) => ({
    myTextField: {
      width: '100%',
      marginBottom: 5,
      [theme.breakpoints.up('xl')]: {
        marginBottom: 5,
      },
      height: '60px',
      paddingRight: '20px',
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
      gridTemplateColumns: '3fr 2fr 7fr',
    },
  })
);

const LecturaSellosForm = (props) => {
  const {
    setFieldValue,
    productoS3
  } = props;

  const classes = useStyles(props);

  useEffect(() => {
    if(productoS3){
      setFieldValue('articulo', productoS3);
    }
  },[productoS3]) // eslint-disable-line

  return (
    <Form className='' noValidate autoComplete='off'>
      <Scrollbar style={{ maxHeight: 600 }}>
        <Box py={5} px={{ xs: 5, lg: 8, xl: 10 }}>
          <Box px={{ md: 5, lg: 8, xl: 10 }}>
            <Box className={classes.inputs_2}>
              <MyTextField
                className={classes.myTextField}
                label='Artículo'
                name='articulo'
                disabled
              />
              <MyTextField
                className={classes.myTextField}
                InputLabelProps={{
                  shrink: true
                }}
                label='Lectura Serie'
                name='serie'
              />
              <Button type='submit' style={{
                visibility: 'hidden'
              }}/>
            </Box>
          </Box>
        </Box>
      </Scrollbar>
    </Form>
  );
};

export default LecturaSellosForm;
