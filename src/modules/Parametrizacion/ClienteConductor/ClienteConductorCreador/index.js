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
} from '../../../../redux/actions/ClienteConductorAction';
import Slide from '@material-ui/core/Slide';
import ClienteConductorForm from './ClienteConductorForm';
import { Fonts } from '../../../../shared/constants/AppEnums';
import { makeStyles } from '@material-ui/core/styles/index';

const Transition = React.forwardRef(function Transition(props, ref) {
   return <Slide direction = 'down' ref = {ref} {...props} />;
});

const validationSchema = yup.object({
   cliente_id: yup.number().required('Requerido'),
   tipo_documento_id: yup.number().required('Requerido'),
   numero_documento: yup.string().required('Requerido'),
   nombre_conductor: yup.string().required('Requerido'),
   indicativo_conductor_empresa: yup.string().required('Requerido'),
   estado: yup.string().required('Requerido'),
});

const ClienteConductorCreador = (props) => {
   const { 
      clienteConductor, 
      handleOnClose, 
      accion, 
      updateColeccion, 
      titulo,
      cliente,
      tipos_documento
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
      ({ clienteConductorReducer }) => clienteConductorReducer.selectedRow,
   );

   const initializeSelectedRow = () => {
      selectedRow = null;
   };
   useEffect(() => {
      initializeSelectedRow();
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
         dispatch(onShow(cliente.id, clienteConductor));
      // eslint-disable-next-line
   }, [accion, dispatch, clienteConductor]);

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
                     
                     tipo_documento_id: selectedRow?.tipo_documento_id??'',
                     
                     numero_documento: selectedRow?.numero_documento??'',
                     
                     nombre_conductor: selectedRow?.nombre_conductor??'',
                     
                     indicativo_conductor_empresa: selectedRow 
                        ? selectedRow.indicativo_conductor_empresa === 'N' 
                           ? 'N' 
                           : 'S' 
                        : 'N',
                     
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
                        <ClienteConductorForm
                           handleOnClose = { handleOnClose }
                           titulo = { titulo }
                           accion = { accion }
                           values = { values }
                           initialValues = { initialValues }
                           tipos_documento={tipos_documento}
                        />
                     )}
               </Formik>
            </Scrollbar>
         </Dialog>
      )
   );
};

export default ClienteConductorCreador;
