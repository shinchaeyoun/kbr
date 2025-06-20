import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import L from "../../styled/ListStyled.jsx";
import CB from "../../styled/CommonBoardStyled.jsx";
import axios from "axios";

import { downloadFile } from "@/utils/fileDownload";

// svg
import AttIcon from "../../components/AttachmentIcon.jsx";
import AttachmentIcon from "../../assets/icon/attachment.svg?react";

const BoardListForm = () => {
  const API_URL = "http://192.168.23.2:5001/board";
  const navigate = useNavigate();
  const location = useLocation();
  const projectCode = location.pathname.split("/")[1];
  const subjectId = location.pathname.split("/")[2];
  const category = location.search.split("=")[1];
  const [isCategory, setIsCategory] = useState(category); // 카테고리 상태
  const [data, setData] = useState([]); // 게시글 데이터 상태
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

  const fetchData = async () => {
    setIsCategory(category);

    try {
      const response = await axios.get(`${API_URL}`, {
        params: {
          code: projectCode,
          category: category,
          id: subjectId,
        },
      });
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [location]);

  return (
    <div
      className="list-wrap"
      onClick={() => {
        if (openPopoverIdx !== null) setOpenPopoverIdx(null);
      }}
    >
      <L.ListWrap
        onClick={(e) => {
          if (openPopoverIdx !== null && e.target === e.currentTarget) {
            setOpenPopoverIdx(null);
          }
        }}
      >
        <CB.Button
          onClick={() =>
            navigate(`write?category=${location.search.split("=")[1]}`, {
              state: { mode: "write", category: isCategory },
            })
          }
        >
          글쓰기
        </CB.Button>

        <L.Content>
          <L.TitleBlock $repeat={isCategory == "common" ? 6 : 5}>
            <p>번호</p>
            {isCategory == "common" && <p>머리말</p>}
            <p style={{ width: "500px" }}>제목</p>
            <p>첨부파일</p>
            <p>등록일</p>
            <p>조회수</p>
          </L.TitleBlock>

          {data.map((item, index) => {
            const isPopover = openPopoverIdx === index;

            const itemDate = new Date(item.date);
            const now = new Date(new Date().getTime());
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
                $repeat={isCategory == "common" ? 6 : 5}
              >
                <div>{index + 1}</div>
                {isCategory == "common" && <div>{item.label}</div>}

                <div className="title">
                  {item.depth >= 1 && <span>└ [답글] </span>}
                  {item.status ? (
                    <p style={{ color: "#a8a8a8" }}>삭제된 글입니다.</p>
                  ) : (
                    <p>{item.title}</p>
                  )}
                </div>
                <div>
                  {item.attachment && !item.status && (
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
                </div>
                <div className="dateTime">{dateTime}</div>
                <div>{item.views}</div>
              </L.Block>
            );
          })}
        </L.Content>
      </L.ListWrap>
    </div>
  );
};

export default BoardListForm;
