import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import S from "../styled/GlobalBlock.jsx";
import axios from "axios";
import "../styled/boardStyled.scss";

// components
import Deleted from "../components/DeletedPage.jsx";

// svg
import AttIcon from "../components/AttachmentIcon.jsx";
import DownloadIcon from "../assets/icon/download.svg?react";

// utils
import { downloadAllZip } from "@/utils/fileDownloadAll";
import { downloadFile } from "@/utils/fileDownload";

const BoardDetail = () => {
  const API_URL = "http://192.168.23.2:5001/board";
  const navigate = useNavigate();
  const location = useLocation();
  const projectCode = location.pathname.split("/")[1];
  const subjectId = location.pathname.split("/")[2];
  const detailIndex = Number(location.pathname.split("/").slice(-1).join("/"));

  const [detail, setDetail] = useState({});
  const [date, setDate] = useState("");

  const [attachmentList, setAttachmentList] = useState([]);

  const [views, setViews] = useState(detail?.views || 0);
  const hasViewedRef = useRef(false);

  const [isDeleted, setIsDeleted] = useState(false);

  const ReplyMode = () => {
    navigate(`reply`, {
      state: { item: detail, mode: "reply" },
    });
  };
  const EditMode = () => {
    navigate(`edit`, {
      state: { item: detail, mode: "edit" },
    });
  };

  const handleDelete = async () => {
    const deletConfirm = confirm("삭제 하시겠습니까?");

    if (deletConfirm) {
      await axios
        .patch(`${API_URL}/delete`, {
          idx: detailIndex,
        })
        .then((res) => {
          console.log("삭제 요청");
          alert("삭제되었습니다.");
          navigate(`${location.pathname.split("/").slice(0, -1).join("/")}`, {
            state: { category: detail.category },
          });
        })
        .catch((error) => {
          console.error("삭제 요청 중 오류 발생:", error);
        });
    }
  };

  const handleDownloadAll = () => {
    downloadAllZip({
      url: `${API_URL}/downloadAll`,
      params: { idx: detail.idx },
      defaultFileName: `${detail.title}.zip`,
    });
  };

  const handleDownload = (detail, index) => {
    downloadFile({
      url: `${API_URL}/filedownload`,
      params: { idx: detail.idx, fileIdx: index },
      detail,
      index,
    });
  };

  const fetchDetail = async () => {
    try {
      const response = await axios.get(`${API_URL}/detail`, {
        params: {
          boardIndex: detailIndex,
          id: subjectId,
          code: projectCode,
        },
      });
      if (response.data[0].status === "delete") setIsDeleted(true);

      if (response.data[0].attachment) {
        const list = response.data[0].attachment.split("|").map((file) => {
          const [savedName, originalName] = file.split(",");
          return originalName;
        });
        setAttachmentList(list);
      }
      const resDate = new Date(response.data[0].date);
      const year = resDate.getFullYear();
      const month = String(resDate.getMonth() + 1).padStart(2, "0");
      const day = String(resDate.getDate()).padStart(2, "0");
      const date = `${year}-${month}-${day}`;

      const hours = String(resDate.getHours()).padStart(2, "0");
      const minutes = String(resDate.getMinutes()).padStart(2, "0");
      const time = `${hours}:${minutes}`;

      setDetail(response.data[0]);
      setDate(date + " " + time);
      setViews(response.data[0].views || 0);

      sessionStorage.getItem("fromWrite") &&
        sessionStorage.removeItem("fromWrite");
    } catch (error) {
      console.error("게시글 상세 조회 중 오류 발생:", error);
      alert("게시글을 불러오는 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    // 페이지가 로드되면 조회수 증가
    if (detail && detail.idx && !hasViewedRef.current) {
      axios.patch(`${API_URL}/views/${detail.idx}`).then(() => {
        setViews((prev) => prev + 1);
      });
      hasViewedRef.current = true;
    }
  }, [detail]);

  useEffect(() => {
    // 페이지 로드 시 셋팅
    fetchDetail();

    // 페이지 초기 로드 시 첨부파일 목록 설정
    if (detail.attachment) {
      const list = detail.attachment.split("|").map((file) => {
        const [savedName, originalName] = file.split(",");
        return originalName;
      });
      setAttachmentList(list);
    }

    if (sessionStorage.getItem("fromWrite")) {
      sessionStorage.removeItem("fromWrite");
    }
  }, []);

  return (
    <>
      {isDeleted ? (
        <Deleted />
      ) : (
        <>
          <div id="board_detail">
            <div className="title">
              <p>{detail.title}</p>
              <S.ButtonWrap style={{ flexDirection: "row" }}>
                {detail.user == localStorage.getItem("userId") && (
                  <>
                    <S.Button onClick={EditMode}>수정하기</S.Button>
                    <S.Button onClick={handleDelete}>삭제하기</S.Button>
                  </>
                )}
                <S.Button onClick={ReplyMode}>답글달기</S.Button>
              </S.ButtonWrap>
            </div>
            <div className="info">
              <div className="user">{detail.user}</div>
              <div className="block">
                <div className="date">{date}</div>
                <div className="views">읽음 {views}</div>
              </div>

              <div className="flex">
                <div>
                  {detail.attachment && (
                    <>
                      <div className="attachmentTitle">
                        <p>첨부파일: 파일 {attachmentList.length} 개</p>
                        <S.Button onClick={handleDownloadAll}>
                          <DownloadIcon width="15px" height="15px" />
                          전체 다운로드
                        </S.Button>
                      </div>

                      <ul>
                        {attachmentList.map((file, index) => (
                          <li
                            key={index}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownload(item, index);
                            }}
                          >
                            <div>
                              <AttIcon
                                filename={file}
                                width="20px"
                                height="20px"
                              />
                              <p>{file}</p>
                            </div>
                            <DownloadIcon width="20px" height="20px" />
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="content">
              {detail.content &&
                detail.content.split(/\r?\n/).map((line, idx) => (
                  <p key={idx}>
                    {line}
                    <br />
                  </p>
                ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default BoardDetail;
