import React, {useState, useEffect} from 'react';
import {Box, Button} from '@material-ui/core';
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
import KitProductosCreador from './KitProductosCreador';
import KitProductosTempCreador from './KitProductosTempCreador';
import {
  onGetColeccion,
  onDelete,
  onCreate
} from '../../../redux/actions/KitProductosAction';
import { onGetColeccionLigera as onGetKits } from 'redux/actions/KitAction';
import { onGetColeccionLigera as onGetProductosInternos } from 'redux/actions/ProductoAction';
import { onGetColeccionLigera as onGetProductos } from 'redux/actions/ProductoClienteAction';
import { fetchError, hideMessage } from 'redux/actions/Common';
import {useDispatch, useSelector} from 'react-redux';
import VisibilityIcon from '@material-ui/icons/Visibility';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import Popover from '@material-ui/core/Popover';
import TuneIcon from '@material-ui/icons/Tune';
import TextField from '@material-ui/core/TextField';
import Swal from 'sweetalert2';
import {
  UPDATE_TYPE,
  CREATE_TYPE,
  DELETE_TYPE,
} from 'shared/constants/Constantes';
import {MessageView} from '../../../@crema';
import moment from 'moment';
import MyCell from 'shared/components/MyCell';
import { useParams } from 'react-router-dom';
import { history } from 'redux/store';
import { ArrowBackIos } from '@material-ui/icons';
import { KITS_PRODUCTOS } from 'shared/constants/SubmenuOptions';

const cells = [
  {
    id: 'producto_s3_id',
    typeHead: 'string',
    label: 'Producto Interno',
    value: (value) => value,
    align: 'left',
    mostrarInicio: true,
  },
  {
    id: 'producto',
    typeHead: 'string',
    label: 'Producto Cliente',
    value: (value) => value,
    align: 'left',
    mostrarInicio: true,
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
    id: 'estado',
    typeHead: 'boolean',
    label: 'Estado',
    value: (value) => (value === 1 ? 'Activo' : 'Inactivo'),
    align: 'center',
    mostrarInicio: true,
    cellColor: (value) => (value === 1 ? 'green' : 'red'),
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
    titulo,
    onOpenAddKitProductos,
    handleOpenPopoverColumns,
    headers,
    permisos,
    onGoBack
  } = props;

  return (
    <Toolbar
      className={clsx(classes.root)}>
        <>
          <Box className={classes.titleTop}>
            <Tooltip title = 'Volver'>
              <ArrowBackIos
                style={{cursor: 'pointer', fontSize: 30}}
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
              {permisos.indexOf('CrearProK') >= 0 && (
                <Tooltip
                  title='Agregar Producto al Kit'
                  onClick={onOpenAddKitProductos}>
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
            <TextField
              label='Cliente'
              name='cliente'
              id='cliente'
              disabled
              value={headers?.cliente??''}
              className={classes.inputFiltros}
            />
            <TextField
              label='Kit'
              name='kit'
              id='kit'
              disabled
              value={headers?.nombre??''}
              className={classes.inputFiltros}
            />
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
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  btnRoot: {
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 5,
    marginBottom: 5,
    color: 'white',
    '&:hover': {
      backgroundColor: theme.palette.colorHover,
      cursor: 'pointer',
    },
  },
  btnPrymary: {
    backgroundColor: theme.palette.primary.main,
    marginRight: 10,
  },
  btnSecundary: {
    backgroundColor: theme.palette.grayBottoms,
  },
}));

const KitProductos = (props) => {
  const {kit_id, cliente_id} = useParams();
  const [showForm, setShowForm] = useState({
    added: false,
    temporal: false
  });
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
  const [productoKitTempSelected, setProductoKitTempSelected] = useState(0);
  const [productoKitSeleccionado, setProductoKitSeleccionado] =
    useState(0);
  const {rows, desde, hasta, ultima_pagina, total} = useSelector(
    ({kitProductosReducer}) => kitProductosReducer,
  );
  
  const kits = useSelector(({kitReducer}) => kitReducer.ligera);
  const productosInternos = useSelector(({productoReducer}) => productoReducer.ligera);
  const productos = useSelector(({productoClienteReducer}) => productoClienteReducer.ligera);

  const {message, error, messageType} = useSelector(({common}) => common);
  // const {pathname} = useLocation();
  const [openPopOver, setOpenPopOver] = useState(false);
  const [popoverTarget, setPopoverTarget] = useState(null);
  const [tempRows, setTempRows] = useState(rows);
  const [newTempRows, setNewTempRows] = useState([]);
  const {user} = useSelector(({auth}) => auth);
  const [permisos, setPermisos] = useState('');
  const [titulo, setTitulo] = useState('');
  const headers = kits.find((kit) => kit.id === parseInt(kit_id));

  useEffect(() => {
    dispatch(onGetKits());
    dispatch(onGetProductosInternos());
    dispatch(onGetProductos(cliente_id));
  },[]) // eslint-disable-line


  useEffect(() => {
    if (message) {
      if (messageType === DELETE_TYPE) {
        Swal.fire('Eliminado', message, 'success');
        updateColeccion();
      }
    }
  }, [message, error]); // eslint-disable-line react-hooks/exhaustive-deps
  
  const textoPaginacion = `Mostrando de ${desde??1} a ${hasta??tempRows.length} de ${total??1} resultados - Página ${page??1} de ${ultima_pagina??1}`;

  useEffect(() => {
    setTempRows(rows);
  },[rows]); // eslint-disable-line

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


  useEffect(() => {
    user &&
      user.permisos.forEach((modulo) => {
        modulo.opciones.forEach((opcion) => {
          if (opcion.url === '/kits') {
            setTitulo(`${opcion.nombre} - Componentes`);
            const permisoAux = [];
            opcion.permisos.forEach((permiso) => {
              const event = (perm) => perm.nombre === permiso.titulo;
              const aux = KITS_PRODUCTOS.some(event);
              if (permiso.permitido && aux) {
                 permisoAux.push(permiso.titulo);
              }
           });
           setPermisos(permisoAux.length>0?permisoAux:'');
          }
        });
      });
  }, [user, props.route]);

  useEffect(() => {
    dispatch(onGetColeccion(page, rowsPerPage, orderByToSend, kit_id));
  }, [dispatch, page, rowsPerPage, orderByToSend]); //eslint-disable-line

  const updateColeccion = () => {
    setPage(1);
    dispatch(onGetColeccion(page, rowsPerPage, orderByToSend, kit_id));
  };
  useEffect(() => {
    setPage(1);
  }, [orderByToSend]);

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

  const onOpenEditKitProductos = (id) => {
    setProductoKitSeleccionado(id);
    setAccion('editar');
    setShowForm({added: true, temporal: false});
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

  const onOpenViewKitProductos = (id) => {
    setProductoKitSeleccionado(id);
    setAccion('ver');
    setShowForm({added: true, temporal: false});
  };

  const addComponents = (component) => {
    const {
      producto_id,
      kit_id,
      cantidad,
      estado,
      producto_s3,
      producto_s3_id,
    } = component;
    const newComponents = [...tempRows];
    const newTempComponents = [...newTempRows];
    const isComponentInKit = newComponents.findIndex((newComponent) => newComponent.producto_s3_id === parseInt(producto_s3_id));
    if(isComponentInKit === -1){
      const newComponent = {
        id:'',
        producto_id:  parseInt(producto_id),
        kit_id: parseInt(kit_id),
        cantidad,
        producto_s3,
        producto_s3_id: parseInt(producto_s3_id),
        estado: parseInt(estado)
      }
      newComponents.push(newComponent);
      newTempComponents.push(newComponent);
      setTempRows(newComponents);
      setNewTempRows(newTempComponents);
    }
  }

  const onDeleteKitProductos = (id) => {
    Swal.fire({
      title: 'Confirmar',
      text: '¿Seguro Que Desea Eliminar El Producto del Kit?',
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

  const onOpenAddKitProductos = () => {
    setProductoKitSeleccionado(0);
    setAccion('crear');
    setShowForm({added: true, temporal: false});
  };

  const handleOnClose = () => {
    setShowForm({added: false, temporal: false});
    setProductoKitSeleccionado(0);
    setProductoKitTempSelected(0);
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
    if (newTempRows.length === 0 && rows.length === 0) {
      setShowTable(false);
    } else {
      setShowTable(true);
    }
  }, [rows, newTempRows]);

  const getProductName = (id) => {
    const producto = productos.find((producto) => producto.id === id);
    return producto?.nombre??'';
  }

  const getInternalProductName = (id) => {
    const productoInterno = productosInternos.find((producto) => producto.id === id);
    return productoInterno?.alias_producto??'';
  }

  const onRemoveTempComponent = (index) => {
    const tempComp = [...newTempRows];
    const tempComp2 = [...tempRows];
    tempComp.splice(index, 1);
    tempComp2.splice(index+rows.length, 1);
    setTempRows(tempComp2);
    setNewTempRows(tempComp);
  }

  const onViewTempComponent = (index) => {
    setAccion('ver');
    setShowForm({added: false, temporal: true});
    setProductoKitTempSelected(index);
  }

  const onEditTempComponent = (index) => {
    setAccion('editar');
    setShowForm({added: false, temporal: true});
    setProductoKitTempSelected(index);
  }

  const onUpdateTempComponents = (data) => {
    const {
      producto_id,
      kit_id,
      cantidad,
      estado,
      producto_s3,
      producto_s3_id,
      index
    } = data;
    const temporalRows = [...tempRows];
    const temporalRows2 = [...newTempRows];
    const currentRow = temporalRows2[index];
    temporalRows.splice(parseInt(index)+rows.length, 1, Object.assign(currentRow, {
      producto_id:  parseInt(producto_id),
      kit_id: parseInt(kit_id),
      cantidad,
      producto_s3,
      producto_s3_id: parseInt(producto_s3_id),
      estado: parseInt(estado)
    }))
    temporalRows2.splice(parseInt(index), 1, Object.assign(currentRow, {
      producto_id:  parseInt(producto_id),
      kit_id: parseInt(kit_id),
      cantidad,
      producto_s3,
      producto_s3_id: parseInt(producto_s3_id),
      estado: parseInt(estado)
    }))
    setTempRows(temporalRows);
    setNewTempRows(temporalRows2);
  }

  const onGoBack = () => {
    history.push('/kits');
  }

  const addComponentsToKit = () => {
    let contador = 0;
    const productosTipoBolsa = productosInternos.filter((producto) => producto.producto_empaque === 'S');
    productosTipoBolsa.forEach((row) => {
      const event = (el) => {
        const {
          producto_s3_id
        } = el;
        return producto_s3_id === row.id;
      }
      const aux = tempRows.some(event);
      if(aux){
        contador+=1;
      }
    })
    if(contador === 0){
      dispatch(fetchError('Debe añadir al menos un producto tipo empaque'))
      setTimeout(() => {
        dispatch(hideMessage());
      },5000)
    } else {
      dispatch(onCreate(kit_id, newTempRows, onGoBack));
    }
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        {permisos && (
          <EnhancedTableToolbar
            onOpenAddKitProductos={onOpenAddKitProductos}
            handleOpenPopoverColumns={handleOpenPopoverColumns}
            headers={headers}
            permisos={permisos}
            titulo={titulo}
            onGoBack={onGoBack}
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
                  rowCount={tempRows.length}
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
                            {permisos.indexOf('ListarProK') >= 0 && (
                              <Tooltip
                                title={<IntlMessages id='boton.editar' />}>
                                <EditIcon
                                  onClick={() =>
                                    onOpenEditKitProductos(row.id)
                                  }
                                  className={`${classes.generalIcons} ${classes.editIcon}`}></EditIcon>
                              </Tooltip>
                            )}
                            {permisos.indexOf('ModificarProK') >= 0 && (
                              <Tooltip title={<IntlMessages id='boton.ver' />}>
                                <VisibilityIcon
                                  onClick={() =>
                                    onOpenViewKitProductos(row.id)
                                  }
                                  className={`${classes.generalIcons} ${classes.visivilityIcon}`}></VisibilityIcon>
                              </Tooltip>
                            )}
                            {permisos.indexOf('EliminarProK') >= 0 && (
                              <Tooltip
                                title={<IntlMessages id='boton.eliminar' />}>
                                <DeleteIcon
                                  onClick={() =>
                                    onDeleteKitProductos(row.id)
                                  }
                                  className={`${classes.generalIcons} ${classes.deleteIcon}`}></DeleteIcon>
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
                                  value={
                                    columna.id === 'producto_s3_id' ?
                                    getInternalProductName(columna.value(row[columna.id])) :
                                    columna.value(row[columna.id])
                                  }
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
                  {
                    newTempRows.map((row, index) => {
                      return (
                        <TableRow
                          hover
                          tabIndex={-1}
                          key={index}
                          className={classes.row}>

                          <TableCell
                            align='center'
                            className={classes.acciones}>
                            {permisos.indexOf('Modificar') >= 0 && (
                              <Tooltip
                                title={<IntlMessages id='boton.editar' />}>
                                <EditIcon
                                  onClick={() =>
                                    onEditTempComponent(index)
                                  }
                                  className={`${classes.generalIcons} ${classes.editIcon}`}></EditIcon>
                              </Tooltip>
                            )}
                            {permisos.indexOf('Listar') >= 0 && (
                              <Tooltip title={<IntlMessages id='boton.ver' />}>
                                <VisibilityIcon
                                  onClick={() =>
                                    onViewTempComponent(index) 
                                  }
                                  className={`${classes.generalIcons} ${classes.visivilityIcon}`}></VisibilityIcon>
                              </Tooltip>
                            )}
                            {permisos.indexOf('Eliminar') >= 0 && (
                              <Tooltip
                                title={<IntlMessages id='boton.eliminar' />}>
                                <DeleteIcon
                                  onClick={() =>
                                    onRemoveTempComponent(index)
                                  }
                                  className={`${classes.generalIcons} ${classes.deleteIcon}`}></DeleteIcon>
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
                                  value={
                                    columna.id === 'producto' ?
                                    getProductName(columna.value(row['producto_id'])) :
                                    columna.id === 'producto_s3_id' ?
                                    columna.value(row['producto_s3']) :
                                    columna.value(row[columna.id])
                                  }
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
        { newTempRows.length > 0 && 
          <Box className={classes.marcoTabla}>
            <Box className={classes.buttonContainer}>
              <Button
                className={`${classes.btnRoot} ${classes.btnPrymary}`}
                variant='contained'
                onClick={addComponentsToKit}
              >
                <IntlMessages id='boton.submit' />
              </Button>
              <Button
                className={`${classes.btnRoot} ${classes.btnSecundary}`}
                onClick={onGoBack}>
                <IntlMessages id='boton.cancel' />
              </Button>
            </Box>
          </Box>
        }
      </Paper>

      {showForm.added ? (
        <KitProductosCreador
          showForm={showForm.added}
          productoKit={productoKitSeleccionado}
          kitId={kit_id}
          accion={accion}
          handleOnClose={handleOnClose}
          updateColeccion={updateColeccion}
          titulo={titulo}
          headers={headers}
          productosInternos={productosInternos}
          productos={productos}
          addComponents={addComponents}
        />
      ) : (
        ''
      )}

      {showForm.temporal ? (
        <KitProductosTempCreador
          showForm={showForm.temporal}
          productoKit={productoKitTempSelected}
          accion={accion}
          handleOnClose={handleOnClose}
          titulo={titulo}
          headers={headers}
          productosInternos={productosInternos}
          productos={productos}
          newTempRows={newTempRows}
          onUpdateTempComponents={onUpdateTempComponents}
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

export default KitProductos;
