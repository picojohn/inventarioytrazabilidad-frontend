import React from 'react';
import {useField, useFormikContext} from 'formik';
import { KeyboardTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import 'moment/locale/es';

const locale = moment.locale('es')

const MyTimePicker = (props) => {
  const [field, meta] = useField(props);
  const {setFieldValue} = useFormikContext();
  const errorText = meta.error && meta.touched ? meta.error : '';
  return (
    <MuiPickersUtilsProvider utils={MomentUtils} locale={locale}>
      <KeyboardTimePicker
        {...props}
        {...field}
        showTodayButton
        minutesStep={5}
        helperText={errorText}
        error={!!errorText}
        InputLabelProps={{
          shrink: true
        }}
        value={field.value}
        onChange={val => setFieldValue(field.name, val)}
      />
    </MuiPickersUtilsProvider>
  );
};

export default MyTimePicker;
