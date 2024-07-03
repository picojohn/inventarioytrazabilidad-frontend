import React from 'react';
import TextField from '@material-ui/core/TextField';
import {useField} from 'formik';

const MyTextField = (props) => {
  const [field, meta] = useField(props);
  const { onBlur } = props;
  const errorText = meta.error && meta.touched ? meta.error : '';
  return (
    <TextField
      {...props}
      {...field}
      helperText={errorText}
      error={!!errorText}
      onBlur={onBlur}
    />
  );
};

export default MyTextField;
