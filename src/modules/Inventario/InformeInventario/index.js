import React, {useState, useEffect} from 'react';
import {Box, Button} from '@material-ui/core';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {lighten, makeStyles} from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
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
import {onGetColeccionLigera as ligeraLugares} from 'redux/actions/LugarAction';
import {onGetColeccionLigera as ligeraUsuarios} from 'redux/actions/LugarUsuarioAction';
import {onGetColeccionLigera as onGetClientes} from 'redux/actions/ClienteAction';
import {useDispatch, useSelector} from 'react-redux';
import Popover from '@material-ui/core/Popover';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { Form, Formik } from 'formik';
import { InsertDriveFile } from '@material-ui/icons';
import defaultConfig from '@crema/utility/ContextProvider/defaultConfig';

const cells = [
  {
    id: 'lugar',
    typeHead: 'string',
    label: 'Lugar',
    value: (value) => value,
    align: 'left',
    mostrarInicio: true,
  },
  {
    id: 'usuario',
    typeHead: 'string',
    label: 'Usuario',
    value: (value) => value,
    align: 'left',
    mostrarInicio: true,
  },
  {
    id: 'nombre',
    typeHead: 'string',
    label: 'Producto/Kit',
    value: (value) => value,
    align: 'left',
    mostrarInicio: true,
  },
  {
    id: 'stock_minimo',
    typeHead: 'string',
    label: 'Stock Mínimo',
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
    gridTemplateColumns: '1fr 1fr 1fr 1fr',
    gap: '20px',
  },
  pairFilters: {
    display: 'flex',
    justifyContent: 'flex-start',
    gap: '20px',
    minWidth: '100px',
  },
  exportButton: {
    backgroundColor: '#4caf50',
    color: 'white',
    boxShadow:
      '0px 3px 5px -1px rgb(0 0 0 / 30%), 0px 6px 10px 0px rgb(0 0 0 / 20%), 0px 1px 18px 0px rgb(0 0 0 / 16%)',
    '&:hover': {
      backgroundColor: theme.palette.colorHover,
      cursor: 'pointer',
    },
  },
  x: {
    position: 'absolute',
    color: '#4caf50',
    fontSize: '14px',
    top: '19px',
    fontWeight: 'bold',
  },}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const {
    permisos,
    numSelected,
    titulo,
    queryFilter,
    lugar,
    usuario,
    lugares,
    usuarios,
    limpiarFiltros,
    interno,
    user,
    cliente,
    clientes
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
            <Formik>
                <Form>
                  {permisos.indexOf('Exportar') >= 0 && (
                    <Tooltip
                      title='Exportar'
                      component='a'
                      className={classes.linkDocumento}
                      href={
                        defaultConfig.API_URL +
                        '/exportar-inventario' +
                        '?lugar=' +
                        lugar +
                        '&usuario=' +
                        usuario +
                        '&cliente=' +
                        (user?.rol?.tipo === 'IN' ? (cliente ? cliente : user?.asociado?.id ) : user?.asociado?.id)
                      }>
                    <IconButton
                        className={classes.exportButton}
                        aria-label='filter list'>
                        <Box component='span' className={classes.x}>
                          X
                        </Box>
                        <InsertDriveFile />
                      </IconButton>
                    </Tooltip>
                  )}
                </Form>
              </Formik>
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
              className={classes.inputFiltros}
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
              {usuarios.filter(usuario=>lugar===''|lugar===undefined|usuario.lugar_id===lugar).map((usuario) => {
                return (
                  <MenuItem
                    value={usuario.usuario_id}
                    key={usuario.id}
                    id={usuario.id}
                    className={classes.pointer}>
                    {usuario.nombre}
                  </MenuItem>
                );
              })}
            </TextField>
            { interno && (
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
            )}
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

const initialFilters = {
  lugar: '',
  usuario: '',
  cliente: ''
};

const InformeInventario = (props) => {
  const [filters, setFilters] = useState(initialFilters);
  const {
    lugar,
    usuario,
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
  const classes = useStyles({vp: vp});
  const dispatch = useDispatch();

  const {user} = useSelector(({auth}) => auth);
  const [permisos, setPermisos] = useState('');
  const [titulo, setTitulo] = useState('');

  const lugares = useSelector(({lugarReducer}) => lugarReducer.ligera);
  const usuarios = useSelector(({lugarUsuarioReducer}) => lugarUsuarioReducer.ligera);
  const clientes = useSelector(({clienteReducer}) => clienteReducer.ligera);

  useEffect(() => {
    if (user?.rol?.tipo !== 'IN' && user?.rol?.tipo !== 'AC'){
        const temp = usuarios.find((usuario) => usuario.usuario_id === user.id);
        if (temp!==undefined){
            setFilters({
              ...filters,
              lugar: temp.lugar_id,
              usuario: user.id
            });
        }
    }
    setInterno(user.rol.tipo==='IN' || user.rol.tipo==='AC')
  }, [ // eslint-disable-line
    user,
    usuarios,
    lugares
  ]) 


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
    if(user?.rol?.tipo === 'IN'){
      dispatch(onGetClientes());
      setFilters({
        ...filters,
        cliente: user.asociado.id
      })
    }
  }, [user, props.route]); // eslint-disable-line

  useEffect(() => {
    dispatch(ligeraLugares());
    dispatch(ligeraUsuarios());
  }, []); // eslint-disable-line

  useEffect(()=>{
    if (user.rol.tipo==='IN'){
      if ((lugar==='' || lugar===undefined)&&(usuario!=='' && usuario!==undefined)){
        const temp = usuarios.find((usuario) => usuario.usuario_id === usuario);
        if (temp!==undefined){
            setFilters({
              ...filters,
              lugar: temp.lugar_id
            });
        }
      }
    }
  },[usuario,lugar,usuarios,user.rol.tipo]) // eslint-disable-line

  const queryFilter = (e) => {
    if(e.target.name === 'cliente'){
      setFilters({
        ...initialFilters,
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
    setFilters(initialFilters);
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

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        {permisos && (
          <EnhancedTableToolbar
            numSelected={0}
            handleOpenPopoverColumns={handleOpenPopoverColumns}
            queryFilter={queryFilter}
            limpiarFiltros={limpiarFiltros}
            lugar={lugar}
            usuario={usuario}
            lugares={lugares}
            usuarios={usuarios}
            interno={interno}
            titulo={titulo}
            permisos={permisos}
            user={user}
            cliente={cliente}
            clientes={clientes}
          />
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

export default InformeInventario;
