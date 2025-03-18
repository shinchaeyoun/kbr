import React from "react";
import AuthAlert from './AuthAlert.jsx';

const PrivateMasterRoute = ({ authenticated, component: Component }) => {
  return authenticated === "master" || authenticated === "admin" ? (
    Component
  ) : (
    <AuthAlert/>
  );
};

export default PrivateMasterRoute;
