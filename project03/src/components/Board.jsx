import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import S from "../styled/GlobalBlock.jsx";

const Board = (props) => {
  return (
    <div>
      <h2>{props.title}</h2>
      <h5>{props.customer}</h5>
      <hr />
      <p>{props.innerUrl}</p>
      <p>{props.outerUrl}</p>
    </div>
  );
};

export default Board;
