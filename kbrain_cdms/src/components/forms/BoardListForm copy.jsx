import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const [isPopover, setIsPopover] = useState(false);
  const [openPopoverIdx, setOpenPopoverIdx] = useState(null);
  const [attachmentList, setAttachmentList] = useState([]);
  const [isCategory, setIsCategory] = useState(location.search.split("=")[1]); // 카테고리 상태

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

  // useEffect(() => {
  //   // if(category === "원고") setIsCategory('script');
  //   // if(category === "스토리보드") setIsCategory('sb');
  //   // if(category === "음성") setIsCategory('voice');
  //   // if(category === "애니") setIsCategory('animation');
  //   // if(category === "영상") setIsCategory('video');
  //   // if(category === "디자인") setIsCategory('design');
  //   // if(category === "개발") setIsCategory('content');

  //   setIsCategory(category);

  //   console.log('isCategory ==>',isCategory);
  // }, [category]);

  useEffect(() => {
    console.log("카테고리 셋팅:", isCategory);
    isCategory == undefined && setIsCategory("common")
  }, []);

  return (
    <div
      className="list-wrap"

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
        <CB.Button
          onClick={() =>
            navigate(`write?category=${location.search.split("=")[1]}`, { state: { mode: "write", category: isCategory } })
          }
        >
          글쓰기
        </CB.Button>

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
                  console.log("클릭된 아이템:", item.idx);

                  // item.status ?
                  // navigate(`deleted`) :
                  navigate(`${item.idx}`, { state: { detailIndex: item.idx } });
                }}
              >
                <p>{index + 1}</p>
                <p>{item.tag}</p>

                <div style={{ display: "flex", gap: "10px" }}>
                  {item.depth >= 1 && (
                    <span style={{ color: "#d0021b" }}>└ [답글] </span>
                  )}
                  {item.status ? (
                    <p style={{ color: "#a8a8a8" }}>삭제된 글입니다.</p>
                  ) : (
                    <p>{item.title}</p>
                  )}
                </div>
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
      </L.ListWrap>
    </div>
  );
};

export default BoardListForm;
