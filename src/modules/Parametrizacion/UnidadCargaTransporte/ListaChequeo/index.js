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
  Dialog,
  Slide,
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
  PlaylistAddCheck
} from '@material-ui/icons';
import ListaChequeoCreador from './ListaChequeoCreador';
import {
  onGetColeccion,
  onDelete,
} from 'redux/actions/ListaChequeoAction';
import {useDispatch, useSelector} from 'react-redux';
import IntlMessages from '@crema/utility/IntlMessages';
import Swal from 'sweetalert2';
import {
  DELETE_TYPE,
} from 'shared/constants/Constantes';
import {useDebounce} from 'shared/hooks/useDebounce';
import moment from 'moment';
import MyCell from 'shared/components/MyCell';
import { Fonts } from 'shared/constants/AppEnums';
import TipoChequePorLista from './TipoChequeoPorLista';

const cells = [
  {
    id: 'nombre',
    typeHead: 'string',
    label: 'Tipo Lista Chequeo',
    value: (value) => value,
    align: 'left',
    mostrarInicio: true,
  },
  {
    id: 'clase_inspeccion',
    typeHead: 'string',
    label: 'Clase Inspección',
    value: (value) => value,
    align: 'left',
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
  const {classes, order, orderBy, onRequestSort, columnasMostradas, permisosT} = props;

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
        { permisosT.length > 0 && (
          <TableCell
            align='center'
            style={{fontWeight: 'bold'}}
            className={classes.headCellWoMargin}>
            {'Tipos Chequeo'}
          </TableCell>
        )}
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
    onOpenAddTipoListaChequeo,
    handleOpenPopoverColumns,
    queryFilter,
    nombre,
    limpiarFiltros,
    unidadCarga,
    permisosL
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
              <Tooltip
                title='Mostrar/Ocultar Columnas'
                onClick={handleOpenPopoverColumns}>
                <IconButton
                  className={classes.columnFilterButton}
                  aria-label='filter list'>
                  <Tune />
                </IconButton>
              </Tooltip>
              {permisosL.indexOf('Crear') >= 0 && (
                <Tooltip
                  title='Crear Tipo Lista de Chequeo'
                  onClick={onOpenAddTipoListaChequeo}>
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
            <TextField
              label='Unidad de Carga/Transporte'
              name='unidadCarga'
              id='unidadCarga'
              disabled
              value={unidadCarga?.nombre??''}
              className={classes.inputFiltros}
            />
            <TextField
              label='Nombre'
              name='nombre'
              id='nombre'
              onChange={queryFilter}
              value={nombre}
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
  dialogBox: {
    position: 'relative',
    '& .MuiDialog-paperWidthSm': {
      maxWidth: 600,
      width: '100%',
      zIndex: '1000 !important'
      // maxHeight:'fit-content'
    },
    '& .MuiTypography-h6': {
      fontWeight: Fonts.LIGHT,
    },
  },
  swal2Container: {
    zIndex: '1350 !important'
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
  btnSecundary: {
    backgroundColor: theme.palette.grayBottoms,
  },
}));

const initialFilters = {
  nombre: ''
}

const initialShow = {
  creador: false,
  tiposChequeos: false
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='down' ref={ref} {...props} />;
});

const UnidadCargaTransporte = (props) => {
  const {
    showForm: show,
    unidadCargaTransporte,
    handleOnClose: close,
    titulo,
    permisosL,
    permisosT
  } = props;
  const [showForm, setShowForm] = useState(initialShow);
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
  const [tipoListaChequeoSeleccionado, setTipoListaChequeoSeleccionado] =
    useState(0);
  const {rows, desde, hasta, ultima_pagina, total} = useSelector(
    ({listaChequeoReducer}) => listaChequeoReducer,
  );

  const {message, error, messageType} = useSelector(({common}) => common);

  useEffect(() => {
    if (message) {
      if (messageType === DELETE_TYPE) {
        Swal.fire({
          title: 'Eliminada', 
          text: message, 
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK',
          target: document.getElementById('swalContainer')
        });
        updateColeccion();
      }
    }
  }, [message, error]); // eslint-disable-line react-hooks/exhaustive-deps

  const textoPaginacion = `Mostrando de ${desde} a ${hasta} de ${total} resultados - Página ${page} de ${ultima_pagina}`;
  const [filters, setFilters] = useState(initialFilters);
  const {
    nombre
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
  const [showTable, setShowTable] = useState(true);

  useEffect(() => {
    if (rows.length === 0) {
      setShowTable(false);
    } else {
      setShowTable(true);
    }
  }, [rows]);

  useEffect(() => {
    if(unidadCargaTransporte){
      dispatch(onGetColeccion(page, rowsPerPage, unidadCargaTransporte.id ,nombre, orderByToSend));
    }
  }, [page, rowsPerPage, debouncedName, orderByToSend, unidadCargaTransporte]); //eslint-disable-line

  const updateColeccion = () => {
    setPage(1);
    dispatch(onGetColeccion(page, rowsPerPage, unidadCargaTransporte.id, nombre, orderByToSend));
  };

  useEffect(() => {
    setPage(1);
  }, [debouncedName, orderByToSend]);

  const queryFilter = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    })
  }

  const limpiarFiltros = () => {
    setFilters(initialFilters);
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

  const onOpenEditTipoListaChequeo = (id) => {
    setTipoListaChequeoSeleccionado(id);
    setAccion('editar');
    setShowForm({
      ...initialShow,
      creador: true
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

  const onOpenViewUnidadCargaTransporte = (id) => {
    setTipoListaChequeoSeleccionado(id);
    setAccion('ver');
    setShowForm({
      ...initialShow,
      creador: true
    });
  };

  const onDeleteTipoListaChequeo = (id) => {
    Swal.fire({
      title: 'Confirmar',
      text: '¿Seguro Que Desea Eliminar El Tipo de Lista de Chequeo?',
      allowEscapeKey: false,
      allowEnterKey: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'NO',
      confirmButtonText: 'SI',
      target: document.getElementById('swalContainer')
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(onDelete(id));
      }
    });
  };

  const onOpenAddTipoListaChequeo = () => {
    setTipoListaChequeoSeleccionado(0);
    setAccion('crear');
    setShowForm({
      ...initialShow,
      creador: true
    });
  };

  const handleOnClose = () => {
    setShowForm(initialShow);
    setTipoListaChequeoSeleccionado(0);
    setAccion('ver');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const onOpenTiposChequeosPorLista = (row) => {
    setTipoListaChequeoSeleccionado(row);
    setShowForm({
      ...initialShow,
      tiposChequeos: true
    })
  }

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
              onOpenAddTipoListaChequeo={onOpenAddTipoListaChequeo}
              handleOpenPopoverColumns={handleOpenPopoverColumns}
              queryFilter={queryFilter}
              limpiarFiltros={limpiarFiltros}
              nombre={nombre}
              titulo={titulo}
              unidadCarga={unidadCargaTransporte}
              permisosL={permisosL}
            />
            {showTable ? (
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
                      permisosT={permisosT}
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
                                className={classes.acciones}
                              >
                                {permisosL.indexOf('Modificar') >= 0 && (
                                  <Tooltip
                                    title={<IntlMessages id='boton.editar' />}>
                                    <Edit
                                      onClick={() =>
                                        onOpenEditTipoListaChequeo(row.id)
                                      }
                                      className={`${classes.generalIcons} ${classes.editIcon}`}></Edit>
                                  </Tooltip>
                                )}
                                {permisosL.indexOf('Listar') >= 0 && (
                                  <Tooltip title={<IntlMessages id='boton.ver' />}>
                                    <Visibility
                                      onClick={() =>
                                        onOpenViewUnidadCargaTransporte(row.id)
                                      }
                                      className={`${classes.generalIcons} ${classes.visivilityIcon}`}></Visibility>
                                  </Tooltip>
                                )}
                                {permisosL.indexOf('Eliminar') >= 0 && (
                                  <Tooltip
                                    title={<IntlMessages id='boton.eliminar' />}>
                                    <Delete
                                      onClick={() =>
                                        onDeleteTipoListaChequeo(row.id)
                                      }
                                      className={`${classes.generalIcons} ${classes.deleteIcon}`}></Delete>
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
                              { permisosT.length > 0 && (
                                <TableCell align='center' className={classes.cell}>
                                  <Tooltip title={'Tipos de Chequeo'}>
                                    <Box style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                      <PlaylistAddCheck 
                                        onClick={() => onOpenTiposChequeosPorLista(row)}
                                        className={`${classes.generalIcons} ${classes.editIcon}`}
                                      />
                                    </Box>
                                  </Tooltip>
                                </TableCell>
                              )}
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
            ) : (
              <Box
                component='h2'
                padding={4}
                fontSize={19}
                className={classes.marcoTabla}>
                <IntlMessages id='sinResultados' />
              </Box>
            )}
          </Paper>
    
          {showForm.creador ? (
            <ListaChequeoCreador
              showForm={showForm.creador}
              tipoListaChequeo={tipoListaChequeoSeleccionado}
              unidadCarga={unidadCargaTransporte}
              accion={accion}
              handleOnClose={handleOnClose}
              updateColeccion={updateColeccion}
              titulo={titulo}
            />
          ) : (
            ''
          )}
          
          {showForm.tiposChequeos ? (
            <TipoChequePorLista
              show={showForm.tiposChequeos}
              tipoListaChequeo={tipoListaChequeoSeleccionado}
              unidadCarga={unidadCargaTransporte}
              close={handleOnClose}
              permisosT={permisosT}
            />
          ) : (
            ''
          )}

          <Box id='swalContainer' className={classes.swal2Container}></Box>
    
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
      <Box className={classes.bottomsGroup}>
        <Button
          className={`${classes.btnRoot} ${classes.btnSecundary}`}
          onClick={close}>
          <IntlMessages id='boton.cancel' />
        </Button>
      </Box>
    </Dialog>
  );
};

export default UnidadCargaTransporte;
