import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import S from "../../styled/GlobalBlock.jsx";
import M from "../../styled/ModalStyled.jsx";
import axios from "axios";

const SubjectForm = (props) => {
  const API_URL = "http://192.168.23.2:5001/subject"; // API URL 상수화
  const { code, mode, isModalOpen, setIsModalOpen, fetchProjectData } =
    props;
  const [warning, setWarning] = useState(false);

  const [board, setBoard] = useState({
    code: code,
    name: "",
    chasiTotal: "",
    manager: "",
  });

  const { name, chasiTotal, manager } = board;

  const onChange = (e) => {
    // if (level < 3) return e.stopPropagation(); // 권한 없을 시 동작 안함
    const { name, value } = e.target;

    setBoard((prevBoard) => ({
      ...prevBoard,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // 공백 체크
    if (name === "") {
      setWarning(true);
      alert("과목명을 입력하세요.");
      return;
    } else if (chasiTotal < 1) {
      setWarning(true);
      alert("차시수는 1 이상이어야 합니다.");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/${mode}`, board);
      fetchProjectData();
      setIsModalOpen(false);
    } catch (err) {
      alert("과목 등록 실패");
    }
  };

  return (
    <M.Wrap>
      <M.Title>{mode == "subjectAdd" ? "과목 추가" : "과목 수정"}</M.Title>

      <M.GridContainer>
        <M.GridItem>
          <M.SubTitle>
            과목명
            {mode == "write" && <span>* 필수입력 내용입니다.</span>}
          </M.SubTitle>
          <M.Group
            className={warning ? "warning" : ""}
            onClick={() => setWarning(false)}
          >
            <M.Input
              type="text"
              placeholder="과목명"
              name="name"
              value={name}
              onChange={onChange}
            />
          </M.Group>
        </M.GridItem>

        <M.GridItem>
          <M.SubTitle>
            차시수
            {mode == "write" && <span>* 필수입력 내용입니다.</span>}
          </M.SubTitle>
          <M.Group
            className={warning ? "warning" : ""}
            onClick={() => setWarning(false)}
          >
            <M.Input
              type="number"
              placeholder="차시수"
              name="chasiTotal"
              value={chasiTotal}
              onChange={onChange}
            />
          </M.Group>
        </M.GridItem>

        <M.GridItem>
          <M.SubTitle>과목담당자</M.SubTitle>
          <M.Group>
            <M.Input
              type="text"
              placeholder="과목담당자"
              name="manager"
              value={manager}
              onChange={onChange}
            />
          </M.Group>
        </M.GridItem>
      </M.GridContainer>

      <M.Button onClick={handleSubmit}>
        {mode == "subjectAdd" ? "과목 등록" : "과목 수정"}
      </M.Button>

      <M.CloseBtn onClick={() => setIsModalOpen(false)}>
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

export default SubjectForm;
