import { Scrollbar } from '@crema';
import { Box, makeStyles, Paper } from '@material-ui/core';
import { Formik } from 'formik';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onGetColeccionLigera as onGetLugares } from 'redux/actions/LugarAction';
import { onGetColeccionLigera as onGetUsuarios } from 'redux/actions/UsuarioAction';
import { onGetColeccionLigera as onGetVehiculos } from 'redux/actions/ClienteVehiculoAction';
import { onGetColeccionLigera as onGetConductores } from 'redux/actions/ClienteConductorAction';
import { onGetColeccionLigera as onGetTiposDocumento } from 'redux/actions/TipoDocumentoAction';
import { onGetColeccionLigera as onGetTransportadoras } from 'redux/actions/ClienteEmpresaTransporteAction';
import Formulario from './Formulario';
import { useState } from 'react';

const useStyles = makeStyles((theme) => ({
  marcoTabla: {
    backgroundColor: 'white',
    boxShadow: '0px 0px 5px 5px rgb(0 0 0 / 10%)',
    borderRadius: '4px',
    paddingLeft: '15px',
    paddingRight: '15px',
    marginTop: '5px',
  },
  root: {
    width: '100%%',
    padding: '20px',
  },
  head: {
    borderTop: '2px solid #dee2e6',
    borderBottom: '2px solid #dee2e6',
    // display:'grid',
    // gridTemplateColumns:gridTemplate,
  },
  headCell: {
    padding: '0px 0px 0px 15px',
  },
  row: {
    // display:'grid',
    // gridTemplateColumns:gridTemplate,
    padding: 'none',
  },
  cell: (props) => ({
    padding: props.vp + ' 0px ' + props.vp + ' 15px',
    whiteSpace: 'nowrap',
  }),
  cellWidth: (props) => ({
    minWidth: props.width,
  }),
  cellColor: (props) => ({
    backgroundColor: props.cellColor,
    color: 'white',
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
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  generalIcons: {
    '&:hover': {
      color: theme.palette.colorHover,
      cursor: 'pointer',
    },
  },
  editIcon: {
    color: theme.palette.primary.main,
  },
  visivilityIcon: {
    color: theme.palette.grayBottoms,
  },
  deleteIcon: {
    color: theme.palette.redBottoms,
  },
  containerIcon: {
    backgroundColor: theme.palette.primary.main,
    color: 'white'
  },
  popoverColumns: {
    display: 'grid',
    padding: '10px',
    color: theme.palette.grayBottoms,
  },
  paginacion: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '10px',
    paddingBottom: '5px',
  },
  rowsPerPageOptions: {
    marginRight: '10px',
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
  btnFinal: {
    backgroundColor: '#48ac33',
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
  inputs_3: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(3,1fr)',
  },
  inputs_4: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(4,1fr)',
  },
}));

const formatos = [
  {id: 1, nombre: 'Formato 1', clase: 'Vacio-Previaje'},
  {id: 2, nombre: 'Formato 2', clase: 'Lleno'},
];

const jsonFormat1 = {
  dAdicionales: [
    {id: 1, nombre: 'Inspeccion Canina', tipo: 'T'}
  ],
  unidades: [
    {
      id: 2, 
      tipo: 'T', 
      nombre: 'Tractocamion 3 Ejes',
      dAdicionales: [
        {id: 2, nombre: 'SOAT', tipo: 'T'},
        {id: 3, nombre: 'Verificacion Comodato', tipo: 'T'},
      ],
      listas: [
        {
          id: 1, 
          nombre: 'Cabezote',
          chequeos: [
            {id: 1, nombre: 'Cabina con modificaciones?', valor: ''},
            {id: 2, nombre: 'Extintores cumplen normas y estan vigentes?', valor: ''},
            {id: 3, nombre: 'Tanques combustible modificados?', valor: ''},
            {id: 4, nombre: 'Llantas en buen estado?', valor: ''},
          ]
        },
        {
          id: 2, 
          nombre: 'Tráiler',
          chequeos: [
            {id: 5, nombre: 'Patas mecanicas con modificaciones?', valor: ''},
            {id: 6, nombre: 'Luces stop funcionan correctamente?', valor: ''},
          ]
        },
      ]
    },
    {
      id: 3, 
      tipo: 'C', 
      nombre: 'Contenedor 20 ft',
      dAdicionales: [
        {id: 4, nombre: 'Naviera', tipo: 'T'},
        {id: 5, nombre: 'Puerto', tipo: 'T'},
      ],
      listas: [
        {
          id: 3, 
          nombre: 'Piso',
          chequeos: [
            {id: 7, nombre: 'Esta desnivelado?', valor: ''},
            {id: 8, nombre: 'Tunel del piso con modificaciones?', valor: ''},
            {id: 9, nombre: 'Vigas modificadas?', valor: ''},
          ]
        },
        {
          id: 4, 
          nombre: 'Techo',
          chequeos: [
            {id: 10, nombre: 'Altura entre piso y techo fuera del estandar?', valor: ''},
            {id: 7, nombre: 'Esta desnivelado?', valor: ''},
            {id: 11, nombre: 'Marcas o quemaduras recientes de soldadura?', valor: ''},
            {id: 12, nombre: 'Orificios de ventilacion del techo fuera del estandar?', valor: ''},
            {id: 9, nombre: 'Vigas modificadas?', valor: ''},
          ]
        },
        {
          id: 5, 
          nombre: 'Puertas',
          chequeos: [
            {id: 13, nombre: 'Abolladuras', valor: ''},
            {id: 11, nombre: 'Marcas o quemaduras recientes de soldadura?', valor: ''},
            {id: 14, nombre: 'Remaches y tuercas manijas con soldaduras o modificaciones?', valor: ''},
            {id: 9, nombre: 'Vigas modificadas?', valor: ''},
          ]
        },
      ]
    },
  ]
}

const initialValues = {
  numero: '1000',
  version: '1',
  estado: 'En proceso',
  conductor: '', 
  nombre_conductor: '', 
  tipo_documento_conductor: '', 
  numero_documento_conductor: '', 
  fecha: '2022-11-04',
  hora_inicio: '08:30',
  hora_fin: '10:25',
  formato: '',
  clase: '',
  lugar_id: '',
}

const Remision = (props) => {
  const classes =  useStyles();
  const dispatch = useDispatch();
  const lugares = useSelector(({lugarReducer}) => lugarReducer.ligera);
  const usuarios = useSelector(({usuarioReducer}) => usuarioReducer.ligera);
  const vehiculos = useSelector(({clienteVehiculoReducer}) => clienteVehiculoReducer.ligera);
  const conductores = useSelector(({clienteConductorReducer}) => clienteConductorReducer.ligera);
  const tiposDocumento = useSelector(({tipoDocumentoReducer}) => tipoDocumentoReducer.ligera);
  const transportadoras = useSelector(({clienteEmpresaTransporteReducer}) => clienteEmpresaTransporteReducer.ligera);
  const listas = {};
  const [see, setSee] = useState(listas);

  useEffect(() => {
    dispatch(onGetLugares(1));
    dispatch(onGetUsuarios());
    dispatch(onGetVehiculos(1));
    dispatch(onGetConductores(1));
    dispatch(onGetTiposDocumento());
    dispatch(onGetTransportadoras());
  }, []) // eslint-disable-line

  jsonFormat1.dAdicionales.forEach((dAdicional) => {
    initialValues[`DAI_${dAdicional.id}`] = '';
  })

  jsonFormat1.unidades.forEach((un) => {
    initialValues[`UI_${un.id}`] = '';
    if(un.tipo === 'T'){
      initialValues[`vehiculo_propio_${un.id}`] = '';
      initialValues[`placa_${un.id}`] = '';
      initialValues[`marca_${un.id}`] = '';
      initialValues[`modelo_${un.id}`] = '';
      initialValues[`color_${un.id}`] = '';
      initialValues[`transportadora_${un.id}`] = '';
      initialValues[`guia_${un.id}`] = '';
    }
    if(un.tipo === 'C'){
      initialValues[`numero_contenedor_${un.id}`] = '';
    }
    un.dAdicionales.forEach((dAd) => {
      initialValues[`DAU_${un.id}_${dAd.id}`] = '';
    })
    un.listas.forEach((lista) => {
      listas[`${un.id}${lista.id}`] = true;
      lista.chequeos.forEach((check) => {
        initialValues[`C_${lista.id}_${check.id}`] = '';
      })
    })
  })

  const toogleSee = (name) => {
    setSee({
      ...see,
      [name]: !see[name] 
    })
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Box className={classes.marcoTabla}>
          <Scrollbar>
            <Formik
              initialStatus={true}
              enableReinitialize={true}
              validateOnBlur={false}
              initialValues={initialValues}
              // validationSchema={validationSchema}
              onSubmit={(data, {setSubmitting}) => {
                console.log(data);
              }}>
              {({initialValues, setFieldValue, values}) => (
                <Formulario
                  classes={classes}
                  initialValues={initialValues}
                  setFieldValue={setFieldValue}
                  values={values}
                  lugares={lugares}
                  formatos={formatos}
                  json={jsonFormat1}
                  usuarios={usuarios}
                  vehiculos={vehiculos}
                  tiposDocumento={tiposDocumento}
                  conductores={conductores}
                  transportadoras={transportadoras}
                  see={see}
                  toogleSee={toogleSee}
                />
              )}
            </Formik>
          </Scrollbar>
        </Box>
      </Paper>
    </div>
  );
};

export default Remision;
