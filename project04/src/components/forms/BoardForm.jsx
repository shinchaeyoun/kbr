import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import S from "../../styled/GlobalBlock.jsx";
import axios from "axios";

const Wrap = styled(S.Wrap)`
  h1 {
    margin-bottom: 20px;
    font-size: 20px;
  }
`;
const GridContainer = styled(S.GridContainer)``;
const GridItem = styled(S.GridItem)`
  ${S.Notice} {
    margin-top: 5px;
    margin-left: 50px;
    font-size: 14px;
    color: #999;
  }

  ${S.Img} {
    justify-content: center;
    margin-left: 45px;
    width: 214px;
    height: 120px;
    object-fit: cover;
  }
`;

const BoardForm = ({ mode, idx, isModalOpen, setIsModalOpen, onModalClose }) => {
  const navigate = useNavigate();

  const [isRead, setIsRead] = useState(false);
  const [isThumb, setIsThumb] = useState(null);
  const [boardTitle, setBoardTitle] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);

  // 게시글 정보 상태
  const [board, setBoard] = useState({
    year: "",
    title: "",
    customer: "",
    innerUrl: "",
    outerUrl: "",
    thumb: isThumb,
  });

  const { year, title, customer, innerUrl, outerUrl, thumb } = board;

  const changeTitle = () => {
    if (mode == "view") {
      setBoardTitle("과정상세");
    } else if (mode == "update") {
      setBoardTitle("과정수정");
    } else {
      setBoardTitle("과정등록");
    }
  };

  // 게시글 데이터 가져오기 (수정 모드일 경우)
  const getBoard = async () => {
    if (mode == "update" || mode == "view") {
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
    const { name, value, files } = e.target;

    if (name === "thumb" && files && files[0]) {
      const file = files[0];
      setIsThumb(true);
      handleImageUpload(file); // 파일 업로드 처리
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
    if (onModalClose) onModalClose();
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

    if (board.thumb !== null && board.thumb !== "") fileName = board.thumb.split("/").pop();

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
    if (title === "") return alert("과정명을 입력해주세요.");
    let uploadedFilePath = thumb;

    if (isThumb && previewFile)
      uploadedFilePath = await handleFileUpload(previewFile);
    const updatedBoard = { ...board, thumb: uploadedFilePath };

    try {
      if (mode === "update") {
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
        navigate("/board");
      }
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  // 컴포넌트 로드시 데이터 로드
  useEffect(() => {
    getBoard();
    changeTitle();
    setPreviewUrl(null);
    if (mode == "view") setIsRead(true);
  }, [isModalOpen]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl); // 메모리 해제
    };
  }, [previewUrl]);

  return (
    <Wrap>
      <h1>{boardTitle}</h1>
      <GridContainer>
        <GridItem>
          <div>사업년도 :</div>
          <S.Input
            type="text"
            name="year"
            value={year}
            readOnly={isRead}
            onChange={onChange}
          />
        </GridItem>
        <GridItem>
          <div>사업명(과정명) :</div>
          <S.Input
            type="text"
            $req="true"
            name="title"
            value={title}
            readOnly={isRead}
            onChange={onChange}
          />
        </GridItem>
        <GridItem>
          <div>고객사 :</div>
          <S.Input
            type="text"
            name="customer"
            value={customer}
            readOnly={isRead}
            onChange={onChange}
          />
        </GridItem>
        <GridItem $long="true">
          <div>내부 경로 :</div>
          <S.Input
            type="text"
            name="innerUrl"
            value={innerUrl}
            readOnly={isRead}
            onChange={onChange}
          />
        </GridItem>
        <GridItem $long="true">
          <div>외부 경로 :</div>
          <S.Input
            type="text"
            name="outerUrl"
            value={outerUrl}
            readOnly={isRead}
            onChange={onChange}
          />
        </GridItem>
        <GridItem direction="column" $long="true">
          <form>
            <div>이미지 :</div>
            <S.Input
              type="file"
              id="thumb"
              accept="image/*"
              name="thumb"
              readOnly={isRead}
              onChange={onChange}
            />
          </form>
          <S.Notice>*이미지 등록시 기존이미지 삭제 됩니다.</S.Notice>
        </GridItem>

        <GridItem direction="column">
          {previewUrl == null ? (
            <>
              <S.Img src={board.thumb} alt={board.title} />
            </>
          ) : (
            <div>
              <S.Img
                src={previewUrl}
                alt="미리보기"
                style={{ maxWidth: "300px", marginTop: "10px" }}
              />
            </div>
          )}
        </GridItem>
      </GridContainer>

      <S.ButtonWrap direction="row">
        {mode !== "view" && (
          <S.Button onClick={handleSubmit}>
            {mode == "update" ? "과정수정" : "과정등록"}
          </S.Button>
        )}
        <S.Button onClick={handleCancel}>닫기</S.Button>
      </S.ButtonWrap>
    </Wrap>
  );
};

export default BoardForm;
