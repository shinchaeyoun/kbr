import React, { useState } from "react";
import { Routes, Route, Link, useNavigate, Outlet, useParams } from "react-router-dom";
import "../styled/dlatl.scss"
const ProjectPage = () => {
  const navigate = useNavigate();

  const { code } = useParams();
  console.log('code',code);

  return (
    <div className="flex project-page ">
      <ul>
        <li onClick={() => navigate("/")}>main</li>
        <li onClick={() => navigate(`/${code}/page1`)}>공통게시판</li>
        <li onClick={() => navigate(`/${code}/page2`)}>일정</li>
        <li onClick={() => navigate(`/${code}/page3`)}>page3</li>
        <li onClick={() => navigate(`/${code}/page4`)}>page4</li>
        <li onClick={() => navigate(`/${code}/scheduled`)}>scheduled</li>
      </ul>

      <section>
        <Outlet></Outlet>
      </section>
    </div>
  );
};

export default ProjectPage;
