import { Scrollbar } from "@crema";
import IntlMessages from "@crema/utility/IntlMessages";
import { Box, Button } from "@material-ui/core";
import { Form } from "formik";
import React from "react"
import { useEffect } from "react";
import MyAutocomplete from "shared/components/MyAutoComplete";
import MySelectField from "shared/components/MySelectField";
import MyTextField from "shared/components/MyTextField";
import { Fonts } from "shared/constants/AppEnums";

const GIForm = ({
  classes,
  action,
  tiposDocumento,
  inspectores,
  setFieldValue,
  values,
  title,
  handleOnClose,
}) => {
  
  useEffect(() => {
    if(values.inspector){
      const ins = inspectores.find((inspec) => inspec.id === values.inspector);
      if (ins) {
        setFieldValue("tipo_documento", ins.tipo_documento_id)
        setFieldValue("nombre_completo", ins.nombre)
        setFieldValue("numero_documento", ins.numero_documento)
      } else {
        setFieldValue("tipo_documento", "")
        setFieldValue("nombre_completo", "")
        setFieldValue("numero_documento", "")
      }
    }
  },[values]);

  return (
    <Form noValidate autoComplete='off'>
      <Scrollbar style={{maxHeight: 600}}>
        <Box py={5} px={{xs: 5, lg: 8, xl: 10}}>
          <Box
            component='h6'
            mb={{xs: 4, xl: 6}}
            fontSize={20}
            fontWeight={Fonts.MEDIUM}>
            {title}
          </Box>
          <Box px={{md: 5, lg: 8, xl: 10}}>
            <Box className={classes.inputs_3}>
              <MyTextField
                className={classes.myTextField}
                label='Número Inspeccion'
                name='numero'
                disabled
              />
              <MyTextField
                className={classes.myTextField}
                label='Versión'
                name='version'
                disabled
              />
              <MyTextField
                className={classes.myTextField}
                label='Estado'
                name='estado'
                disabled
              />
            </Box>
            <Box className={classes.inputs_1_2}>
              <MyTextField
                className={classes.myTextField}
                label='Fecha'
                name='fecha'
                type='date'
                disabled
                InputLabelProps={{
                  shrink: true
                }}
              />
              <MyTextField
                className={classes.myTextField}
                label='Nombre Conductor'
                name='nombre_conductor'
                disabled
              />
            </Box>
            <MyAutocomplete
              className={classes.myTextField}
              label='Inspector'
              name={'inspector'}
              options={inspectores.map((inspector) => ({...inspector, nombre: inspector.nombre}))}
              disabled={action === "ver"}
            />
            <Box className={classes.inputs_2}>
              <MySelectField
                className={classes.myTextField}
                label='Tipo Documento'
                name='tipo_documento'
                required
                options={tiposDocumento.map((tipoDoc) => ({id: tipoDoc.tipo_documento_codigo, nombre: tipoDoc.tipo_documento}))}
                disabled={action === "ver"}
              />
              <MyTextField
                className={classes.myTextField}
                label='Número Documento'
                name='numero_documento'
                required
                disabled={action === "ver"}
              />
            </Box>
            <MyTextField
              className={classes.myTextField}
              label='Nombre Completo'
              name='nombre_completo'
              required
              disabled={action === "ver"}
            />
            <MyTextField
              className={classes.myTextField}
              label='Empresa'
              name='empresa'
              disabled={action === "ver"}
            />
            <Box className={classes.inputs_2}>
              <MyTextField
                className={classes.myTextField}
                label='Cargo'
                name='cargo'
                disabled={action === "ver"}
              />
              <MyTextField
                className={classes.myTextField}
                label='Identificacion Chaleco'
                name='identificacion_chaleco'
                disabled={action === "ver"}
              />
            </Box>
            <MyTextField
              className={classes.myTextField}
              label='Firma'
              name='firma'
              required
              disabled={action === "ver"}
            />
          </Box>
        </Box>
      </Scrollbar>
      <Box className={classes.bottomsGroup}>
        {action !== 'ver' && (
          <Button
            className={`${classes.btnRoot} ${classes.btnPrymary}`}
            variant='contained'
            type='submit'>
            <IntlMessages id='boton.submit' />
          </Button>
        )}
        <Button
          className={`${classes.btnRoot} ${classes.btnSecundary}`}
          onClick={handleOnClose}>
          <IntlMessages id='boton.cancel' />
        </Button>
      </Box>
    </Form>
  )
};

export default GIForm;