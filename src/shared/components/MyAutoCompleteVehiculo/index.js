import {useField} from 'formik';
import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

const MyAutocompleteContenedor = (props) => {
  const [field, meta, form] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : '';
  let myvalueAux = '';
  if (field.value !== '') {
    props.options.forEach((option) => {
      if (option.placa_vehiculo === field.value) {
        myvalueAux = option.placa_vehiculo;
      }
    });
  }
  let myvalue = '';
  if (myvalueAux === '') {
    myvalue = field.value;
  } else {
    myvalue = myvalueAux;
  }
  return (
    <Autocomplete
      selectOnFocus={false}
      openOnFocus
      onKeyDown={(e) => {
        if (e.key === 'Backspace') {
          props.options.forEach((option) => {
            if (option.placa_vehiculo === field.value) {
              form.setValue('');
            }
          });
        }
      }}
      {...props}
      onChange={(event, newValue, reasons, details, trial) => {
        if(newValue) {
          form.setValue(newValue.placa_vehiculo)
        } else { 
          form.setValue('')
        }
      }}
      inputValue={myvalue}
      renderOption={(option) => {
        if (option.estado) {
          return (
            <React.Fragment>
              {option.placa_vehiculo}
            </React.Fragment>
          );
        }
      }}
      getOptionLabel={(option) => (option.estado ? option.placa_vehiculo : '')}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            {...field}
            name={props.name}
            style={props.style}
            label={props.label}
            required={props.required}
            helperText={errorText}
            error={!!errorText}
            onBlur={props.onBlur}
          />
        );
      }}
    />
  );
};

export default MyAutocompleteContenedor;
