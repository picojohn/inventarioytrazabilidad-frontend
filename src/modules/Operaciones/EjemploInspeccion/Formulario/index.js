import React from 'react';
import {Box, Button, Tooltip} from '@material-ui/core';
import {Form} from 'formik';
import {Fonts} from '../../../../shared/constants/AppEnums';
import MyTextField from 'shared/components/MyTextField';
import MyAutocomplete from 'shared/components/MyAutoComplete';
import MySelectField from 'shared/components/MySelectField';
import { useEffect } from 'react';
import MyRadioField from 'shared/components/MyRadioField';
import { DATO_BOOLEAN_RADIO } from 'shared/constants/ListaValores';
import MyAutocompleteVehiculo from 'shared/components/MyAutoCompleteVehiculo';
import { AddAPhoto, Comment, KeyboardArrowDown, KeyboardArrowRight, VerifiedUser, Warning } from '@material-ui/icons';
import IntlMessages from '@crema/utility/IntlMessages';
import { useState } from 'react';
import TipoChequeoObs from './TipoChequeoObs';
import GrupoInspeccion from './GrupoInspeccion/GrupoInspeccion';
import RegistroFotografico from './RegistroFotografico/RegistroFotografico';
import { MessageView } from '@crema';
import { CREATE_TYPE, UPDATE_TYPE } from 'shared/constants/Constantes';
import { useSelector } from 'react-redux';

const types = [
  {typ: 'T', name: 'text'},
  {typ: 'F', name: 'date'},
  {typ: 'N', name: 'number'},
];

const unitTypes = [
  {typ: 'T', name: 'Unidad Transporte'},
  {typ: 'C', name: 'Contenedor'},
];

const InfoTransporte = ({id, classes, values, vehiculos, setVehicleData, transportadoras, setFieldValue, lugares}) => {
  const onTransportadoraChange = (e) => {
    if(e && e.id){
      const transportadora = transportadoras.find((transportador) => transportador.id === e.id);
      if(transportadora){
        setFieldValue(`transportadora_${id}`, transportadora.nombre);
      }
      return;
    }
    setFieldValue(`transportadora_${id}`, '');
  };
  return (
    <>
      <Box className={classes.inputs_4}>
        <MyRadioField
          label='Vehículo Propio'
          name={`vehiculo_propio_${id}`}
          options={DATO_BOOLEAN_RADIO}
        />
      </Box>
      <Box className={classes.inputs_4}>
        <MyAutocompleteVehiculo
          className={classes.myTextField}
          label='Placa Vehiculo'
          name={`placa_${id}`}
          onBlur={() => setVehicleData(id)}
          options={values[`vehiculo_propio_${id}`] === 'S' ? vehiculos : []}
        />
        <MyTextField
          className={classes.myTextField}
          label='Marca'
          name={`marca_${id}`}
        />
        <MyTextField
          className={classes.myTextField}
          label='Año modelo'
          name={`modelo_${id}`}
        />
        <MyTextField
          className={classes.myTextField}
          label='Color'
          name={`color_${id}`}
        />
        <MyAutocomplete
          className={classes.myTextField}
          label='Transportadora Empresa'
          onChange={onTransportadoraChange}
          name={`empresa_transportadora_${id}`}
          options={transportadoras.filter((transportador) => transportador.cliente_id === 1)}
        />
        <MyTextField
          className={classes.myTextField}
          label='Nombre Transportadora'
          name={`transportadora_${id}`}
        />
        <MyTextField
          className={classes.myTextField}
          label='Documento Transporte'
          name={`guia_${id}`}
        />
      </Box>
      <Box className={classes.inputs_4}>
        <MyAutocomplete
          className={classes.myTextField}
          label='Lugar Inspeccion'
          name={`lugar_id_${id}`}
          required
          options={lugares}
        />
      </Box>
    </>
  );
}

const InfoContenedor = ({id, classes, lugares}) => {
  return (
    <>
      <Box className={classes.inputs_4}>
        <MyTextField
          className={classes.myTextField}
          label='Número Contenedor'
          name={`numero_contenedor_${id}`}
        />
      </Box>
      <Box className={classes.inputs_4}>
        <MyAutocomplete
          className={classes.myTextField}
          label='Lugar Inspeccion'
          name={`lugar_id_${id}`}
          required
          options={lugares}
        />
      </Box>
    </>
  );
}

const CheckList = (props) => {
  const {
    id,
    name,
    lista,
    unidad,
    open
  } = props;
  return (
    <Box
      style={{
        display: 'grid',
        gridTemplateColumns: '4fr 1fr 1fr',
        border: '0.5px solid gray',
        alignItems: 'center',
        width: '90%',
        marginLeft: 30,
      }}
    >
      <Box
        component='h6'
        mb={{xs: 4, xl: 6}}
        mt={{xs: 4, xl: 6}}
        paddingLeft={15}
        fontSize={14}
        fontWeight={Fonts.MEDIUM}
      >
        {name}
      </Box>
      <MyRadioField
        label=''
        name={`C_${lista.id}_${id}`}
        options={DATO_BOOLEAN_RADIO}
      />
      <Box>
        <Tooltip 
          title='Obsevaciones' 
          style={{cursor: 'pointer'}}
          onClick={() => open(unidad.nombre, lista.nombre, name)}
        >
          <Comment/>
        </Tooltip>
        { id === 7 && (
          <Warning
            style={{
              color: '#FFDC00',
              marginLeft: 5
            }}
          />
        )}
      </Box>
    </Box>
  );
}

const initialObs = {
  see: false,
  lista: '',
  unidadCarga: '',
  tipoChequeo: ''
}

const Formulario = (props) => {
  const {
    lugares,
    classes,
    formatos,
    values,
    setFieldValue,
    json,
    usuarios,
    vehiculos,
    see,
    toogleSee,
    conductores,
    tiposDocumento,
    transportadoras,
  } = props;

  const [seeObs, setSeeObs] = useState(initialObs);
  const [seeInspectionGroup, setSeeInspectionGroup] = useState(false);
  const [seePhotos, setSeePhotos] = useState(false);
  const {message, error, messageType} = useSelector(({common}) => common);

  useEffect(() => {
    if(values.formato){
      const formato = formatos.find((form) => form.id === parseInt(values.formato))
      if(formato){
        setFieldValue('clase', formato.clase);
      }
    }
  },[values.formato]) // eslint-disable-line

  useEffect(() => {
    if(values.conductor){
      const conductor = conductores.find((conductor) => conductor.id === parseInt(values.conductor));
      if(conductor){
        setFieldValue('nombre_conductor', conductor.nombre_conductor);
        setFieldValue('numero_documento_conductor', conductor.numero_documento);
        setFieldValue('tipo_documento_conductor', conductor.tipo_documento_id);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.conductor]);

  const setType = (typ, list) => {
    const type = list.find((item) => item.typ === typ);
    return type?.name??'text';
  }

  const setUnity = (typ, list) => {
    const type = list.find((item) => item.typ === typ);
    return type?.name??'text';
  }

  const setVehicleData = (id) => {
    if(values[`vehiculo_propio_${id}`] === 'S'){
      const vehicle = vehiculos.find((veh) => veh.placa_vehiculo === values[`placa_${id}`]);
      if(vehicle){
        setFieldValue(`marca_${id}`, vehicle.marca_vehiculo);
        setFieldValue(`modelo_${id}`, vehicle.modelo_vehiculo);
      }
    }
  }

  const onSeeObs = (unidadCarga, lista, tipoChequeo) => {
    setSeeObs({
      see: true,
      unidadCarga,
      lista,
      tipoChequeo
    })
  }

  const close = () => {
    setSeeObs(initialObs)
  }

  const renderChevron = (state) => {
    return (
      state ?
        ( <KeyboardArrowDown style={{fontSize: 40}}/> )
        : 
        ( <KeyboardArrowRight style={{fontSize: 40}}/> )
    );
  }

  const toogleInspectionGroup = () => {
    setSeeInspectionGroup(!seeInspectionGroup);
  }

  const toogleSeePhotos = () => {
    setSeePhotos(!seePhotos);
  }
 
  return (
    <>
      <Form className='' noValidate autoComplete='off'>
        {/* <Scrollbar style={{maxHeight: 1300}}> */}
          <Box py={5} px={{xs: 5, lg: 8, xl: 10}}>
            <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <Box
                component='h6'
                mb={{xs: 4, xl: 6}}
                mt={{xs: 4, xl: 6}}
                fontSize={20}
                fontWeight={Fonts.MEDIUM}>
                Registro Inspección
              </Box>
              <Tooltip title="Registro Fotogŕafico">
                <AddAPhoto />
              </Tooltip>
            </Box>
            <Box className={classes.inputs_3}>
              <MyTextField
                className={classes.myTextField}
                label='Número'
                name='numero'
                required
                disabled
              />
              <MyTextField
                className={classes.myTextField}
                label='Versión'
                name='version'
                required
                disabled
              />
              <MyTextField
                className={classes.myTextField}
                label='Estado'
                name='estado'
                required
                disabled
              />
            </Box>
            <Box className={classes.inputs_3}>
              <MyTextField
                className={classes.myTextField}
                label='Fecha'
                name='fecha'
                type='date'
                InputLabelProps={{
                  shrink: true
                }}
                required
              />
              <MyTextField
                className={classes.myTextField}
                label='Hora Inicio'
                name='hora_inicio'
                type='time'
                InputLabelProps={{
                  shrink: true
                }}
                required
              />
              <MyTextField
                className={classes.myTextField}
                label='Hora Fin'
                name='hora_fin'
                type='time'
                InputLabelProps={{
                  shrink: true
                }}
                required
              />
            </Box>
            <Box className={classes.inputs_3}>
              <MySelectField
                className={classes.myTextField}
                label='Formato Inspeccion'
                name='formato'
                required
                options={formatos}
              />
              <MyTextField
                className={classes.myTextField}
                label='Clase Inspección'
                name='clase'
                required
                disabled
              />
              <MyAutocomplete
                className={classes.myTextField}
                label='Lugar'
                name='lugar_id'
                required
                options={lugares}
              />
            </Box>
            <Box className={classes.inputs_3}>
              <MyAutocomplete
                className={classes.myTextField}
                label='Conductores Empresa'
                name={'conductor'}
                options={conductores.map((conductor) => ({...conductor, nombre: conductor.nombre_conductor}))}
                required
              />
            </Box>
            <Box className={classes.inputs_3}>
              <MyAutocomplete
                className={classes.myTextField}
                label='Tipo Documento Conductor'
                name={'tipo_documento_conductor'}
                options={tiposDocumento}
                required
              />
              <MyTextField
                className={classes.myTextField}
                label='Número Documento Conductor'
                name='numero_documento_conductor'
                required
              />
              <MyTextField
                className={classes.myTextField}
                label='Nombre Conductor'
                name='nombre_conductor'
                required
              />
              <MyTextField
                className={classes.myTextField}
                label='Número Viaje'
                name='numero_viaje'
                required
              />
            </Box>
            {json.dAdicionales.length > 0 && (
              <Box
                component='h6'
                mb={{xs: 4, xl: 6}}
                mt={{xs: 4, xl: 6}}
                fontSize={16}
                fontWeight={Fonts.MEDIUM}>
                Datos Adicionales:
              </Box>
            )}
            <Box className={classes.inputs_4}>
              {json.dAdicionales.map((dAdicional, index) => (
                <MyTextField
                  key={index}
                  className={classes.myTextField}
                  label={dAdicional.nombre}
                  name={`DAI_${dAdicional.id}`}
                  type={setType(dAdicional.tipo, types)}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              ))}
            </Box>
            <Box 
              component='h6' 
              fontSize={17} 
              onClick={() => toogleInspectionGroup()}
              fontWeight='bold' 
              mb={3} 
              style={{
                display: 'flex', 
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
                Grupo Inspeccion: {renderChevron(seeInspectionGroup)}
            </Box>
            {seeInspectionGroup && (<GrupoInspeccion title={"Grupo Inspeccion"}/>)}
            {json.unidades.map((unidad, index) => (
              <Box key={index}>
                <Box 
                  style={{
                    borderTop: '1px solid gray',
                    marginTop: 15,
                    paddingTop: 5,
                    fontSize: 18
                  }}
                >
                  <span style={{fontWeight: 'bold'}}>{setUnity(unidad.tipo, unitTypes)}:</span> {unidad.nombre}
                </Box>
                <Box className={classes.inputs_4}>
                  <MyAutocomplete
                    className={classes.myTextField}
                    label='Usuario Inspeccion'
                    name={`UI_${unidad.id}`}
                    options={usuarios}
                    required
                  />
                </Box>
                { unidad.tipo === 'T' ? 
                  ( <InfoTransporte 
                      id={unidad.id}
                      classes={classes}
                      values={values}
                      vehiculos={vehiculos}
                      setVehicleData={setVehicleData}
                      setFieldValue={setFieldValue}
                      transportadoras={transportadoras}
                      lugares={lugares}
                    /> 
                  ) 
                :
                  ( 
                    <InfoContenedor 
                      id={unidad.id}
                      classes={classes} 
                      lugares={lugares}
                    /> 
                  )
                }
                {unidad.dAdicionales.length > 0 && (
                  <Box
                    component='h6'
                    mb={{xs: 4, xl: 6}}
                    mt={{xs: 4, xl: 6}}
                    fontSize={16}
                    fontWeight={Fonts.MEDIUM}>
                    Datos Adicionales:
                  </Box>
                )}
                <Box className={classes.inputs_4}>
                  {unidad.dAdicionales.map((dAdicional, index) => (
                    <MyTextField
                      key={index}
                      className={classes.myTextField}
                      label={dAdicional.nombre}
                      name={`DAU_${unidad.id}_${dAdicional.id}`}
                      type={setType(dAdicional.tipo, types)}
                      InputLabelProps={{
                        shrink: true
                      }}
                    />
                  ))}
                </Box>
                {unidad.listas.map((lista, index) => (
                  <Box key={index}>
                    <Box
                      style={{
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    > 
                      {see[`${unidad.id}${lista.id}`] ? 
                          ( <KeyboardArrowDown
                              style={{
                                cursor: 'pointer'
                              }}
                              onClick={() => {
                                toogleSee(`${unidad.id}${lista.id}`)
                              }}
                            /> 
                          )
                        :
                          ( <KeyboardArrowRight
                              style={{
                                cursor: 'pointer'
                              }}
                              onClick={() => {
                                toogleSee(`${unidad.id}${lista.id}`)
                              }}
                            /> 
                          )
                      }
                      <Box
                        key={index}
                        component='h6'
                        mb={{xs: 4, xl: 6}}
                        mt={{xs: 4, xl: 6}}
                        fontSize={16}
                        fontWeight={Fonts.MEDIUM}>
                        {lista.nombre}
                      </Box>
                      { lista.chequeos.every((check) => values[`C_${lista.id}_${check.id}`]) &&
                        <VerifiedUser
                          style={{
                            color: '#48ac33'
                          }}
                        />
                      }
                    </Box>
                    {lista.chequeos.map((chequeo, index) => 
                      see[`${unidad.id}${lista.id}`] && (
                      <CheckList 
                        key={index} 
                        name={chequeo.nombre} 
                        id={chequeo.id} 
                        lista={lista}
                        unidad={unidad}
                        open={onSeeObs}
                      />
                    ))}
                  </Box>
                ))}
              </Box>
            ))}
            <Box 
              component='h6' 
              fontSize={17} 
              onClick={() => toogleSeePhotos()}
              fontWeight='bold' 
              mb={3}
              mt={3} 
              style={{
                display: 'flex', 
                alignItems: 'center',
                cursor: 'pointer'
              }}
            >
                Registro Fotografico: {renderChevron(seeInspectionGroup)}
            </Box>
            {seePhotos && (<RegistroFotografico title={"Registro Fotográfico"}/>)}
            <Box sx={{mt: 4}}>
              <MyRadioField
                label='El vehículo y el contenedor son aceptados'
                name={`vehiculo_contenedor_aceptados`}
                options={DATO_BOOLEAN_RADIO}
              />
            </Box>
          </Box>
        {/* </Scrollbar> */}
        <Box className={classes.bottomsGroup}>
          <Button
            className={`${classes.btnRoot} ${classes.btnFinal}`}
            variant='contained'>
            Finalizar
          </Button>
          <Button
            className={`${classes.btnRoot} ${classes.btnPrymary}`}
            variant='contained'
            type='submit'>
            <IntlMessages id='boton.submit' />
          </Button>
          <Button
            className={`${classes.btnRoot} ${classes.btnSecundary}`}
            onClick={() => console.log('Hi')}>
            <IntlMessages id='boton.cancel' />
          </Button>
        </Box>
      </Form>
      { seeObs.see && (
        <TipoChequeoObs
          handleOnClose={close}
          showForm={seeObs.see}
          unidadCarga={seeObs.unidadCarga}
          lista={seeObs.lista}
          tipoChequeo={seeObs.tipoChequeo}
        />
      )}
      <MessageView
        variant={messageType === UPDATE_TYPE || messageType === CREATE_TYPE? 'success': 'error'}
        message={message||error}
      />
    </>
  );
};

export default Formulario;
