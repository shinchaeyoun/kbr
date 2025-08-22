import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import L from "../../styled/ListStyled.jsx";
import CB from "../../styled/CommonBoardStyled.jsx";
import axios from "axios";

import { downloadFile } from "@/utils/fileDownload";

// svg
import AttIcon from "../../components/AttachmentIcon.jsx";
import AttachmentIcon from "../../assets/icon/attachment.svg?react";
import DoublePrev from "../../assets/icon/double-prev-arrow.svg?react";
import Prev from "../../assets/icon/prev-arrow.svg?react";
import Next from "../../assets/icon/next-arrow.svg?react";
import DoubleNext from "../../assets/icon/double-next-arrow.svg?react";

const fetchBoardList = async ({ projectCode, subjectId, category, limit, offset }) => {
  const API_URL = "http://192.168.23.2:5001/board";
  const response = await axios.get(`${API_URL}`, {
    params: {
      code: projectCode,
      category: category,
      id: subjectId,
      limit: limit,
      offset: offset,
    },
  });
  return response.data;
};

const BoardListForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const projectCode = location.pathname.split("/")[1];
  const subjectId = location.pathname.split("/")[2];
  const category = searchParams.get("category");

  const [pageNo, setPageNo] = useState(Number(searchParams.get("page")) || 1); // 페이지 번호
  const limit = 15;
  const [offset, setOffset] = useState(0); // 현재 페이지 오프셋
  const [openPopoverIdx, setOpenPopoverIdx] = useState(null); // 팝오버 열기/닫기 상태
  const [attachmentList, setAttachmentList] = useState([]);

  // react-query로 게시글 데이터 fetch
  const { data: boardData, isLoading, isError } = useQuery({
    queryKey: ["boardList", projectCode, subjectId, category, limit, offset],
    queryFn: () => fetchBoardList({ projectCode, subjectId, category, limit, offset }),
    keepPreviousData: true,
  });

  const data = boardData?.list || [];
  const totalData = boardData?.totalCount || 0;
  const isPage = Math.ceil(totalData / limit);

  // 페이지 버튼 클릭 핸들러
  const handlePageBtn = (direction) => {
    return () => {
      if (direction === "prev" && offset > 0) {
        setOffset((prevOffset) => prevOffset - limit);
        setPageNo((prev) => prev - 1);
        setSearchParams({ category, page: pageNo - 1 });
      } else if (direction === "next" && offset + limit < totalData) {
        setOffset((prevOffset) => prevOffset + limit);
        setPageNo((prev) => prev + 1);
        setSearchParams({ category, page: pageNo + 1 });
      } else if (direction === "doublePrev") {
        setOffset(0);
        setPageNo(1);
        setSearchParams({ category, page: 1 });
      } else if (direction === "doubleNext") {
        setOffset(limit * (isPage - 1));
        setPageNo(isPage);
        setSearchParams({ category, page: isPage });
      }
    };
  };

  // 파일 다운로드
  const handleDownload = (item, index) => {
    downloadFile({
      url: `http://192.168.23.2:5001/board/filedownload`,
      params: { idx: item.idx, fileIdx: index },
      item,
      index,
    });
  };

  // 페이지 이동 버튼
  const handlePageMove = useCallback(
    (page) => {
      setOffset(limit * (page - 1));
      setPageNo(page);
      setSearchParams({ category, page: page });
    },
    [limit, category, setSearchParams]
  );

  useEffect(() => {
    if (pageNo > 1) setOffset(limit * (pageNo - 1));
  }, [pageNo]);

  if (isLoading) return <div>로딩중...</div>;
  if (isError) return <div>에러 발생</div>;

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
        <CB.Button onClick={() => navigate(`write?category=${category}&type=write`)}>
          글쓰기
        </CB.Button>

        <L.Content>
          <L.TitleBlock $repeat={category == "common" ? 6 : 5}>
            <p>번호</p>
            {category == "common" && <p>머리말</p>}
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
                  navigate(`${item.idx}`);
                  sessionStorage.setItem("pageNo", `${pageNo}`);
                }}
                $repeat={category == "common" ? 6 : 5}
              >
                <div>{index + 1}</div>
                {category == "common" && <div>{item.label}</div>}

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

        {isPage > 0 && (
          <L.PageWrap>
            <DoublePrev onClick={handlePageBtn("doublePrev")} />
            <Prev onClick={handlePageBtn("prev")} />

            {Array.from({ length: isPage }, (_, i) => i + 1).map(
              (pageNumber) => (
                <L.PageButton
                  key={pageNumber}
                  onClick={() => handlePageMove(pageNumber)}
                  className={offset / limit === pageNumber - 1 ? "active" : ""}
                >
                  {pageNumber}
                </L.PageButton>
              )
            )}

            <Next onClick={handlePageBtn("next")} />
            <DoubleNext onClick={handlePageBtn("doubleNext")} />
          </L.PageWrap>
        )}
      </L.ListWrap>
    </div>
  );
};

export default BoardListForm;
