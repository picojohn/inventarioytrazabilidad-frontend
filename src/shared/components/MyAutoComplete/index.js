import {useField} from 'formik';
import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

const MyAutocomplete = (props) => {
  const [field, meta, form] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : '';
  let myvalueAux = '';
  if (field.value !== '') {
    props.options.forEach((option) => {
      if (option.id === field.value) {
        myvalueAux = option.nombre;
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
            if (option.id === field.value) {
              form.setValue('');
            }
          });
        }
      }}
      {...props}
      onChange={(event, newValue, reasons, details, trial) => {
        if(typeof props.onChange === 'function'){
          props.onChange(newValue);
        }
        return newValue ? form.setValue(newValue.id) : form.setValue('')
      }}
      inputValue={myvalue}
      renderOption={(option) => {
        if (option.estado) {
          return (
            <React.Fragment>
              {props.completeid
                ? (option.numero_documento ? option.numero_documento : '0') +
                  ' - ' +
                  option.nombre
                : option.nombre}
            </React.Fragment>
          );
        }
      }}
      getOptionLabel={(option) => (option.estado ? option.nombre : '')}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            {...field}
            name={props.name}
            // className={props.className}
            style={props.style}
            label={props.label}
            required={props.required}
            helperText={errorText}
            error={!!errorText}
          />
        );
      }}
    />
  );
};

export default MyAutocomplete;
