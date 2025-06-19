import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import S from "../styled/GlobalBlock.jsx";
import B from "../styled/BoardStyled.jsx";
import axios from "axios";

// svg
import AttIcon from "../components/AttachmentIcon.jsx";

const BoardWrite = () => {
  const API_URL = "http://192.168.23.2:5001/board";
  const location = useLocation();
  const navigate = useNavigate();
  const projectCode = location.pathname.split("/")[1];
  const subjectId = location.pathname.split("/")[2];
  const category = location.state?.category || "";
  const { item } = location.state || {};

  const [isMode, setIsMode] = useState(location.state.mode || "write");
  const [file, setFile] = useState(null);
  const [fileArr, setFileArr] = useState([]);
  const [fileNameArr, setFileNameArr] = useState([]);
  const [fileList, setFileList] = useState(false);
  const fileInputRef = useRef();

  // const basePath = location.pathname.split("/").slice(0, 4).join("/");
  const basePath = isMode == "reply" ? location.pathname.split("/").slice(0, -2).join("/") :location.pathname.split("/").slice(0, -1).join("/");

  const [selectCategory, setSelectCategory] = useState(
    location.state?.category || ""
  );

  // const [data, setData] = useState({
  //   projectCode: location.pathname.split("/")[1],
  //   subjectId: location.pathname.split("/")[2],
  //   category: "" || selectCategory,
  //   tag: "" || item?.tag,
  //   title: "" || item?.title,
  //   content: "" || item?.content,
  //   attachment: file || item?.attachment,
  //   user: localStorage.getItem("userId"),
  // });
  const [data, setData] = useState({
    projectCode: location.pathname.split("/")[1],
    subjectId: location.pathname.split("/")[2],
    category: "" || selectCategory,
    tag: "",
    title: "",
    content: "",
    attachment: file,
    user: localStorage.getItem("userId"),
  });

  const handleFileDelete = (e, index) => {
    e.stopPropagation();
    if (
      isMode == "edit" &&
      item?.attachment &&
      index < item.attachment.split("|").length
    ) {
      setFileNameArr((prev) => prev.filter((_, idx) => idx !== index));
    } else {
      // 새로 업로드한 파일 삭제
      const arrIdx =
        index - (item?.attachment ? item.attachment.split("|").length : 0);
      setFileArr((prev) => prev.filter((_, idx) => idx !== arrIdx));
      setFileNameArr((prev) => prev.filter((_, idx) => idx !== index));
    }

    if (fileNameArr.length == 1) {
      setFileList(false);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e) => {
    const totalCount = fileNameArr.length;
    if (totalCount >= 3) {
      alert("첨부파일은 최대 3개까지 등록할 수 있습니다.");
      e.target.value = "";
      return;
    }
    setFile(e.target.files[0]);
    setFileArr((prev) => [...prev, e.target.files[0]]);
    setFileNameArr((prev) => [...prev, e.target.files[0].name]);
    setFileList(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("index", item?.idx || null);
      formData.append("isMode", isMode);
      formData.append("projectCode", data.projectCode);
      formData.append("subjectId", data.subjectId);
      // 카테고리 추가하기
      formData.append("category", selectCategory || null); // 카테고리 값이 필요하면 여기에 추가
      formData.append("title", data.title || "[제목 없음]");
      formData.append("content", data.content || "");
      formData.append("user", data.user);

      fileArr.forEach((file, idx) => formData.append("attachment", file));

      for (const x of formData.entries()) {
        const name = x[0] == "attachment" && x[1].name;
        if (x[0] == "attachment") formData.append("attachment_name", name);
        if (x[0] == "category") {
          // console.log("카테고리 값", x[1]);
        }
      }

      if (isMode == "edit" && item?.attachment) {
        const remainFiles = fileNameArr.filter((name) =>
          item.attachment
            .split("|")
            .map((f) => f.split(",")[1])
            .includes(name)
        );
        formData.append("remain_files", JSON.stringify(remainFiles));
      }

      if (isMode == "edit") {
        const res = await axios.patch(
          `${API_URL}/update?idx=${item.idx}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (res.data.msg === "전송 성공") {
          alert("수정되었습니다.");
          sessionStorage.setItem("fromWrite", "1");
          navigate(-1);
        }
      } else if (isMode == "write" || isMode == "reply") {
        const res = await axios.post(`${API_URL}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.data.msg === "전송 성공") {
          alert("등록되었습니다.");
          console.log('basePath ==>', basePath);
          
          sessionStorage.setItem("fromWrite", "1");
          navigate(`${basePath}`, { state: { category: selectCategory } });
          // navigate(-1);
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    file !== null && setFileList(true);
    if (fileNameArr.length == 0) setFileList(false);
  }, [file, fileArr]);

  useEffect(() => {
    // if (item) {
    if (isMode == "edit") {
      setData((prev) => ({
        ...prev,
        category: item.category,
        title: item.title,
        content: item.content,
        attachment: item.attachment,
      }));

      setSelectCategory(item.category);
    }
    if (isMode == "reply") {
      setSelectCategory(item.category);
    }
  }, []);

  useEffect(() => {
    // if (isMode == "edit" && item?.attachment) {
    //   const names = item.attachment.split("|").map((f) => f.split(",")[1]);
    //   setFileNameArr(names);
    //   setFileArr([]);
    //   setFileList(true);
    // }
  }, [isMode, item]);

  return (
    <>
      {category}
      <B.ButtonWrap>
        <S.Button onClick={handleSubmit}>
          {isMode == "edit" ? "수정" : "등록"}
        </S.Button>
        {/* <S.Button>등록예약</S.Button>
            <S.Button>임시저장</S.Button>
            <S.Button>미리보기</S.Button> */}
      </B.ButtonWrap>
      <B.OptionWrap>
        <B.Option>
          <div>
            <p>제목</p>
          </div>
          <div>
            <B.Input
              type="text"
              name="title"
              value={data.title || ""}
              onChange={handleChange}
            />
          </div>
        </B.Option>

        <B.Option>
          <div>
            <p>카테고리</p>
          </div>
          <div>
            <S.Select
              name="category"
              value={selectCategory}
              onKeyDown={(e) => {
                // handleKeyPress(e);
                e.preventDefault();
              }}
              onChange={(e) => {
                setSelectCategory(e.target.value);
                handleChange(e);
              }}
            >
              <option value="원고">원고</option>
              <option value="스토리보드">스토리보드</option>
              <option value="영상">영상</option>
            </S.Select>
          </div>
        </B.Option>

        <B.Option>
          <div>
            <p>첨부파일</p>
          </div>
          <div>
            <B.Content>
              <B.Input
                type="file"
                name="attachment"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
              {fileList && (
                <div className="fileList">
                  {fileNameArr.map((item, index) => {
                    return (
                      <div className="flex" key={index}>
                        <div className="box">
                          <AttIcon filename={item} width="20px" height="20px" />
                          <p>{item}</p>
                        </div>
                        <span onClick={(e) => handleFileDelete(e, index)}>
                          삭제
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </B.Content>
          </div>
        </B.Option>

        <B.Option>
          <div>
            <p>내용</p>
          </div>
          <div>
            <B.Textarea
              name="content"
              value={data.content || ""}
              onChange={handleChange}
            ></B.Textarea>
          </div>
        </B.Option>
      </B.OptionWrap>
    </>
  );
};

export default BoardWrite;
