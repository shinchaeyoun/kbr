import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import S from "../styled/GlobalBlock.jsx";
import B from "../styled/BoardStyled.jsx";
import axios from "axios";
import "../styled/boardStyled.scss";

import DownloadIcon from "../assets/icon/download.svg?react";

import { downloadAllZip } from "@/utils/fileDownloadAll";

const BoardDetail = () => {
  const API_URL = "http://192.168.23.2:5001/board";
  const navigate = useNavigate();
  const location = useLocation();
  const projectCode = location.pathname.split("/")[1];
  const { item } = location.state || {};

  const [views, setViews] = useState(item?.views || 0);
  const hasViewedRef = useRef(false);

  const [attachmentList, setAttachmentList] = useState([]);

  const EditMode = () => {
    navigate(`/${projectCode}/board/edit`, {
      state: { item },
    });
  };

  
const handleDownloadAll = () => {
  downloadAllZip({
    url: `${API_URL}/downloadAll`,
    params: { idx: item.idx },
    defaultFileName: `${item.title}.zip`
  });
};
  // 전체 파일 다운로드 (zip)
  const downloadAll = async () => {
    try {
      const response = await axios.get(`${API_URL}/downloadAll`, {
        params: { idx: item.idx },
        responseType: "blob",
      });

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
    }
  };

  // 개별 파일 다운로드
  const fileDownload = async (e, item, index) => {
    e.stopPropagation();
    const originalName = item.attachment.split("|").map((file, idx) => {
      const [savedName, originalName] = file.split(",");
      return originalName;
    })[index];

    try {
      const response = await axios.get(`${API_URL}/filedownload`, {
        params: { idx: item.idx, fileIdx: index },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const a = document.createElement("a");
      a.href = url;
      a.download = originalName || "download";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        a.remove();
      }, 100);
    } catch (err) {
      alert("파일 다운로드 실패");
    }
  };

  useEffect(() => {
    if (item && item.idx && !hasViewedRef.current) {
      axios.patch(`${API_URL}/views/${item.idx}`).then(() => {
        setViews((prev) => prev + 1);
      });
      hasViewedRef.current = true;
    }
  }, [item]);

  useEffect(() => {
    if (item.attachment) {
      const list = item.attachment.split("|").map((file) => {
        const [savedName, originalName] = file.split(",");
        return originalName;
      });
      setAttachmentList(list);
    }
  }, []);

  return (
    <>
      <div id="board_detail">
        <div className="title">
          <p>{item.title}</p>
          {item.user == localStorage.getItem("userId") && (
            <S.Button onClick={EditMode}>수정하기</S.Button>
          )}
        </div>
        <div className="info">
          <div className="user">{item.user}</div>
          <div className="block">
            <div className="date">2025. 05. 20{item.date}</div>
            <div className="views">읽음 {views}</div>
          </div>

          <div className="flex">
            <div>
              {item.attachment && (
                <>
                  <div className="attachmentTitle">
                    <p>첨부파일: 파일 {attachmentList.length} 개</p>
                    {/* <S.Button onClick={downloadAll}> */}
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
                          fileDownload(e, item, index);
                        }}
                      >
                        <p>{file}</p>
                        <DownloadIcon width="20px" height="20px" />
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="content">{item.content}</div>
      </div>
    </>
  );
};

export default BoardDetail;
