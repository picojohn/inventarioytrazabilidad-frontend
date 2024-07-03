import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import {Formik} from 'formik';
import {Scrollbar} from '@crema';
import Slide from '@material-ui/core/Slide';
import TipoChequeoObsForm from './TipoChequeoObsForm';
import {Fonts} from 'shared/constants/AppEnums';
import {makeStyles} from '@material-ui/core/styles/index';

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
}));

const TipoChequeoObs = (props) => {
  const {
    showForm,
    handleOnClose,
    unidadCarga,
    lista,
    tipoChequeo
  } = props;

  const classes = useStyles(props);

  return (
    showForm && (
      <Dialog
        open={showForm}
        onClose={handleOnClose}
        aria-labelledby='simple-modal-title'
        TransitionComponent={Transition}
        aria-describedby='simple-modal-description'
        className={classes.dialogBox}
        fullWidth
        maxWidth={'sm'}>
        <Scrollbar>
          <Formik
            initialStatus={true}
            enableReinitialize={true}
            validateOnBlur={false}
            initialValues={{
              id: '',
              unidadCarga: unidadCarga??'',
              lista: lista??'',
              tipoChequeo: tipoChequeo??'',
              tipo_alerta: '',
              numero: '',
              observaciones: '',
              evidencias: '',
            }}
            onSubmit={(data, {setSubmitting}) => {
              setSubmitting(true);
              console.log(data);
              setSubmitting(false);
            }}>
            {() => (
              <TipoChequeoObsForm
                handleOnClose={handleOnClose}
              />
            )}
          </Formik>
        </Scrollbar>
      </Dialog>
    )
  );
};

export default TipoChequeoObs;
