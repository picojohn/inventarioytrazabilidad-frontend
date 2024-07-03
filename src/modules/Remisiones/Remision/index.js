import React, {useState, useEffect} from 'react';
import {Box, Button, MenuItem} from '@material-ui/core';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {lighten, makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import Pagination from '@material-ui/lab/Pagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import {
  onGetColeccion,
  onDelete,
  onConfirmOrReject
} from 'redux/actions/RemisionAction';
import { onGetColeccionLigera as onGetClientes } from 'redux/actions/ClienteAction';
import {useDispatch, useSelector} from 'react-redux';
import VisibilityIcon from '@material-ui/icons/Visibility';
import IntlMessages from '@crema/utility/IntlMessages';
import Popover from '@material-ui/core/Popover';
import TuneIcon from '@material-ui/icons/Tune';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import TextField from '@material-ui/core/TextField';
import Swal from 'sweetalert2';
import {
  UPDATE_TYPE,
  CREATE_TYPE,
  DELETE_TYPE,
  CONFIRM_TYPE,
  REJECT_TYPE,
} from 'shared/constants/Constantes';
import {MessageView} from '@crema';
import {useDebounce} from 'shared/hooks/useDebounce';
import moment from 'moment';
import MyCell from 'shared/components/MyCell';
import { history } from 'redux/store';
import { ESTADOS_REMISIONES } from 'shared/constants/ListaValores';
import { Cancel, CheckBox } from '@material-ui/icons';
import ObservacionesRechazoForm from './ObservacionesRechazo';
import Loading from 'shared/components/Loading';
import { useLocation } from 'shared/hooks/useLocation';
import HelpButton from 'shared/components/HelpButton';

const cells = [
  {
    id: 'numero_remision',
    typeHead: 'numeric',
    label: 'Número Remision',
    value: (value) => value,
    align: 'right',
    mostrarInicio: true,
  },
  {
    id: 'fecha_remision',
    typeHead: 'string',
    label: 'Fecha',
    value: (value) => value,
    align: 'left',
    mostrarInicio: true,
  },
  {
    id: 'cliente_envio',
    typeHead: 'string',
    label: 'Cliente Envio',
    value: (value) => value,
    align: 'left',
    mostrarInicio: false,
  },
  {
    id: 'usuario_envio',
    typeHead: 'string',
    label: 'Usuario Envia',
    value: (value) => value,
    align: 'left',
    mostrarInicio: false,
  },
  {
    id: 'lugar_envio',
    typeHead: 'string',
    label: 'Origen',
    value: (value) => value,
    align: 'left',
    mostrarInicio: true,
  },
  {
    id: 'cliente_destino',
    typeHead: 'string',
    label: 'Cliente Destino',
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
    id: 'lugar_destino',
    typeHead: 'string',
    label: 'Destino',
    value: (value) => value,
    align: 'left',
    mostrarInicio: true,
  },
  {
    id: 'guia_transporte',
    typeHead: 'string',
    label: 'Guía',
    value: (value) => value,
    align: 'left',
    mostrarInicio: true,
  },
  {
    id: 'estado_remision',
    typeHead: 'string',
    label: 'Estado Remision',
    value: (value) => ESTADOS_REMISIONES.map((estado) => estado.id === value ? estado.nombre : ''),
    align: 'left',
    mostrarInicio: true,
  },
  {
    id: 'fecha_aceptacion',
    typeHead: 'string',
    label: 'Fecha Aceptación',
    value: (value) => value?moment(value).format('DD-MM-YYYY'):'',
    align: 'left',
    mostrarInicio: false,
  },
  {
    id: 'fecha_rechazo',
    typeHead: 'string',
    label: 'Fecha Rechazo',
    value: (value) => value?moment(value).format('DD-MM-YYYY'):'',
    align: 'left',
    mostrarInicio: false,
  },
  {
    id: 'fecha_anulacion',
    typeHead: 'string',
    label: 'Fecha Anulación',
    value: (value) => value?moment(value).format('DD-MM-YYYY'):'',
    align: 'left',
    mostrarInicio: false,
  },
  {
    id: 'observaciones_remision',
    typeHead: 'string',
    label: 'Observaciones',
    value: (value) => value,
    align: 'left',
    mostrarInicio: false,
  },
  {
    id: 'observaciones_rechazo',
    typeHead: 'string',
    label: 'Observ. Rechazo',
    value: (value) => value,
    align: 'left',
    mostrarInicio: false,
  },
  {
    id: 'usuario_modificacion_nombre',
    typeHead: 'string',
    label: 'Modificado Por',
    value: (value) => value,
    align: 'left',
    width: '140px',
    mostrarInicio: false,
  },
  {
    id: 'fecha_modificacion',
    typeHead: 'string',
    label: 'Fecha Última Modificación',
    value: (value) => moment(value).format('DD-MM-YYYY HH:mm:ss'),
    align: 'left',
    width: '180px',
    mostrarInicio: false,
  },
  {
    id: 'usuario_creacion_nombre',
    typeHead: 'string',
    label: 'Creado Por',
    value: (value) => value,
    align: 'left',
    width: '140px',
    mostrarInicio: false,
  },
  {
    id: 'fecha_creacion',
    typeHead: 'string',
    label: 'Fecha Creación',
    value: (value) => moment(value).format('DD-MM-YYYY HH:mm:ss'),
    align: 'left',
    width: '180px',
    mostrarInicio: false,
  },
];

function EnhancedTableHead(props) {
  const {classes, order, orderBy, onRequestSort, columnasMostradas} = props;

  return (
    <TableHead>
      <TableRow className={classes.head}>
        <TableCell
          align='left'
          style={{fontWeight: 'bold'}}
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
                  // onClick={createSortHandler(cell.id)}
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
  onSelectAllClick: PropTypes.func.isRequired,
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
    gridTemplateColumns: '2fr 2fr 2fr 2fr 1fr',
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
    titulo,
    onOpenAddRemision,
    handleOpenPopoverColumns,
    queryFilter,
    filters,
    limpiarFiltros,
    permisos,
    cliente,
    clientes,
    user,
    url
  } = props;
  return (
    <Toolbar
      className={clsx(classes.root)}
    >
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
            <HelpButton url={url} />
            <Tooltip
              title='Mostrar/Ocultar Columnas'
              onClick={handleOpenPopoverColumns}>
              <IconButton
                className={classes.columnFilterButton}
                aria-label='filter list'>
                <TuneIcon />
              </IconButton>
            </Tooltip>
            {permisos.indexOf('Crear') >= 0 && (
              <Tooltip
                title='Crear Remision'
                onClick={onOpenAddRemision}>
                <IconButton
                  className={classes.createButton}
                  aria-label='filter list'>
                  <AddIcon />
                </IconButton>
              </Tooltip>
            )}
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
            label='Número'
            name='numero'
            id='numero'
            onChange={queryFilter}
            value={filters.numero}
            className={classes.inputFiltros}
          />
          <TextField
            label='Fecha'
            name='fecha'
            id='fecha'
            type='date'
            InputLabelProps={{
              shrink: true
            }}
            onChange={queryFilter}
            value={filters.fecha}
            className={classes.inputFiltros}
          />
          <TextField
            label='Guia'
            name='guia'
            id='guia'
            onChange={queryFilter}
            value={filters.guia}
            className={classes.inputFiltros}
          />
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
    </Toolbar>
  );
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
  acceptIcon: {
    color: '#48ac33',
  },
  denyIcon: {
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

const initialFilters = {
  numero: '',
  fecha: '',
  guia: '',
  cliente: '',
}

const locationInfo = {
  lat: 0,
  lon: 0,
}

let hUrl = '';

const Remision = (props) => {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('');
  const [orderByToSend, setOrderByToSend] = React.useState(
    'numero_remision:desc',
  );
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const dense = true; //Borrar cuando se use el change
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const rowsPerPageOptions = [5, 10, 15, 25, 50];
  const [showObservaciones, setShowObservaciones] = useState({
    show: false,
    id: '',
    lugar_origen_id: ''
  });
  const {rows, desde, hasta, ultima_pagina, total} = useSelector(
    ({remisionReducer}) => remisionReducer,
  );

  const {message, error, messageType, updatingContent} = useSelector(({common}) => common);
  const clientes = useSelector(({clienteReducer}) => clienteReducer.ligera);

  useEffect(() => {
    if (message) {
      switch (messageType) {
        case DELETE_TYPE:
          Swal.fire('Anulada', message, 'success');
          break;
        case CONFIRM_TYPE:
          Swal.fire('Aceptada', message, 'success');
          break;
        case REJECT_TYPE:
          Swal.fire('Rechazada', message, 'success');
          break;
        default:
          break;
      }
      updateColeccion();
    }
  }, [message, error]); // eslint-disable-line react-hooks/exhaustive-deps

  const textoPaginacion = `Mostrando de ${desde} a ${hasta} de ${total} resultados - Página ${page} de ${ultima_pagina}`;
  const [filters, setFilters] = useState(initialFilters);
  const {numero, fecha, guia, cliente} = filters;
  const debouncedNumber = useDebounce(numero, 800);
  const debouncedGuide = useDebounce(guia, 800);
  // const {pathname} = useLocation();
  const [openPopOver, setOpenPopOver] = useState(false);
  const [popoverTarget, setPopoverTarget] = useState(null);

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
  const {getLocation, latitude, longitude} = useLocation();

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
            hUrl = opcion.url_ayuda;
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
    getLocation();
    if(user?.rol?.tipo === 'IN'){
      dispatch(onGetClientes());
      setFilters({
        ...filters,
        cliente: user.asociado.id
      })
    }
  }, [user, props.route]); // eslint-disable-line

  useEffect(() => {
    dispatch(onGetColeccion(page, rowsPerPage, orderByToSend, numero, fecha, guia, cliente));
  }, [dispatch, page, rowsPerPage, debouncedNumber, debouncedGuide, fecha, cliente, orderByToSend]); //eslint-disable-line

  useEffect(() => {
    setPage(1);
  }, [debouncedNumber, orderByToSend, debouncedGuide, cliente, fecha]);

  const queryFilter = (e) => {
    setFilters({
        ...filters, 
        [e.target.name]: e.target.value
    });
  };

  const limpiarFiltros = () => {
    setFilters(initialFilters);
  };

  const updateColeccion = () => {
    setPage(1);
    dispatch(onGetColeccion(page, rowsPerPage, orderByToSend, numero, fecha, guia, cliente));
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

  const onOpenEditRemision = (id) => {
    history.push('remisiones/editar/'+id);
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

  const onOpenViewRemision = (id) => {
    history.push('remisiones/ver/'+id);
  };

  const onDeleteRemision = (id) => {
    const datos = {
      latitude: locationInfo.lat,
      longitude: locationInfo.lon
    }
    Swal.fire({
      title: 'Anular',
      text: '¿Seguro Que Desea Anular La Remisión?',
      allowEscapeKey: false,
      allowEnterKey: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'NO',
      confirmButtonText: 'SI',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(onDelete(id, datos));
      }
    });
  };

  const onOpenAddRemision = () => {
    history.push('remisiones/crear');
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const onConfirm = (id, numero) => {
    const datos = {
      action: 'Confirm',
      latitude,
      longitude
    }
    Swal.fire({
      title: 'Aceptar',
      text: `¿Seguro Que Desea Aceptar La Remisión ${numero}?`,
      allowEscapeKey: false,
      allowEnterKey: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'NO',
      confirmButtonText: 'SI',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(onConfirmOrReject(id, datos));
      }
    });
  }

  const onReject = (id, lugar_origen_id) => {
    setShowObservaciones({
      show: true,
      id,
      lugar_origen_id
    })
  }

  const handleOnCloseObservaciones = () => {
    setShowObservaciones({
      show: false,
      id: '',
    })
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        {permisos && (
          <EnhancedTableToolbar
            numSelected={selected.length}
            onOpenAddRemision={onOpenAddRemision}
            handleOpenPopoverColumns={handleOpenPopoverColumns}
            queryFilter={queryFilter}
            limpiarFiltros={limpiarFiltros}
            filters={filters}
            permisos={permisos}
            titulo={titulo}
            cliente={cliente}
            clientes={clientes}
            user={user}
            url={hUrl}
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
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={changeOrderBy}
                  rowCount={rows.length}
                  columnasMostradas={columnasMostradas}
                />
                <TableBody>
                  {
                    rows.map((row, index) => {
                      const isItemSelected = isSelected(row.name);

                      return (
                        <TableRow
                          hover
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.id}
                          selected={isItemSelected}
                          className={classes.row}>

                          <TableCell
                            align='left'
                            className={classes.acciones}>
                            {permisos.indexOf('Modificar') >= 0 
                              && row.user_envio_id === user.id 
                              && row.estado_remision === 'GEN' && (
                              <Tooltip
                                title={<IntlMessages id='boton.editar' />}>
                                <EditIcon
                                  onClick={() =>
                                    onOpenEditRemision(row.id)
                                  }
                                  className={`${classes.generalIcons} ${classes.editIcon}`}></EditIcon>
                              </Tooltip>
                            )}
                            {permisos.indexOf('Listar') >= 0 && (
                              <Tooltip title={<IntlMessages id='boton.ver' />}>
                                <VisibilityIcon
                                  onClick={() =>
                                    onOpenViewRemision(row.id)
                                  }
                                  className={`${classes.generalIcons} ${classes.visivilityIcon}`}></VisibilityIcon>
                              </Tooltip>
                            )}
                            {permisos.indexOf('Eliminar') >= 0 
                              && row.user_envio_id === user.id 
                              && row.estado_remision === 'GEN' && (
                              <Tooltip
                                title={<IntlMessages id='boton.anular' />}>
                                <DeleteIcon
                                  onClick={() =>
                                    onDeleteRemision(row.id)
                                  }
                                  className={`${classes.generalIcons} ${classes.deleteIcon}`}></DeleteIcon>
                              </Tooltip>
                            )}
                            {permisos.indexOf('Modificar') >= 0 
                              && row.user_destino_id === user.id 
                              && row.estado_remision === 'GEN' && (
                              <Tooltip
                                title={<IntlMessages id='boton.aceptar' />}>
                                <CheckBox
                                  onClick={() =>
                                    onConfirm(row.id, row.numero_remision)
                                  }
                                  className={`${classes.generalIcons} ${classes.acceptIcon}`}></CheckBox>
                              </Tooltip>
                            )}
                            {permisos.indexOf('Modificar') >= 0 
                              && row.user_destino_id === user.id 
                              && row.estado_remision === 'GEN' && (
                              <Tooltip
                                title={<IntlMessages id='boton.rechazar' />}>
                                <Cancel
                                  onClick={() =>
                                    onReject(row.id, row.lugar_envio_id)
                                  }
                                  className={`${classes.generalIcons} ${classes.denyIcon}`}></Cancel>
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
                                  popover={columna.id === 'valor_parametro'}
                                />
                              );
                            } else {
                              return <th key={row.id + columna.id}></th>;
                            }
                          })}
                        </TableRow>
                      );
                    })
                  }
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

      {showObservaciones.show && (
        <ObservacionesRechazoForm
          show={showObservaciones.show}
          id={showObservaciones.id}
          handleOnClose={handleOnCloseObservaciones}
          lugar_origen_id={showObservaciones.lugar_origen_id}
          locationInfo={locationInfo}
        />
      )}

      {/* <CircularProgress
        style={{
          zIndex: 1000
        }}
        disableShrink
        size={80}
      /> */}

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
      <MessageView
        variant={
          messageType === UPDATE_TYPE || messageType === CREATE_TYPE
            ? 'success'
            : 'error'
        }
        message={
          messageType === UPDATE_TYPE || messageType === CREATE_TYPE
            ? message
            : ''
        }
      />
      {
        updatingContent && 
          <Loading/>
      }
    </div>
  );
};

export default Remision;
