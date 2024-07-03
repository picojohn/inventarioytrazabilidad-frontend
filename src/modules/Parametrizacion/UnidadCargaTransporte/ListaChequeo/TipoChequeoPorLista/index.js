import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormGroup,
  IconButton,
  TextField,
  Tooltip,
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
  FormControlLabel,
  Switch,
  Popover,
  lighten,
  makeStyles,
  Dialog,
  Slide
} from '@material-ui/core';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Pagination from '@material-ui/lab/Pagination';
import {
  onGetColeccionPorLista,
  onToogleCheck
} from 'redux/actions/TipoChequeoAction';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import IntlMessages from '@crema/utility/IntlMessages';
import MyCell from 'shared/components/MyCell';
import { useDebounce } from 'shared/hooks/useDebounce';
import { ClearAll } from '@material-ui/icons';
import { Fonts } from 'shared/constants/AppEnums';

const cells = [
  {
    id: 'nombre',
    typeHead: 'string',
    label: 'Nombre',
    value: (value) => value,
    align: 'left',
    mostrarInicio: true,
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
    gridTemplateColumns: '4fr 4fr 4fr 1fr',
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
    unidadCarga,
    tipoListaChequeo,
    modificable
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
            {'Tipos Chequeos Por Lista'}
          </Typography>
        </Box>
        <Box className={classes.contenedorFiltros}>
          <TextField
            label='Unidad de Carga'
            name='unidadCarga'
            id='unidadCarga'
            value={unidadCarga?.nombre??''}
            disabled
            className={classes.inputFiltros}
          />
          <TextField
            label='Tipo Lista Chequeo'
            name='tipoListaChequeo'
            id='tipoListaChequeo'
            value={tipoListaChequeo?.nombre??''}
            disabled
            className={classes.inputFiltros}
          />
          <TextField
            label='Nombre'
            name='nombre'
            id='nombre'
            onChange={queryFilter}
            value={filtros.nombre}
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
        <Box className={classes.contenedorFiltros2}>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filtros.soloSeleccionados}
                  name='soloSeleccionados'
                  onChange={queryFilter}
                  disabled={!modificable}
                  color='primary' 
                />
              }
              label='Solo Seleccionados'
            />
          </FormGroup>
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
    paddingLeft: '35px',
    paddingRight: '35px',
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

const initialState = {
  nombre: '',
  soloSeleccionados: false,
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='down' ref={ref} {...props} />;
});

const TipoChequePorLista = (props) => {
  const { 
    tipoListaChequeo, 
    unidadCarga, 
    show, 
    close,
    permisosT 
  } = props;
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('');
  const [orderByToSend, setOrderByToSend] = React.useState(
    'nombre:asc',
  );
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [filtros, setFiltros] = useState(initialState)
  const {
    nombre, 
    soloSeleccionados,
  } = filtros;
  const debouncedInitialSeries = useDebounce(nombre, 800);
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
  } = useSelector(({tipoChequeoReducer}) => tipoChequeoReducer.porLista);

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
  const [showTable, setShowTable] = useState(true);

  useEffect(() => {
    if (rows.length === 0)
      setShowTable(false);
    else
      setShowTable(true);
  }, [rows]);
  
  useEffect(() => {
    if(permisosT.length > 0 && !(permisosT.indexOf('Modificar') >= 0)){
      setFiltros({
        ...filtros,
        soloSeleccionados: true
      })    
    }
  }, [permisosT]); // eslint-disable-line

  useEffect(() => {
    if(tipoListaChequeo){
      dispatch(
        onGetColeccionPorLista(
          page,
          rowsPerPage,
          orderByToSend,
          tipoListaChequeo.id,
          nombre,
          soloSeleccionados,
        )
      );
    }
  }, [ // eslint-disable-line react-hooks/exhaustive-deps
    dispatch, 
    page, 
    rowsPerPage, 
    orderByToSend, 
    debouncedInitialSeries,
    soloSeleccionados,
    tipoListaChequeo
  ]);

  useEffect(() => {
    setPage(1);
  }, [
    orderByToSend,
    debouncedInitialSeries,
    soloSeleccionados,
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
      onGetColeccionPorLista(
        page,
        rowsPerPage,
        orderByToSend,
        tipoListaChequeo.id,
        nombre,
        soloSeleccionados,
      )
    );
  };

  const toogleCheck = (row) => {
    const datos = {
      tipo_chequeo_id: row.id,
      lista_chequeo_id: tipoListaChequeo?.id,
      unidad_carga_id: unidadCarga?.id,
    }
    dispatch(onToogleCheck(datos, updateColeccion));
  }

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const modificable = permisosT.indexOf('Modificar') >= 0;

  return (
    <Dialog
      open={show}
      onClose={close}
      aria-labelledby='simple-modal-title'
      TransitionComponent={Transition}
      aria-describedby='simple-modal-description'
      className={classes.dialogBox}
      maxWidth={'md'}
      fullWidth
    >
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <EnhancedTableToolbar
            queryFilter={queryFilter}
            filtros={filtros}
            limpiarFiltros={limpiarFiltros}
            unidadCarga={unidadCarga}
            tipoListaChequeo={tipoListaChequeo}
            modificable={modificable}
          />
          { showTable ? (
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
                              className={classes.acciones}
                            >
                              <Checkbox
                                checked={parseInt(row.checked) !== 0}
                                color='primary'
                                onClick={() => toogleCheck(row)}
                                disabled={!modificable}
                                inputProps={{ 'aria-labelledby': index }}
                              />
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

export default TipoChequePorLista;
