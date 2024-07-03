import React, {useEffect, useState} from 'react';
import Dialog from '@material-ui/core/Dialog';
import {Formik} from 'formik';
import * as yup from 'yup';
import {Scrollbar} from '../../../../@crema';
import Slide from '@material-ui/core/Slide';
import KitProductosTempForm from './KitProductosTempForm';
import {Fonts} from '../../../../shared/constants/AppEnums';
import {makeStyles} from '@material-ui/core/styles/index';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='down' ref={ref} {...props} />;
});

const validationSchema = yup.object({
  producto_id: yup
    .number()
    .required('Requerido'),
  cantidad: yup
    .number()
    .required('Requerido'),
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

const KitProductosTempCreador = (props) => {
  const {
    productoKit,
    handleOnClose,
    accion,
    titulo,
    headers,
    productos,
    productosInternos,
    newTempRows,
    onUpdateTempComponents
  } = props;

  const classes = useStyles(props);

  const [showForm, setShowForm] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});

  useEffect(() => {
    if (selectedRow) {
      setShowForm(true);
    } else if (accion === 'crear') {
      setShowForm(true);
    } else {
      setShowForm(false);
    }
  }, [selectedRow, accion]);

  useEffect(() => {
    if ((accion === 'editar') | (accion === 'ver')) {
      const selected = newTempRows[productoKit];
      setSelectedRow(selected);
    }
  }, [accion]); // eslint-disable-line

  return (
    showForm && (
      <Dialog
        open={showForm}
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
              id: selectedRow?.id??'',
              index: productoKit,
              kit_id: headers?.id??'',
              cliente: headers?.cliente??'',
              kit: headers?.nombre??'',
              producto_id: selectedRow?.producto_id??'',
              producto_s3: selectedRow?.producto_s3??'',
              producto_s3_id: selectedRow?.producto_s3??'',
              cantidad: selectedRow?.cantidad??'',
              estado: selectedRow
                ? selectedRow.estado === 1
                  ? '1'
                  : '0'
                : '1',
            }}
            validationSchema={validationSchema}
            onSubmit={(data, {setSubmitting}) => {
              setSubmitting(true);
              if (accion === 'editar') {
                if (selectedRow) {
                  // dispatch(onUpdate(data, handleOnClose, updateColeccion));
                  onUpdateTempComponents(data);
                  handleOnClose();
                }
              }
              setSubmitting(false);
            }}>
            {({initialValues, setFieldValue, values}) => (
              <KitProductosTempForm
                setFieldValue={setFieldValue}
                handleOnClose={handleOnClose}
                titulo={titulo}
                accion={accion}
                initialValues={initialValues}
                productos={productos}
                productosInternos={productosInternos}
                values={values}
              />
            )}
          </Formik>
        </Scrollbar>
      </Dialog>
    )
  );
};

export default KitProductosTempCreador;
