import React, {useState, useEffect} from 'react';
import {
  Box, 
  Paper,
  makeStyles
} from '@material-ui/core';
import InstalacionDetalle from './InstalacionDetalle';
import {onGetColeccionLigera as ligeraLugares} from 'redux/actions/LugarAction';
import {onGetColeccionLigera as ligeraUsuarios} from 'redux/actions/LugarUsuarioAction';
import {onGetColeccionLigera as getOperacionesEmbarque} from 'redux/actions/TipoEventoAction';
import {onGetColeccionLigera as getContenedores} from 'redux/actions/ContenedorAction';
import {onGetColeccionLigera as getZonas} from 'redux/actions/ZonaContenedorAction';
import {onGetColeccionLigera as getProductos} from 'redux/actions/ProductoClienteAction';
import {onGetColeccionLigera as getClientes} from 'redux/actions/ClienteAction';
import {useDispatch, useSelector} from 'react-redux';
import IntlMessages from '@crema/utility/IntlMessages';
import { MessageView } from '@crema';
import { CREATE_TYPE} from 'shared/constants/Constantes';
import { onGetColeccionInstalacion } from 'redux/actions/SelloAction';
import Loading from 'shared/components/Loading';

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
  }
}));

let hUrl = '';

const Instalacion = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  
  const {user} = useSelector(({auth}) => auth);
  const {message, error, messageType, updatingContent} = useSelector(({common}) => common);
  const [permisos, setPermisos] = useState('');
  const [titulo, setTitulo] = useState('');
  
  const operacionesEmbarque = useSelector(({tipoEventoReducer}) => tipoEventoReducer.ligera);
  const contenedores = useSelector(({contenedorReducer}) => contenedorReducer.ligera);
  const lugares = useSelector(({lugarReducer}) => lugarReducer.ligera);
  const zonas = useSelector(({zonaContenedorReducer}) => zonaContenedorReducer.ligera);
  const productos = useSelector(({productoClienteReducer}) => productoClienteReducer.ligera);
  const clientes = useSelector(({clienteReducer}) => clienteReducer.ligera);
  // const usuarios = useSelector(({lugarUsuarioReducer}) => lugarUsuarioReducer.ligera);

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
  }, [user, props.route]);
  
  useEffect(() => {
    dispatch(onGetColeccionInstalacion());
    dispatch(getClientes());
    dispatch(ligeraUsuarios());
  }, []); // eslint-disable-line
  
  useEffect(() => {
    if(user?.asociado && clientes.length > 0){
      const cliente = clientes.find((cus) => cus.id === user.asociado.id);
      if(cliente){
        dispatch(getProductos(cliente.id));
        if(cliente.indicativo_operaciones_embarque === 'S') {
          dispatch(getOperacionesEmbarque());
        }
        if(cliente.indicativo_registro_lugar_instalacion === 'S') {
          dispatch(ligeraLugares(cliente.id));
        }
        if(cliente.indicativo_registro_zona_instalacion === 'S') {
          dispatch(getZonas());
        }
        if(cliente.indicativo_instalacion_contenedor === 'S') {
          dispatch(getContenedores());
        }
      }
    }
  }, [ // eslint-disable-line
    user,
    clientes
  ])

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        {permisos.length > 0 ? (
          <Box className={classes.marcoTabla}>
            <InstalacionDetalle
              titulo={titulo}
              operacionesEmbarque={operacionesEmbarque}
              contenedores={contenedores}
              lugares={lugares}
              zonas={zonas}
              productos={productos}
              user={user}
              cliente={clientes.find((cus) => cus.id === user.asociado.id)??[]}
              dispatch={dispatch}
              url={hUrl}
            />
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
      <MessageView
        variant={messageType === CREATE_TYPE ? 'success' : 'error'}
        message={messageType === CREATE_TYPE ? message : error}
      />
      { updatingContent &&
        <Loading/>
      }
    </div>
  );
};

export default Instalacion;
