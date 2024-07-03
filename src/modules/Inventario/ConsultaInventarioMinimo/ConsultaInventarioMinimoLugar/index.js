import React, {useState, useEffect} from 'react';
import {Box, Button, Dialog, Slide} from '@material-ui/core';
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
import ConsultaInventarioCreator from './ConsultaInventarioMinimoLugarDetalle';
import {
  onGetInventarioLugar,
} from 'redux/actions/SelloAction';
import {useDispatch, useSelector} from 'react-redux';
import VisibilityIcon from '@material-ui/icons/Visibility';
import IntlMessages from '@crema/utility/IntlMessages';
import Popover from '@material-ui/core/Popover';
import TuneIcon from '@material-ui/icons/Tune';
import TextField from '@material-ui/core/TextField';
import MyCell from 'shared/components/MyCell';
import { Scrollbar } from '@crema';


const cells = [
  {
    id: 'usuario',
    typeHead: 'string',
    label: 'Usuario',
    value: (value) => value,
    align: 'left',
    mostrarInicio: true,
  },
  {
    id: 'cantidad',
    typeHead: 'string',
    label: 'Cantidad',
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
    gridTemplateColumns: '4fr 4fr 1fr 1fr',
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
    consultaInventario
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
            label='Lugar'
            name='lugar'
            id='lugar'
            value={consultaInventario?.lugar??''}
            disabled
          />
          <TextField
            label='Producto/Kit'
            name='producto_kit'
            id='producto_kit'
            value={consultaInventario?.nombre??''}
            disabled
          />
          <TextField
            label='Cantidad'
            name='cantidad'
            id='cantidad'
            value={consultaInventario?.cantidad??''}
            disabled
          />
          <TextField
            label='Stock Mínimo'
            name='stock'
            id='stock'
            value={consultaInventario?.stock_minimo??''}
            disabled
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
  dialogBox: {
    position: 'relative',
    '& .MuiDialog-paperWidthSm': {
      maxWidth: 800,
      width: '100%',
      // maxHeight:'fit-content'
    },
    '& .MuiTypography-h6': {
      fontWeight: 'light',
    },
  },
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
    padding: '10px 20px',
  },
  scrollbar: {
    minWidth: '800px'
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
  btnPrymary: {
    backgroundColor: theme.palette.primary.main,
  },
  btnSecundary: {
    backgroundColor: theme.palette.grayBottoms,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='down' ref={ref} {...props} />;
});

const ConsultaInventarioMinimoLugar = (props) => {
  const {
    showForm: showDialog,
    consultaInventario,
    handleOnClose: handleOnCloseDialog,
    updateColeccion,
    titulo
  } = props;
  const [showForm, setShowForm] = useState(false);
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
  const [consultaInventarioSeleccionado, setConsultaInventarioSeleccionado] = useState(0);
  const {rows, desde, hasta, ultima_pagina, total} = useSelector(
    ({selloReducer}) => selloReducer.inventarioLugar,
    );
  const textoPaginacion = `Mostrando de ${desde} a ${hasta} de ${total} resultados - Página ${page} de ${ultima_pagina}`;
  const [openPopOver, setOpenPopOver] = useState(false);
  const [popoverTarget, setPopoverTarget] = useState(null);
  const [showTable, setShowTable] = useState(true);

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
    if (rows.length === 0) {
      setShowTable(false);
    } else {
      setShowTable(true);
    }
  }, [rows]);

  useEffect(() => {
    if(consultaInventario){
      dispatch(
        onGetInventarioLugar(
          page,
          rowsPerPage,
          orderByToSend,
          consultaInventario?.lugar_id??'',
          consultaInventario?.kit_id ? consultaInventario?.kit_id : consultaInventario?.producto_id,
          consultaInventario?.kit_id ? 'K' : 'P',
        ),
      );
    }
  }, [ // eslint-disable-line react-hooks/exhaustive-deps
    dispatch,
    page,
    rowsPerPage,
    orderByToSend,
    showForm,
    consultaInventario
  ]);

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

  const onOpenViewConsultaInventario = (row) => {
    setConsultaInventarioSeleccionado(row);
    setAccion('ver');
    setShowForm(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const handleOnClose = () => {
    setShowForm(false);
    setConsultaInventarioSeleccionado(0);
    setAccion('ver');
  };

  return (
    <Dialog
      open={showDialog}
      onClose={handleOnCloseDialog}
      aria-labelledby='simple-modal-title'
      TransitionComponent={Transition}
      aria-describedby='simple-modal-description'
      className={classes.dialogBox}
      maxWidth={'xl'}
    >
      <Scrollbar className={classes.scrollbar}>
        <div className={classes.root}>
          <Paper className={classes.paper}>
            <EnhancedTableToolbar
              handleOpenPopoverColumns={handleOpenPopoverColumns}
              titulo={titulo}
              consultaInventario={consultaInventario}
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
                              <Tooltip title={<IntlMessages id='boton.ver' />}>
                                <VisibilityIcon
                                  onClick={() => onOpenViewConsultaInventario(row)}
                                  className={`${classes.generalIcons} ${classes.visivilityIcon}`}></VisibilityIcon>
                              </Tooltip>                              
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
            ):(
              <Box
                component='h2'
                padding={4}
                fontSize={19}
                className={classes.marcoTabla}>
                <IntlMessages id='sinResultados' />
              </Box>
            )}
          </Paper>

          {showForm ? (
            <ConsultaInventarioCreator
              showForm={showForm}
              consultaInventario={consultaInventarioSeleccionado}
              accion={accion}
              handleOnClose={handleOnClose}
              updateColeccion={updateColeccion}
              titulo={titulo}
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
        <Box className={classes.bottomsGroup}>
          <Button
            className={`${classes.btnRoot} ${classes.btnSecundary}`}
            onClick={handleOnCloseDialog}>
            <IntlMessages id='boton.cancel' />
          </Button>
        </Box>
      </Scrollbar>
    </Dialog>
  );
};

export default ConsultaInventarioMinimoLugar;