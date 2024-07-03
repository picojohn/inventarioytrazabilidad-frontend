import React, {useState, useEffect} from 'react';
import {
  Box, 
  Toolbar,
  Typography,
  Paper,
  Tooltip,
  TextField,
  makeStyles,
  FormLabel,
  RadioGroup,
  FormControl,
  FormControlLabel,
  Radio,
  IconButton,
  MenuItem
} from '@material-ui/core';
import clsx from 'clsx';
import EventosPorLugar from './EventosPorLugar';
import {useDispatch, useSelector} from 'react-redux';
import {
  Search,
} from '@material-ui/icons';
import IntlMessages from '@crema/utility/IntlMessages';
import { Form, Formik } from 'formik';
import InstalacionesPorProducto from './InstacionesPorProducto';
import InstalacionesXLugarXProducto from './InstalacionesXLugarXProducto';
import { onGetDataForConsulta, onLeaveBitacora } from 'redux/actions/SelloAction';
import {onGetColeccionLigera as onGetClientes} from 'redux/actions/ClienteAction';

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    padding: '15px',
    backgroundColor: 'white',
    boxShadow: '0px 0px 5px 5px rgb(0 0 0 / 10%)',
    borderRadius: '4px',
    display: 'grid',
    // gap: '20px',
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
  contenedorFiltros: {
    width: '90%',
    display: 'grid',
    gridTemplateColumns: '2fr 2fr 2fr 1fr',
    gap: '20px',
    paddingLeft: 15,
  },
}));

const options = [
  {label: 'Eventos Por Lugar', value: 'epl'},
  {label: 'Instalaciones Por Producto', value: 'ipp'},
  {label: 'Instalaciones Por Lugar y Producto', value: 'ilp'},
];

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const {
    titulo,
    queryFilter,
    fechaInicial,
    fechaFinal,
    tipoConsulta,
    getData,
    clientes,
    cliente,
    user
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
            <Formik>
              <Form>
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
            label='Fecha Inicial'
            name='fechaInicial'
            id='fechaInicial'
            type='date'
            InputLabelProps={{
              shrink: true
            }}
            required
            onChange={queryFilter}
            value={fechaInicial}
          />
          <TextField
            label='Fecha Final'
            name='fechaFinal'
            id='fechaFinal'
            type='date'
            InputLabelProps={{
              shrink: true
            }}
            required
            onChange={queryFilter}
            value={fechaFinal}
          />
          <Box display='grid'>
            <Box display='flex' mb={2}>
              <Tooltip 
                title='Buscar' 
                onClick={() => {
                  getData(tipoConsulta)
                }}
              >
                <IconButton
                  className={classes.createButton}
                  aria-label='filter list'>
                  <Search />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
        <Box>
          <FormControl component='fieldset'>
            <FormLabel />
            <RadioGroup row name='tipoConsulta' value={tipoConsulta} onChange={queryFilter}>
              {options.map((option, index) => {
                return (
                  <FormControlLabel
                    key={index}
                    value={option.value}
                    control={<Radio color='primary' />}
                    label={option.label}
                    labelPlacement='start'
                  />
                );
              })}
            </RadioGroup>
          </FormControl>
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
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
    boxShadow: 'none',
    backgroundColor: 'transparent',
  },
}));

const initialFilters = {
  fechaInicial: '',
  fechaFinal: '',
  tipoConsulta: '',
  cliente: '',
}

const ConsultaTotales = (props) => {
  const dense = true; //Borrar cuando se use el change
  const {ipp, ilp, epl} = useSelector(({selloReducer}) => selloReducer.consultas);
  const clientes = useSelector(({clienteReducer}) => clienteReducer.ligera);
  const {data: dataIpp} = ipp;
  const {data: dataIlp} = ilp;
  const {data: dataEpl} = epl;
  const [filters, setFilters] = useState(initialFilters);
  const {
    fechaInicial,
    fechaFinal,
    tipoConsulta,
    cliente
  } = filters;

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
    if(user?.rol?.tipo === 'IN'){
      dispatch(onGetClientes());
    }
    setFilters({
      ...filters,
      cliente: user.asociado.id
    })
  }, [user, props.route]); // eslint-disable-line

  useEffect(() => {
    return () => dispatch(onLeaveBitacora());
  },[]); // eslint-disable-line

  const queryFilter = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    })
  }
  
  const getData = (tipo) => {
    if(countFilters()){
      dispatch(onGetDataForConsulta(tipo, fechaInicial, fechaFinal, cliente));
    }
  }

  const countFilters = () => {
    const even = (ev) => ev !== '';
    return Object.values(filters).every(even);
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        {permisos && (
          <EnhancedTableToolbar
            queryFilter={queryFilter}
            fechaInicial={fechaInicial}
            fechaFinal={fechaFinal}
            tipoConsulta={tipoConsulta}
            titulo={titulo}
            getData={getData}
            cliente={cliente}
            clientes={clientes}
            user={user}
          />
        )}
        { permisos ? (
          <Box className={classes.marcoTabla}>
            {dataEpl?.length > 0 && (
              <EventosPorLugar
                titulo={titulo}
                data={dataEpl}
              />
            )}
            {dataIpp?.length > 0 && (
              <InstalacionesPorProducto
                titulo={titulo}
                data={dataIpp}
              />
            )}
            {dataIlp?.length > 0 && (
              <InstalacionesXLugarXProducto
                titulo={titulo}
                data={dataIlp}
              />
            )}
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
    </div>
  );
};

export default ConsultaTotales;
