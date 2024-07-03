import React, { useEffect } from 'react';
import {Box, Dialog, Slide, makeStyles} from '@material-ui/core';
import {Formik} from 'formik';
import * as yup from 'yup';
import {Scrollbar} from '@crema';
import {Fonts} from 'shared/constants/AppEnums';
import { useState } from 'react';
import jwtAxios from '@crema/services/auth/jwt-auth/jwt-api';
import { rows, tiposDocumentoEx } from './GrupoInspeccion';
import GIForm from './Form';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='down' ref={ref} {...props} />;
});

const validationSchema = yup.object({
  tipo_documento: yup
    .string()
    .required('Requerido'),
  nombre_completo: yup
    .string()
    .required('Requerido'),
  numero_documento: yup
    .number()
    .required('Requerido')
    .typeError("Debe ser un número"),
  firma: yup
    .string()
    .nullable(),
});

const useStyles = makeStyles((theme) => ({
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
}));

const GrupoInspeccionForm = (props) => {
  const {
    handleOnClose,
    open,
    selectedInspector,
    action,
    title,
    classes,
  } = props;

  const [inspectores, setInspectores] = useState([]);
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [inspector, setInspector] = useState(null);

  const getInspectores = async () => {
    try {
      const { data } = await jwtAxios.get('clientes-inspectores/' + 1, { 
        params: {
           page: 1,
           limite: 500,
           cliente_id: 1,
        },
      });
      setInspectores(data.datos)
    } catch (error) {
      
    }
  }

  const getTiposDocumento = async () => {
    try {
      const { data } = await jwtAxios
        .get('tipos-documento', {
          params: {
            ligera: true,
          },
        })
      setTiposDocumento(tiposDocumentoEx)
    } catch (error) {
      
    }
  }

  const getInspector = () => {
    const ins = rows.find((row) => row.id === selectedInspector);
    setInspector(ins)
  }

  useEffect(() => {
    getInspectores();
    getTiposDocumento();
    if (action !== "crear") {
      getInspector();
    }
  }, [])

  return (
    open && (
      <Dialog
        open={open}
        onClose={handleOnClose}
        aria-labelledby='simple-modal-title'
        TransitionComponent={Transition}
        aria-describedby='simple-modal-description'
        className={classes.dialogBox}
        fullWidth
        maxWidth={'md'}>
        <Scrollbar>
          <Formik
            initialStatus={true}
            enableReinitialize={true}
            validateOnBlur={false}
            initialValues={{
              tipo_documento: inspector ? inspector.tipo_documento_codigo : '',
              nombre_completo: inspector ? inspector.nombre : '',
              numero_documento: inspector ? inspector.documento : '',
              cargo: inspector ? inspector.cargo : '',
              inspector: '',
              firma: '',
              numero: '1000',
              version: '1',
              estado: 'En proceso',
              conductor: '', 
              nombre_conductor: 'Pepito Perez', 
              tipo_documento_conductor: '', 
              numero_documento_conductor: '', 
              fecha: '2022-11-04',
              hora_inicio: '08:30',
              hora_fin: '10:25',
              formato: '',
              clase: '',
              lugar_id: '',
            }}
            validationSchema={validationSchema}
            onSubmit={(data, {setSubmitting}) => {
              setSubmitting(true);
              setSubmitting(false);
            }}>
            {({initialValues, setFieldValue, errors, values}) => (
              <GIForm 
                classes={classes}
                action={action}
                tiposDocumento={tiposDocumento}
                inspectores={inspectores}
                title={title}
                setFieldValue={setFieldValue}
                values={values}
                handleOnClose={handleOnClose}
              />
            )}
          </Formik>
        </Scrollbar>
      </Dialog>
    )
  );
};

export default GrupoInspeccionForm;
