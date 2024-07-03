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
import {onGetColeccion} from '../../../redux/actions/ConsultaAuditoriaAction';
import VisibilityIcon from '@material-ui/icons/Visibility';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import Popover from '@material-ui/core/Popover';
import TuneIcon from '@material-ui/icons/Tune';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import TextField from '@material-ui/core/TextField';
import {useDispatch, useSelector} from 'react-redux';
import {useDebounce} from 'shared/hooks/useDebounce';
import MyCell from 'shared/components/MyCell';

const cells = [
  {
    id: 'id_recurso',
    typeHead: 'numeric',
    label: 'ID Recurso',
    value: (value) => value,
    align: 'right',
    mostrarInicio: true,
  },
  {
    id: 'nombre_recurso',
    typeHead: 'string',
    label: 'Nombre Recurso',
    value: (value) => value.substring(value.lastIndexOf('\\') + 1),
    align: 'left',
    mostrarInicio: true,
  },
  {
    id: 'descripcion_recurso',
    typeHead: 'string',
    label: 'Descripción Recurso',
    value: (value) => value,
    align: 'left',
    mostrarInicio: true,
  },
  {
    id: 'accion',
    typeHead: 'string',
    label: 'Acción',
    value: (value) => value,
    align: 'left',
    mostrarInicio: true,
  },
  {
    id: 'responsable_nombre',
    typeHead: 'string',
    label: 'Responsable',
    value: (value) => value,
    align: 'left',
    mostrarInicio: true,
  },
  {
    id: 'fecha',
    typeHead: 'string',
    label: 'Fecha',
    value: (value) => value,
    align: 'left',
    mostrarInicio: true,
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
    gridTemplateColumns: '4fr 4fr 4fr 1fr',
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
    titulo,
    handleOpenPopoverColumns,
    queryFilter,
    nombreRecursoFiltro,
    descripcionRecursoFiltro,
    accionFiltro,
    fechaHastaFiltro,
    fechaDesdeFiltro,
    limpiarFiltros,
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
            </Box>
          </Box>
          <Box className={classes.contenedorFiltros}>
            <TextField
              label='Nombre Recurso'
              name='nombreRecursoFiltro'
              id='nombreRecursoFiltro'
              onChange={queryFilter}
              value={nombreRecursoFiltro}
              className={classes.inputFiltros}
            />
            <TextField
              label='Descripción Recurso'
              name='descripcionRecursoFiltro'
              id='descripcionRecursoFiltro'
              onChange={queryFilter}
              value={descripcionRecursoFiltro}
              className={classes.inputFiltros}
            />
            <TextField
              label='Acción'
              name='accionFiltro'
              id='accionFiltro'
              onChange={queryFilter}
              value={accionFiltro}
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
            <TextField
              label='Fecha Desde'
              name='fechaDesdeFiltro'
              id='fechaDesdeFiltro'
              onChange={queryFilter}
              type='date'
              InputLabelProps={{
                shrink: true,
              }}
              value={fechaDesdeFiltro}
              className={classes.inputFiltros}
            />
            <TextField
              label='Fecha Hasta'
              name='fechaHastaFiltro'
              id='fechaHastaFiltro'
              type='date'
              InputLabelProps={{
                shrink: true,
              }}
              onChange={queryFilter}
              value={fechaHastaFiltro}
              className={classes.inputFiltros}
            />
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

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
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

const ConsultaAuditoria = (props) => {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('');
  const [orderByToSend, setOrderByToSend] = React.useState('fecha:desc');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const dense = true; //Borrar cuando se use el change

  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const rowsPerPageOptions = [5, 10, 15, 25, 50];

  const {rows, desde, hasta, ultima_pagina, total} = useSelector(
    ({consultaAuditoriaReducer}) => consultaAuditoriaReducer,
  );
  const textoPaginacion = `Mostrando de ${desde} a ${hasta} de ${total} resultados - Página ${page} de ${ultima_pagina}`;
  const [nombreRecursoFiltro, setNombreRecursoFiltro] = useState('');
  const [descripcionRecursoFiltro, setDescripcionRecursoFiltro] = useState('');
  const [accionFiltro, setAccionFiltro] = useState('');
  const [fechaHastaFiltro, setFechaHastaFiltro] = useState('');
  const [fechaDesdeFiltro, setFechaDesdeFiltro] = useState('');
  const debouncedResourceName = useDebounce(nombreRecursoFiltro, 800);
  const debouncedResourceDes = useDebounce(descripcionRecursoFiltro, 800);
  const debouncedAction = useDebounce(accionFiltro, 800);
  const debouncedInitialDate = useDebounce(fechaHastaFiltro, 800);
  const debouncedFinalDate = useDebounce(fechaDesdeFiltro, 800);
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
  }, [user, props.route]);

  useEffect(() => {
    dispatch(
      onGetColeccion(
        page,
        rowsPerPage,
        orderByToSend,
        nombreRecursoFiltro,
        descripcionRecursoFiltro,
        fechaDesdeFiltro,
        fechaHastaFiltro,
        accionFiltro,
      ),
    );
  }, [ // eslint-disable-line react-hooks/exhaustive-deps
    dispatch,
    page,
    rowsPerPage,
    debouncedResourceName,
    debouncedResourceDes,
    debouncedAction,
    debouncedInitialDate,
    debouncedFinalDate,
    orderByToSend,
  ]);

  useEffect(() => {
    setPage(1);
  }, [
    debouncedResourceName,
    debouncedResourceDes,
    orderByToSend,
    debouncedAction,
    debouncedInitialDate,
    debouncedFinalDate,
  ]);

  const queryFilter = (e) => {
    switch (e.target.name) {
      case 'descripcionRecursoFiltro':
        setDescripcionRecursoFiltro(e.target.value);
        break;
      case 'nombreRecursoFiltro':
        setNombreRecursoFiltro(e.target.value);
        break;
      case 'fechaDesdeFiltro':
        setFechaDesdeFiltro(e.target.value);
        break;
      case 'fechaHastaFiltro':
        setFechaHastaFiltro(e.target.value);
        break;
      case 'accionFiltro':
        setAccionFiltro(e.target.value);
        break;
      default:
        break;
    }
  };

  const limpiarFiltros = () => {
    setNombreRecursoFiltro('');
    setDescripcionRecursoFiltro('');
    setFechaDesdeFiltro('');
    setFechaHastaFiltro('');
    setAccionFiltro('');
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

  const [showTable, setShowTable] = useState(true);
  useEffect(() => {
    if (rows.length === 0) {
      setShowTable(false);
    } else {
      setShowTable(true);
    }
  }, [rows]);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        {permisos && (
          <EnhancedTableToolbar
            numSelected={selected.length}
            handleOpenPopoverColumns={handleOpenPopoverColumns}
            queryFilter={queryFilter}
            limpiarFiltros={limpiarFiltros}
            accionFiltro={accionFiltro}
            fechaHastaFiltro={fechaHastaFiltro}
            fechaDesdeFiltro={fechaDesdeFiltro}
            nombreRecursoFiltro={nombreRecursoFiltro}
            descripcionRecursoFiltro={descripcionRecursoFiltro}
            permisos={permisos}
            titulo={titulo}
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
                  {rows.map((row, index) => {
                    const isItemSelected = isSelected(row.name);
                    return (
                      <>
                        <TableRow
                          hover
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          selected={isItemSelected}
                          className={classes.row}>
                          <TableCell
                            align='center'
                            className={classes.acciones}>
                            {permisos.indexOf('Listar') >= 0 && (
                              <Tooltip title={<IntlMessages id='boton.ver' />}>
                                <VisibilityIcon
                                  onClick={() => {
                                    if (
                                      document.getElementById(row.id).style
                                        .display === 'none'
                                    ) {
                                      document.getElementById(row.id).style =
                                        'display:table-row';
                                    } else {
                                      document.getElementById(row.id).style =
                                        'display:none';
                                    }
                                  }}
                                  className={`${classes.generalIcons} ${classes.visivilityIcon}`}></VisibilityIcon>
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

                        <TableRow
                          id={row.id}
                          tabIndex={-1}
                          key={row.id + '-description'}
                          style={{display: 'none'}}>
                          <TableCell
                            colSpan={columnasMostradas.length + 1}
                            width='100%'>
                            <Box
                              display='grid'
                              gridTemplateColumns='repeat(2,1fr)'>
                              {row.recurso_original && (
                                <Box>
                                  <Box component='h4'>Recurso Original</Box>
                                  <Table>
                                    <TableBody>
                                      <TableRow hover className={classes.row}>
                                        <TableCell className={classes.cell}>
                                          <Box component='h5'>Campo</Box>
                                        </TableCell>
                                        <TableCell className={classes.cell}>
                                          <Box component='h5'>Valor</Box>
                                        </TableCell>
                                      </TableRow>
                                      {Object.keys(
                                        JSON.parse(row.recurso_original),
                                      ).map((key) => {
                                        return (
                                          <TableRow
                                            hover
                                            className={classes.row}>
                                            <TableCell className={classes.cell}>
                                              <Box
                                                component='p'
                                                fontWeight={
                                                  row.recurso_original &&
                                                  row.recurso_resultante &&
                                                  JSON.parse(
                                                    row.recurso_resultante,
                                                  )[key] !==
                                                    JSON.parse(
                                                      row.recurso_original,
                                                    )[key]
                                                    ? 'bold'
                                                    : 'normal'
                                                }>
                                                {key}
                                              </Box>
                                            </TableCell>
                                            <TableCell className={classes.cell}>
                                              <Box
                                                component='p'
                                                fontWeight={
                                                  row.recurso_original &&
                                                  row.recurso_resultante &&
                                                  JSON.parse(
                                                    row.recurso_resultante,
                                                  )[key] !==
                                                    JSON.parse(
                                                      row.recurso_original,
                                                    )[key]
                                                    ? 'bold'
                                                    : 'normal'
                                                }>
                                                {typeof JSON.parse(
                                                  row.recurso_original,
                                                )[key] === 'object'
                                                  ? ''
                                                  : JSON.parse(
                                                      row.recurso_original,
                                                    )[key]}
                                              </Box>
                                            </TableCell>
                                          </TableRow>
                                        );
                                      })}
                                    </TableBody>
                                  </Table>
                                </Box>
                              )}
                              {row.recurso_resultante && (
                                <Box>
                                  <Box component='h4'>Recurso Resultante</Box>
                                  <Table>
                                    <TableBody>
                                      <TableRow hover className={classes.row}>
                                        <TableCell className={classes.cell}>
                                          <Box component='h5'>Campo</Box>
                                        </TableCell>
                                        <TableCell className={classes.cell}>
                                          <Box component='h5'>Valor</Box>
                                        </TableCell>
                                      </TableRow>
                                      {Object.keys(
                                        JSON.parse(row.recurso_resultante),
                                      ).map((key) => {
                                        return (
                                          <TableRow
                                            hover
                                            className={classes.row}>
                                            <TableCell className={classes.cell}>
                                              <Box
                                                component='p'
                                                fontWeight={
                                                  JSON.parse(
                                                    row.recurso_resultante,
                                                  )[key] !==
                                                  JSON.parse(
                                                    row.recurso_original,
                                                  )[key]
                                                    ? 'bold'
                                                    : 'normal'
                                                }>
                                                {key}
                                              </Box>
                                            </TableCell>
                                            <TableCell className={classes.cell}>
                                              <Box
                                                component='p'
                                                fontWeight={
                                                  JSON.parse(
                                                    row.recurso_resultante,
                                                  )[key] !==
                                                  JSON.parse(
                                                    row.recurso_original,
                                                  )[key]
                                                    ? 'bold'
                                                    : 'normal'
                                                }>
                                                {typeof JSON.parse(
                                                  row.recurso_resultante,
                                                )[key] === 'object'
                                                  ? ''
                                                  : JSON.parse(
                                                      row.recurso_resultante,
                                                    )[key]}
                                              </Box>
                                            </TableCell>
                                          </TableRow>
                                        );
                                      })}
                                    </TableBody>
                                  </Table>
                                </Box>
                              )}
                            </Box>
                          </TableCell>
                        </TableRow>
                      </>
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

export default ConsultaAuditoria;
