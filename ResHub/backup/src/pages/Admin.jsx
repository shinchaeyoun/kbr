import React from "react";
import NewAccounts from "../components/AdminSummary/NewAccounts.jsx";
import RegisteredCourses from "../components/AdminSummary/RegisteredCourses.jsx";
import UserList from "./UserList.jsx";

const Admin = () => {
  return (
    <div>
      {/* <NewAccounts /> */}
      {/* <RegisteredCourses /> */}
      <UserList />
    </div>
  );
};

export default Admin;
