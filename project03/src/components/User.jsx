import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import S from "../styled/GlobalBlock.jsx";
import axios from "axios";

const User = (props) => {
  console.log("props.isUpdate", props.isUpdate);
  const updateMode = props.isUpdate;

  const fields = [
    { label: "아이디", value: props.id },
    { label: "레벨", value: props.level },
    { label: "이름", value: props.name },
    { label: "팀", value: props.team },
    { label: "번호", value: props.tel },
    { label: "메일", value: props.eMail },
    { label: "etc1", value: props.etc1 },
    { label: "etc2", value: props.etc2 },
    { label: "etc3", value: props.etc3 },
  ];

  return (
    <>
      {updateMode ? (
        <>
          updateMode
          {fields.map((field, index) => (
            <p key={index}>
              {field.label} : <input type="text" value={field.value}/>
            </p>
          ))}
        </>
      ) : (
        <>
          updateMode not
          {fields.map((field, index) => (
            <p key={index}>
              {field.label} : <input type="text" value={field.value} readOnly/>
            </p>
          ))}
        </>
      )}
      {/* <p>아이디 : {props.id}</p>
      <p>레벨 : {props.level}</p>
      <p>이름 : {props.name}</p>
      <p>팀 : {props.team}</p>
      <p>번호 : {props.tel}</p>
      <p>메일 : {props.eMail}</p>
      <p>etc1 : {props.etc1}</p>
      <p>etc2 : {props.etc2}</p>
      <p>etc3 : {props.etc3}</p>
      {props.isUpdate} */}
    </>
  );
};

export default User;
