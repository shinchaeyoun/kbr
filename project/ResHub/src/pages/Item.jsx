import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import S from "../styled/GlobalBlock.jsx";
import D from "../styled/DetailStyle.jsx";
import "../styled/itemStyle.scss";
import axios from "axios";

// components
import Deleted from "../components/DeletedPage.jsx";

// svg
import AttIcon from "../components/AttachmentIcon.jsx";
import DownloadIcon from "../assets/icon/download.svg?react";

// utils
import { downloadAllZip } from "@/utils/fileDownloadAll";
import { downloadFile } from "@/utils/fileDownload";

const Item = () => {
  const API_URL = import.meta.env.VITE_API_URL || "http://192.168.23.2:5100/item";
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const itemIndex = searchParams.get("no");
  const [data, setData] = useState({});

  const [date, setDate] = useState("");
  const hasViewedRef = useRef(false);

  const [tagArr, setTagArr] = useState([]);

  const attachmentList = data.attachment ? data.attachment.split("|").map((file) => file.split(",")[1]) : [];

  const [isDeleted, setIsDeleted] = useState(false);
  const [category, setCategory] = useState("");

  const EditMode = async () => {
    // 수정모드
    navigate(`/edit?no=${itemIndex}`);
  };

  const handleDelete = async () => {
    if (window.confirm("삭제하시겠습니까?")) {
      try {
        const response = await axios.delete(`${API_URL}/delete`, {
          params: { idx: data.index },
        });
        if (response.data.msg === "삭제 완료") {
          alert("삭제되었습니다.");
          navigate(-1);
        }
      } catch (error) {
        console.error("삭제 실패:", error);
        alert("삭제에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleDownloadAll = () => {
    downloadAllZip({
      url: `${API_URL}/downloadAll`,
      params: { idx: data.index },
      defaultFileName: `${data.title || "[제목 없음]"}.zip`,
    });
  };

  const handleDownload = (item, index) => {
    downloadFile({
      url: `${API_URL}/filedownload`,
      params: { idx: data.index, fileIdx: index },
      item,
      index,
    });
  };

  const handleCopyClick = () => {
    const innerUrlInput = document.createElement("input");
    innerUrlInput.value = data.innerUrl;
    document.body.appendChild(innerUrlInput);
    innerUrlInput.select();
    document.execCommand("copy");
    document.body.removeChild(innerUrlInput);
    alert("클립보드에 복사되었습니다!");
  };

  const fatchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/detail/${itemIndex}`);
      setCategory(response.data.category);
      setData(response.data);
      setDate(response.data.date);
      setTagArr(response.data.tag ? response.data.tag.split(",") : []);
    } catch (error) {
      console.error("Error fetching item data:", error);
    }
  };

  useEffect(() => {
    // 페이지가 로드되면 조회수 증가
    if (data && data.idx && !hasViewedRef.current) {
      //   axios.patch(`${API_URL}/views/${data.idx}`).then(() => {
      //     setViews((prev) => prev + 1);
      //   });
      //   hasViewedRef.current = true;
    }
  }, [data]);

  useEffect(() => {
    fatchData();
  }, []);

  return (
    <>
      {isDeleted ? (
        <D.Wrapper>
          <Deleted />
        </D.Wrapper>
      ) : (
        <D.Wrapper>
          <div className="title">
            <D.Title>{data.title}</D.Title>
            <S.ButtonWrap style={{ flexDirection: "row" }}>
              {data.user == localStorage.getItem("userId") && (
                <>
                  <S.Button onClick={EditMode}>수정하기</S.Button>
                  <S.Button onClick={handleDelete}>삭제하기</S.Button>
                </>
              )}
            </S.ButtonWrap>
          </div>

          <div className="info">
            <div className="user">{data.user}</div>
            <div className="block">
              <div className="date">{date}</div>
            </div>

            <div className="flex">
              <div>
                {data.attachment && (
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
                            handleDownload(data, index);
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

            {category !== "포팅 가이드" && (
              <div className="innerUrl">
                <div>내부경로</div>
                <div style={{ cursor: "pointer" }} onClick={handleCopyClick} title="클립보드로 복사">
                  <a>{data.innerUrl}</a>
                </div>
              </div>
            )}

            {category !== "포팅 가이드" && (
              <div className="outerUrl">
                <div>외부경로</div>
                <div>
                  <a
                    href={data.outerUrl}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(data.outerUrl, "_blank", `width=${data.width || 1280},height=${data.height || 720}`);
                      e.preventDefault();
                    }}
                    style={{ display: "inline-flex" }}
                    title="링크로 이동"
                  >
                    {data.outerUrl}
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="outerUrl">
            {data.outerUrl && (
              <>
                <div style={{ textAlign: "center", marginBottom: "20px" }}>크로스브라우징 이슈로 화면이 안나오는 경우 외부 팝업으로 확인</div>
                <iframe
                  src={data.outerUrl || "https://via.placeholder.com/150"}
                  title="Preview"
                  width="100%"
                  height="600"
                  style={{ border: "1px solid #ccc", borderRadius: "4px" }}
                ></iframe>
              </>
            )}
          </div>

          <div className="content">
            {data.description &&
              data.description.split(/\r?\n/).map((line, idx) => (
                <p key={idx}>
                  {line}
                  <br />
                </p>
              ))}
          </div>

          {tagArr.length > 0 && (
            <div className="tag_container">
              {tagArr.map((tag, index) => (
                <div className="tag" key={index} onClick={() => navigate(`/?tag=${tag}`)}>
                  <span>#</span>
                  {tag}
                </div>
              ))}
            </div>
          )}
        </D.Wrapper>
      )}
    </>
  );
};

export default Item;
