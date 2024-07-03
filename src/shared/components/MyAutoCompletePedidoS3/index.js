import {useField} from 'formik';
import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

const MyAutocompletePedidoS3 = (props) => {
  const [field, meta, form] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : '';
  let myvalueAux = '';
  if (field.value !== '') {
    props.options.forEach((option) => {
      if (option.numero_pedido === field.value) {
        myvalueAux = option.numero_pedido;
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
            if (option.numero_pedido === field.value) {
              form.setValue('');
            }
          });
        }
      }}
      {...props}
      onChange={(event, newValue, reasons, details, trial) =>
        newValue ? form.setValue(newValue.numero_pedido) : form.setValue('')
      }
      inputValue={myvalue}
      renderOption={(option) => {
        if (option.estado) {
          return (
            <React.Fragment>
             {option.numero_pedido} - {option.fecha_pedido}
            </React.Fragment>
          );
        }
      }}
      getOptionLabel={(option) => (option.estado ? option.numero_pedido : '')}
      renderInput={(params) => {
        return (
          <TextField
            {...params}
            {...field}
            name={props.name}
            className={props.className}
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

export default MyAutocompletePedidoS3;
