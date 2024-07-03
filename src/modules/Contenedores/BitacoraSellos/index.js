import React, {useState, useEffect} from 'react';
import {
  Box, 
  Button, 
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
  FormControlLabel,
  Switch,
  TextField,
  MenuItem,
  Popover,
  lighten,
  makeStyles
} from '@material-ui/core';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Pagination from '@material-ui/lab/Pagination';
import BitacoraSellosDetalle from './BitacoraSellosDetalle';
import {
  onGetBitacora, onLeaveBitacora,
} from 'redux/actions/SelloAction';
import {onGetColeccionLigera as ligeraLugares} from 'redux/actions/LugarAction';
import {onGetColeccionLigera as onGetClientes} from 'redux/actions/ClienteAction';
import {onGetColeccionLigera as ligeraUsuarios} from 'redux/actions/LugarUsuarioAction';
import {onGetColeccionLigera as getEventos} from 'redux/actions/TipoEventoAction';
import {useDispatch, useSelector} from 'react-redux';
import {
  Visibility,
  Tune,
  ClearAll,
  Search,
  LocationOnOutlined,
  InsertDriveFile,
} from '@material-ui/icons';
import IntlMessages from '@crema/utility/IntlMessages';
import MyCell from 'shared/components/MyCell';
import { ESTADOS_SELLOS, TIPOS_EMPAQUES } from 'shared/constants/ListaValores';
import { Form, Formik } from 'formik';
import defaultConfig from '@crema/utility/ContextProvider/defaultConfig';

const cells = [
  {
    id: 'numero_remision',
    typeHead: 'numeric',
    label: 'Remisión',
    value: (value) => value,
    align: 'right',
    mostrarInicio: false,
  },
  {
    id: 'fecha_creacion',
    typeHead: 'string',
    label: 'Fecha y Hora',
    value: (value) => value,
    align: 'left',
    mostrarInicio: true,
  },
  {
    id: 'evento',
    typeHead: 'string',
    label: 'Evento',
    value: (value) => value,
    align: 'left',
    mostrarInicio: true,
  },
  {
    id: 'producto',
    typeHead: 'string',
    label: 'Producto',
    value: (value) => value,
    align: 'left',
    mostrarInicio: true,
  },
  {
    id: 'serial',
    typeHead: 'string',
    label: 'Serial',
    value: (value) => value,
    align: 'left',
    mostrarInicio: true,
  },  
  {
    id: 'tipo_empaque_despacho',
    typeHead: 'string',
    label: 'Tipo Empaque',
    value: (value) => TIPOS_EMPAQUES.map((typ) => typ.id === value ? typ.nombre : ''),
    align: 'left',
    mostrarInicio: false,
  },
  {
    id: 'serial_empaque',
    typeHead: 'string',
    label: 'Serial Empaque',
    value: (value) => value,
    align: 'left',
    mostrarInicio: false,
  },    
  {
    id: 'estado_sello',
    typeHead: 'string',
    label: 'Estado',
    value: (value) => ESTADOS_SELLOS.map((state) => state.id === value ? state.nombre : ''),
    align: 'left',
    mostrarInicio: true,
  },  
  {
    id: 'numero_contenedor',
    typeHead: 'string',
    label: 'Contenedor',
    value: (value) => value,
    align: 'left',
    mostrarInicio: true,
  },  
  {
    id: 'documento_referencia',
    typeHead: 'string',
    label: 'Documento Ref.',
    value: (value) => value,
    align: 'left',
    mostrarInicio: true,
  },  
  {
    id: 'lugar_origen',
    typeHead: 'string',
    label: 'Lugar',
    value: (value) => value,
    align: 'left',
    mostrarInicio: true,
  },  
  {
    id: 'usuario_origen',
    typeHead: 'string',
    label: 'Responsable',
    value: (value) => value,
    align: 'left',
    mostrarInicio: true,
  },  
  {
    id: 'lugar_destino',
    typeHead: 'string',
    label: 'Lugar Destino',
    value: (value) => value,
    align: 'left',
    mostrarInicio: false,
  },  
  {
    id: 'usuario_destino',
    typeHead: 'string',
    label: 'Usuario Destino',
    value: (value) => value,
    align: 'left',
    mostrarInicio: false,
  },
  {
    id: 'lugar_instalacion',
    typeHead: 'string',
    label: 'Lugar Instalación',
    value: (value) => value,
    align: 'left',
    mostrarInicio: false,
  },    
  {
    id: 'zona_instalacion',
    typeHead: 'string',
    label: 'Zona Instalación',
    value: (value) => value,
    align: 'left',
    mostrarInicio: false,
  },    
  {
    id: 'observaciones_evento',
    typeHead: 'string',
    label: 'Observaciones',
    value: (value) => value,
    align: 'left',
    mostrarInicio: false,
  },    
];

function EnhancedTableHead(props) {
  const {classes, order, orderBy, onRequestSort, columnasMostradas} = props;

  return (
    <TableHead>
      <TableRow className={classes.head}>
        <TableCell
          style={{fontWeight: 'bold'}}
          align='center'
          className={classes.headCell}>
          {'Acciones'}
        </TableCell>
        {columnasMostradas.map((cell) => {
          if (cell.mostrar) {
            return (
              <TableCell
                key={cell.id}
                style={{fontWeight: 'bold'}}
                align={
                  cell.typeHead === 'string'
                    ? 'left'
                    : cell.typeHead === 'numeric'
                    ? 'right'
                    : 'center'
                }
                className={classes.cell}
                sortDirection={orderBy === cell.id ? order : false}>
                <TableSortLabel
                  active={orderBy === cell.id}
                  direction={orderBy === cell.id ? order : 'asc'}
                  onClick={() => {
                    onRequestSort(cell.id);
                  }}>
                  {cell.label}
                  {orderBy === cell.id ? (
                    <span className={classes.visuallyHidden}>
                      {order === 'desc'
                        ? 'sorted descending'
                        : 'sorted ascending'}
                    </span>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            );
          } else {
            return <th key={cell.id}></th>;
          }
        })}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  columnasMostradas: PropTypes.array.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    padding: '15px',
    backgroundColor: 'white',
    boxShadow: '0px 0px 5px 5px rgb(0 0 0 / 10%)',
    borderRadius: '4px',
    display: 'grid',
    // gap: '20px',
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
    fontWeight: 'bold',
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
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gap: '20px',
  },
  pairFilters: {
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '20px',
    minWidth: '100px',
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
  }
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const {
    titulo,
    handleOpenPopoverColumns,
    queryFilter,
    fechaInicial,
    fechaFinal,
    evento,
    serial,
    contenedor,
    documentoRef,
    lugar,
    usuario,
    eventos,
    lugares,
    usuarios,
    limpiarFiltros,
    interno,
    getBitacora,
    operacionEmbarque,
    user,
    permisos,
    clientes,
    cliente
  } = props;
  return (
    <Toolbar className={clsx(classes.root)}>
      <>
        <Box className={classes.titleTop}>
          <Typography
            className={classes.title}
            variant='h6'
            id='tableTitle'
            component='div'>
            {titulo}
          </Typography>
          <Box className={classes.horizontalBottoms}>
            <Formik>
              <Form>
                {permisos.indexOf('Exportar') >= 0 && (
                  <Tooltip
                    title='Exportar'
                    component='a'
                    className={classes.linkDocumento}
                    href={
                      defaultConfig.API_URL +
                      '/bitacora-sellos' +
                      '?fechaInicial=' +
                      fechaInicial +
                      '&fechaFinal=' +
                      fechaFinal + 
                      '&evento=' +
                      evento + 
                      '&operacionEmbarque=' +
                      operacionEmbarque + 
                      '&contenedor=' +
                      contenedor + 
                      '&documentoRef=' +
                      documentoRef + 
                      '&lugar=' +
                      lugar + 
                      '&usuario=' +
                      usuario + 
                      '&serial=' +
                      serial + 
                      '&cliente=' +
                      (cliente ? cliente : user?.asociado?.id) 
                    }>
                  <IconButton
                      className={classes.exportButton}
                      aria-label='filter list'>
                      <Box component='span' className={classes.x}>
                        X
                      </Box>
                      <InsertDriveFile />
                    </IconButton>
                  </Tooltip>
                )}
              </Form>
            </Formik>
            <Tooltip
              title='Mostrar/Ocultar Columnas'
              onClick={handleOpenPopoverColumns}>
              <IconButton
                className={classes.columnFilterButton}
                aria-label='filter list'>
                <Tune />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Box className={classes.contenedorFiltros}>
          <TextField
            label='Fecha Inicial'
            name='fechaInicial'
            id='fechaInicial'
            type='date'
            InputLabelProps={{
              shrink: true
            }}
            onChange={queryFilter}
            value={fechaInicial}
          />
          <TextField
            label='Fecha Final'
            name='fechaFinal'
            id='fechaFinal'
            type='date'
            InputLabelProps={{
              shrink: true
            }}
            onChange={queryFilter}
            value={fechaFinal}
          />
          <TextField
            label='Evento'
            name='evento'
            id='evento'
            select={true}
            onChange={queryFilter}
            value={evento}
          >
            {eventos.map((ev) => {
              return (
                <MenuItem
                  value={ev.id}
                  key={ev.id}
                  id={ev.id}
                >
                  {ev.nombre}
                </MenuItem>
              );
            })}
          </TextField>
          <Box display='grid'>
            <Box display='flex' mb={2}>
              <Tooltip title='Buscar' onClick={getBitacora}>
                <IconButton
                  className={classes.createButton}
                  aria-label='filter list'>
                  <Search />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
        <Box className={classes.contenedorFiltros}>
          <TextField
            label='Operacion Embarque'
            name='operacionEmbarque'
            id='operacionEmbarque'
            onChange={queryFilter}
            value={operacionEmbarque}
          />
          <TextField
            label='Contenedor'
            name='contenedor'
            id='contenedor'
            onChange={queryFilter}
            value={contenedor}
          />
          <TextField
            label='Documento Ref.'
            name='documentoRef'
            id='documentoRef'
            onChange={queryFilter}
            value={documentoRef}
          />
          <Box display='grid'>
            <Box display='flex' mb={2}>
              <Tooltip title='Limpiar Filtros' onClick={limpiarFiltros}>
                <IconButton
                  className={classes.clearButton}
                  aria-label='filter list'>
                  <ClearAll />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
        <Box className={classes.contenedorFiltros}>
          { user?.rol?.tipo === 'IN' && (
            <TextField
              label='Cliente'
              name='cliente'
              id='cliente'
              onChange={queryFilter}
              value={cliente}
              select
              className={classes.inputFiltros}
            >
              {clientes.map((cus) => {
                return (
                  <MenuItem
                    value={cus.id}
                    key={cus.id}
                    id={cus.id}
                    className={classes.pointer}>
                    {cus.nombre}
                  </MenuItem>
                );
              })}
            </TextField>
          )}
          <TextField
            label='Lugar'
            name='lugar'
            id='lugar'
            select={true}
            onChange={queryFilter}
            value={lugar}
            disabled={!interno}
          >
            {lugares.filter((place) => cliente ? place.cliente_id === cliente : place.cliente_id === user?.asociado?.id).map((lugar) => {
              return (
                <MenuItem
                  value={lugar.id}
                  key={lugar.id}
                  id={lugar.id}
                  className={classes.pointer}>
                  {lugar.nombre}
                </MenuItem>
              );
            })}
          </TextField>
          <TextField
            label='Usuario'
            name='usuario'
            id='usuario'
            select={true}
            onChange={queryFilter}
            disabled={!interno}
            value={usuario}
            >
            {usuarios.filter(us=>lugar===''|lugar===undefined|us.lugar_id===lugar).map((us) => {
              return (
                <MenuItem
                  value={us.usuario_id}
                  key={us.id}
                  id={us.id}
                  className={classes.pointer}>
                  {us.nombre}
                </MenuItem>
              );
            })}
          </TextField>
          <TextField
            label='Serial Externo'
            name='serial'
            id='serial'
            onChange={queryFilter}
            value={serial}
          />
        </Box>
      </>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  handleOpenPopoverColumns: PropTypes.func.isRequired,
  queryFilter: PropTypes.func.isRequired,
  limpiarFiltros: PropTypes.func.isRequired,
};

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
  },
  headCell: {
    padding: '0px 0px 0px 15px',
  },
  row: {
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
    color: props.cellColor,
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
  attachIcon: {
    color: theme.palette.primary.main,
  },
  generalIcons: {
    '&:hover': {
      color: theme.palette.colorHover,
      cursor: 'pointer',
    },
  },
  visivilityIcon: {
    color: theme.palette.grayBottoms,
  },
  locationIcon: {
    color: '#48ac33',
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

const initialFilters = {
  fechaInicial: '',
  fechaFinal: '',
  evento: '',
  serial: '',
  contenedor: '',
  documentoRef: '',
  lugar: '',
  usuario: '',
  operacionEmbarque: '',
  cliente: '',
}

const BitacoraSellos = (props) => {
  const [showForm, setShowForm] = useState(false);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('');
  const [orderByToSend, setOrderByToSend] = React.useState(
    'fecha_creacion:desc',
  );
  const [page, setPage] = React.useState(1);
  const dense = true; //Borrar cuando se use el change

  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const rowsPerPageOptions = [5, 10, 15, 25, 50];

  const [accion, setAccion] = useState('ver');
  const [bitacoraDetalleSelecionada, setBitacoraDetalleSeleccionada] = useState(0);
  const {rows, desde, hasta, ultima_pagina, total} = useSelector(
    ({selloReducer}) => selloReducer.bitacora,
  );

  const textoPaginacion = `Mostrando de ${desde} a ${hasta} de ${total} resultados - Página ${page} de ${ultima_pagina}`;
  const [filters, setFilters] = useState(initialFilters);
  const {
    fechaInicial,
    fechaFinal,
    evento,
    serial,
    contenedor,
    documentoRef,
    lugar,
    usuario,
    operacionEmbarque,
    cliente
  } = filters;
  const [openPopOver, setOpenPopOver] = useState(false);
  const [popoverTarget, setPopoverTarget] = useState(null);

  const [interno, setInterno] = useState('');

  let columnasMostradasInicial = [];

  cells.forEach((cell) => {
    columnasMostradasInicial.push({
      id: cell.id,
      mostrar: cell.mostrarInicio,
      typeHead: cell.typeHead,
      label: cell.label,
      value: cell.value,
      align: cell.align,
      width: cell.width,
      cellColor: cell.cellColor,
    });
  });

  const [columnasMostradas, setColumnasMostradas] = useState(
    columnasMostradasInicial,
    );

    let vp = '15px';
    if (dense === true) {
      vp = '0px';
    }
  const classes = useStyles({vp: vp});
  const dispatch = useDispatch();
  
  const {user} = useSelector(({auth}) => auth);
  const [permisos, setPermisos] = useState('');
  const [titulo, setTitulo] = useState('');
  const [showTable, setShowTable] = useState(true);
  
  const eventos = useSelector(({tipoEventoReducer}) => tipoEventoReducer.ligera);
  const lugares = useSelector(({lugarReducer}) => lugarReducer.ligera);
  const usuarios = useSelector(({lugarUsuarioReducer}) => lugarUsuarioReducer.ligera);
  const clientes = useSelector(({clienteReducer}) => clienteReducer.ligera);

  useEffect(() => {
    if (rows.length === 0) {
      setShowTable(false);
    } else {
      setShowTable(true);
    }
  }, [rows]);

  useEffect(() => {
    user &&
      user.permisos.forEach((modulo) => {
        modulo.opciones.forEach((opcion) => {
          if (opcion.url === props.route.path) {
            setTitulo(opcion.nombre);
            const permisoAux = [];
            opcion.permisos.forEach((permiso) => {
              if (permiso.permitido) {
                permisoAux.push(permiso.titulo);
              }
            });
            setPermisos(permisoAux);
          }
        });
      });
    if(user?.rol?.tipo === 'IN'){
      dispatch(onGetClientes());
      setFilters({
        ...filters,
        cliente: user.asociado.id
      })
    }
  }, [user, props.route]); // eslint-disable-line

  useEffect(() => {
    if (user?.rol?.tipo!=='IN' && user?.rol?.tipo!=='AC'){
        const temp = usuarios.find((us) => us.usuario_id === user?.id);
        if (temp!==undefined){
          setFilters({
            ...filters,
            usuario: String(user?.id),
            lugar: temp.lugar_id
          });
        }
    }
    setInterno(user?.rol?.tipo==='IN' || user?.rol?.tipo==='AC')
  }, [ // eslint-disable-line
    user,
    usuarios,
    lugares,
  ]) 
  
  useEffect(() => {
    dispatch(ligeraLugares());
    dispatch(ligeraUsuarios());
    dispatch(getEventos());

    return () => dispatch(onLeaveBitacora());
  }, []); // eslint-disable-line

  useEffect(() => {
    setPage(1);
  }, [orderByToSend, filters]);

  useEffect(() => {
    if(countFilters()){
      getBitacora();
    }
  }, [page, rowsPerPage, orderByToSend]); // eslint-disable-line

  const queryFilter = (e) => {
    if(e.target.name === 'cliente'){
      setFilters({
        ...filters,
        lugar: '',
        usuario: '',
        [e.target.name]: e.target.value
      })
    } else {
      setFilters({
        ...filters,
        [e.target.name]: e.target.value
      })
    }
  }

  const limpiarFiltros = () => {
    if(interno){
      setFilters(initialFilters);
    } else {
      setFilters({
        ...initialFilters,
        lugar,
        usuario
      })
    }
  };

  const changeOrderBy = (id) => {
    if (orderBy === id) {
      if (order === 'asc') {
        setOrder('desc');
        setOrderByToSend(id + ':desc');
      } else {
        setOrder('asc');
        setOrderByToSend(id + ':asc');
      }
    } else {
      setOrder('asc');
      setOrderBy(id);
      setOrderByToSend(id + ':asc');
    }
  };

  const handleClosePopover = () => {
    setOpenPopOver(false);
    setPopoverTarget(null);
  };

  const handleOpenPopoverColumns = (e) => {
    setPopoverTarget(e.currentTarget);
    setOpenPopOver(true);
  };

  const handleOnchangeMostrarColumna = (e) => {
    let aux = columnasMostradas;
    setColumnasMostradas(
      aux.map((column) => {
        if (column.id === e.target.id) {
          return {...column, mostrar: !column.mostrar};
        } else {
          return column;
        }
      }),
    );
  };

  const showAllColumns = () => {
    let aux = columnasMostradas;
    setColumnasMostradas(
      aux.map((column) => {
        return {...column, mostrar: true};
      }),
    );
  };

  const reiniciarColumns = () => {
    setColumnasMostradas(columnasMostradasInicial);
  };

  
  const onOpenViewBitacoraDetalle = (row) => {
    setBitacoraDetalleSeleccionada(row);
    setAccion('ver');
    setShowForm(true);
  };
  const handleOnClose = () => {
    setShowForm(false);
    setBitacoraDetalleSeleccionada(0);
    setAccion('ver');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const getBitacora = () => {
    if(countFilters()){
      dispatch(onGetBitacora(
        page,
        rowsPerPage,
        orderByToSend,
        fechaInicial,
        fechaFinal,
        evento,
        serial,
        contenedor,
        documentoRef,
        lugar,
        usuario,
        operacionEmbarque,
        cliente
      ));
    }
  }

  const onSeeLocation = (url) => {
    window.open(url, '_blank').focus()
  }

  const countFilters = () => {
    const even = (ev) => ev !== '';
    return Object.values(filters).some(even);
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        {permisos && (
          <EnhancedTableToolbar
            handleOpenPopoverColumns={handleOpenPopoverColumns}
            queryFilter={queryFilter}
            limpiarFiltros={limpiarFiltros}
            fechaInicial={fechaInicial}
            fechaFinal={fechaFinal}
            evento={evento}
            serial={serial}
            contenedor={contenedor}
            documentoRef={documentoRef}
            lugar={lugar}
            usuario={usuario}
            eventos={eventos}
            lugares={lugares}
            usuarios={usuarios}
            interno={interno}
            titulo={titulo}
            operacionEmbarque={operacionEmbarque}
            getBitacora={getBitacora}
            user={user}
            permisos={permisos}
            clientes={clientes}
            cliente={cliente}
          />
        )}
        {showTable && permisos ? (
          <Box className={classes.marcoTabla}>
            <Box className={classes.paginacion}>
              <Box>
                <p>{textoPaginacion}</p>
              </Box>
              <Box className={classes.paginacion}>
                <select
                  className={classes.rowsPerPageOptions}
                  value={rowsPerPage}
                  onChange={handleChangeRowsPerPage}>
                  {rowsPerPageOptions.map((option) => {
                    return (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    );
                  })}
                </select>
                <Pagination
                  showFirstButton
                  showLastButton
                  onChange={handleChangePage}
                  count={ultima_pagina}
                  page={page}
                />
              </Box>
            </Box>

            <TableContainer>
              <Table
                className={classes.table}
                aria-labelledby='tableTitle'
                size={dense ? 'small' : 'medium'}
                aria-label='enhanced table'>
                <EnhancedTableHead
                  classes={classes}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={changeOrderBy}
                  rowCount={rows.length}
                  columnasMostradas={columnasMostradas}
                />
                <TableBody>
                  {rows.map((row, index) => {

                    return (
                      <TableRow
                        hover
                        tabIndex={-1}
                        key={index}
                        className={classes.row}>
                        <TableCell align='center' className={classes.acciones}>
                          {permisos.indexOf('Consultar') >= 0 && (
                            <Tooltip title={<IntlMessages id='boton.localizacion' />}>
                              <LocationOnOutlined
                                onClick={() => onSeeLocation(row.ubicacion)}
                                className={`${classes.generalIcons} ${classes.locationIcon}`}
                                />
                            </Tooltip>
                          )}
                          {permisos.indexOf('Consultar') >= 0 && (
                            <Tooltip title={<IntlMessages id='boton.ver' />}>
                              <Visibility
                                onClick={() => onOpenViewBitacoraDetalle(row.id)}
                                className={`${classes.generalIcons} ${classes.visivilityIcon}`}
                                />
                            </Tooltip>
                          )}
                        </TableCell>

                        {columnasMostradas.map((columna) => {
                          if (columna.mostrar) {
                            return (
                              <MyCell
                                useStyles={useStyles}
                                key={row.id + columna.id}
                                align={columna.align}
                                width={columna.width}
                                claseBase={classes.cell}
                                value={columna.value(row[columna.id])}
                                cellColor={
                                  columna.cellColor
                                    ? columna.cellColor(row[columna.id])
                                    : ''
                                }
                              />
                            );
                          } else {
                            return <th key={row.id + columna.id}></th>;
                          }
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <Box className={classes.paginacion}>
              <Box>
                <p>{textoPaginacion}</p>
              </Box>
              <Box className={classes.paginacion}>
                <select
                  className={classes.rowsPerPageOptions}
                  value={rowsPerPage}
                  onChange={handleChangeRowsPerPage}>
                  {rowsPerPageOptions.map((option) => {
                    return (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    );
                  })}
                </select>
                <Pagination
                  showFirstButton
                  showLastButton
                  onChange={handleChangePage}
                  count={ultima_pagina}
                  page={page}
                />
              </Box>
            </Box>
          </Box>
        ) : permisos ? (
          <Box
            component='h2'
            padding={4}
            fontSize={19}
            className={classes.marcoTabla}>
            <IntlMessages id='sinResultados' />
          </Box>
        ) : (
          <Box
            component='h2'
            padding={4}
            fontSize={19}
            className={classes.marcoTabla}>
            <IntlMessages id='noAutorizado' />
          </Box>
        )}
      </Paper>

      {showForm ? (
        <BitacoraSellosDetalle
          bitacoraDetalle={bitacoraDetalleSelecionada}
          accion={accion}
          handleOnClose={handleOnClose}
          titulo={titulo}
          onSeeLocation={onSeeLocation}
        />
      ) : (
        ''
      )}

      <Popover
        id='popoverColumns'
        open={openPopOver}
        anchorEl={popoverTarget}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}>
        <Box className={classes.popoverColumns}>
          {columnasMostradas.map((column) => {
            return (
              <FormControlLabel
                key={column.id}
                control={
                  <Switch
                    id={column.id}
                    checked={column.mostrar}
                    onChange={handleOnchangeMostrarColumna}
                  />
                }
                label={column.label}
              />
            );
          })}
          <Box>
            <Button onClick={showAllColumns}>Mostrar Todos</Button>
            <Button onClick={reiniciarColumns}>Reiniciar Vista</Button>
          </Box>
        </Box>
      </Popover>
    </div>
  );
};

export default BitacoraSellos;
