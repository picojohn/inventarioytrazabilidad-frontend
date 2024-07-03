import React, {useState, useMemo} from 'react';
import {
  Box, 
  Button,
  makeStyles,
  withStyles,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  IconButton,
  Tooltip,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  Slide,
  Dialog,
} from '@material-ui/core';
import {styled} from '@material-ui/styles';
import clsx from 'clsx';
import {
  Delete,
  AttachFile,
  Check,
  InsertDriveFile
} from '@material-ui/icons';
import {useDispatch} from 'react-redux';
import {Formik, Form} from 'formik';
import * as yup from 'yup';
import parse from 'html-react-parser';
import ReactExport from 'react-export-excel';
import Dropzone, {useDropzone} from 'react-dropzone';
import IntlMessages from '@crema/utility/IntlMessages';
import {onImport} from 'redux/actions/OperacionEmbarqueContenedorAction';
import MyTextField from 'shared/components/MyTextField';
import {Fonts} from 'shared/constants/AppEnums';
import {FETCH_ERROR} from 'shared/constants/ActionTypes';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    padding: '15px',
    backgroundColor: 'white',
    boxShadow: '0px 0px 5px 5px rgb(0 0 0 / 10%)',
    borderRadius: '4px',
    display: 'grid',
  },
  title: {
    flex: '1 1 100%',
  },
  titleTop: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  layout: {
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'center'
  },
  inputFiltros:{
    width:'40%'
  }
}));

const ColorlibStepIconRoot = styled('div')(({theme, ownerstate}) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
    ...(ownerstate.active && {
      backgroundImage:
        'linear-gradient( 136deg, rgb(15,106,164) 0%, rgb(59,183,232) 33%,rgb(66,188,199) 66%, rgb(72,172,51) 100%)',
      boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
    ...(ownerstate.completed && {
    backgroundImage:
    'linear-gradient( 136deg, rgb(15,106,164) 0%, rgb(59,183,232) 33%,rgb(66,188,199) 66%, rgb(72,172,51) 100%)',
  }),
}));

const ColorlibStepIcon = (props) => {
  const {active, completed, className} = props;

  const icons = {
    1: <AttachFile />,
    2: <Check />,
  };
  const messages = {
    1: 'Cargar Archivo',
    2: 'Verificación de Datos',
  };

  return (
    <Tooltip title={messages[String(props.icon)]}>
      <ColorlibStepIconRoot
        ownerstate={{completed, active}}
        className={className}
      >
        {icons[String(props.icon)]}
      </ColorlibStepIconRoot>
    </Tooltip>
  );
};

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    '& $line': {
      backgroundImage: 'linear-gradient( 95deg, #26426C 0%,#be1e2d 100%)',
    },
  },
  completed: {
    '& $line': {
      backgroundImage: 'linear-gradient( 95deg, #26426C 0%,#be1e2d 100%)',
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
})(StepConnector);

const EnhancedTableToolbar = ({activeStep, titulo}) => {
  const classes = useToolbarStyles();
  const steps = ['Cargar Archivo', 'Verificación de datos'];
  return (
    <Toolbar className={clsx(classes.root)}>
      <Box className={classes.titleTop}>
        <Typography
          className={classes.title}
          variant='h6'
          id='tableTitle'
          component='div'
        >
          {titulo}
        </Typography>
      </Box>
      <Box className={classes.layout}>
        <Box width={'70%'}>
          <Stepper 
            alternativeLabel
            activeStep={activeStep}
            connector={<ColorlibConnector />}>
            { steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel StepIconComponent={ColorlibStepIcon} {...labelProps}>
                    {label}
                  </StepLabel>
                </Step>
              );
            })}
          </Stepper>
        </Box>
      </Box>
    </Toolbar>
  );
};

const useStyles = makeStyles((theme) => ({
  dialogBox: {
    minHeight: '600px',
    position: 'relative',
    '& .MuiDialog-paperWidthSm': {
      width: '100%',
      minHeight: '800px',
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
  exportButton: {
    backgroundColor: '#4caf50',
    color: 'white',
    boxShadow:
      '0px 3px 5px -1px rgb(0 0 0 / 30%), 0px 6px 10px 0px rgb(0 0 0 / 20%), 0px 1px 18px 0px rgb(0 0 0 / 16%)',
    '&:hover': {
      backgroundColor: theme.palette.colorHover,
      cursor: 'pointer',
    },
  },
  x: {
    position: 'absolute',
    color: '#4caf50',
    fontSize: '14px',
    top: '19px',
    fontWeight: 'bold',
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
  marcoTabla: {
    backgroundColor: 'white',
    boxShadow: '0px 0px 5px 5px rgb(0 0 0 / 10%)',
    borderRadius: '4px',
    paddingLeft: '15px',
    paddingRight: '15px',
    paddingTop: '15px',
    paddingBottom: '15px',
    marginTop: '5px',
  },
  root: {
    width: '100%%',
    padding: '20px',
  },
  head: {
    borderTop: '2px solid #dee2e6',
    borderBottom: '2px solid #dee2e6',
    marginTop: '20px',
  },
  row: {
    padding: 'none',
  },
  cell: (props) => ({
    padding: props.vp + ' 0px ' + props.vp + ' 15px',
    whiteSpace: 'nowrap',
  }),
  acciones: (props) => ({
    padding: props.vp + ' 0px ' + props.vp + ' 15px',
    minWidth: '100px',
  }),
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
    boxShadow: 'none',
    backgroundColor: 'transparent',
  },
  table: {
    minWidth: '100%',
  },
  generalIcons: {
    '&:hover': {
      color: theme.palette.colorHover,
      cursor: 'pointer',
    },
  },
  deleteIcon: {
    color: theme.palette.redBottoms,
  },
}));

function EnhancedTableHead(props) {
  const {classes, titulos} = props;
  return (
    <TableHead>
      <TableRow className={classes.head}>
        {titulos.map((cell, index) => {
          return (
            <TableCell key={index} align={'left'} className={classes.cell}>
              <TableSortLabel>{cell}</TableSortLabel>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#ffffff',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
  height: '100px',
};
const activeStyle = {
  borderColor: '#2196f3',
};
const acceptStyle = {
  borderColor: '#00e676',
};
const rejectStyle = {
  borderColor: '#ff1744',
};

const validationSchema = yup.object({
  nombre_archivo: yup.string().required('Requerido'),
});

const columnasMostradas = [
  'numero_contenedor',
  'observaciones_contenedor',
  'observaciones',
];

const titulos = [
  'Número Contenedor',
  'Observaciones Contenedor',
  'Observaciones',
];

const acceptedFormats = ['.xlsx','.xlsm','.xltx','.xltm','.xlam'];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='down' ref={ref} {...props} />;
});

const CargaContenedor = (props) => {
  const {show, close, titulo, operacionEmbarque} = props;
  const [activeStep, setActiveStep] = useState(0);
  const [rows, setRows] = useState([]);
  const dispatch = useDispatch();
  const {isDragActive, isDragAccept, isDragReject} = useDropzone();
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [
      isDragActive,
      isDragAccept,
      isDragReject,
    ],
  );  

  const dense = true; //Borrar cuando se use el change
  let vp = '15px';
  if (dense === true) {
    vp = '0px';
  }
  const classes = useStyles({vp: vp});

  const handleOnClose = () => {
    setActiveStep(0);
    setRows([]);
  };

  return (
    <Dialog
      open={show}
      onClose={close}
      aria-labelledby='simple-modal-title'
      TransitionComponent={Transition}
      aria-describedby='simple-modal-description'
      className={classes.dialogBox}
      maxWidth={'lg'}
      fullWidth
    >
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <EnhancedTableToolbar 
            activeStep={activeStep}  
            titulo={titulo}
          />
          { activeStep === 0 ? (
            <Box className={classes.marcoTabla}>
              <Box component='h4'>1. Carga Datos</Box>
              <Formik
                initialStatus={true}
                enableReinitialize={true}
                validateOnBlur={false}
                initialValues={{
                  nombre_archivo: '',
                  archivo: '',
                  operacion_embarque_id: operacionEmbarque??'',
                }}
                validationSchema={validationSchema}
                onSubmit={(data, {setSubmitting}) => {
                  setSubmitting(true);
                  dispatch(onImport(data, setActiveStep, setRows));
                  setSubmitting(false);
                }}>
                {({values, setFieldValue}) => {
                  return (
                    <Form encType='multipart/form-data'>
                      <Box py={5} px={{xs: 5, lg: 8, xl: 10}} height='200px'>
                        <Dropzone
                          onDrop={(acceptedFiles) => {
                            if (acceptedFiles.length === 0) {
                              dispatch({
                                type: FETCH_ERROR,
                                payload: 'Solo se aceptan archivos excel',
                              });
                            } else {
                              setFieldValue('archivo', acceptedFiles[0]);
                              setFieldValue(
                                'nombre_archivo',
                                acceptedFiles[0].name,
                              );
                            }
                          }}
                          accept={acceptedFormats.join(',')}>
                          {({getRootProps, getInputProps}) => (
                            <div {...getRootProps({style})}>
                              <input
                                {...getInputProps()}
                                name='archivo'
                                type='file'
                                id='archivo'
                                onChange={(event) => {
                                  const name = event.currentTarget.files[0].name.toLowerCase();
                                  const ev = (i) => name.includes(i);
                                  if (acceptedFormats.some(ev)) {
                                    setFieldValue(
                                      'archivo',
                                      event.currentTarget.files[0],
                                    );
                                    setFieldValue(
                                      'nombre_archivo',
                                      event.currentTarget.files[0].name,
                                    );
                                  } else {
                                    dispatch({
                                      type: FETCH_ERROR,
                                      payload: 'Solo se aceptan archivos Excel',
                                    });
                                  }
                                }}
                              />
                              <p>Arrastra un archivo o haz click para cargarlo</p>
                            </div>
                          )}
                        </Dropzone>
                        <MyTextField
                          name='nombre_archivo'
                          id='nombre_archivo'
                          type='hidden'
                          width='100%'
                        />
                        {values.nombre_archivo ? (
                          <Box
                            component='p'
                            display='flex'
                            justifyContent='center'>
                            {values.nombre_archivo}
                            <Tooltip title={<IntlMessages id='boton.eliminar' />}>
                              <Delete
                                onClick={() => {
                                  setFieldValue('archivo', {});
                                  setFieldValue('nombre_archivo', '');
                                }}
                                className={`${classes.generalIcons} ${classes.deleteIcon}`}></Delete>
                            </Tooltip>
                          </Box>
                        ) : (
                          ''
                        )}
                      </Box>
                      <Box className={classes.bottomsGroup}>
                        <Button
                          className={`${classes.btnRoot} ${classes.btnPrymary}`}
                          variant='contained'
                          type='submit'>
                          Cargar y Continuar
                        </Button>
                      </Box>
                    </Form>
                  );
                }}
              </Formik>
            </Box>
          ) : (
            <Box className={classes.marcoTabla}>
              <Box display='flex' justifyContent='space-between'>
                <Box>
                  <Box component='h4'>2. Verificación de Datos</Box>
                  <Box component='h6'>
                    {'Registros Procesados: ' + rows.registros_procesados}
                  </Box>
                  <Box component='h6'>
                    {'Registros Cargados: ' + rows.registros_cargados}
                  </Box>
                  <Box component='h6' mb={3}>
                    {'Registros Fallidos: ' + rows.registros_fallidos}
                  </Box>
                </Box>
                <Box>
                  <ExcelFile
                    element={
                      <Tooltip
                        title='Exportar Resultados'
                        component='a'
                        className={classes.linkDocumento}
                      >
                        <IconButton
                          className={classes.exportButton}
                          aria-label='filter list'>
                          <Box component='span' className={classes.x}>
                            X
                          </Box>
                          <InsertDriveFile />
                        </IconButton>
                      </Tooltip>
                    }
                    filename={
                      'Resultados Carga Contenedores-' + new Date(Date.now()).getTime()
                    }>
                    <ExcelSheet data={rows.errores} name='Hoja 1'>
                      <ExcelColumn
                        label='Número Contenedor'
                        value='numero_contenedor'
                        widthPx={160}
                      />
                      <ExcelColumn
                        label='Observaciones Contenedor'
                        value='observaciones_contenedor'
                        widthPx={160}
                      />
                      <ExcelColumn label='Observaciones' value='observaciones' />
                    </ExcelSheet>
                  </ExcelFile>
                </Box>
              </Box>
              <TableContainer>
                <Table
                  className={classes.table}
                  aria-labelledby='tableTitle'
                  size={dense ? 'small' : 'medium'}
                  aria-label='enhanced table'>
                  <EnhancedTableHead classes={classes} titulos={titulos} />
                  <TableBody>
                    {rows.errores.map((row, index) => {
                      return (
                        <TableRow
                          hover
                          tabIndex={-1}
                          key={index}
                          className={classes.row}>
                          {columnasMostradas.map((columna,index) => {
                            return (
                              <TableCell
                                key={index}
                                align='left'
                                className={classes.acciones}
                              >
                                { columna === 'observaciones'
                                  ? parse(row[columna])
                                  : row[columna]
                                }
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box className={classes.bottomsGroup}>
                <Button
                  className={`${classes.btnRoot} ${classes.btnSecundary}`}
                  onClick={handleOnClose}>
                  <IntlMessages id='boton.cancel' />
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </div>
      <Box className={classes.bottomsGroup}>
        <Button
          className={`${classes.btnRoot} ${classes.btnSecundary}`}
          onClick={close}>
          Cerrar
        </Button>
      </Box>
    </Dialog>
  );
};

export default CargaContenedor;
