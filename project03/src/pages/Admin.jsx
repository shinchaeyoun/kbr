import React from "react";
import NewAccounts from "../components/AdminSummary/NewAccounts";
import RegisteredCourses from "../components/AdminSummary/RegisteredCourses";

const Admin = () => {
  return (
    <div>
      <NewAccounts />
      <RegisteredCourses />
    </div>
  );
};

export default Admin;
