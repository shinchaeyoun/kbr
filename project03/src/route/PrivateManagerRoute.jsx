import React from "react";
import AuthAlert from '../components/AuthAlert.jsx';

const PrivateManagerRoute = ({ level, component: Component }) => {
  return level >= 3 ? (
    Component
  ) : (
    <AuthAlert/>
  );
};

export default PrivateManagerRoute;
