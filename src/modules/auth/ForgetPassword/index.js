import React from 'react';
import {useLocation} from 'react-router-dom';
import ForgetPasswordJwtAuth from './ForgetPasswordJwtAuth';

const ForgetPassword = () => {
  const location = useLocation();

  const tab = (location.state && location.state.tab) || 'firebase';

  return <>{tab === 'jwtAuth' && <ForgetPasswordJwtAuth />}</>;
};

export default ForgetPassword;
