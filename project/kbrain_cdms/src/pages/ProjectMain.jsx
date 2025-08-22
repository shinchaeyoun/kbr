import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled, { css } from "styled-components";
import S from "../styled/GlobalBlock.jsx";
import axios from "axios";

import NavigationItem from "../components/NavigationItem.jsx";
import Modal from "../components/Modal.jsx";

const ProjectMain = ({ code, fetchProjectData }) => {
  const API_URL = "http://192.168.23.2:5001/board"; // API URL 상수화
  const navigate = useNavigate();

  // 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("");
  const openModal = () => {
    const modalType = "add"; // 모달 타입 설정
    setIsModalOpen(!isModalOpen);
    setModalMode(modalType);
  }

  return (
    <>
      <Modal
        code={code}
        mode={modalMode}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        fetchProjectData={fetchProjectData}
      />

      <p>code : {code}</p>
      <br />
      <div>
        <NavigationItem label="공통게시판" path={`board`} navigate={navigate} />
      </div>

      <S.Button onClick={openModal}>과목추가</S.Button>
    </>
  );
};

export default ProjectMain;
