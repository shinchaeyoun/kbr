import React, { useState, useParams } from "react";
import { Routes, Route, Link, useNavigate, Outlet } from "react-router-dom";

const Main = () => {
  // const { code } = useParams();
  // console.log('code',idx);
  
  return (
    <div>
      <div>Main</div>
      <section>
        <Outlet></Outlet>
      </section>
    </div>
  );
};

export default Main;
