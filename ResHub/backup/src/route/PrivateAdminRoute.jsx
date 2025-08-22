import React, { useState } from "react";
import AuthAlert from '../pages/AuthAlert.jsx';


const PrivateAdminRoute = ({ level, component: Component }) => {
  return level == 9 ? (
    Component
  ) : (
    <AuthAlert/>
  );
};

export default PrivateAdminRoute;