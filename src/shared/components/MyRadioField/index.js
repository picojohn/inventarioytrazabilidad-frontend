import React from 'react';
import {Field, useField} from 'formik';
import {RadioGroup, Radio, FormControl, FormControlLabel, FormHelperText, FormLabel, makeStyles} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  labelLeft: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  marginRight: {
    marginRight: 5
  }
}));

const MyRadioField = (props) => {
  const [field, meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : '';
  const classes = useStyles(props);
  return (
    <FormControl error={!!errorText} component='fieldset'>
      <div className={props.labelPlacement === 'start' ? classes.labelLeft : ''}>
      <FormLabel {...props} {...field} className={props.labelPlacement === 'start' ? classes.marginRight : ''}>
        {props.label}
      </FormLabel>
      <Field {...props} {...field} type='radio' as={RadioGroup} row>
        {props.options.map((option, index) => {
          return (
            <FormControlLabel
              key={index}
              value={option.value}
              control={<Radio color='primary' />}
              label={option.label}
              labelPlacement='end'
              disabled={props.disabled}
            />
          );
        })}
      </Field>
      </div>
      <FormHelperText>{errorText}</FormHelperText>
    </FormControl>
  );
};

export default MyRadioField;