import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import TotalAccounts from "../components/AdminSummary/TotalAccounts";
import NewAccounts from "../components/AdminSummary/NewAccounts";
// import RecentCourses from "../components/AdminSummary/RecentCourses";
import RegisteredCourses from "../components/AdminSummary/RegisteredCourses";

const Admin = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div onClick={()=>{navigate(`/admin/userlist`)}}>계정관리</div>
      {/* <div onClick={()=>{navigate(`/admin/usermgmt`)}}>등급관리</div> */}
      <NewAccounts />
      <RegisteredCourses />
    </div>
  );
};

export default Admin;
