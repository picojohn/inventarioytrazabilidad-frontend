import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormGroup,
  IconButton,
  TextField,
  Tooltip,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  lighten,
  makeStyles
} from '@material-ui/core/styles';
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
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import {
  onGetColeccionSellos,
  onGetColeccionSellosRemisionados,
  toogleRemisionarTodos,
  toogleRemisionDetalle
} from 'redux/actions/RemisionAction';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import IntlMessages from '@crema/utility/IntlMessages';
import Popover from '@material-ui/core/Popover';
import Swal from 'sweetalert2';
import {
  UPDATE_TYPE,
  CREATE_TYPE,
  DELETE_TYPE,
} from 'shared/constants/Constantes';
import { MessageView } from '@crema';
import MyCell from 'shared/components/MyCell';
import moment from 'moment';
import { useDebounce } from 'shared/hooks/useDebounce';
import { ClearAll } from '@material-ui/icons';
import { useLocation } from 'shared/hooks/useLocation';

const cells = [
  {
    id: 'producto_kit',
    typeHead: 'string',
    label: 'Producto/Kit',
    value: (value) => value,
    align: 'left',
    mostrarInicio: true,
  },
  {
    id: 'serial',
    typeHead: 'string',
    label: 'Serie',
    value: (value) => value,
    align: 'left',
    mostrarInicio: true,
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
  const {
    classes,
    order,
    orderBy,
    onRequestSort,
    columnasMostradas
  } = props;

  return (
    <TableHead>
      <TableRow className={classes.head}>
        <TableCell
          align='center'
          style={{ fontWeight: 'bold' }}
          className={classes.headCell}>
          {'Selección'}
        </TableCell>
        {
          columnasMostradas.map((cell) => {
            if (cell.mostrar)
              return (
                <TableCell
                  key={cell.id}
                  style={{ fontWeight: 'bold' }}
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
                    {orderBy === cell.id
                      ? (
                        <span className={classes.visuallyHidden}>
                          {order === 'desc'
                            ? 'sorted descending'
                            : 'sorted ascending'
                          }
                        </span>
                      )
                      : null
                    }
                  </TableSortLabel>
                </TableCell>
              );
            else
              return <th key={cell.id}></th>;
          })
        }
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  columnasMostradas: PropTypes.array.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: '35px',
    paddingRight: '35px',
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
    paddingTop: 5
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
    alignItems: 'center',
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
    gridTemplateColumns: '1fr 1fr 1fr 1fr 2fr',
    gap: '20px',
  },
  contenedorFiltros2: {
    width: '90%',
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    gap: '20px',
    paddingBottom: 5
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
    filtros,
    queryFilter,
    limpiarFiltros,
    seleccionados,
    seleccionadosSobreFiltro,
    total,
    toogleCheckAll,
    protegido
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
            {'Sellos'}
          </Typography>
        </Box>
        <Box className={classes.contenedorFiltros}>
          <TextField
            label='Serie Inicial'
            name='serieInicial'
            id='serieInicial'
            onChange={queryFilter}
            value={filtros.serieInicial}
            className={classes.inputFiltros}
          />
          <TextField
            label='Serie Final'
            name='serieFinal'
            id='serieFinal'
            onChange={queryFilter}
            value={filtros.serieFinal}
            className={classes.inputFiltros}
          />
          <TextField
            label='Número Pedido'
            name='numeroPedido'
            id='numeroPedido'
            onChange={queryFilter}
            value={filtros.numeroPedido}
            className={classes.inputFiltros}
          />
          <TextField
            label='Ítems seleccionados'
            name='seleccionados'
            id='seleccionados'
            disabled
            value={seleccionados??0}
            className={classes.inputFiltros}
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
        { !protegido && 
          <Box className={classes.contenedorFiltros2}>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={(total??-1)===(seleccionadosSobreFiltro??-2)}
                    onClick={(e) => toogleCheckAll(!e.target.checked)}
                    name='seleccionarTodos'
                    color='primary' 
                  />
                }
                label='Seleccionar Todos'
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filtros.soloSeleccionados}
                    name='soloSeleccionados'
                    onChange={queryFilter}
                    color='primary' 
                  />
                }
                label='Solo Seleccionados'
              />
            </FormGroup>
          </Box>
        }
      </>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {

};

const useStyles = makeStyles((theme) => ({
  marcoTabla: {
    backgroundColor: 'white',
    boxShadow: '0px 0px 5px 5px rgb(0 0 0 / 10%)',
    borderRadius: '4px',
    paddingLeft: '35px',
    paddingRight: '35px',
    marginTop: '5px',
  },
  root: {
    width: '100%%',
    paddingTop: '20px',
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
  btnSecondary: {
    backgroundColor: theme.palette.grayBottoms,
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
}));

const initialState = {
  serieInicial: '',
  serieFinal: '',
  numeroPedido: '',
  soloSeleccionados: false,
}

const RemisionDetalle = (props) => {
  const { data, protegido } = props;
  const { numero_remision, usuarioEnvio, lugarEnvio, clienteDestino} = data;
  const { id: user_envio_id } = usuarioEnvio??[];
  const { id: lugar_envio_id } = lugarEnvio??[];
  const { id: cliente_destino_id } = clienteDestino??[];
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('');
  const [orderByToSend, setOrderByToSend] = React.useState(
    'serial:desc',
  );
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [filtros, setFiltros] = useState(initialState)
  const {
    serieInicial, 
    serieFinal, 
    soloSeleccionados,
    numeroPedido
  } = filtros;
  const debouncedInitialSeries = useDebounce(serieInicial, 800);
  const debouncedFinalSeries = useDebounce(serieFinal, 800);
  const debouncedOrderNumber = useDebounce(numeroPedido, 800);
  // const [dense, setDense] = React.useState(false);
  const dense = true; //Borrar cuando se use el change
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const rowsPerPageOptions = [5, 10, 15, 25, 50];

  const {
    rows, 
    desde, 
    hasta, 
    ultima_pagina, 
    total, 
    seleccionados,
    seleccionadosSobreFiltro,
  } = useSelector(({remisionReducer}) => remisionReducer);

  const { message, error, messageType } = useSelector(({ common }) => common);

  useEffect(() => {
    if (message) {
      if (messageType === DELETE_TYPE) {
        Swal.fire('Eliminado', message, 'success');
        updateColeccion();
      }
    }
  }, [message, error]); // eslint-disable-line react-hooks/exhaustive-deps

  const textoPaginacion = `Mostrando de ${desde} a ${hasta} de ${total} resultados - Página ${page} de ${ultima_pagina}`;
  // const {pathname } = useLocation();
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
  const classes = useStyles({ vp: vp });
  const dispatch = useDispatch();

  const { user } = useSelector(({ auth }) => auth);
  const [permisos, setPermisos] = useState('');
  const [showTable, setShowTable] = useState(true);
  const {getLocation, latitude, longitude} = useLocation();

  useEffect(() => {
    if (rows.length === 0)
      setShowTable(false);
    else
      setShowTable(true);
  }, [rows]);

  useEffect(() => {
    user &&
      user.permisos.forEach((modulo) => {
        modulo.opciones.forEach((opcion) => {
          if (opcion.url === '/remisiones') {
            const permisoAux = [];
            opcion.permisos.forEach((permiso) => {
              if (permiso.permitido) {
                permisoAux.push(permiso.titulo);
              }
            });
            setPermisos(permisoAux.length > 0 ? permisoAux : '');
          }
        });
      });
      getLocation();
  }, [user, props.route]); // eslint-disable-line

  useEffect(() => {
    if(numero_remision && user_envio_id && lugar_envio_id){
      if(protegido){
        dispatch(
          onGetColeccionSellosRemisionados(
            page,
            rowsPerPage,
            orderByToSend,
            numero_remision,
            user_envio_id,
            lugar_envio_id,
            serieInicial,
            serieFinal,
            protegido?protegido:soloSeleccionados,
            numeroPedido,
            cliente_destino_id
          )
        );
      } else {
        dispatch(
          onGetColeccionSellos(
            page,
            rowsPerPage,
            orderByToSend,
            numero_remision,
            user_envio_id,
            lugar_envio_id,
            serieInicial,
            serieFinal,
            protegido?protegido:soloSeleccionados,
            numeroPedido,
            cliente_destino_id
          )
        );
      }
    }
  }, [ // eslint-disable-line react-hooks/exhaustive-deps
    dispatch, 
    page, 
    rowsPerPage, 
    orderByToSend, 
    numero_remision, 
    user_envio_id, 
    lugar_envio_id,
    debouncedInitialSeries,
    debouncedFinalSeries,
    soloSeleccionados,
    debouncedOrderNumber
  ]);

  useEffect(() => {
    setPage(1);
  }, [
    orderByToSend,
    debouncedInitialSeries,
    debouncedFinalSeries,
    soloSeleccionados,
    debouncedOrderNumber
  ]);

  const queryFilter = (e) => {
    switch (e.target.name) {
      case 'soloSeleccionados':
        setFiltros({
          ...filtros,
          [e.target.name]: e.target.checked
        });
        break;
      default:
        setFiltros({
          ...filtros,
          [e.target.name]: e.target.value
        })
        break;
    }
  }

  const limpiarFiltros = () => {
    setFiltros(initialState);
  }

  const changeOrderBy = (id) => {
    if (orderBy === id) {
      if (order === 'asc') {
        setOrder('desc');
        setOrderByToSend(id + ':desc');
      }
      else {
        setOrder('asc');
        setOrderByToSend(id + ':asc');
      }
    }
    else {
      setOrder('asc');
      setOrderBy(id);
      setOrderByToSend(id + ':asc');
    }
  };

  const handleClosePopover = () => {
    setOpenPopOver(false);
    setPopoverTarget(null);
  };

  const handleOnchangeMostrarColumna = (e) => {
    let aux = columnasMostradas;
    setColumnasMostradas(
      aux.map((column) => {
        if (column.id === e.target.id)
          return { ...column, mostrar: !column.mostrar };
        else
          return column;
      }),
    );
  };

  const showAllColumns = () => {
    let aux = columnasMostradas;
    setColumnasMostradas(
      aux.map((column) => {
        return { ...column, mostrar: true };
      }),
    );
  };

  const reiniciarColumns = () => {
    setColumnasMostradas(columnasMostradasInicial);
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

  const updateColeccion = () => {
    setPage(1);
    dispatch(
      onGetColeccionSellos(
        page,
        rowsPerPage,
        orderByToSend,
        numero_remision,
        user_envio_id,
        lugar_envio_id,
        serieInicial,
        serieFinal,
        soloSeleccionados,
        numeroPedido,
        cliente_destino_id
      )
    );
  };

  const toogleCheck = (row) => {
    const datos = {
      numero_remision: numero_remision,
      sello_id: row.id,
      producto_id: row.producto_id,
      kit_id: row.kit_id??'',
      serial: row.serial,
      indicativo_confirmacion_recepcion: data.indicativo_confirmacion_recepcion,
      lugar_destino_id: data.lugarDestino.id,
      user_destino_id: data.usuarioDestino.id,
      cliente_destino_id,
      latitude,
      longitude,
    }
    dispatch(toogleRemisionDetalle(datos, updateColeccion));
  }

  const toogleCheckAll = (seleccionar) => {
    const datos = {
      seleccionar: seleccionar?1:0,
      numero_remision: numero_remision,
      indicativo_confirmacion_recepcion: data.indicativo_confirmacion_recepcion,
      user_envio_id: data.usuarioEnvio.id,
      lugar_envio_id: data.lugarEnvio.id,
      lugar_destino_id: data.lugarDestino.id,
      user_destino_id: data.usuarioDestino.id,
      cliente_destino_id,
      latitude,
      longitude,
      data: rows,
      serial_inicial: serieInicial,
      serial_final: serieFinal,
      numero_pedido: numeroPedido,
      soloSeleccionados
    }
    dispatch(toogleRemisionarTodos(datos, updateColeccion));
  }

  const isSelected = (name) => selected.indexOf(name) !== -1;

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        {permisos && (
          <EnhancedTableToolbar
            queryFilter={queryFilter}
            filtros={filtros}
            limpiarFiltros={limpiarFiltros}
            seleccionados={seleccionados}
            seleccionadosSobreFiltro={seleccionadosSobreFiltro}
            total={total}
            toogleCheckAll={toogleCheckAll}
            protegido={protegido}
          />
        )}
        {
          showTable &&
            permisos
            ? (
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
                      {
                        rowsPerPageOptions.map((option) => {
                          return (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          );
                        })
                      }
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
                          const isItemSelected = isSelected(row.id);

                          return (
                            <TableRow
                              hover
                              aria-checked={isItemSelected}
                              tabIndex={-1}
                              key={row.id}
                              selected={isItemSelected}
                              className={classes.row}>
                              <TableCell
                                align='center'
                                className={classes.acciones}>
                                {permisos.indexOf('Modificar') >= 0 && (
                                  <Checkbox
                                    checked={row.checked === 1}
                                    color='primary'
                                    style={{
                                      pointerEvents: protegido?'none':'default'
                                    }}
                                    disabled={protegido}
                                    onClick={() => toogleCheck(row)}
                                    inputProps={{ 'aria-labelledby': index }}
                                  />
                                )}
                              </TableCell>

                              {
                                columnasMostradas.map((columna) => {
                                  if (columna.mostrar)
                                    return (
                                      <MyCell
                                        colSpan={2}
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
                                  else
                                    return <th key={row.id + columna.id}></th>;
                                })
                              }
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
                      {
                        rowsPerPageOptions.map((option) => {
                          return (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          );
                        })
                      }
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
            )
            : permisos
              ? (
                <Box
                  component='h2'
                  padding={4}
                  fontSize={19}
                  className={classes.marcoTabla}>
                  <IntlMessages id='sinResultados' />
                </Box>
              )
              : (
                <Box
                  component='h2'
                  padding={4}
                  fontSize={19}
                  className={classes.marcoTabla}>
                  <IntlMessages id='noAutorizado' />
                </Box>
              )
        }
      </Paper>

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
            : error
        }
      />
    </div>
  );
};

export default RemisionDetalle;
