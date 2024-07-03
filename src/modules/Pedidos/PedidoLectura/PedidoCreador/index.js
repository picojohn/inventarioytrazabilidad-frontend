import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField
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
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import LecturaSellos from './PedidoDetalle/LecturaSellos';
import {
  onGetColeccionParaLectura,
} from 'redux/actions/PedidoDetalleAction';
import { onGetColeccionLigera as onGetPedidos } from 'redux/actions/PedidoAction';
import { onGetColeccionLigera as onGetColores } from 'redux/actions/ColorAction';
import { onGetColeccionLigera as onGetProductosS3 } from 'redux/actions/ProductoAction';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import IntlMessages from '@crema/utility/IntlMessages';
import Popover from '@material-ui/core/Popover';
import TuneIcon from '@material-ui/icons/Tune';
import Swal from 'sweetalert2';
import {
  UPDATE_TYPE,
  CREATE_TYPE,
  DELETE_TYPE,
} from 'shared/constants/Constantes';
import { MessageView } from '@crema';
import MyCell from 'shared/components/MyCell';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import { ArrowBackIos, List } from '@material-ui/icons';
// import DetalleKit from './PedidoDetalle/Leidos';
import Leidos from './PedidoDetalle/Leidos';
import { history } from 'redux/store';
import LecturaKit from './PedidoDetalle/LecturaKit';

const cells = [
  {
    id: 'kit',
    typeHead: 'string',
    label: 'Nombre Kit',
    value: (value) => value,
    align: 'left',
    mostrarInicio: true,
  },
  {
    id: 'producto_s3_id',
    typeHead: 'string',
    label: 'Descripción Producto',
    value: (value) => value,
    align: 'left',
    mostrarInicio: true,
  },
  {
    id: 'color_id',
    typeHead: 'string',
    label: 'Color',
    value: (value) => value,
    align: 'left',
    mostrarInicio: true,
  },
  {
    id: 'consecutivo_detalle',
    typeHead: 'numeric',
    label: 'Consecutivo',
    value: (value) => value,
    align: 'right',
    mostrarInicio: false,
  },
  {
    id: 'cantidad',
    typeHead: 'numeric',
    label: 'Cantidad',
    value: (value) => value,
    align: 'right',
    mostrarInicio: true,
  },
  {
    id: 'prefijo',
    typeHead: 'string',
    label: 'Prefijo',
    value: (value) => value,
    align: 'left',
    mostrarInicio: false,
  },
  {
    id: 'posfijo',
    typeHead: 'string',
    label: 'Posfijo',
    value: (value) => value,
    align: 'left',
    mostrarInicio: false,
  },
  {
    id: 'longitud_serial',
    typeHead: 'numeric',
    label: 'Long. Serial',
    value: (value) => value,
    align: 'right',
    mostrarInicio: false,
  },
  {
    id: 'consecutivo_serie_inicial',
    typeHead: 'numeric',
    label: 'Cons. Serie Inicial',
    value: (value) => value,
    align: 'right',
    mostrarInicio: false,
  },
  {
    id: 'serie_inicial_articulo',
    typeHead: 'string',
    label: 'Serie Inicial',
    value: (value) => value,
    align: 'left',
    mostrarInicio: true,
  },
  {
    id: 'serie_final_articulo',
    typeHead: 'string',
    label: 'Serie Final',
    value: (value) => value,
    align: 'left',
    mostrarInicio: true,
  },
  {
    id: 'longitud_sello',
    typeHead: 'string',
    label: 'Long. Sello',
    value: (value) => value,
    align: 'left',
    mostrarInicio: false,
  },
  {
    id: 'diametro',
    typeHead: 'string',
    label: 'Diámetro',
    value: (value) => value,
    align: 'left',
    mostrarInicio: false,
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
          {'Acciones'}
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
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  columnasMostradas: PropTypes.array.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: '35px',
    paddingRight: '35px',
    paddingBottom: '20px',
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
    gridTemplateColumns: '2fr 3fr 8fr',
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
    handleOpenPopoverColumns,
    pedido
  } = props;

  const onGoBack = () => {
    history.push('/pedidos-lectura');
  }

  return (
    <Toolbar
      className={clsx(classes.root)}
    >
      <>
        <Box className={classes.titleTop}>
          <Box
            style={{
              display: 'flex',

            }}
          >
            <Tooltip title='Volver'>
              <ArrowBackIos
                style={{
                  cursor: 'pointer', 
                  fontSize: 30 
                }}
                onClick={onGoBack}
              />
            </Tooltip>
            <Typography
              className={classes.title}
              variant='h6'
              id='tableTitle'
              component='div'>
              {titulo}
            </Typography>
          </Box>
          <Box className={classes.horizontalBottoms}>
            <Tooltip
              title='Mostrar/Ocultar Columnas'
              onClick={handleOpenPopoverColumns}>
              <IconButton
                className={classes.columnFilterButton}
                aria-label='filter list'>
                <TuneIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Box className={classes.contenedorFiltros}>
          <TextField
            label='Número de pedido'
            name='numeroFiltro'
            id='numeroFiltro'
            value={pedido?.numero_pedido??''}
            disabled
            className={classes.inputFiltros}
          />
          <TextField
            label='Cliente'
            name='clienteFiltro'
            id='clienteFiltro'
            value={pedido?.cliente??''}
            disabled
            className={classes.inputFiltros}
          />
        </Box>
      </>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  handleOpenPopoverColumns: PropTypes.func.isRequired,
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
    color: '#3ab5e6',
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

let pedido = [];

const PedidoDetalle = (props) => {
  const { pedido_id } = useParams();
  const [showForm, setShowForm] = useState({
    creador: false,
    kit: '',
    producto: false,
    producto_s3: ''
  });
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('');
  const [orderByToSend, setOrderByToSend] = React.useState(
    'fecha_modificacion:desc',
  );
  const [page, setPage] = React.useState(1);
  // const [dense, setDense] = React.useState(false);
  const dense = true; //Borrar cuando se use el change
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const rowsPerPageOptions = [5, 10, 15, 25, 50];

  const [accion, setAccion] = useState('ver');
  const [leido, setLeido] = useState(false);
  const [detalleSeleccionado, setDetalleSeleccionado] = useState(0);
  const { rows, desde, hasta, ultima_pagina, total } = useSelector(
    ({ pedidoDetalleReducer }) => pedidoDetalleReducer,
  );
  const pedidos = useSelector(({ pedidoReducer }) => pedidoReducer.ligera);
  const colores = useSelector(({ colorReducer }) => colorReducer.ligera);
  const productosS3 = useSelector(({ productoReducer }) => productoReducer.ligera);

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
  const [titulo, setTitulo] = useState('');

  useEffect(() => {
    user &&
      user.permisos.forEach((modulo) => {
        modulo.opciones.forEach((opcion) => {
          if (opcion.url === '/pedidos-lectura') {
            setTitulo(opcion.nombre);
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
  }, [user, props.route]);

  useEffect(() => {
    dispatch(
      onGetColeccionParaLectura(
        page,
        rowsPerPage,
        orderByToSend,
        pedido_id
      )
    );
  }, [dispatch, page, rowsPerPage, orderByToSend]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateColeccion = () => {
    setPage(1);
    dispatch(
      onGetColeccionParaLectura(
        page,
        rowsPerPage,
        orderByToSend,
        pedido_id
      )
    );
  };

  useEffect(() => {
    setPage(1);
  }, [orderByToSend]);

  useEffect(() => {
    dispatch(onGetPedidos());
    dispatch(onGetColores());
    dispatch(onGetProductosS3());
  }, []) //eslint-disable-line

  useEffect(() => {
    if (pedidos) {
      pedido = pedidos.find((req) => req.id === parseInt(pedido_id));
    }
  }, [pedidos, pedido_id])

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

  const handleOpenPopoverColumns = (e) => {
    setPopoverTarget(e.currentTarget);
    setOpenPopOver(true);
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

  const onReadItem = (id, kit, producto_s3_id) => {
    setDetalleSeleccionado(id);
    setAccion('ver');
    if(!!kit){
      setShowForm({
        creador: false,
        kit,
        producto: false,
        producto_s3: ''
      });
    } else {
      setShowForm({
        creador: false,
        kit: '',
        producto: true,
        producto_s3: producto_s3_id
      });
    }
  };

  const handleOnClose = () => {
    setShowForm({
      creador: false,
      kit: false,
      producto: false,
      producto_s3: false
    });
    setDetalleSeleccionado(0);
    setAccion('ver');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const [showTable, setShowTable] = useState(true);
  useEffect(() => {
    if (rows.length === 0)
      setShowTable(false);
    else
      setShowTable(true);
  }, [rows]);

  const onGetColor = (id) => {
    const color = colores.find((colour) => colour.id === parseInt(id));
    if (color) {
      return color.nombre;
    }
    return '';
  }

  const getProductoS3 = (id) => {
    const productoS3 = productosS3.find((s3) => s3.id === parseInt(id));
    if (productoS3) {
      return productoS3.alias_producto;
    }
    return '';
  }

  const onLeer = () => {
    setLeido(true);
    setTimeout(() => {
      setLeido(false);
    }, 2000)
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        {permisos && (
          <EnhancedTableToolbar
            titulo={titulo}
            handleOpenPopoverColumns={handleOpenPopoverColumns}
            pedido={pedido}
          />
        )}
        {showTable && permisos ? (
          <Box className={classes.marcoTabla}>
            <Box className={classes.paginacion}>
              <Box><p>{textoPaginacion}</p></Box>
              <Box className={classes.paginacion}>
                <select
                  className={classes.rowsPerPageOptions}
                  value={rowsPerPage}
                  onChange={handleChangeRowsPerPage}
                >
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
                        key={row.id}
                        className={classes.row}
                      >
                        <TableCell
                          align='center'
                          className={classes.acciones}>
                          {permisos.indexOf('Listar') >= 0 && (
                            <Tooltip title={<IntlMessages id='boton.lectura' />}>
                              <List
                                onClick={() => onReadItem(row.id, row.kit_id, row.producto_s3_id)}
                                className={`${classes.generalIcons} ${classes.visivilityIcon}`}>
                              </List>
                            </Tooltip>
                          )}
                        </TableCell>

                        {columnasMostradas.map((columna) => {
                          if (columna.mostrar)
                            return (
                              <MyCell
                                useStyles={useStyles}
                                key={row.id + columna.id}
                                align={columna.align}
                                width={columna.width}
                                claseBase={classes.cell}
                                value={
                                  columna.id === 'color_id' ?
                                    onGetColor(columna.value(row[columna.id])) :
                                    columna.id === 'producto_s3_id' ?
                                      getProductoS3(columna.value(row[columna.id])) :
                                      columna.value(row[columna.id])
                                }
                                cellColor={
                                  columna.cellColor
                                    ? columna.cellColor(row[columna.id])
                                    : ''
                                }
                              />
                            );
                          else
                            return <th key={row.id + columna.id}></th>;
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <Box className={classes.paginacion}>
              <Box><p>{textoPaginacion}</p></Box>
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

      {showForm.producto ? (
        <LecturaSellos
          showForm={showForm.producto}
          accion={accion}
          handleOnClose={handleOnClose}
          updateColeccion={onLeer}
          titulo={titulo}
          pedido={pedido}
          producto_s3_id={showForm.producto_s3}
          productosS3={productosS3}
        />
      ) : ('')
      }

      {showForm.kit ? (
        <LecturaKit
          route={{
            path: '/pedidos'
          }}
          showForm={!!showForm.kit}
          detalle={detalleSeleccionado}
          accion={accion}
          handleOnClose={handleOnClose}
          updateColeccion={onLeer}
          titulo={titulo}
          pedido={pedido}
          productosS3={productosS3}
          kit={showForm.kit}
        />
      ) : ('')
      }

      <Leidos
        route={{
          path: '/pedidos'
        }}
        showForm={showForm.producto}
        detalle={detalleSeleccionado}
        accion={accion}
        handleOnClose={handleOnClose}
        leido={leido}
        titulo={titulo}
        pedido={pedido}
        productosS3={productosS3}
      />


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
        message={message||error}
      />
    </div>
  );
};

export default PedidoDetalle;
