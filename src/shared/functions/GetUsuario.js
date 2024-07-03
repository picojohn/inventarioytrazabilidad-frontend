import {useAuthUser} from '../../../src/@crema/utility/AppHooks';

const GetUsuario = () => {
  const user = useAuthUser();
  if (user.displayName) {
    return user;
  } else {
    return {
      id: '',
      nombre: '',
      email: '',
      identificacion_usuario: '',
      asociado: {id: '', nombre: '', numero_documento: ''},
      rol: {id: '', nombre: '', tipo: ''},
      permisos: '',
    };
  }
};

export default GetUsuario;
