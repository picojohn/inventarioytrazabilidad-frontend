import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {Form, Formik, useField} from 'formik';
import * as yup from 'yup';
import {useDispatch} from 'react-redux';

import InfoView from '@crema/core/InfoView';
import {onJwtSignIn} from '../../../redux/actions';
import {useHistory} from 'react-router-dom';
import Box from '@material-ui/core/Box';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import {useIntl} from 'react-intl';
import {makeStyles} from '@material-ui/core/styles';
import {Fonts} from '../../../shared/constants/AppEnums';
import { useLocation } from 'shared/hooks/useLocation';
import { useEffect } from 'react';

const MyTextField = (props) => {
  const [field, meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : '';
  return (
    <TextField
      {...props}
      {...field}
      helperText={errorText}
      error={!!errorText}
    />
  );
};

const useStyles = makeStyles((theme) => ({
  formRoot: {
    textAlign: 'left',
    width: '100%',
    [theme.breakpoints.up('xl')]: {
      marginBottom: 24,
    },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  myTextFieldRoot: {
    width: '100%',
  },
  checkboxRoot: {
    marginLeft: -12,
  },
  pointer: {
    cursor: 'pointer',
  },
  btnRoot: {
    borderRadius: theme.overrides.MuiCard.root.borderRadius,
    width: '10rem',
    fontWeight: Fonts.REGULAR,
    fontSize: 16,
    textTransform: 'capitalize',
  },
  btnRootFull: {
    width: '100%',
  },
  dividerRoot: {
    marginBottom: 16,
    marginLeft: -48,
    marginRight: -48,
    [theme.breakpoints.up('xl')]: {
      marginBottom: 32,
    },
  },
  textPrimary: {
    color: theme.palette.text.primary,
  },
  colorTextPrimary: {
    color: theme.palette.primary.main,
  },
  underlineNone: {
    textDecoration: 'none',
  },
  textGrey: {
    color: theme.palette.grey[500],
  },
}));

const validationSchema = yup.object({
  username: yup
    .string()
    .required(<IntlMessages id='validation.userRequired' />),
  password: yup
    .string()
    .required(<IntlMessages id='validation.passwordRequired' />),
});

const SigninJwtAuth = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const onGoToForgetPassword = () => {
    history.push('/forget-password', {tab: 'jwtAuth'});
  };
  const {getLocation, latitude, longitude} = useLocation();

  useEffect(() => {
    getLocation();
  },[]) // eslint-disable-line

  const {messages} = useIntl();
  const classes = useStyles(props);

  return (
    <Box flex={1} display='flex' flexDirection='column'>
      <Box
        px={{xs: 6, sm: 10, xl: 15}}
        pt={8}
        sx={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
        flex={1}
        display='flex'
        flexDirection='column'>
        <Formik
          validateOnChange={true}
          initialValues={{
            username: '',
            password: '',
          }}
          validationSchema={validationSchema}
          onSubmit={(data, {setSubmitting}) => {
            setSubmitting(true);
            dispatch(
              onJwtSignIn({username: data.username, password: data.password, latitud: latitude, longitud: longitude}),
              history,
            );
            setSubmitting(false);
          }}>
          {({isSubmitting}) => (
            <Form className={classes.formRoot} noValidate autoComplete='off'>
              <Box width='100%' mb={{xs: 5, xl: 8}}>
                <MyTextField
                  fullWidth
                  placeholder={messages['common.ni']}
                  name='username'
                  label={<IntlMessages id='common.ni' />}
                  variant='outlined'
                  className={classes.myTextFieldRoot}
                />
              </Box>

              <Box width='100%' mb={{xs: 3, xl: 4}}>
                <MyTextField
                  fullWidth
                  type='password'
                  placeholder={messages['common.password']}
                  label={<IntlMessages id='common.password' />}
                  name='password'
                  variant='outlined'
                  className={classes.myTextFieldRoot}
                />
              </Box>

              <Box
                mb={{xs: 3, xl: 4}}
                display='flex'
                flexDirection={{xs: 'column', sm: 'row'}}
                alignItems={{sm: 'center'}}
                justifyContent={{sm: 'space-between'}}
                fontSize={15}>
                <Box
                  color='primary.main'
                  component='span'
                  ml={{sm: 4}}
                  className={classes.pointer}
                  onClick={onGoToForgetPassword}
                  fontSize={15}>
                  <IntlMessages id='common.forgetPassword' />
                </Box>
              </Box>

              <Box
                mb={6}
                display='flex'
                flexDirection={{xs: 'column', sm: 'row'}}
                alignItems={{sm: 'center'}}
                justifyContent={{sm: 'space-between'}}>
                <Button
                  variant='contained'
                  color='primary'
                  type='submit'
                  disabled={isSubmitting}
                  className={classes.btnRoot}>
                  <IntlMessages id='common.login' />
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Box>
      <InfoView />
    </Box>
  );
};

export default SigninJwtAuth;
