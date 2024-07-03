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
} from '../../../../redux/actions/ClienteVehiculoAction';
import Slide from '@material-ui/core/Slide';
import ClienteVehiculoForm from './ClienteVehiculoForm';
import { Fonts } from '../../../../shared/constants/AppEnums';
import { makeStyles } from '@material-ui/core/styles/index';

const Transition = React.forwardRef(function Transition(props, ref) {
   return <Slide direction = 'down' ref = {ref} {...props} />;
});

const validationSchema = yup.object({
   cliente_id: yup.number().required('Requerido'),
   placa_vehiculo: yup.string().required('Requerido'),
   marca_vehiculo: yup.string().required('Requerido'),
   indicativo_vehiculo_propio: yup.string().required('Requerido'),
   estado: yup.string().required('Requerido'),
});

const ClienteVehiculoCreador = (props) => {
   const { 
      clienteVehiculo, 
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
      ({ clienteVehiculoReducer }) => clienteVehiculoReducer.selectedRow,
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
      if ((accion === 'editar') | (accion === 'ver')) {
         dispatch(onShow(cliente.id, clienteVehiculo));
      }
      // eslint-disable-next-line
   }, [accion, dispatch, clienteVehiculo]);

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
                     
                     placa_vehiculo: selectedRow?.placa_vehiculo??'',
                     
                     marca_vehiculo: selectedRow?.marca_vehiculo??'',
                     
                     modelo_vehiculo: selectedRow?.modelo_vehiculo??'',
                     
                     indicativo_vehiculo_propio: selectedRow 
                        ? selectedRow.indicativo_vehiculo_propio === 'N' 
                           ? 'N' 
                           : 'S' 
                        : 'N',
                     
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
                        <ClienteVehiculoForm
                           handleOnClose = { handleOnClose }
                           titulo = { titulo }
                           accion = { accion }
                           values = { values }
                           initialValues = { initialValues }
                        />
                     )}
               </Formik>
            </Scrollbar>
         </Dialog>
      )
   );
};

export default ClienteVehiculoCreador;
