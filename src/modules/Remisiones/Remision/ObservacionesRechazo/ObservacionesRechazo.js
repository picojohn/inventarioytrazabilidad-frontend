import React, { useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import {Form, Formik} from 'formik';
import * as yup from 'yup';
import {useDispatch} from 'react-redux';
import {Scrollbar} from '@crema';
import {
  onConfirmOrReject,
} from 'redux/actions/RemisionAction';
import Slide from '@material-ui/core/Slide';
import {Fonts} from 'shared/constants/AppEnums';
import {makeStyles} from '@material-ui/core/styles/index';
import { Box, Button } from '@material-ui/core';
import MyTextField from 'shared/components/MyTextField';
import IntlMessages from '@crema/utility/IntlMessages';
import { usePerteneceASecSel } from 'shared/hooks/usePerteneceASecSel';
import MyRadioField from 'shared/components/MyRadioField';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='down' ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  dialogBox: {
    position: 'relative',
    '& .MuiDialog-paperWidthSm': {
      maxWidth: 600,
      width: '100%',
      // maxHeight:'fit-content'
    },
    '& .MuiTypography-h6': {
      fontWeight: Fonts.LIGHT,
    },
  },
  bottomsGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingBottom: '20px',
    gap: '10px',
    backgroundColor: 'white',
    paddingRight: '20px',
    position: 'sticky',
    left: 0,
    bottom: 0,
  },
  myTextField: {
    width: '100%',
    marginBottom: 5,
    [theme.breakpoints.up('xl')]: {
      marginBottom: 5,
    },
    height: '60px',
  },
  btnRoot: {
    paddingLeft: 15,
    paddingRight: 15,
    color: 'white',
    '&:hover': {
      backgroundColor: theme.palette.colorHover,
      cursor: 'pointer',
    },
  },
  btnPrymary: {
    backgroundColor: theme.palette.primary.main,
  },
  btnSecundary: {
    backgroundColor: theme.palette.grayBottoms,
  },
}));

const options = [
  {value: 'S', label: 'Sí'},
  {value: 'N', label: 'No'},
];

const ObservacionesRechazoForm = (props) => {
  const {
    show,
    id,
    handleOnClose,
    lugar_origen_id,
    locationInfo
  } = props;

  const {pertenece, consultarPertenece} = usePerteneceASecSel();
  const dispatch = useDispatch();
  const classes = useStyles(props);

  const validationSchema = yup.object({
    observaciones_rechazo: yup
      .string()
      .required('Requerido')
      .max('128', 'Debe tener máximo 128 Caracteres'),
    id: yup
      .number()
      .required('Requerido'),
    indicativo_series: yup
      .string()
      .nullable()
      .test({
        name: 'pertenece',
        exclusive: false,
        params: {
          pertenece
        },
        message: 'Requerido',
        test: function(value){
          return (!!pertenece && value !== undefined) || (!!!pertenece && value === undefined) 
        }
      }),
  });
  
  useEffect(() => {
    if(lugar_origen_id){
      consultarPertenece(lugar_origen_id);
    }
  },[lugar_origen_id]); // eslint-disable-line

  return (
    <Dialog
      open={show}
      onClose={handleOnClose}
      aria-labelledby='simple-modal-title'
      TransitionComponent={Transition}
      aria-describedby='simple-modal-description'
      className={classes.dialogBox}
      maxWidth={'sm'}>
      <Scrollbar>
        <Formik
          initialStatus={true}
          enableReinitialize={true}
          validateOnBlur={false}
          initialValues={{
            id,
            observaciones_rechazo: '',
            action: 'Reject',
            indicativo_series: '',
            latitude: locationInfo.lat,
            longitude: locationInfo.lon
          }}
          validationSchema={validationSchema}
          onSubmit={(data, {setSubmitting}) => {
            setSubmitting(true);
            dispatch(onConfirmOrReject(data.id, data, handleOnClose));
            setSubmitting(false);
          }}>
          {() => (
            <Form className='' noValidate autoComplete='off'>
              <Scrollbar style={{maxHeight: 600}}>
                <Box py={5} px={{xs: 5, lg: 8, xl: 10}}>
                  <Box
                    component='h6'
                    fontSize={20}
                    py={3}
                    fontWeight={Fonts.BOLD}>
                    Rechazo Remisión
                  </Box>
                  <Box
                    style={{
                      marginBottom: 50
                    }} 
                    px={{md: 5, lg: 8, xl: 10}}
                  >
                    {pertenece &&
                      <MyRadioField
                        label='Permitir Repetir Series'
                        labelPlacement='start'
                        name='indicativo_series'
                        options={options}
                      />
                    }
                    <MyTextField
                      className={classes.myTextField}
                      label='Observaciones Rechazo'
                      name='observaciones_rechazo'
                      variant='outlined'
                      multiline
                      minRows={4}
                    />
                  </Box>
                </Box>
              </Scrollbar>
              <Box className={classes.bottomsGroup}>
                <Button
                  className={`${classes.btnRoot} ${classes.btnPrymary}`}
                  variant='contained'
                  type='submit'>
                  <IntlMessages id='boton.submit' />
                </Button>
                <Button
                  className={`${classes.btnRoot} ${classes.btnSecundary}`}
                  onClick={handleOnClose}>
                  <IntlMessages id='boton.cancel' />
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Scrollbar>
    </Dialog>
  );
};

export default ObservacionesRechazoForm;
