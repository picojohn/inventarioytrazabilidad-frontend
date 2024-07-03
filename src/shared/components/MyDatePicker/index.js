import React from 'react';
import {useField, useFormikContext} from 'formik';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import moment from 'moment';
import MomentUtils from '@date-io/moment';
import 'moment/locale/es';

const locale = moment.locale('es');

const MyDatePicker = (props) => {
  const [field, meta] = useField(props);
  const {setFieldValue} = useFormikContext();
  const errorText = meta.error && meta.touched ? meta.error : '';
  return (
    <MuiPickersUtilsProvider utils={MomentUtils} locale={locale}>
      <KeyboardDatePicker
        {...props}
        {...field}
        helperText={errorText}
        showTodayButton
        placeholder='31/12/2000'
        error={!!errorText}
        value={field.value}
        format='DD/MM/yyyy'
        onChange={val => setFieldValue(field.name, val)}
        InputLabelProps={{
          shrink: true
        }}
      />
    </MuiPickersUtilsProvider>
  );
};

export default MyDatePicker;
