import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styled, { css } from "styled-components";
import S from "../styled/GlobalBlock.jsx";

const GridContainer = styled(S.GridContainer)``;
const GridItem = styled(S.GridItem)``;

const BoardWrite = () => {
  const navigate = useNavigate();

  const [board, setboard] = useState({
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

  const onChange = (e) => {
    const { value, name } = e.target;
    setboard({
      ...board,
      [name]: value,
    });
  };

  const saveBoard = async () => {
    await axios.post(`http://192.168.23.65:5000/board`, board).then((res) => {
      console.log("??res.data.msg", res.data.msg);
      if (res.data.msg == undefined) {
        alert("등록되었습니다.");
        navigate("/board");
      } else {
        alert("강조박스의 내용을 모두 작성해주세요.");
        console.log("??res.data.msg", res.data.msg);
      }
    });
  };

  const backToList = () => {
    navigate("/board");
  };

  return (
    <>
      <h1>과정등록</h1>
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
            type="date"
            name="startAt"
            value={startAt}
            onChange={onChange}
          />
          <S.Input
            type="date"
            name="scheduledAt"
            value={scheduledAt}
            onChange={onChange}
          />
          <S.Input
            type="date"
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
            <S.Input type="text" onChange={onChange} />원
          </div>
          <div>
            <S.Input type="text" onChange={onChange} />원
          </div>
          <div>
            <S.Input type="text" onChange={onChange} />원
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
          <div>외부 경로로 :</div>
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
            type="date"
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
        <S.Button onClick={saveBoard}>과정등록</S.Button>
        <S.Button onClick={backToList}>취소</S.Button>
      </div>
    </>
  );
};

export default BoardWrite;
