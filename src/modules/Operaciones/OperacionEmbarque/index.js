import React, {useState, useEffect} from 'react';
import {
  Box, 
  Button,
  lighten,
  makeStyles,
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
  Popover,
  TextField,
  MenuItem,
  Icon,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Pagination from '@material-ui/lab/Pagination';
import {
  Delete, 
  Edit, 
  Add,
  Visibility,
  Tune,
  ClearAll,
  CheckBoxOutlineBlank,
  Publish
} from '@material-ui/icons';
import OperacionEmbarqueCreador from './OperacionEmbarqueCreador';
import Contenedor from './Contenedor';
import {
  onGetColeccion,
  onDelete,
} from 'redux/actions/OperacionEmbarqueAction';
import {onGetColeccionLigera as onGetClientes} from 'redux/actions/ClienteAction';
import {useDispatch, useSelector} from 'react-redux';
import IntlMessages from '@crema/utility/IntlMessages';
import Swal from 'sweetalert2';
import {
  UPDATE_TYPE,
  CREATE_TYPE,
  DELETE_TYPE,
} from 'shared/constants/Constantes';
import {MessageView} from '@crema';
import {useDebounce} from 'shared/hooks/useDebounce';
import moment from 'moment';
import MyCell from 'shared/components/MyCell';
import { ESTADOS_OPERACION_EMBARQUE } from 'shared/constants/ListaValores';
import ReactExport from 'react-export-excel';
import CargaContenedor from './CargaContenedor';
import HelpButton from 'shared/components/HelpButton';

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

const cells = [
  {
    id: 'nombre',
    typeHead: 'string',
    label: 'Nombre',
    value: (value) => value,
    align: 'left',
    mostrarInicio: true,
  },
  {
    id: 'fecha_inicio',
    typeHead: 'string',
    label: 'Fecha Inicio',
    value: (value) => moment(value).format('DD-MM-YYYY'),
    align: 'left',
    mostrarInicio: true,
  },
  {
    id: 'fecha_fin',
    typeHead: 'string',
    label: 'Fecha Fin',
    value: (value) => moment(value).format('DD-MM-YYYY'),
    align: 'left',
    mostrarInicio: true,
  },
  {
    id: 'indicativo_requiere_instalacion_previaje',
    typeHead: 'string',
    label: 'Requiere Inst. Previaje',
    value: (value) => (value === 'S' ? 'Sí' : 'No'),
    align: 'left',
    mostrarInicio: false,
  },
  {
    id: 'estado',
    typeHead: 'string',
    label: 'Estado',
    value: (value) => ESTADOS_OPERACION_EMBARQUE.map((state) => state.id === value ? state.nombre : ''),
    align: 'left',
    mostrarInicio: true,
    cellColor: (value) => value === 'VIG' ? 'green' : 'red'
  },
  {
    id: 'observaciones',
    typeHead: 'string',
    label: 'Observaciones',
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
          align='center'
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
        <TableCell
          align='center'
          style={{fontWeight: 'bold'}}
          className={classes.headCellWoMargin}>
          {'Contenedores'}
        </TableCell>
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
    // width: 'min-content',
    display: 'flex',
    gap: '5px',
    maxHeight: 50
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
    gridTemplateColumns: '2fr 2fr 2fr 1fr',
    gap: '20px',
  },
  pairFilters: {
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '20px',
    minWidth: '100px',
  },
  layout: {
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    width: 350,
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
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const {
    titulo,
    onOpenAddOperacionEmbarque,
    handleOpenPopoverColumns,
    queryFilter,
    nombre,
    estado,
    limpiarFiltros,
    permisos,
    cliente,
    clientes,
    user,
    url
  } = props;
  return (
    <Toolbar
      className={clsx(classes.root)}>
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
              <Box className={classes.layout}>
                <ExcelFile
                  element={
                    <Button className={`${classes.btnRoot} ${classes.btnPrymary}`}>
                      <Icon>{'download'}</Icon>
                      Formato Importación Contenedores
                    </Button>
                  }
                  filename={'Formato Carga Contenedores'}>
                  <ExcelSheet data={[]} name='Hoja 1'>
                    <ExcelColumn
                      label='Numero Contenedor'
                      value=''
                      widthPx={160}
                    />
                    <ExcelColumn
                      label='Observaciones'
                      value=''
                      widthPx={260}
                    />
                  </ExcelSheet>
                </ExcelFile>
              </Box>
              <HelpButton url={url}/>
              <Tooltip
                title='Mostrar/Ocultar Columnas'
                onClick={handleOpenPopoverColumns}>
                <IconButton
                  className={classes.columnFilterButton}
                  aria-label='filter list'>
                  <Tune />
                </IconButton>
              </Tooltip>
              {permisos.indexOf('Crear') >= 0 && (
                <Tooltip
                  title='Crear Operación Embarque'
                  onClick={onOpenAddOperacionEmbarque}>
                  <IconButton
                    className={classes.createButton}
                    aria-label='filter list'>
                      <Add/>
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
              label='Nombre'
              name='nombre'
              id='nombre'
              onChange={queryFilter}
              value={nombre}
              className={classes.inputFiltros}
            />
             <TextField
              label='Estado'
              name='estado'
              id='estado'
              onChange={queryFilter}
              value={estado}
              select
              className={classes.inputFiltros}
            >
              {ESTADOS_OPERACION_EMBARQUE.map((estado) => {
                return (
                  <MenuItem
                    value={estado.id}
                    key={estado.id}
                    id={estado.id}
                    className={classes.pointer}>
                    {estado.nombre}
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
                    <ClearAll />
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
}));

const initialFilters = {
  nombre: '',
  estado: '',
  cliente: ''
}

const initialFormStatus = {
  creator: false,
  contenedores: false,
  import: false,
}

let hUrl = '';

const OperacionEmbarque = (props) => {
  const [showForm, setShowForm] = useState(initialFormStatus);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('');
  const [orderByToSend, setOrderByToSend] = React.useState(
    'fecha_modificacion:desc',
  );
  const [page, setPage] = React.useState(1);
  const dense = true; //Borrar cuando se use el change
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const rowsPerPageOptions = [5, 10, 15, 25, 50];

  const [accion, setAccion] = useState('ver');
  const [operacionEmbarqueSeleccionada, setOperacionEmbarqueSeleccionada] =
    useState(0);
  const {rows, desde, hasta, ultima_pagina, total} = useSelector(
    ({operacionEmbarqueReducer}) => operacionEmbarqueReducer,
  );

  const {message, error, messageType} = useSelector(({common}) => common);
  const clientes = useSelector(({clienteReducer}) => clienteReducer.ligera);

  useEffect(() => {
    if (message && message === 'La operación de embarque ha sido eliminada.') {
      if (messageType === DELETE_TYPE) {
        Swal.fire('Eliminada', message, 'success');
        updateColeccion();
      }
    }
  }, [message, error]); // eslint-disable-line react-hooks/exhaustive-deps

  const textoPaginacion = `Mostrando de ${desde} a ${hasta} de ${total} resultados - Página ${page} de ${ultima_pagina}`;
  const [filters, setFilters] = useState(initialFilters);
  const {
    nombre,
    estado,
    cliente
  } = filters;
  const debouncedName = useDebounce(nombre, 800);
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
    if(user?.rol?.tipo === 'IN'){
      dispatch(onGetClientes());
      setFilters({
        ...filters,
        cliente: user.asociado.id
      })
    }
  }, [user, props.route]); // eslint-disable-line

  useEffect(() => {
    dispatch(onGetColeccion(page, rowsPerPage, orderByToSend, nombre, estado, cliente));
  }, [page, rowsPerPage, debouncedName, orderByToSend, estado, cliente]); //eslint-disable-line

  useEffect(() => {
    setPage(1);
  }, [debouncedName, orderByToSend, estado, cliente]);

  const queryFilter = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    })
  }

  const limpiarFiltros = () => {
    setFilters(initialFilters);
  };

  const updateColeccion = () => {
    setPage(1);
    dispatch(onGetColeccion(page, rowsPerPage, orderByToSend, nombre, estado, cliente));
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

  const onOpenEditOperacionEmbarque = (id) => {
    setOperacionEmbarqueSeleccionada(id);
    setAccion('editar');
    setShowForm({
      ...initialFormStatus,
      creator: true
    });
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

  const onOpenViewOperacionEmbarque = (id) => {
    setOperacionEmbarqueSeleccionada(id);
    setAccion('ver');
    setShowForm({
      ...initialFormStatus,
      creator: true
    });
  };

  const onDeleteOperacionEmbarque = (id) => {
    Swal.fire({
      title: 'Confirmar',
      text: '¿Seguro Que Desea Eliminar La Operacion de Embarque?',
      allowEscapeKey: false,
      allowEnterKey: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'NO',
      confirmButtonText: 'SI',
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(onDelete(id));
      }
    });
  };

  const onOpenAddOperacionEmbarque = () => {
    setOperacionEmbarqueSeleccionada(0);
    setAccion('crear');
    setShowForm({
      ...initialFormStatus,
      creator: true
    });
  };

  const handleOnClose = () => {
    setShowForm(initialFormStatus);
    setOperacionEmbarqueSeleccionada(0);
    setAccion('ver');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const openContenedoresList = (row) => {
    setOperacionEmbarqueSeleccionada(row)
    setShowForm({
      ...initialFormStatus,
      contenedores: true
    });
  }

  const onOpenImport = (row) => {
    setOperacionEmbarqueSeleccionada(row);
    setShowForm({
      ...initialFormStatus,
      import: true
    })
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        {permisos && (
          <EnhancedTableToolbar
            onOpenAddOperacionEmbarque={onOpenAddOperacionEmbarque}
            handleOpenPopoverColumns={handleOpenPopoverColumns}
            queryFilter={queryFilter}
            limpiarFiltros={limpiarFiltros}
            nombre={nombre}
            estado={estado}
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
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={changeOrderBy}
                  rowCount={rows.length}
                  columnasMostradas={columnasMostradas}
                />
                <TableBody>
                  {
                    rows.map((row, index) => {
                      return (
                        <TableRow
                          hover
                          tabIndex={-1}
                          key={row.id}
                          className={classes.row}>

                          <TableCell
                            align='center'
                            className={classes.acciones}>
                            {permisos.indexOf('Modificar') >= 0 && (
                              <Tooltip title={<IntlMessages id='boton.editar' />}>
                                <Edit
                                  onClick={() => onOpenEditOperacionEmbarque(row.id)}
                                  className={`${classes.generalIcons} ${classes.editIcon}`}
                                />
                              </Tooltip>
                            )}
                            {permisos.indexOf('Listar') >= 0 && (
                              <Tooltip title={<IntlMessages id='boton.ver' />}>
                                <Visibility
                                  onClick={() => onOpenViewOperacionEmbarque(row.id)}
                                  className={`${classes.generalIcons} ${classes.visivilityIcon}`}
                                />
                              </Tooltip>
                            )}
                            {permisos.indexOf('Eliminar') >= 0 && (
                              <Tooltip title={<IntlMessages id='boton.eliminar' />}>
                                <Delete
                                  onClick={() => onDeleteOperacionEmbarque(row.id)}
                                  className={`${classes.generalIcons} ${classes.deleteIcon}`}
                                />
                              </Tooltip>
                            )}
                            {permisos.indexOf('Modificar') >= 0 && (
                              <Tooltip title='Importar Contenedores'>
                                <Publish
                                  onClick={() =>onOpenImport(row)}
                                  className={`${classes.generalIcons}`}
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
                                  popover={columna.id === 'valor_parametro'}
                                />
                              );
                            } else {
                              return <th key={row.id + columna.id}></th>;
                            }
                          })}
                          <TableCell align='center' className={classes.cell}>
                              <Tooltip title={'Contenedores'}>
                                <Box style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                  <CheckBoxOutlineBlank 
                                    onClick={() => openContenedoresList(row)}
                                    className={`${classes.generalIcons} ${classes.containerIcon}`}
                                  />
                                </Box>
                              </Tooltip>
                            </TableCell>
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

      {showForm.creator ? (
        <OperacionEmbarqueCreador
          showForm={showForm.creator}
          operacionEmbarque={operacionEmbarqueSeleccionada}
          accion={accion}
          handleOnClose={handleOnClose}
          updateColeccion={updateColeccion}
          titulo={titulo}
          clientes={clientes}
          user={user}
        />
      ) : (
        ''
      )}

      { showForm.contenedores ? (
        <Contenedor
          showForm={showForm.contenedores}
          operacionEmbarque={operacionEmbarqueSeleccionada}
          accion={accion}
          handleOnClose={handleOnClose}
          updateColeccion={updateColeccion}
          titulo={`${titulo} - Contenedores`}
        />
      ) : (
        ''
      )}

      { showForm.import && (
        <CargaContenedor
          show={showForm.import}
          operacionEmbarque={operacionEmbarqueSeleccionada?.id??''}
          close={handleOnClose}
          titulo={`${operacionEmbarqueSeleccionada?.nombre??''} - Carga Contenedores`}
        />
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
      <MessageView
        variant={messageType === UPDATE_TYPE || messageType === CREATE_TYPE? 'success': 'error'}
        message={message||error}
      />
    </div>
  );
};

export default OperacionEmbarque;