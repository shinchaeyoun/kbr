import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div onClick={()=>{navigate(`/admin/userlist`)}}>계정관리</div>
      <div onClick={()=>{navigate(`/admin/usermgmt`)}}>등급관리</div>
    </div>
  );
};

export default Admin;
