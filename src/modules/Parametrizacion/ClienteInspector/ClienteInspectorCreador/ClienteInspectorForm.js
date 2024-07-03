import React, { useEffect, useState } from 'react';
import { 
   Box, 
   Button 
} from '@material-ui/core';
import { Form } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import Scrollbar from '@crema/core/Scrollbar';
import IntlMessages from '@crema/utility/IntlMessages';
import { Fonts } from 'shared/constants/AppEnums';
import MyTextField from 'shared/components/MyTextField';
import MyRadioField from 'shared/components/MyRadioField';
import {
   DATO_BOOLEAN_RADIO, ESTADO_RADIO, 
} from 'shared/constants/ListaValores';
import MySelectField from 'shared/components/MySelectField';

// Estilos para utilizar en los diferentes componentes del formulario
const useStyles = makeStyles((theme) => ({
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
		paddingRight: '20px',
	},
	MySelectField: {  
		width: 'auto',
		marginBottom: 16,
		[theme.breakpoints.up('xl')]: { 
			marginBottom: 24, 
		},
		color: theme.palette.primary.main,
		'&:target': { 
			color: theme.palette.primary.main, 
		}, 
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
	widthFull: {  
		width: '100%',  
	},
	pointer: {  
		cursor: 'pointer',  
	},
	inputs_2: {
		width: '100%',       
		display: 'grid',
		gridTemplateColumns: 'repeat(2,1fr)', 
	},      
}));

const ClienteInspectorForm = (props) => {
	const {
		handleOnClose, 
		accion, 
		initialValues, 
		titulo, 
		tipos_documento
	} = props;
   
	const [disabled, setDisabled] = useState(false);

	useEffect(() => {
		if (accion === 'ver' || initialValues.estado === '0') 
				setDisabled(true);
	}, [initialValues.estado, accion]);

	const classes = useStyles(props);

	return (
		<Form noValidate autoComplete='off'>
			<Scrollbar style={{maxHeight: 600}}>
				<Box py={5} px={{xs: 5, lg: 8, xl: 10}}>
					<Box 
						component='h6' 
						mb={{xs: 4, xl: 6}} 
						fontSize={ 20 } 
						fontWeight={ Fonts.MEDIUM }
					>
						{titulo}
					</Box>
						<Box px={{md: 5, lg: 8, xl: 10}}>
							<MyTextField 
								className={classes.myTextField} 
								label='Cliente' 
								name='nombre_cliente' 
								disabled 
							/>
							<Box className={classes.inputs_2}>
								<MySelectField 
									className={classes.myTextField} 
									label='Tipo documento' 
									name='tipo_documento_id' 
									disabled={ disabled }
									required 
									options={tipos_documento}
								/>
								<MyTextField 
									className={classes.myTextField} 
									label='Número documento' 
									name='numero_documento' 
									disabled={ disabled } 
									required 
								/>
							</Box>
							<MyTextField 
								className={classes.myTextField} 
								label='Nombre Completo' 
								name='nombre_inspector' 
								disabled={disabled} 
								required 
							/>
							<Box className={classes.inputs_2}>
								<MyTextField 
									className={classes.myTextField} 
									label='Teléfono Celular' 
									name='celular_inspector' 
									disabled={disabled} 
								/>
								<MyTextField 
									className={classes.myTextField} 
									label='Correo Electrónico' 
									name='correo_inspector' 
									disabled={disabled} 
								/>
								<MyRadioField 
									className={classes.MyRadioField}
									label='Formado para Inspección' 
									name='indicativo_formado_inspeccion' 
									disabled={disabled}
									options={DATO_BOOLEAN_RADIO}
									required 
								/>
								<MyTextField 
									className={classes.myTextField} 
									label='Última Fecha Formación' 
									name='fecha_ultima_formacion'
									type='date'
									InputLabelProps={{
										shrink: true
									}} 
									disabled={disabled} 
									required 
								/>
								<MyTextField 
									className={classes.myTextField} 
									label='Cargo' 
									name='cargo' 
									disabled={disabled}
								/>
								<MyRadioField 
									className={classes.MyRadioField}
									label='Estado' 
									name='estado' 
									disabled={accion === 'ver'}
									options={ESTADO_RADIO}
									required 
								/>
							</Box>
						</Box>
				</Box>
			</Scrollbar>
			<Box className={classes.bottomsGroup}>
				{accion !== 'ver' && (   
					<Button 
						className={`${classes.btnRoot} ${classes.btnPrymary}`} 
						variant='contained' 
						type='submit'
					>
						<IntlMessages id='boton.submit' />
					</Button> 
				)}
				<Button 
					className={`${classes.btnRoot} ${classes.btnSecundary}`} 
					onClick={handleOnClose}
				>
					<IntlMessages id='boton.cancel' />
				</Button>
			</Box>
		</Form>
	);
};

export default ClienteInspectorForm;
