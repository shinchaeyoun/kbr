import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import S from "../styled/GlobalBlock.jsx";
import C from "../styled/CalenderStyle.jsx";

const ToolbarMini = (props) => {
  const { date } = props;
  const navigate = (action) => props.onNavigate(action);

  const prevIcon = (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.55809 2.05811L4.11621 7.49998L9.55809 12.9419L10.4418 12.0581L5.88371 7.49998L10.4418 2.94186L9.55809 2.05811Z"
        fill="black"
      />
    </svg>
  );
  const nextIcon = (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.44191 2.05811L10.8838 7.49998L5.44191 12.9419L4.55816 12.0581L9.11629 7.49998L4.55816 2.94186L5.44191 2.05811Z"
        fill="black"
      />
    </svg>
  );

  return (
    <C.ToolbarMiniComponent>
      <C.Group>{`${date.getFullYear()}년 ${date.getMonth() + 1}월`}</C.Group>
      <C.Group>
        <C.ButtonMini onClick={navigate.bind(null, "PREV")}>
          {prevIcon}
        </C.ButtonMini>
        <C.ButtonMini onClick={navigate.bind(null, "NEXT")}>
          {nextIcon}
        </C.ButtonMini>
      </C.Group>
    </C.ToolbarMiniComponent>
  );
};

export default ToolbarMini;
