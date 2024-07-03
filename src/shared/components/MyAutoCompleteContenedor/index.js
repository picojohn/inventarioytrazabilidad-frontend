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
      if (option.numero_contenedor === field.value) {
        myvalueAux = option.numero_contenedor;
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
            if (option.numero_contenedor === field.value) {
              form.setValue('');
            }
          });
        }
      }}
      {...props}
      onChange={(event, newValue, reasons, details, trial) =>
        newValue ? form.setValue(newValue.numero_contenedor) : form.setValue('')
      }
      inputValue={myvalue}
      renderOption={(option) => {
        if (option.estado) {
          return (
            <React.Fragment>
              {option.numero_contenedor}
            </React.Fragment>
          );
        }
      }}
      getOptionLabel={(option) => (option.estado ? option.numero_contenedor : '')}
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
