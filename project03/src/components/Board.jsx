import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import S from "../styled/GlobalBlock.jsx";

const Board = ({ idx, title, customer, innerUrl, outerUrl }) => {
  return (
    <div>
      <h2>{title}</h2>
      <h5>{customer}</h5>
      <hr />
      <p>{innerUrl}</p>
      <p>{outerUrl}</p>
    </div>
  );
};

export default Board;
