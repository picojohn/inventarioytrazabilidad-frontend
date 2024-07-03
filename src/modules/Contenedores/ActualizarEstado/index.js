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
import ActualizarEstadoDetalle from './ActualizarEstadoDetalle';
import {
  onGetColeccionActualizacion, onLeaveBitacora,
} from 'redux/actions/SelloAction';
import {onGetColeccionLigera as ligeraLugares} from 'redux/actions/LugarAction';
import {onGetColeccionLigera as ligeraUsuarios} from 'redux/actions/LugarUsuarioAction';
import {onGetColeccionLigera as onGetClientes} from 'redux/actions/ClienteAction';
import {useDispatch, useSelector} from 'react-redux';
import {
  Tune,
  ClearAll,
  Search,
  TrackChanges,
} from '@material-ui/icons';
import IntlMessages from '@crema/utility/IntlMessages';
import MyCell from 'shared/components/MyCell';
import { ESTADOS_SELLOS } from 'shared/constants/ListaValores';
import { MessageView } from '@crema';
import { CREATE_TYPE } from 'shared/constants/Constantes';
import HelpButton from 'shared/components/HelpButton';

const cells = [
  {
    id: 'numero_ultima_remision',
    typeHead: 'numeric',
    label: 'Última Remisión',
    value: (value) => value,
    align: 'right',
    mostrarInicio: false,
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
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 15
  }
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const {
    titulo,
    handleOpenPopoverColumns,
    queryFilter,
    serial,
    contenedor,
    documentoRef,
    lugar,
    usuario,
    lugares,
    usuarios,
    limpiarFiltros,
    interno,
    getBitacora,
    operacionEmbarque,
    user,
    clientes,
    cliente,
    url
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
            <HelpButton url={url} />
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
          <Box className={classes.buttonsContainer}>
              <Box display='flex' mb={2}>
                <Tooltip title='Buscar' onClick={getBitacora}>
                  <IconButton
                    className={classes.createButton}
                    aria-label='filter list'>
                    <Search />
                  </IconButton>
                </Tooltip>
              </Box>
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
                  {lugar.nombre+ ' - ' +lugar.cliente}
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
  generalIcons: {
    '&:hover': {
      color: theme.palette.colorHover,
      cursor: 'pointer',
    },
  },
  visivilityIcon: {
    color: theme.palette.primary.main,
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
  serial: '',
  contenedor: '',
  documentoRef: '',
  lugar: '',
  usuario: '',
  operacionEmbarque: '',
  cliente: ''
}

let hUrl = '';

const ActualizarEstado = (props) => {
  const [showForm, setShowForm] = useState(false);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('');
  const [orderByToSend, setOrderByToSend] = React.useState(
    'serial:asc',
  );
  const [page, setPage] = React.useState(1);
  const dense = true; //Borrar cuando se use el change

  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const rowsPerPageOptions = [5, 10, 15, 25, 50];

  const [selloSelecionado, setSelloSeleccionado] = useState([]);
  const {rows, desde, hasta, ultima_pagina, total} = useSelector(
    ({selloReducer}) => selloReducer.actualizarEstado,
  );

  const textoPaginacion = `Mostrando de ${desde} a ${hasta} de ${total} resultados - Página ${page} de ${ultima_pagina}`;
  const [filters, setFilters] = useState(initialFilters);
  const {
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
  
  const {message, error, messageType} = useSelector(({common}) => common);
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

  
  const onOpenActualizarEstadoSello = (row) => {
    setSelloSeleccionado(row);
    setShowForm(true);
  };
  const handleOnClose = () => {
    setShowForm(false);
    setSelloSeleccionado([]);
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
      dispatch(onGetColeccionActualizacion(
        page,
        rowsPerPage,
        orderByToSend,
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
            serial={serial}
            contenedor={contenedor}
            documentoRef={documentoRef}
            lugar={lugar}
            usuario={usuario}
            lugares={lugares}
            usuarios={usuarios}
            interno={interno}
            titulo={titulo}
            user={user}
            operacionEmbarque={operacionEmbarque}
            getBitacora={getBitacora}
            cliente={cliente}
            clientes={clientes}
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
                  {rows.map((row, index) => {

                    return (
                      <TableRow
                        hover
                        tabIndex={-1}
                        key={index}
                        className={classes.row}>
                        <TableCell align='center' className={classes.acciones}>
                          {permisos.indexOf('Modificar') >= 0 && (
                            <Tooltip title={'Actualizar Estado'}>
                              <TrackChanges
                                onClick={() => onOpenActualizarEstadoSello(row)}
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
        <ActualizarEstadoDetalle
          selloSelecionado={selloSelecionado}
          handleOnClose={handleOnClose}
          titulo={titulo}
          showForm={showForm}
          getBitacora={getBitacora}
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
      <MessageView
        variant={messageType === CREATE_TYPE ? 'success' : 'error'}
        message={message||error}
      />
    </div>
  );
};

export default ActualizarEstado;
