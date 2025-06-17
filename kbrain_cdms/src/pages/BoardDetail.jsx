import React, { useState, useEffect, useRef, use } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import S from "../styled/GlobalBlock.jsx";
import B from "../styled/BoardStyled.jsx";
import axios from "axios";
import "../styled/boardStyled.scss";

// svg
import AttIcon from "../components/AttachmentIcon.jsx";
import DownloadIcon from "../assets/icon/download.svg?react";

import { downloadAllZip } from "@/utils/fileDownloadAll";
import { downloadFile } from "@/utils/fileDownload";

const BoardDetail = () => {
  const API_URL = "http://192.168.23.2:5001/board";
  const navigate = useNavigate();
  const location = useLocation();
  const projectCode = location.pathname.split("/")[1];
  const subjectId = location.pathname.split("/")[2];
  // const { item: initialItem } = location.state || {};
  const { detailIndex } = location.state || null;
  const [detail, setDetail] = useState({});
  const [date, setDate] = useState("");

  const [attachmentList, setAttachmentList] = useState([]);

  const [views, setViews] = useState(detail?.views || 0);
  const hasViewedRef = useRef(false);

  const EditMode = () => {
    navigate(`/${projectCode}/board/edit`, {
      state: { item: detail },
    });
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
    console.log("fetchDetail");

    try {
      const response = await axios.get(`${API_URL}/detail`, {
        params: {
          boardIndex: detailIndex,
          id: subjectId,
          code: projectCode,
        },
      });

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

      sessionStorage.getItem("fromWrite") && sessionStorage.removeItem("fromWrite");
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
      // navigate(-1)로 돌아온 것임
      console.log("navigate(-1)로 돌아옴");
      sessionStorage.removeItem("fromWrite");
    }
  }, []);

  // useEffect(() => {
  //   if(initialItem && initialItem.idx) {
  //     axios.get(`${API_URL}`, {
  //       params: {
  //         boardIndex: initialItem.idx,
  //         code: projectCode
  //       },
  //     }).then((res) => {
  //       if (res.data && res.data[0]) setDetail(res.data[0]);
  //     });
  //   }
  // }, [initialItem?.idx, projectCode]);

  // useEffect(() => {
  //   // 최초 마운트 또는 item.idx 변경 시 최신 데이터 fetch

  //   console.log("useEffect detail.idx ==>", detail.idx);

  //   axios.get(`${API_URL}`, {
  //       params: {
  //         boardIndex: detail.idx,
  //         code: projectCode
  //       },
  //     }).then((res) => {
  //       console.log("받아온 데이터", res.data[0]);

  //     setDetail(res.data[0]);
  //   });
  // }, [detail.idx]);

  return (
    <>
      <div id="board_detail">
        <div className="title">
          <p>{detail.title}</p>
          {detail.user == localStorage.getItem("userId") && (
            <S.Button onClick={EditMode}>수정하기</S.Button>
          )}
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
                          <AttIcon filename={file} width="20px" height="20px" />
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
  );
};

export default BoardDetail;
