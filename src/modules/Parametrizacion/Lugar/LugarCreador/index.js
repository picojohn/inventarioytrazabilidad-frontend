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
} from '../../../../redux/actions/LugarAction';
import Slide from '@material-ui/core/Slide';
import LugarForm from './LugarForm';
import { Fonts } from '../../../../shared/constants/AppEnums';
import { makeStyles } from '@material-ui/core/styles/index';

const Transition = React.forwardRef(function Transition(props, ref) {
   return <Slide direction = 'down' ref = {ref} {...props} />;
});

const validationSchema = yup.object({
   cliente_id: yup.number().required('Requerido'),
   nombre: yup.string().required('Requerido'),
   tipo_lugar: yup.string().required('Requerido'),
   indicativo_lugar_remision: yup.string().required('Requerido'),
   indicativo_lugar_instalacion: yup.string().required('Requerido'),
   indicativo_lugar_inspeccion: yup.string().required('Requerido'),
   estado: yup.string().required('Requerido'),
});

const LugarCreador = (props) => {
   const { 
      lugar, 
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
      ({ lugarReducer }) => lugarReducer.selectedRow,
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
         dispatch(onShow(cliente.id, lugar));
      // eslint-disable-next-line
   }, [accion, dispatch, lugar]);

   return (
      showForm && (
         <Dialog
            open = { showForm }
            onClose = { handleOnClose }
            aria-labelledby = 'simple-modal-title'
            TransitionComponent = { Transition }
            aria-describedby = 'simple-modal-description'
            className = { classes.dialogBox }
            maxWidth = { 'md' }
            fullWidth>
            <Scrollbar>
               <Formik
                  initialStatus = { true }
                  enableReinitialize = { true }
                  validateOnBlur = { false }
                  initialValues = {{
                     
                     id: selectedRow 
                        ? selectedRow.id 
                        : '',
                     
                     nombre: selectedRow 
                        ? selectedRow.nombre 
                        : '',
                     
                     direccion: selectedRow?.direccion??'',
                     
                     telefono: selectedRow?.telefono??'',
                     
                     cliente_id: cliente?.id??'', 

                     nombre_cliente: cliente?.nombre??'',
                     
                     tipo_lugar: selectedRow 
                        ? selectedRow.tipo_lugar 
                        : '',
                     
                     indicativo_lugar_remision: selectedRow 
                        ? selectedRow.indicativo_lugar_remision === 'N' 
                           ? 'N' 
                           : 'S' 
                        : 'N',
                     
                     indicativo_lugar_instalacion: selectedRow 
                        ? selectedRow.indicativo_lugar_instalacion === 'N' 
                           ? 'N' 
                           : 'S' 
                        : 'N',
                     
                     indicativo_lugar_inspeccion: selectedRow 
                        ? selectedRow.indicativo_lugar_inspeccion === 'N' 
                           ? 'N' 
                           : 'S' 
                        : 'N',
                     
                     codigo_externo_lugar: selectedRow?.codigo_externo_lugar??'',
                     
                     geocerca_id: selectedRow?.geocerca_id??'',
                     
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
                        <LugarForm
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

export default LugarCreador;
