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
  form {
    display: flex;

    input {
      align-content: center;
    }
  }

  input[type="file" i]::-webkit-file-upload-button {
    border: none;
    border: 1px solid #66a6ff;
    background-color: #fff;
    border-radius: 5px;
    height: 25px;
    line-height: 25px;
    padding: 0 10px;
    cursor: pointer;
  }

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

const BoardForm = ({ mode, idx, isModalOpen, setIsModalOpen }) => {
  const navigate = useNavigate();
  const [isRead, setIsRead] = useState(false);
  const [isThumb, setIsThumb] = useState(null);

  const handleFileUpload = async (file) => {
    const reader = new FileReader();

    reader.onload = async () => {
      const base64Image = reader.result; // Base64 데이터
      try {
        const response = await axios.post(`http://192.168.23.65:5000/board/upload`, {
          base64Image,
          idx, // 게시글의 idx
        });
        console.log("업로드 성공:", response.data);
        setBoard((prevBoard) => ({
          ...prevBoard,
          thumb: response.data.thumb, // 서버에서 반환된 파일 경로를 설정
        }));
      } catch (error) {
        console.error("업로드 실패:", error);
        alert("이미지 업로드 실패");
      }
    };

    reader.readAsDataURL(file); // 파일을 Base64로 변환
  };

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

  // 입력 필드 데이터 바인딩
  const onChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "thumb" && files && files[0]) {
      const file = files[0];
      handleFileUpload(file); // 파일 업로드 처리
    } else {
      setBoard((prevBoard) => ({
        ...prevBoard,
        [name]: value,
      }));
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

  // 게시글 저장
  const handleSubmit = async () => {
    let uploadedFilePath = thumb; // 기존 thumb 값을 기본값으로 설정

    if (isThumb) {
      // 파일이 선택된 경우 업로드
      uploadedFilePath = await handleFileUpload();
    }

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

  // 취소 버튼 동작
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [boardTitle, setBoardTitle] = useState("");
  const changeTitle = () => {
    if (mode == "view") {
      setBoardTitle("과정상세");
    } else if (mode == "update") {
      setBoardTitle("과정수정");
    } else {
      setBoardTitle("과정등록");
    }
  };

  // 컴포넌트 로드시 데이터 로드
  useEffect(() => {
    getBoard();
    changeTitle();
    if (mode == "view") setIsRead(true);
  }, [isModalOpen]);

  return (
    <Wrap>
      {/* <h1>{mode == "update" ? "과정수정" : "과정등록"}</h1> */}
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
          {/* <S.Button>과정검색</S.Button> */}
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
          <form
            onSubmit={async (e) => {
              e.preventDefault(); // 기본 폼 제출 방지
              const formData = new FormData();
              formData.append("image", isThumb); // 선택한 파일 추가

              try {
                const response = await axios.post(
                  `http://192.168.23.65:5000/board/upload?idx=${idx}`,
                  formData,
                  {
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                  }
                );
                alert("이미지 업로드 성공!");
                console.log(response.data); // 서버 응답 확인
              } catch (error) {
                console.error("이미지 업로드 실패:", error);
                alert("이미지 업로드 실패");
              }
            }}
          >
            <div>이미지 :</div>
            {/* {board.thumb && <>{board.thumb}</>} */}
            <S.Input
              type="file"
              id="thumb"
              accept="image/*"
              name="thumb"
              readOnly={isRead}
              onChange={onChange}
            />
            {/* <S.Button type="submit">업로드</S.Button> */}
          </form>
          <S.Notice>*이미지 등록시 기존이미지 삭제 됩니다.</S.Notice>
        </GridItem>

        <GridItem direction="column">
          {board.thumb && (
            <>
              <S.Img src={board.thumb} alt={board.title} />
            </>
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
