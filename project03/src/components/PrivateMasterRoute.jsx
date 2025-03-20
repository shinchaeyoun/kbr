import React from "react";
import AuthAlert from './AuthAlert.jsx';

const PrivateMasterRoute = ({ level, component: Component }) => {
  return level >= 3 ? (
    Component
  ) : (
    <AuthAlert/>
  );
};

export default PrivateMasterRoute;
