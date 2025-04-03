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

const BoardForm = ({ mode, idx, isModalOpen, setIsModalOpen }) => {
  const [isRead, setIsRead] = useState(false);
  const [isThumb, setIsThumb] = useState(null);
  const [boardTitle, setBoardTitle] = useState("");
  const [fileName, setFileName] = useState("");
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
  };

  // 이미지 등록
  const handleImageUpload = (file) => {
    const url = URL.createObjectURL(file); // 브라우저 메모리에 임시 URL 생성
    setPreviewUrl(url);
    setPreviewFile(file);
  };

  // 이미지 파일 서버 업로드
  const handleFileUpload = () => {
    console.log("handleFileUpload PreviewFile /", previewFile);

    const reader = new FileReader();

    reader.onload = () => {
      const base64Image = reader.result; // Base64 데이터
      const originalName = previewFile.name; // 원본 파일 이름

      const filePath = board.thumb;
      const fileName = filePath
        ? filePath.split("/").pop().split(".")[0] // 기존 파일 이름
        : originalName.split(".")[0]; // 새 파일 이름

      // const fileName = filePath.split(".")[0];

      // console.log("Base64 데이터:", base64Image);

      // 상태에 Base64 데이터와 파일 이름 저장
      setBoard((prevBoard) => ({
        ...prevBoard,
        thumb: base64Image, // Base64 데이터 저장
      }));
      setFileName(fileName); // 파일 이름 저장
    };

    reader.readAsDataURL(previewFile); // 파일을 Base64로 변환
  };

  // 게시글 저장
  const handleSubmit = async () => {
    // console.log("fileName", fileName);
    console.log("isThumb", isThumb);
    console.log("handleSubmit previewFile /", previewFile);

    let uploadedFilePath = thumb; // 기존 thumb 값을 기본값으로 설정

    if (isThumb) {
      // 파일이 선택된 경우 업로드
      uploadedFilePath = await handleFileUpload();
      console.log("업로드된 파일 경로:", uploadedFilePath);
    }
    console.log("uploadedFilePath 경로:", uploadedFilePath);
    
    const updatedBoard = { ...board, thumb: uploadedFilePath };
    
    console.log(" updatedBoard:", updatedBoard.thumb);
    // try {
    //   if (mode === "update") {
    //     const response = await axios.patch(
    //       `http://192.168.23.65:5000/board/update?idx=${idx}`,
    //       updatedBoard,
    //       {
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //       }
    //     );
    //     alert("수정되었습니다.");
    //     setIsModalOpen(false);
    //   } else if (mode === "write") {
    //     const response = await axios.post(
    //       `http://192.168.23.65:5000/board`,
    //       updatedBoard,
    //       {
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //       }
    //     );
    //     alert("등록되었습니다.");
    //     setIsModalOpen(false);
    //     navigate("/board");
    //   }
    // } catch (error) {
    //   console.error("저장 실패:", error);
    //   alert("저장 중 오류가 발생했습니다.");
    // }
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
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
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
          <form>
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
          {" "}
          {/* {board.thumb && (
            <>
              <S.Img src={board.thumb} alt={board.title} />
            </>
          )} */}
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
