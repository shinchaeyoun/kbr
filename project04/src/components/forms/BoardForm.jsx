import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import S from "../../styled/GlobalBlock.jsx";
import B from "../../styled/BoardStyled.jsx";
import M from "../../styled/ModalStyled.jsx";

import axios from "axios";

const BoardForm = ({
  mode,
  idx,
  isModalOpen,
  setIsModalOpen,
  onModalClose,
  level,
}) => {
  const navigate = useNavigate();

  const [isRead, setIsRead] = useState(false);
  const [isThumb, setIsThumb] = useState(null);
  const [boardTitle, setBoardTitle] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [warning, setWarning] = useState(false);

  const currentYear = new Date().getFullYear(); // 현재 연도 가져오기
  const [SelectYear, setSelectYear] = useState(currentYear); // SelectYear 변수에 현재 연도 저장

  // 게시글 정보 상태
  const [board, setBoard] = useState({
    year: currentYear,
    title: "",
    customer: "",
    innerUrl: "",
    outerUrl: "",
    thumb: isThumb,
  });

  const { year, title, customer, innerUrl, outerUrl, thumb } = board;

  const changeTitle = () => {
    if (mode == "view") {
      setBoardTitle("사업(과정)정보");
    } else {
      setBoardTitle("사업(과정)정보입력");
    }
  };

  // 게시글 데이터 가져오기 (수정 모드일 경우)
  const getBoard = async () => {
    if (mode == "view") {
      await axios
        .get(`http://192.168.23.65:5000/board?idx=${idx}`)
        .then((res) => {
          const { year, title, customer, innerUrl, outerUrl, thumb } = res.data;
          setBoard({ year, title, customer, innerUrl, outerUrl, thumb });
        });
    }
  };

  // 입력 필드 데이터 바인딩
  const onChange = (e) => {
    if (level < 3) return e.stopPropagation(); // 권한 없을 시 동작 안함
    const { name, value, files } = e.target;

    if (name === "thumb" && files && files[0]) {
      const file = files[0];
      setIsThumb(true);
      handleImageUpload(file); // 파일 업로드 처리
    } else if (name === "year") {
      setSelectYear(value);
      setBoard((prevBoard) => ({
        ...prevBoard,
        [name]: value,
      }));
    } else {
      setBoard((prevBoard) => ({
        ...prevBoard,
        [name]: value,
      }));
    }
  };

  // 취소 버튼 동작
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // 이미지 등록
  const handleImageUpload = (file) => {
    const url = URL.createObjectURL(file); // 브라우저 메모리에 임시 URL 생성
    setPreviewUrl(url);
    setPreviewFile(file);
  };

  // 이미지 파일 서버 업로드
  const handleFileUpload = async (file = previewFile) => {
    if (!file) {
      console.error("파일이 전달되지 않았습니다.");
      return null;
    }

    const reader = new FileReader();
    let fileName = file.name;

    if (board.thumb !== null && board.thumb !== "")
      fileName = board.thumb.split("/").pop();

    console.log("인덱스 정보 없음? ", idx);
    if (idx === undefined || idx === null) {
      console.log("인덱스 값 재정의 해야함");
      // 인덱스 값 재정의
    }

    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        const base64Image = reader.result; // Base64 데이터
        const originalName = fileName; // 원본 파일 이름

        try {
          const response = await axios.post(
            `http://192.168.23.65:5000/board/upload`,
            {
              base64Image,
              originalName,
              idx, // 게시글의 idx
            }
          );

          setBoard((prevBoard) => ({
            ...prevBoard,
            thumb: response.data.thumb, // 서버에서 반환된 파일 경로를 설정
          }));

          resolve(response.data.thumb); // 서버에서 반환된 파일 경로를 반환
        } catch (error) {
          alert("이미지 업로드 실패");
          reject(error);
        }
      };

      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file); // 파일을 Base64로 변환
    });
  };

  // 게시글 저장
  const handleSubmit = async () => {
    // 공백 체크
    if (title === "" && year === "") {
      setWarning(true);
      alert("사업연도/사업명을 입력하세요.");
      return;
    }

    // 중복 체크
    const response = await axios.post(`http://192.168.23.65:5000/board/dup`, {
      year: year,
      title: title,
    });

    if (response.data.result) {
      alert(response.data.msg);
      return;
    }

    // 이미지 업로드
    let uploadedFilePath = thumb;

    if (isThumb && previewFile)
      uploadedFilePath = await handleFileUpload(previewFile);
    const updatedBoard = {
      ...board,
      year: SelectYear,
      thumb: uploadedFilePath,
    };

    // 서버에 데이터 전송
    try {
      if (mode === "view") {
        const response = await axios.patch(
          `http://192.168.23.65:5000/board/update?idx=${idx}`,
          updatedBoard,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        alert("수정되었습니다.");
        setIsModalOpen(false);
        if (onModalClose) onModalClose(); // 부모 컴포넌트에 변경 알림
      } else if (mode === "write") {
        const response = await axios.post(
          `http://192.168.23.65:5000/board`,
          updatedBoard,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        alert("등록되었습니다.");
        setIsModalOpen(false);
        if (onModalClose) onModalClose();
        navigate("/board");
      }
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  // 게시글 삭제
  const deleteBoard = async () => {
    if (level < 9) {
      alert("삭제 권한 없음");
      return;
    }

    const deleteCode = "dd";
    const userInput = prompt("삭제 암호를 입력하세요", "");

    if (userInput === deleteCode) {
      try {
        await axios.delete(`http://192.168.23.65:5000/board/delete`, {
          data: { idx },
        });
        setIsModalOpen(false);
        if (onModalClose) onModalClose("delete", idx); // 부모 컴포넌트에 변경 알림
      } catch (error) {
        console.error("삭제 중 오류 발생:", error);
      }
    } else {
      alert("잘못된 비밀번호입니다.");
    }
  };

  // 컴포넌트 로드시 데이터 로드
  useEffect(() => {
    getBoard();
    changeTitle();
    setPreviewUrl(null);
    if (mode == "view" && level < 3) setIsRead(true);
  }, [isModalOpen]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl); // 메모리 해제
    };
  }, [previewUrl]);

  return (
    <M.Wrap>
      <M.Title>{boardTitle}</M.Title>
      <M.GridContainer>
        <M.GridItem>
          <div>
            사업연도/사업명(과정명)
            {mode == "write" && <span>* 필수입력 내용입니다.</span>}
          </div>

          <M.Group
            className={warning ? "warning" : ""}
            onClick={() => setWarning(false)}
          >
            <S.Select
              type="text"
              name="year"
              value={year || SelectYear}
              disabled={level < 3}
              onChange={onChange}
            >
              {Array.from({ length: 7 }, (_, i) => {
                const year = currentYear + 1 - i; // SelectYear부터 이전 5년까지 옵션 생성
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </S.Select>
            <M.Input
              type="text"
              $req="true"
              name="title"
              value={title}
              readOnly={isRead}
              onChange={onChange}
            />
          </M.Group>
        </M.GridItem>
        <M.GridItem>
          <div>고객사</div>
          <M.Input
            type="text"
            name="customer"
            value={customer}
            readOnly={isRead}
            onChange={onChange}
          />
        </M.GridItem>
        <M.GridItem>
          <div>과정경로(서버경로)</div>
          <M.Input
            type="text"
            name="innerUrl"
            value={innerUrl}
            readOnly={isRead}
            onChange={onChange}
          />
        </M.GridItem>
        <M.GridItem>
          <div>과정URL(검수사이트)</div>
          <M.Input
            type="text"
            name="outerUrl"
            value={outerUrl}
            readOnly={isRead}
            onChange={onChange}
          />
        </M.GridItem>
        <M.GridItem $margin="0 0 5px 0">
          <M.Form>
            <div>썸네일 이미지</div>
            <M.Input
              type="file"
              id="thumb"
              accept="image/*"
              name="thumb"
              readOnly={isRead}
              disabled={level < 3}
              onChange={onChange}
            />
          </M.Form>
          {mode == "view" && level > 2 && (
            <S.Notice>*이미지 등록시 기존이미지 삭제 됩니다.</S.Notice>
          )}
        </M.GridItem>

        <M.GridItem>
          {board.thumb !== null && (
            <>
              <M.Img src={board.thumb} alt="미리보기" />
            </>
          )}
          {previewUrl !== null && (
            <>
              <M.Img src={previewUrl} alt="미리보기" />
            </>
          )}
        </M.GridItem>
      </M.GridContainer>

      {level > 2 && (
        <M.Button onClick={handleSubmit}>
          {mode == "view" ? "사업(과정) 수정" : "사업(과정) 등록"}
        </M.Button>
      )}
      {level == 9 && mode == "view" && (
        <M.DeleteBtn
          onClick={(e) => {
            e.stopPropagation();
            deleteBoard(board.idx, e);
          }}
        >
          삭제하기
        </M.DeleteBtn>
      )}
      <M.CloseBtn onClick={handleCancel}>
        <svg
          width="30"
          height="32"
          viewBox="0 0 30 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="0.707107"
            y1="1.29289"
            x2="28.7071"
            y2="29.2929"
            stroke="black"
            strokeWidth="1.5"
          />
          <line
            x1="28.7071"
            y1="2.70711"
            x2="0.707107"
            y2="30.7071"
            stroke="black"
            strokeWidth="1.5"
          />
        </svg>
      </M.CloseBtn>
    </M.Wrap>
  );
};

export default BoardForm;
