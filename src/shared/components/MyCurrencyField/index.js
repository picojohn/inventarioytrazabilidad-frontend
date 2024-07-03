import React from 'react';
import TextField from '@material-ui/core/TextField';
import {useField} from 'formik';
import NumberFormat from 'react-number-format';

const NumberFormatCustom = React.forwardRef(function NumberFormatCustom(props, ref) {
  const { onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      decimalScale={2}
      fixedDecimalScale
      isNumericString
    />
  );
});

const MyCurrencyField = (props) => {
  const [field, meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : '';
  return (
    <TextField
      {...props}
      {...field}
      InputLabelProps={{
        shrink: true,
      }}
      InputProps={{
        inputComponent: NumberFormatCustom,
      }}
      helperText={errorText}
      error={!!errorText}
    />
  );
};

export default MyCurrencyField;