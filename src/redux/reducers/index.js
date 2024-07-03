import {combineReducers} from 'redux';
import {connectRouter} from 'connected-react-router';
import Settings from './Setting';
import Common from './Common';
import Auth from './Auth';
// Seguridad
import RolReducer from './RolReducer';
import AplicacionReducer from './AplicacionReducer';
import ModuloReducer from './ModuloReducer';
import UsuarioReducer from './UsuarioReducer';
import OpcionSistemaReducer from './OpcionSistemaReducer';
import ConsultaAuditoriaReducer from './ConsultaAuditoriaReducer';
import PermisoReducer from './PermisoReducer';
// Parametrizacion
import ParametroCorreoReducer from './ParametroCorreoReducer';
import ParametroConstanteReducer from './ParametroConstanteReducer';
import TipoAlertaReducer from './TipoAlertaReducer';
import ClienteReducer from './ClienteReducer';
import LugarReducer from './LugarReducer';
import ClienteAlertaReducer from './ClienteAlertaReducer';
import ClienteVehiculoReducer from './ClienteVehiculoReducer';
import ClienteConductorReducer from './ClienteConductorReducer';
import AsociadoReducer from './AsociadoReducer';
import ProductoReducer from './ProductoReducer';
import ProductoClienteReducer from './ProductoClienteReducer';
import ZonaContenedorReducer from './ZonaContenedorReducer';
import TipoEventoReducer from './TipoEventoReducer';
import KitReducer from './KitReducer';
import TipoDocumentoReducer from './TipoDocumentoReducer';
import KitProductosReducer from './KitProductosReducer';
import TipoContenedorReducer from './TipoContenedorReducer';
import ContenedorReducer from './ContenedorReducer';
import LugarUsuarioReducer from './LugarUsuarioReducer';
import InventarioMinimoReducer from './InventarioMinimoReducer';
import PedidoReducer from './PedidoReducer';
import PedidoS3Reducer from './PedidoS3Reducer';
import PedidoDetalleReducer from './PedidoDetalleReducer';
import ColorReducer from './ColorReducer';
import SelloReducer from './SelloReducer';
import RemisionReducer from './RemisionReducer';
import TerceroReducer from './TerceroReducer';
import TipoChequeoReducer from './TipoChequeoReducer';
import UnidadCargaTransporteReducer from './UnidadCargaTransporteReducer';
import ListaChequeoReducer from './ListaChequeoReducer';
import ClaseInspeccionReducer from './ClaseInspeccionReducer';
import OperacionEmbarqueReducer from './OperacionEmbarqueReducer';
import OperacionEmbarqueContenedorReducer from './OperacionEmbarqueContenedorReducer';
import DatoAdicionalReducer from './DatoAdicionalReducer';
import FormatoInspeccionReducer from './FormatoInspeccionReducer';
import FormatoInspeccionUnidadReducer from './FormatoInspeccionUnidadReducer';
import ClienteInspectorReducer from './ClienteInspectorReducer';
import ClienteEmpresaTransporteReducer from './ClienteEmpresaTransporteReducer';
import SolicitudAccesoReducer from './SolicitudAccesoReducer';
import ClaseInspeccionListaFotosReducer from './ClaseInspeccionListaFotosReducer';

const reducers = (history) =>
  combineReducers({
    router: connectRouter(history),
    settings: Settings,
    auth: Auth,
    common: Common,
    rolReducer: RolReducer,
    aplicacionReducer: AplicacionReducer,
    moduloReducer: ModuloReducer,
    usuarioReducer: UsuarioReducer,
    opcionSistemaReducer: OpcionSistemaReducer,
    permisoReducer: PermisoReducer,
    consultaAuditoriaReducer: ConsultaAuditoriaReducer,
    parametroCorreoReducer: ParametroCorreoReducer,
    parametroConstanteReducer: ParametroConstanteReducer,
    tipoAlertaReducer: TipoAlertaReducer,
    clienteReducer: ClienteReducer,
    lugarReducer: LugarReducer,
    clienteAlertaReducer: ClienteAlertaReducer,
    clienteVehiculoReducer: ClienteVehiculoReducer,
    clienteConductorReducer: ClienteConductorReducer,
    asociadoReducer: AsociadoReducer,
    productoReducer: ProductoReducer,
    productoClienteReducer: ProductoClienteReducer,
    zonaContenedorReducer: ZonaContenedorReducer,
    tipoEventoReducer: TipoEventoReducer,
    kitReducer: KitReducer,
    tipoDocumentoReducer: TipoDocumentoReducer,
    kitProductosReducer: KitProductosReducer,
    tipoContenedorReducer: TipoContenedorReducer,
    contenedorReducer: ContenedorReducer,
    lugarUsuarioReducer: LugarUsuarioReducer,
    inventarioMinimoReducer: InventarioMinimoReducer,
    pedidoReducer: PedidoReducer,
    pedidoS3Reducer: PedidoS3Reducer,
    pedidoDetalleReducer: PedidoDetalleReducer,
    colorReducer: ColorReducer,
    selloReducer: SelloReducer,
    remisionReducer: RemisionReducer,
    terceroReducer: TerceroReducer,
    tipoChequeoReducer: TipoChequeoReducer,
    unidadCargaTransporteReducer: UnidadCargaTransporteReducer,
    listaChequeoReducer: ListaChequeoReducer,
    claseInspeccionReducer: ClaseInspeccionReducer,
    operacionEmbarqueReducer: OperacionEmbarqueReducer,
    operacionEmbarqueContenedorReducer: OperacionEmbarqueContenedorReducer,
    datoAdicionalReducer: DatoAdicionalReducer,
    formatoInspeccionReducer: FormatoInspeccionReducer,
    formatoInspeccionUnidadReducer: FormatoInspeccionUnidadReducer,
    clienteInspectorReducer: ClienteInspectorReducer,
    clienteEmpresaTransporteReducer: ClienteEmpresaTransporteReducer,
    solicitudAccesoReducer: SolicitudAccesoReducer,
    claseInspeccionListaFotosReducer: ClaseInspeccionListaFotosReducer,
  });

export default reducers;
