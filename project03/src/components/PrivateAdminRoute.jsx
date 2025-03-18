import React, { useState } from "react";
import AuthAlert from './AuthAlert.jsx';


const PrivateAdminRoute = ({ authenticated, component: Component }) => {
  return authenticated === "admin" ? (
    Component
  ) : (
    // <Navigate to="/" {...alert("admin 접근할 수 없는 페이지입니다.")} />
    <AuthAlert/>
  );
};

export default PrivateAdminRoute;