import React, { use, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import S from "../../styled/GlobalBlock.jsx";
import L from "../../styled/ListStyled.jsx";
import axios from "axios";

import AttachmentIcon from "../../assets/icon/attachment.svg?react";

const BoardListForm = ({ data }) => {
  const API_URL = "http://192.168.23.2:5001/board";
  const navigate = useNavigate();

  // AttachmentListPopover_container__8rCpq
  const [isPopover, setIsPopover] = useState(false);

  // 전체 파일 다운로드 (zip)
  const downloadAll = async (item) => {
    try {
      const response = await axios.get(`${API_URL}/downloadAll`, {
        params: { idx: item.idx },
        responseType: "blob",
      });

      // Content-Disposition에서 파일명 추출
      let fileName = "attachments.zip";
      const disposition = response.headers["content-disposition"];
      if (disposition && disposition.indexOf("filename=") !== -1) {
        const matches = /filename[^;=\n]*=((['\"]).*?\2|[^;\n]*)/.exec(
          disposition
        );
        if (matches != null && matches[1]) {
          fileName = decodeURIComponent(matches[1].replace(/['"]/g, ""));
        }
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `${item.title}.zip`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        a.remove();
      }, 100);
    } catch (err) {
      alert("파일 다운로드 실패");
      console.log(err);
      
    }
  };

  useEffect(() => {}, [isPopover]);

  return (
    <L.ListWrap>
      <L.Content>
        <L.TitleBlock>
          <p>번호</p>
          <p>머리말</p>
          <p>제목</p>
          <p>첨부파일</p>
          <p>등록일</p>
          <p>조회수</p>
        </L.TitleBlock>

        {data.map((item, index) => {
          return (
            <L.Block
              key={index}
              onClick={() => {
                navigate(`${item.idx}`, { state: { item } });
              }}
            >
              <p>{item.idx}</p>
              <p>{item.tag}</p>
              <p>{item.title}</p>
              <p>
                {item.attachment && (
                  <S.Button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadAll(item);
                    }}
                  >
                    {/* 다운로드 */}
                    <AttachmentIcon width="20px" height="20px" />
                  </S.Button>
                )}
              </p>
              {/* <p>{item.user}</p> */}
              <p>{item.date.split("T")[0]}</p>
              <p>{item.views}</p>
            </L.Block>
          );
        })}
      </L.Content>
    </L.ListWrap>
  );
};

export default BoardListForm;
