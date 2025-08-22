import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import S from "../styled/GlobalBlock.jsx";
import axios from "axios";

const User = (props) => {
  const idx  = props.idx;
  return (
    <>
      <p>
        아이디 :
        <input type="text" name={props.id} value={props.id || ""} />
      </p>
      <p>
        <label htmlFor="level">레벨 :</label>
        <select
          name="level"
          id="level"
          value={props.level} // 현재 레벨 값을 선택된 값으로 설정
          onChange={(e) => props.onLevelChange(e.target.value,props.idx)} // 변경 시 이벤트 핸들링
        >
          <option value="1">1 : guest</option>
          <option value="2">2 : member</option>
          <option value="3">3 : manager</option>
          <option value="9">9 : admin</option>
        </select>
      </p>

      <p>
        이름 : <input type="text" name={props.name} value={props.name || ""} />
      </p>
      <p>
        팀 : <input type="text" name={props.team} value={props.team || ""} />
      </p>
      <p>
        전화번호 : <input type="text" name={props.tel} value={props.tel || ""} />
      </p>
      <p>
        메일 : <input type="text" name={props.eMail} value={props.eMail || ""} />
      </p>
    </>
  );
};

export default User;
