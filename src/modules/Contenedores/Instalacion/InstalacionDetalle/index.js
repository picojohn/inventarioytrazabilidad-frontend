import React, {useEffect}  from 'react';
import {Formik} from 'formik';
import {Scrollbar} from '@crema';
import InstalacionDetalleForm from './InstalacionDetalleForm';
import { useState } from 'react';
import * as yup from 'yup';
import { fetchError, fetchStart } from 'redux/actions';
import { onInstall, onReadForInstall } from 'redux/actions/SelloAction';
import { useSelector } from 'react-redux';
import { useLocation } from 'shared/hooks/useLocation';

// const sealList = [
//   {id: 1, serial: 'SR100SF'},
//   {id: 2, serial: 'SR101SF'},
//   {id: 3, serial: 'SR102SF'},
//   {id: 4, serial: 'PS10220LT'},
//   {id: 5, serial: 'PS10221LT'},
//   {id: 6, serial: 'PS10222LT'},
//   {id: 7, serial: 'PS10223LT'},
//   {id: 8, serial: 'PS10224LT'},
//   {id: 9, serial: 'PS10225LT'},
//   {id: 10, serial: 'PS10226LT'},
//   {id: 11, serial: 'PS10227LT'},
// ]

const InstalacionDetalle = (props) => {
  const {
    titulo,
    operacionesEmbarque,
    contenedores,
    lugares,
    zonas,
    productos,
    cliente,
    dispatch,
    url
  } = props;

  const [readSeal, setReadSeal] = useState([]);
  const [images, setImages] = useState([]);
  const { read, ligera: sellos } = useSelector(({selloReducer}) => selloReducer.instalar);
  const {getLocation, latitude, longitude} = useLocation();

  useEffect(() => {
    getLocation();
  },[]); // eslint-disable-line

  useEffect(() => {
    if(read){
      addToList(read, readSeal, setReadSeal);
    }
  },[read]) // eslint-disable-line

  const onReadSeal = (cliente_id, producto_id, serial) => {
    const data = {
      cliente_id,
      producto_id,
      serial
    }
    dispatch(onReadForInstall(data));
    // setReadSeal(sealList)
  }

  const onUnreadSeal = (id) => {
    const currentState = [...readSeal];
    const index = currentState.findIndex((seal) => seal.id === id);
    if(~index){
      currentState.splice(index, 1);
      setReadSeal(currentState);
    }
  }

  const addToList = (obj, list, setList) => {
    const currentList = [...list];
    const index = currentList.findIndex((item) => item.id === obj.id);
    if(!~index){
      const newObj = {
        ...obj,
        latitude,
        longitude
      }
      currentList.push(newObj);
      setList(currentList);
    }
  }

  const validationSchema = yup.object({
    operacion_embarque_id: yup
      .number()
      .nullable()
      .typeError('Debe ser un número')
      .test({
        name: 'excluyente',
        exclusive: false,
        params: {},
        message: 'Requerido', // eslint-disable-line
        test: function(value){
          return (cliente.indicativo_operaciones_embarque === 'S' && value !== undefined) || cliente.indicativo_operaciones_embarque === 'N' 
        }
      }),
    contenedor_id: yup
      .number()
      .nullable()
      .typeError('Debe ser un número')
      .test({
        name: 'excluyente',
        exclusive: false,
        params: {},
        message: 'Requerido', // eslint-disable-line
        test: function(value){
          return (cliente.indicativo_instalacion_contenedor === 'S' && value !== undefined) || cliente.indicativo_instalacion_contenedor === 'N' 
        }
      }),
    documento_referencia: yup
      .string()
      .nullable()
      .max('25', 'Debe tener máximo 25 Caracteres')
      .test({
        name: 'excluyente',
        exclusive: false,
        params: {},
        message: 'Requerido', // eslint-disable-line
        test: function(value){
          return (cliente.indicativo_documento_referencia === 'S' && value !== undefined) || cliente.indicativo_documento_referencia === 'N' 
        }
      }),
    lugar_instalacion_id: yup
      .number()
      .nullable()
      .typeError('Debe ser un número')
      .test({
        name: 'excluyente',
        exclusive: false,
        params: {},
        message: 'Requerido', // eslint-disable-line
        test: function(value){
          return (cliente.indicativo_registro_lugar_instalacion === 'S' && value !== undefined) || cliente.indicativo_registro_lugar_instalacion === 'N' 
        }
      }),
    zona_instalacion_id: yup
      .number()
      .nullable()
      .typeError('Debe ser un número')
      .test({
        name: 'excluyente',
        exclusive: false,
        params: {},
        message: 'Requerido', // eslint-disable-line
        test: function(value){
          return (cliente.indicativo_registro_zona_instalacion === 'S' && value !== undefined) || cliente.indicativo_registro_zona_instalacion === 'N' 
        }
      }),
    producto_id: yup
      .number()
      .required('Requerido'),
  });

  const reinitilizeReadSeals = () => {
    setReadSeal([]);
    setImages([]);
  }

  return (
    <Scrollbar>
      <Formik
        initialStatus={true}
        enableReinitialize={true}
        validationSchema={validationSchema}
        validateOnBlur={false}
        initialValues={{
          cliente_id: cliente?.id??'',
          operacion_embarque_id: '',
          contenedor_id: '',
          documento_referencia: '',
          lugar_instalacion_id: '',
          zona_instalacion_id: '',
          producto_id: '',
          serial: '',
          evidencias: '',
        }}
        onSubmit={(data, {resetForm}) => {
          if(readSeal.length === 0){
            dispatch(fetchError('Debe leer al menos un serial para instalar'))
            setTimeout(() => {
              dispatch(fetchStart());
            },4000)
            return;
          }
          data.rows = readSeal;
          dispatch(onInstall(data, resetForm, reinitilizeReadSeals));
        }}>
        {({values, setFieldValue, handleSubmit}) => (
          <InstalacionDetalleForm
            titulo={titulo}
            values={values}
            operacionesEmbarque={operacionesEmbarque}
            contenedores={contenedores}
            lugares={lugares}
            zonas={zonas}
            productos={productos}
            cliente={cliente}
            readSeal={readSeal}
            onReadSeal={onReadSeal}
            onUnreadSeal={onUnreadSeal}
            dispatch={dispatch}
            setFieldValue={setFieldValue}
            handleSubmit={handleSubmit}
            sellos={sellos}
            images={images}
            setImages={setImages}
            url={url}
          />
        )}
      </Formik>
    </Scrollbar>
  );
};

export default InstalacionDetalle;
