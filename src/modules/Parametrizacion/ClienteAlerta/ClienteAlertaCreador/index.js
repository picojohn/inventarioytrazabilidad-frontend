import React, {useEffect, useRef, useState} from 'react';
import Dialog from '@material-ui/core/Dialog';
import { Formik } from 'formik';
import * as yup from 'yup';
import { 
   useDispatch, 
   useSelector
} from 'react-redux';
import { Scrollbar } from '../../../../@crema';
import {
   onShow, 
   onUpdate, 
   onCreate,
} from '../../../../redux/actions/ClienteAlertaAction';
import Slide from '@material-ui/core/Slide';
import ClienteAlertaForm from './ClienteAlertaForm';
import { Fonts } from '../../../../shared/constants/AppEnums';
import { makeStyles } from '@material-ui/core/styles/index';
import { onGetColeccionLigera as tipoAlertaLigera } from 'redux/actions/TipoAlertaAction';

const Transition = React.forwardRef(function Transition(props, ref) {
   return <Slide direction = 'down' ref = {ref} {...props} />;
});

const validationSchema = yup.object({
   cliente_id: yup.number().required('Requerido'),
   alerta_id: yup.number().required('Requerido'),
   numero_horas: yup.number().required('Requerido').typeError('Debe ser un número'),
   estado: yup.string().required('Requerido'),
});

const ClienteAlertaCreador = (props) => {
   const { 
      clienteAlerta, 
      handleOnClose, 
      accion, 
      updateColeccion, 
      titulo,
      cliente,
   } = props;

   const dispatch = useDispatch();
   const [showForm, setShowForm] = useState(false);
   const useStyles = makeStyles(
      (theme) => ({
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
      })
   );

   const classes = useStyles(props);

   let selectedRow = useRef();
   selectedRow = useSelector(
      ({ clienteAlertaReducer }) => clienteAlertaReducer.selectedRow,
   );

   const tiposAlerta = useSelector(
      ({ tipoAlertaReducer }) => tipoAlertaReducer.ligera, 
   );

   const initializeSelectedRow = () => {
      selectedRow = null;
   };

   useEffect(() => {
      initializeSelectedRow();
      dispatch( tipoAlertaLigera() );
      // eslint-disable-next-line 
   }, []);

   if (accion === 'crear') {
      initializeSelectedRow();
   }

   useEffect(() => {
      if (selectedRow) 
         setShowForm(true);
      else 
         if (accion === 'crear') 
            setShowForm(true);
         else 
            setShowForm(false);
   }, [selectedRow, accion]);
   
   useEffect(() => {
      if ((accion === 'editar') | (accion === 'ver')) 
         dispatch(onShow(cliente.id, clienteAlerta));
      // eslint-disable-next-line
   }, [accion, dispatch, clienteAlerta]);

   return (
      showForm && (
         <Dialog
            open = { showForm }
            onClose = { handleOnClose }
            aria-labelledby = 'simple-modal-title'
            TransitionComponent = { Transition }
            aria-describedby = 'simple-modal-description'
            className = { classes.dialogBox }
            maxWidth = { 'sm' }
            fullWidth>
            <Scrollbar>
               <Formik
                  initialStatus = { true }
                  enableReinitialize = { true }
                  validateOnBlur = { false }
                  initialValues = {{
                     
                     id: selectedRow?.id??'',

                     cliente_id: cliente?.id??'', 

                     nombre_cliente: cliente?.nombre??'',
                     
                     alerta_id: selectedRow?.alerta_id??'',
                                         
                     numero_horas: selectedRow?.numero_horas??'',
                     
                     observaciones: selectedRow?.observaciones??'',
                     
                     estado: selectedRow 
                        ? selectedRow.estado === 1 
                           ? '1' 
                           : '0' 
                        : '1',

                  }}
                  validationSchema = { validationSchema }
                  onSubmit = {
                     (data, {setSubmitting}) => {
                        setSubmitting(true);
                        if (accion === 'crear') 
                           dispatch(
                              onCreate(data, handleOnClose, updateColeccion)
                           );
                        else 
                           if (accion === 'editar') 
                              if (selectedRow) 
                                 dispatch(
                                    onUpdate(data, handleOnClose, updateColeccion)
                                 );
                        setSubmitting(false);
                     }
                  }>
                  {
                     ({initialValues, values}) => (
                        <ClienteAlertaForm
                           handleOnClose = { handleOnClose }
                           titulo = { titulo }
                           accion = { accion }
                           values = { values }
                           initialValues = { initialValues }
                           tiposAlerta = { tiposAlerta }
                        />
                     )}
               </Formik>
            </Scrollbar>
         </Dialog>
      )
   );
};

export default ClienteAlertaCreador;
