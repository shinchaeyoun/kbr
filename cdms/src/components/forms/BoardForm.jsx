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
const GridItem = styled(S.GridItem)``;

const BoardForm = ({ mode, idx, isModalOpen, setIsModalOpen }) => {
  const navigate = useNavigate();
  const [isRead, setIsRead] = useState(false);

  // 게시글 정보 상태
  const [board, setBoard] = useState({
    title: '',
    subTitle: '',
    customer: '',
    pm1: '',
    pm2: '',
    pm3: '',
    startAt: '',
    scheduledAt: '',
    completedAt: '',
    totalCha: '',
    lmsTime: '',
    lmsCode: '',
    innerUrl: '',
    outerUrl: '',
    customerName: '',
    customerTel: '',

    customerPlan: '',
    pottingComp: '',
    etc: '',
  });

  const {
    title,
    subTitle,
    customer,
    pm1,
    pm2,
    pm3,
    startAt,
    scheduledAt,
    completedAt,
    totalCha,
    lmsTime,
    lmsCode,
    innerUrl,
    outerUrl,
    customerName,
    customerTel,
    customerPlan,
    pottingComp,
    etc,
  } = board;

  // 입력 필드 데이터 바인딩
  const onChange = (e) => {
    const { value, name } = e.target;
    setBoard({
      ...board,
      [name]: value,
    });
  };

  // 게시글 데이터 가져오기 (수정 모드일 경우)
  const getBoard = async () => {
    if (mode == "update" || mode == "view") {
      await axios
        .get(`http://192.168.23.2:5000/board?idx=${idx}`)
        .then((res) => setBoard(res.data));
    }
  };

  // 게시글 저장
  const handleSubmit = async () => {
    if (mode == "update") {
      // 수정 로직
      await axios
        .patch(`http://192.168.23.2:5000/board/update?idx=${idx}`, board)
        .then(() => {
          alert("수정되었습니다.");
          setIsModalOpen(false);
        });
    } else if (mode == "write") {
      // 작성 로직
      await axios.post(`http://192.168.23.2:5000/board`, board).then((res) => {
        if (res.data.msg === undefined) {
          alert("등록되었습니다.");
          setIsModalOpen(false);
          navigate("/board");
          getBoard();
        } else {
          alert("강조박스의 내용을 모두 작성해주세요.");
        }
      });
    }
  };

  // 취소 버튼 동작
  const handleCancel = () => {
    setIsModalOpen(false);
  };



  const [boardTitle, setBoardTitle] = useState('');
  const changeTitle = () => {
    if (mode == "view") {
      setBoardTitle("과정상세")
    } else if (mode == "update") {
      setBoardTitle("과정수정")
    } else {
      setBoardTitle("과정등록")
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
          <div>사업명(과정명) :</div>
          <S.Input
            type="text"
            $req="true"
            name="title"
            value={title}
            readOnly={isRead}
            onChange={onChange}
          />

          <S.Button>과정검색</S.Button>
        </GridItem>
        <GridItem>
          <div>세부 과정명 :</div>
          <S.Input
            type="text"
            name="subTitle"
            value={subTitle}
            readOnly={isRead}
            onChange={onChange}
          />

          <select name="cont_option" id="cont_option">
            <option value="1">입찰</option>
            <option value="2">약식제안</option>
            <option value="3">컨소시엄</option>
          </select>
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
        <GridItem $short="true">
          <div>총괄PM/과정PM/개발PM :</div>
          <S.Input
            type="text"
            $req="true"
            name="pm1"
            value={pm1}
            readOnly={isRead}
            onChange={onChange}
          />
          <S.Input
            type="text"
            name="pm2"
            value={pm2}
            readOnly={isRead}
            onChange={onChange}
          />
          <S.Input
            type="text"
            name="pm3"
            value={pm3}
            readOnly={isRead}
            onChange={onChange}
          />
        </GridItem>
        <GridItem $short="true">
          <div>착수시작/완료예정/완료일 :</div>
          <S.Input
            type="text"
            name="startAt"
            value={startAt}
            readOnly={isRead}
            onChange={onChange}
          />
          <S.Input
            type="text"
            name="scheduledAt"
            value={scheduledAt}
            readOnly={isRead}
            onChange={onChange}
          />
          <S.Input
            type="text"
            name="completedAt"
            value={completedAt}
            readOnly={isRead}
            onChange={onChange}
          />
        </GridItem>
        <GridItem $short="true">
          <div>총차시수/신고시간/운영코드 :</div>
          <div>
            <S.Input
              type="text"
              name="totalCha"
              value={totalCha}
              readOnly={isRead}
              onChange={onChange}
            />
            차시
          </div>
          <div>
            <S.Input
              type="text"
              name="lmsTime"
              value={lmsTime}
              readOnly={isRead}
              onChange={onChange}
            />
            시간
          </div>
          <div>
            <S.Input
              type="text"
              name="lmsCode"
              value={lmsCode}
              readOnly={isRead}
              onChange={onChange}
            />
          </div>
        </GridItem>
        {/* <GridItem $short="true">
          <div>수주/예상/완료비용 :</div>
          <div>
            <S.Input type="text" readOnly={isRead} />원
          </div>
          <div>
            <S.Input type="text" readOnly={isRead} />원
          </div>
          <div>
            <S.Input type="text" readOnly={isRead} />원
          </div>
        </GridItem> */}
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
        <GridItem $short="true">
          <div>업체담당자/연락처/교육예정일 :</div>
          <S.Input
            type="text"
            name="customerName"
            value={customerName}
            readOnly={isRead}
            onChange={onChange}
          />
          <S.Input
            type="text"
            name="customerTel"
            value={customerTel}
            readOnly={isRead}
            onChange={onChange}
          />
          <S.Input
            type="text"
            name="customerPlan"
            value={customerPlan}
            readOnly={isRead}
            onChange={onChange}
          />
        </GridItem>
        <GridItem>
          <div>포팅업체 :</div>
          <S.Input
            type="text"
            name="pottingComp"
            value={pottingComp}
            readOnly={isRead}
            onChange={onChange}
          />
        </GridItem>
        <GridItem $long="true">
          <div>기타사항 :</div>
          <S.Input
            type="text"
            name="etc"
            value={etc}
            readOnly={isRead}
            onChange={onChange}
          />
        </GridItem>
      </GridContainer>

      <div>
        {
          mode !== "view" && (
            <S.Button onClick={handleSubmit}>
              {mode == "update" ? "과정수정" : "과정등록"}
            </S.Button>
          )
        }
        <S.Button onClick={handleCancel}>닫기</S.Button>
      </div>
    </Wrap>
  );
};

export default BoardForm;
