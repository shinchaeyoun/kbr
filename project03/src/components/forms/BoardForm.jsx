import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import S from "../../styled/GlobalBlock.jsx";
import axios from "axios";

const GridContainer = styled(S.GridContainer)``;
const GridItem = styled(S.GridItem)``;

const BoardForm = ({ isUpdate }) => {
  const navigate = useNavigate();
  const { idx } = useParams();

  // 게시글 정보 상태
  const [board, setBoard] = useState({
    title: null,
    subTitle: null,
    customer: null,
    pm1: null,
    pm2: null,
    pm3: null,
    startAt: null,
    scheduledAt: null,
    completedAt: null,
    totalCha: null,
    lmsTime: null,
    lmsCode: null,
    innerUrl: null,
    outerUrl: null,
    customerName: null,
    customerTel: null,
    customerPlan: null,
    pottingComp: null,
    etc: null,
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
    if (isUpdate) {
      await axios
        .get(`http://192.168.23.65:5000/board?idx=${idx}`)
        .then((res) => setBoard(res.data));
    }
  };

  // 게시글 저장
  const handleSubmit = async () => {
    if (isUpdate) {
      // 수정 로직
      await axios
        .patch(`http://192.168.23.65:5000/update?idx=${idx}`, board)
        .then(() => {
          alert("수정되었습니다.");
          navigate("/board");
        });
    } else {
      // 작성 로직
      await axios.post(`http://192.168.23.65:5000/board`, board).then((res) => {
        if (res.data.msg === undefined) {
          alert("등록되었습니다.");
          navigate("/board");
        } else {
          alert("강조박스의 내용을 모두 작성해주세요.");
        }
      });
    }
  };

  // 취소 버튼 동작
  const handleCancel = () => navigate("/board");

  // 컴포넌트 로드시 데이터 로드
  useEffect(() => {
    getBoard();
  }, []);

  return (
    <>
      <h1>{isUpdate ? "과정수정" : "과정등록"}</h1>
      <GridContainer>
        <GridItem>
          <div>사업명(과정명) :</div>
          <S.Input
            type="text"
            $req="true"
            name="title"
            value={title}
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
            onChange={onChange}
          />
          <S.Input type="text" name="pm2" value={pm2} onChange={onChange} />
          <S.Input type="text" name="pm3" value={pm3} onChange={onChange} />
        </GridItem>
        <GridItem $short="true">
          <div>착수시작/완료예정/완료일 :</div>
          <S.Input
            type="text"
            name="startAt"
            value={startAt}
            onChange={onChange}
          />
          <S.Input
            type="text"
            name="scheduledAt"
            value={scheduledAt}
            onChange={onChange}
          />
          <S.Input
            type="text"
            name="completedAt"
            value={completedAt}
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
              onChange={onChange}
            />
            차시
          </div>
          <div>
            <S.Input
              type="text"
              name="lmsTime"
              value={lmsTime}
              onChange={onChange}
            />
            시간
          </div>
          <div>
            <S.Input
              type="text"
              name="lmsCode"
              value={lmsCode}
              onChange={onChange}
            />
          </div>
        </GridItem>
        <GridItem $short="true">
          <div>수주/예상/완료비용 :</div>
          <div>
            <S.Input type="text" />원
          </div>
          <div>
            <S.Input type="text" />원
          </div>
          <div>
            <S.Input type="text" />원
          </div>
        </GridItem>
        <GridItem $long="true">
          <div>내부 경로 :</div>
          <S.Input
            type="text"
            name="innerUrl"
            value={innerUrl}
            onChange={onChange}
          />
        </GridItem>
        <GridItem $long="true">
          <div>외부 경로 :</div>
          <S.Input
            type="text"
            name="outerUrl"
            value={outerUrl}
            onChange={onChange}
          />
        </GridItem>
        <GridItem $short="true">
          <div>업체담당자/연락처/교육예정일 :</div>
          <S.Input
            type="text"
            name="customerName"
            value={customerName}
            onChange={onChange}
          />
          <S.Input
            type="text"
            name="customerTel"
            value={customerTel}
            onChange={onChange}
          />
          <S.Input
            type="text"
            name="customerPlan"
            value={customerPlan}
            onChange={onChange}
          />
        </GridItem>
        <GridItem>
          <div>포팅업체 :</div>
          <S.Input
            type="text"
            name="pottingComp"
            value={pottingComp}
            onChange={onChange}
          />
        </GridItem>
        <GridItem $long="true">
          <div>기타사항 :</div>
          <S.Input type="text" name="etc" value={etc} onChange={onChange} />
        </GridItem>
      </GridContainer>

      <div>
        <S.Button onClick={handleSubmit}>{isUpdate ? "과정수정" : "과정등록"}</S.Button>
        <S.Button onClick={handleCancel}>취소</S.Button>
      </div>
    </>
  );
};

export default BoardForm;
