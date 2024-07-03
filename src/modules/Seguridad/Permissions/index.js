import React, {useState, useEffect} from 'react';
import {Box} from '@material-ui/core';
import clsx from 'clsx';
import {lighten, makeStyles} from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  onGetPermisos,
  onOtorgarPermiso,
  onRevocarPermiso,
} from '../../../redux/actions/RolAction';
import {onGetColeccionLigera as onGetColeccionLigeraModulo} from 'redux/actions/ModuloAction';
import {onGetColeccionLigera as onGetColeccionLigeraOpcion} from 'redux/actions/OpcionSistemaAction';

import {useDispatch, useSelector} from 'react-redux';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import TextField from '@material-ui/core/TextField';
import {useParams} from 'react-router-dom';
import {Fonts} from '../../../shared/constants/AppEnums';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import ClearAllIcon from '@material-ui/icons/ClearAll';

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    padding: '15px',
    backgroundColor: 'white',
    boxShadow: '0px 0px 5px 5px rgb(0 0 0 / 10%)',
    borderRadius: '4px',
    display: 'grid',
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
  createButton: {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    boxShadow:
      '0px 3px 5px -1px rgb(0 0 0 / 30%), 0px 6px 10px 0px rgb(0 0 0 / 20%), 0px 1px 18px 0px rgb(0 0 0 / 16%)',
    '&:hover': {
      backgroundColor: theme.palette.colorHover,
      cursor: 'pointer',
    },
  },
  clearButton: {
    backgroundColor: 'gray',
    color: 'white',
    boxShadow:
      '0px 3px 5px -1px rgb(0 0 0 / 30%), 0px 6px 10px 0px rgb(0 0 0 / 20%), 0px 1px 18px 0px rgb(0 0 0 / 16%)',
    '&:hover': {
      backgroundColor: theme.palette.colorHover,
      cursor: 'pointer',
    },
  },
  horizontalBottoms: {
    width: 'min-content',
    display: 'flex',
    gap: '5px',
  },
  titleTop: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  columnFilterButton: {
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
    boxShadow:
      '0px 3px 5px -1px rgb(0 0 0 / 30%), 0px 6px 10px 0px rgb(0 0 0 / 20%), 0px 1px 18px 0px rgb(0 0 0 / 16%)',
    '&:hover': {
      backgroundColor: theme.palette.colorHover,
      cursor: 'pointer',
    },
  },
  contenedorFiltros: {
    width: '90%',
    display: 'grid',
    gridTemplateColumns: '4fr 4fr 1fr',
    gap: '20px',
  },
  pairFilters: {
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '20px',
    minWidth: '100px',
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const {
    numSelected,
    moduloFiltro,
    opcionFiltro,
    limpiarFiltros,
    queryFilter,
    modulos,
    opcionesSistema,
  } = props;
  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}>
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color='inherit'
          variant='subtitle1'
          component='div'>
          {numSelected} selected
        </Typography>
      ) : (
        <>
          <Box className={classes.titleTop}>
            <Typography
              className={classes.title}
              variant='h6'
              id='tableTitle'
              component='div'>
              <IntlMessages id='seguridad.permisos' />
            </Typography>
            <Box className={classes.horizontalBottoms}></Box>
          </Box>
          <Box className={classes.contenedorFiltros}>
            <TextField
              label='Módulo'
              name='moduloFiltro'
              id='moduloFiltro'
              select={true}
              onChange={queryFilter}
              value={moduloFiltro}>
              {modulos.map((modulo) => {
                return (
                  <MenuItem
                    value={modulo.id}
                    key={modulo.id}
                    id={modulo.id}
                    className={classes.pointer}>
                    {modulo.nombre}
                  </MenuItem>
                );
              })}
            </TextField>

            <TextField
              label='Opción del Sistema'
              name='opcionFiltro'
              id='opcionFiltro'
              select={true}
              onChange={queryFilter}
              value={opcionFiltro}>
              {opcionesSistema.map((opcion) => {
                return (
                  <MenuItem
                    value={opcion.id}
                    key={opcion.id}
                    id={opcion.id}
                    className={classes.pointer}>
                    {opcion.nombre}
                  </MenuItem>
                );
              })}
            </TextField>
            <Box display='grid'>
              <Box display='flex' mb={2}>
                <Tooltip title='Limpiar Filtros' onClick={limpiarFiltros}>
                  <IconButton
                    className={classes.clearButton}
                    aria-label='filter list'>
                    <ClearAllIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        </>
      )}

      {numSelected > 0 ? (
        <Tooltip title='Delete'>
          <IconButton aria-label='delete'>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        ''
      )}
    </Toolbar>
  );
};

const useStyles = makeStyles((theme) => ({
  chargedFile: {
    padding: '0px',
  },
  linkDocumento: {
    textDecoration: 'underline',
    color: 'blue',
    textAlign: 'center',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  dialogBox: {
    minHeight: '600px',
    position: 'relative',
    '& .MuiDialog-paperWidthSm': {
      width: '100%',
      minHeight: '800px',
      // maxHeight:'fit-content'
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
}));

const Permissions = () => {
  const {rol_id} = useParams();
  const [moduloFiltro, setModuloFiltro] = useState('');
  const [opcionFiltro, setOpcionFiltro] = useState('');
  const dense = true; //Borrar cuando se use el change

  const rows = useSelector(({rolReducer}) => rolReducer.permisos);

  const modulos = useSelector(({moduloReducer}) => moduloReducer.ligera);

  const showModulosLocal =
    localStorage.getItem('showModulos') !== ''
      ? JSON.parse(localStorage.getItem('showModulos'))
      : '';
  const showOpcionesLocal =
    localStorage.getItem('showOpciones') !== ''
      ? JSON.parse(localStorage.getItem('showOpciones'))
      : '';

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(onGetPermisos(rol_id, moduloFiltro, opcionFiltro));
  }, [dispatch, rol_id, moduloFiltro, opcionFiltro]);

  useEffect(() => {
    dispatch(onGetColeccionLigeraModulo());
  }, [dispatch]);

  useEffect(() => {
    dispatch(onGetColeccionLigeraOpcion(moduloFiltro));
  }, [dispatch, moduloFiltro]);

  let modulosAux = [];
  rows.forEach((modulo) => {
    let opcionesAux = [];
    modulo.opciones.forEach((opcion) => {
      opcionesAux.push({
        nombre: opcion.nombre,
        permisos: opcion.permisos,
        mostrar:
          typeof showOpcionesLocal[opcion.id] === 'undefined'
            ? true
            : showOpcionesLocal[opcion.id],
        id: opcion.id,
      });
    });
    modulosAux.push({
      nombre: modulo.nombre,
      opciones: opcionesAux,
      id: modulo.id,
      mostrar:
        typeof showModulosLocal[modulo.id] === 'undefined'
          ? true
          : showModulosLocal[modulo.id],
    });
  });
  const [showModulos, setShowModulos] = useState([]);

  setTimeout(() => {
    setShowModulos(modulosAux);
  }, 1);

  const opcionesSistema = useSelector(
    ({opcionSistemaReducer}) => opcionSistemaReducer.ligera,
  );

  let vp = '15px';
  if (dense === true) {
    vp = '0px';
  }

  const classes = useStyles({vp: vp});

  const [showTable, setShowTable] = useState(true);
  useEffect(() => {
    if (rows.length === 0) {
      setShowTable(false);
    } else {
      setShowTable(true);
    }
  }, [rows]);

  const updateColeccion = () => {
    dispatch(onGetPermisos(rol_id, moduloFiltro, opcionFiltro));
  };

  const queryFilter = (e) => {
    switch (e.target.name) {
      case 'moduloFiltro':
        setModuloFiltro(e.target.value);
        break;
      case 'opcionFiltro':
        setOpcionFiltro(e.target.value);
        break;
      default:
        break;
    }
  };

  const limpiarFiltros = () => {
    setModuloFiltro('');
    setOpcionFiltro('');
  };

  const handleMostrarModulo = (id) => {
    let aux = localStorage.getItem('showModulos');

    if (aux === '') {
      aux = {};
    } else {
      aux = JSON.parse(aux);
    }

    if (typeof aux[id] === 'undefined') {
      aux[id] = false;
    } else {
      aux[id] = !aux[id];
    }

    localStorage.setItem('showModulos', JSON.stringify(aux));
  };

  const handleMostrarOpcion = (id) => {
    let aux = localStorage.getItem('showOpciones');

    if (aux === '') {
      aux = {};
    } else {
      aux = JSON.parse(aux);
    }

    if (typeof aux[id] === 'undefined') {
      aux[id] = false;
    } else {
      aux[id] = !aux[id];
    }

    localStorage.setItem('showOpciones', JSON.stringify(aux));
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          numSelected={0}
          queryFilter={queryFilter}
          limpiarFiltros={limpiarFiltros}
          opcionFiltro={opcionFiltro}
          moduloFiltro={moduloFiltro}
          modulos={modulos}
          opcionesSistema={opcionesSistema}
        />

        {showTable ? (
          <Box className={classes.marcoTabla}>
            {showModulos.map((modulo, key) => {
              return (
                <div key={key}>
                  <Box
                    component='h2'
                    fontWeight='500'
                    borderBottom='1px #ddd solid'
                    display='flex'
                    justifyContent='space-between'
                    alignItems='center'
                    marginTop='10px'
                    onClick={() => {
                      handleMostrarModulo(modulo.id);
                    }}>
                    {modulo.nombre}
                    {modulo.mostrar ? (
                      <KeyboardArrowDownIcon />
                    ) : (
                      <KeyboardArrowLeftIcon />
                    )}
                  </Box>
                  {modulo.mostrar ? (
                    <Box>
                      {modulo.opciones.map((opcion) => {
                        return (
                          <Box
                            borderBottom='1px #ddd solid'
                            marginLeft='10px'
                            py='10px'
                            key={opcion.nombre}>
                            <Box
                              component='h4'
                              fontWeight='300'
                              display='flex'
                              alignItems='center'
                              onClick={() => {
                                handleMostrarOpcion(opcion.id);
                              }}>
                              {opcion.mostrar ? (
                                <KeyboardArrowDownIcon />
                              ) : (
                                <KeyboardArrowRightIcon />
                              )}
                              {opcion.nombre}
                            </Box>
                            {opcion.mostrar ? (
                              <Box
                                display='grid'
                                gridTemplateColumns='repeat(4,1fr)'
                                mx='20px'
                                gap='20px'
                                py='10px'>
                                {opcion.permisos.map((permiso) => {
                                  return (
                                    <Box
                                      key={opcion.nombre + '-' + permiso.nombre}
                                      component='h4'
                                      fontWeight='300'
                                      display='flex'
                                      alignItems='center'>
                                      <Checkbox
                                        key={permiso.id}
                                        checked={permiso.permitido}
                                        onChange={(event) => {
                                          if (event.target.checked) {
                                            dispatch(
                                              onOtorgarPermiso(
                                                {
                                                  rol_id: rol_id,
                                                  permission_id: permiso.id,
                                                },
                                                updateColeccion,
                                              ),
                                            );
                                          } else {
                                            dispatch(
                                              onRevocarPermiso(
                                                {
                                                  rol_id: rol_id,
                                                  permission_id: permiso.id,
                                                },
                                                updateColeccion,
                                              ),
                                            );
                                          }
                                        }}
                                      />
                                      {permiso.nombre}
                                    </Box>
                                  );
                                })}
                              </Box>
                            ) : (
                              ''
                            )}
                          </Box>
                        );
                      })}
                    </Box>
                  ) : (
                    ''
                  )}
                </div>
              );
            })}
          </Box>
        ) : (
          <Box
            component='h2'
            padding={4}
            fontSize={19}
            className={classes.marcoTabla}
            display='flex'
            justifyContent='space-between'>
            <IntlMessages id='sinResultados' />
          </Box>
        )}
      </Paper>
    </div>
  );
};

export default Permissions;
