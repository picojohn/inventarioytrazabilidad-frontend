import React, { useEffect } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import {
  useDispatch,
} from 'react-redux';
import { Scrollbar } from '@crema';
import {
  onRead,
} from 'redux/actions/SelloAction';
import LecturaSellosForm from './LecturaSellosForm';
import { Fonts } from 'shared/constants/AppEnums';
import { makeStyles } from '@material-ui/core/styles/index';
import { Box } from '@material-ui/core';

const validationSchema = yup.object({
  serie: yup.string().required('Requerido'),
});

const useStyles = makeStyles(
  (theme) => ({
    dialogBox: {
      position: 'relative',
      '& .MuiDialog-paperWidthSm': {
        maxWidth: 600,
        width: '100%',
        // maxHeight:'fit-content'
      },
      '& .MuiTypography-h6': {
        fontWeight: Fonts.LIGHT,
      },
    },
    marcoTabla: {
      backgroundColor: 'white',
      boxShadow: '0px 0px 5px 5px rgb(0 0 0 / 10%)',
      borderRadius: '4px',
      // paddingLeft: '15px',
      // paddingRight: '15px',
      marginBottom: '5px',
      marginTop: '5px',
    },
    root: {
      width: '100%%',
      paddingTop: '20px',
    },
  })
);

let productoS3 = null;

const LecturaSellos = (props) => {
  const {
    updateColeccion,
    pedido,
    showForm,
    producto_s3_id,
    productosS3
  } = props;

  const classes = useStyles(props);
  const dispatch = useDispatch();
  
  useEffect(() => {
    setProductoS3Name();
  },[producto_s3_id, productosS3]); //eslint-disable-line

  const voiceNot = (message) => {
    const msg = new SpeechSynthesisUtterance();
    msg.text = message;
    window.speechSynthesis.speak(msg);
  }

  const setProductoS3Name = () => {
    if(productosS3 && producto_s3_id){
      const producto = productosS3.find((p) => p.id === parseInt(producto_s3_id));
      if(producto){
        productoS3 = producto.alias_producto;
      }
    }
  }

  return (
    showForm && (
      <Box className={classes.marcoTabla}>
        <Scrollbar>
          <Formik
            initialStatus={true}
            enableReinitialize={true}
            validateOnBlur={false}
            initialValues={{
              numero_pedido: pedido?.numero_pedido??'',
              producto_s3_id: producto_s3_id??'',
              articulo: productoS3??'',
              serie: '',
              tipo: 'I'
            }}
            validationSchema={validationSchema}
            onSubmit={
              (data, { setSubmitting, resetForm }) => {
                setSubmitting(true);
                dispatch(onRead(data, updateColeccion, resetForm, voiceNot));
                setSubmitting(false);
              }
            }>{({ setFieldValue }) => (
              <LecturaSellosForm
                setFieldValue={setFieldValue}
                productoS3={productoS3}
              />
            )}
          </Formik>
        </Scrollbar>
      </Box>
    )
  );
};

export default LecturaSellos;
