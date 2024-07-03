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
      // marginBottom: 5,
      [theme.breakpoints.up('xl')]: {
        // marginBottom: 5,
      },
      height: '60px',
      paddingRight: '20px',
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
      width: '80%',
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
    },
  })
);

const LecturaKitForm = (props) => {
  const {
    arrayBuild,
    productosS3,
    setFieldValue
  } = props;
  
  useEffect(() => {
    if(arrayBuild && productosS3){
      const producto = productosS3.find((p) => p.id === arrayBuild[0]);
      if(producto){
        setFieldValue('articulo', producto.alias_producto);
        setFieldValue('producto_s3_id', producto.id);
      }
    }
  },[arrayBuild, productosS3]); // eslint-disable-line

  const classes = useStyles(props);

  return (
    <Form className='' noValidate autoComplete='off'>
      <Scrollbar style={{ maxHeight: 600 }}>
        <Box px={{ xs: 5, lg: 8, xl: 10 }}>
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
                label='Serie'
                name='serie'
                InputLabelProps={{
                  shrink: true
                }}
                required
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

export default LecturaKitForm;
