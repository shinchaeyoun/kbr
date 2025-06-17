import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import M from "../../styled/ModalStyled.jsx";
import axios from 'axios';

const ModalForm = (props) => {
  const { mode, idx, isModalOpen, setIsModalOpen, onModalClose, level } = props;

  const [data, setData] = useState({
    idx: idx || "",
    title: "",
    customer: "",
    innerUrl: "",
    outerUrl: "",
    thumb: null,
    year: new Date().getFullYear(),
  });


  if (mode === "subjectAdd") {
    
  }
  return (
    <M.Wrap>
      <M.Title>{data.title}</M.Title>
      <M.GridContainer>
        <M.GridItem>
          <M.SubTitle>
            {data.title}
          </M.SubTitle>

          <M.Group
            // className={warning ? "warning" : ""}
            // onClick={() => setWarning(false)}
          >
            <select>
              <option>year</option>
            </select>
            <M.Input/>
          </M.Group>
        </M.GridItem>
      </M.GridContainer>

      <M.CloseBtn onClick={()=>setIsModalOpen(false)}>
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          strokeWidth={2}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M1 1L29 29" stroke="black" />
          <path d="M29 1L1 29" stroke="black" />
        </svg>
      </M.CloseBtn>
    </M.Wrap>
  );
};

export default ModalForm;