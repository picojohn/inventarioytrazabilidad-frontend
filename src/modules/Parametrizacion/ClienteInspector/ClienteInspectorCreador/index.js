import React, {useEffect, useRef, useState} from 'react';
import Dialog from '@material-ui/core/Dialog';
import { Formik } from 'formik';
import * as yup from 'yup';
import { 
	useDispatch, 
	useSelector
} from 'react-redux';
import { Scrollbar } from '@crema';
import {
	onShow, 
	onUpdate, 
	onCreate,
} from 'redux/actions/ClienteInspectorAction';
import Slide from '@material-ui/core/Slide';
import ClienteInspectorForm from './ClienteInspectorForm';
import { Fonts } from 'shared/constants/AppEnums';
import { makeStyles } from '@material-ui/core/styles/index';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction = 'down' ref = {ref} {...props} />;
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

const validationSchema = yup.object({
	cliente_id: yup.number().required('Requerido'),
	tipo_documento_id: yup.number().required('Requerido'),
	numero_documento: yup.string().required('Requerido'),
	nombre_inspector: yup.string().required('Requerido'),
	celular_inspector: yup.number().nullable().typeError('numero inválido'),
	correo_inspector: yup.string().email('formato no válido').nullable(),
	indicativo_formado_inspeccion: yup.string().required('Requerido'),
	fecha_ultima_formacion: yup
		.date()
		.nullable()
		.test({
			name: 'excluyente',
			exclusive: false,
			params: {},
			message: 'Requerido', // eslint-disable-line
			test: function(value){
				return (this.parent.indicativo_formado_inspeccion === 'S' && value !== undefined) || this.parent.indicativo_formado_inspeccion !== 'S' 
			}
		}),
	nombre_inspector: yup.string().nullable(),
	estado: yup.string().required('Requerido'),
});

const ClienteInspectorCreador = (props) => {
	const { 
		clienteInspector, 
		handleOnClose, 
		accion, 
		updateColeccion, 
		titulo,
		cliente,
		tipos_documento
	} = props;

	const dispatch = useDispatch();
	const [showForm, setShowForm] = useState(false);
	const classes = useStyles(props);
	let selectedRow = useRef();
	selectedRow = useSelector(
		({ clienteInspectorReducer }) => clienteInspectorReducer.selectedRow,
	);

	useEffect(() => {
		initializeSelectedRow();
	}, []);

	useEffect(() => {
		if (selectedRow){
			setShowForm(true);
		} else {
			if (accion === 'crear'){
				setShowForm(true);
			} else {
				setShowForm(false);
			} 
		} 
	}, [selectedRow, accion]);
	
	useEffect(() => {
		if ((accion === 'editar') | (accion === 'ver')) {
			dispatch(onShow(cliente.id, clienteInspector));
		}
	}, [accion, clienteInspector]); // eslint-disable-line

	const initializeSelectedRow = () => {
		selectedRow = null;
	};

	if (accion === 'crear') {
		initializeSelectedRow();
	}

	return (
		showForm && (
			<Dialog
				open={showForm}
				onClose={handleOnClose}
				aria-labelledby='simple-modal-title'
				TransitionComponent={Transition}
				aria-describedby='simple-modal-description'
				className={classes.dialogBox}
				maxWidth={'sm'}
				fullWidth
			>
				<Scrollbar>
					<Formik
						initialStatus={true}
						enableReinitialize={true}
						validateOnBlur={false}
						initialValues={{
							id: selectedRow?.id??'',
							cliente_id: cliente?.id??'', 
							nombre_cliente: cliente?.nombre??'',
							tipo_documento_id: selectedRow?.tipo_documento_id??'',
							numero_documento: selectedRow?.numero_documento??'',
							nombre_inspector: selectedRow?.nombre_inspector??'',
							cargo: selectedRow?.cargo??'',
							celular_inspector: selectedRow?.celular_inspector??'',
							correo_inspector: selectedRow?.correo_inspector??'',
							fecha_ultima_formacion: selectedRow?.fecha_ultima_formacion??'',
							indicativo_formado_inspeccion: selectedRow?.indicativo_formado_inspeccion??'',
							estado: selectedRow 
								? selectedRow.estado === 1 
										? '1' 
										: '0' 
								: '1',
						}}
						validationSchema={validationSchema}
						onSubmit={(data, {setSubmitting}) => {
							setSubmitting(true);
							if (accion === 'crear') {
								dispatch(onCreate(data, handleOnClose, updateColeccion));
							} else if (accion === 'editar' && selectedRow) {
								dispatch(onUpdate(data, handleOnClose, updateColeccion));
							}
							setSubmitting(false);
						}}
					> 
						{({initialValues, values}) => (
							<ClienteInspectorForm
								handleOnClose={handleOnClose}
								titulo={titulo}
								accion={accion}
								values={values}
								initialValues={initialValues}
								tipos_documento={tipos_documento}
							/>
						)}
					</Formik>
				</Scrollbar>
			</Dialog>
		)
	);
};

export default ClienteInspectorCreador;
