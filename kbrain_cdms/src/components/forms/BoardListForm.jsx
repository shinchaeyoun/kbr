import React, { use, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import S from "../../styled/GlobalBlock.jsx";
import L from "../../styled/ListStyled.jsx";
import CB from "../../styled/CommonBoardStyled.jsx";
import axios from "axios";

import { downloadFile } from "@/utils/fileDownload";

// svg
import AttIcon from "../../components/AttachmentIcon.jsx";
import AttachmentIcon from "../../assets/icon/attachment.svg?react";

const BoardListForm = ({ data, category }) => {
  const API_URL = "http://192.168.23.2:5001/board";
  const navigate = useNavigate();
  const [isPopover, setIsPopover] = useState(false);
  const [openPopoverIdx, setOpenPopoverIdx] = useState(null);
  const [attachmentList, setAttachmentList] = useState([]);

  // 파일 다운로드
  const handleDownload = (item, index) => {
    downloadFile({
      url: `${API_URL}/filedownload`,
      params: { idx: item.idx, fileIdx: index },
      item,
      index,
    });
  };

  useEffect(() => {}, [isPopover]);

  useEffect(() => {
    // console.log(category, "category");
  }, []);

  return (
    <div
      onClick={() => {
        if (openPopoverIdx !== null) setOpenPopoverIdx(null);
      }}
    >
      <L.ListWrap
        onClick={(e) => {
          // 팝오버가 열려있고, L.ListWrap(배경) 클릭 시 팝오버 닫기
          if (openPopoverIdx !== null && e.target === e.currentTarget) {
            setOpenPopoverIdx(null);
          }
        }}
      >
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
            const isPopover = openPopoverIdx === index;
            // console.log("게시물 저장 시간", item);

            // 날짜 파싱 및 포맷팅 (간결하게)
            const itemDate = new Date(item.date);
            const now = new Date(new Date().getTime());
            // console.log("현재 시간", now);
            
            const year = itemDate.getFullYear();
            const month = String(itemDate.getMonth() + 1).padStart(2, "0");
            const day = String(itemDate.getDate()).padStart(2, "0");

            const hours = String(itemDate.getHours()).padStart(2, "0");
            const minutes = String(itemDate.getMinutes()).padStart(2, "0");

            const isToday =
              itemDate.getFullYear() === now.getFullYear() &&
              itemDate.getMonth() === now.getMonth() &&
              itemDate.getDate() === now.getDate();

            const dateTime = isToday
              ? `${hours}:${minutes}`
              : itemDate.getFullYear() === now.getFullYear()
              ? `${month}-${day} ${hours}:${minutes}`
              : `${year}-${month}-${day} ${hours}:${minutes}`;

            return (
              <L.Block
                key={index}
                onClick={() => {
                  navigate(`${item.idx}`, { state: { detailIndex: item.idx } });
                }}
              >
                <p>{index + 1}</p>
                <p>{item.tag}</p>
                <p>{item.title}</p>
                <p>
                  {item.attachment && (
                    <L.AttachmentIcon
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenPopoverIdx(isPopover ? null : index);
                        setAttachmentList(item.attachment.split("|"));
                      }}
                    >
                      <AttachmentIcon width="20px" height="20px" />
                      {isPopover && (
                        <L.AttachmentPop>
                          <ul>
                            {attachmentList.map((file, idx) => {
                              const [savedName, originalName] = file.split(",");
                              return (
                                <li
                                  key={idx}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownload(item, idx);
                                  }}
                                >
                                  <AttIcon
                                    filename={originalName}
                                    width="20px"
                                    height="20px"
                                  />
                                  {originalName}
                                </li>
                              );
                            })}
                          </ul>
                        </L.AttachmentPop>
                      )}
                    </L.AttachmentIcon>
                  )}
                </p>
                <p>{dateTime}</p>
                <p>{item.views}</p>
              </L.Block>
            );
          })}
        </L.Content>

        <CB.Button
          onClick={() =>
            navigate(`write`, { state: { mode: "write", category: category } })
          }
        >
          글쓰기
        </CB.Button>
      </L.ListWrap>
    </div>
  );
};

export default BoardListForm;
