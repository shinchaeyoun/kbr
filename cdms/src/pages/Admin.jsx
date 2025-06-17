import React from "react";
import NewAccounts from "../components/AdminSummary/NewAccounts.jsx";
import RegisteredCourses from "../components/AdminSummary/RegisteredCourses.jsx";

const Admin = () => {
  return (
    <div>
      <NewAccounts />
      <RegisteredCourses />
    </div>
  );
};

export default Admin;
