import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import S from "../styled/GlobalBlock.jsx";

const Board = (props) => {
  return (
    <div>
      <h2>사업명(과정명) :{props.title}</h2>
      <h4>세부 과정명 :{props.subTitle}</h4>
      <h5>고객사 :{props.customer}</h5>
      <hr />
      <p>
        총괄PM/과정PM/개발PM : {props.pm1}
        {props.pm2}
        {props.pm3}
      </p>
      <p>
        착수시작/완료예정/완료일 :{props.startAt}
        {props.scheduledAt}
        {props.completedAt}
      </p>
      <p>
        총차시수/신고시간/운영코드 :{props.totalCha} {props.lmsTime}
        {props.lmsCode}
      </p>
      <p>내부 경로 :{props.innerUrl}</p>
      <p>외부 경로 :{props.outerUrl}</p>
      <p>
        업체담당자/연락처/교육예정일 :{props.customerName}
        {props.customerTel}
        {props.customerPlan}
      </p>
      <p>포팅업체 :{props.pottingComp}</p>
      <p>기타사항 :{props.etc}</p>
    </div>
  );
};

export default Board;
