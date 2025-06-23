import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import S from "../styled/GlobalBlock.jsx";
import B from "../styled/BoardStyled.jsx";
import axios from "axios";
import AttIcon from "../components/AttachmentIcon.jsx";
import { changeCateName } from "@/utils/changeCateName";

const BoardWrite = () => {
  const API_URL = "http://192.168.23.2:5001/board";
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const projectCode = location.pathname.split("/")[1];
  const subjectId = location.pathname.split("/")[2];
  const [item, setItem] = useState({});
  const isMode = location.pathname.split("/").slice(-1).join("/");
  const [categoryName, setCategoryName] = useState("");
  const [categoryNameKr, setCategoryNameKr] = useState("");
  const [cateArr, setCateArr] = useState([]);
  const [progArr, setPorgArr] = useState([]);
  const labelArr = ["회의록", "공지사항", "기타"];
  const [label, setLabel] = useState("기타");
  const [file, setFile] = useState(null);
  const [fileArr, setFileArr] = useState([]);
  const [fileNameArr, setFileNameArr] = useState([]);
  const [fileList, setFileList] = useState(false);
  const fileInputRef = useRef();
  const basePath =
    isMode == "reply" || isMode == "update"
      ? location.pathname.split("/").slice(0, -2).join("/")
      : location.pathname.split("/").slice(0, -1).join("/");
  const [data, setData] = useState({
    projectCode: projectCode,
    subjectId: subjectId,
    category: categoryName,
    label: "",
    title: "",
    content: "",
    attachment: file,
    user: localStorage.getItem("userId"),
  });

  const handleFileDelete = (e, index) => {
    e.stopPropagation();
    if (
      isMode == "update" &&
      item?.attachment &&
      index < item.attachment.split("|").length
    ) {
      setFileNameArr((prev) => prev.filter((_, idx) => idx !== index));
    } else {
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

    fileInputRef.current.value = "";
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
      formData.append("isMode", isMode); // 필요한가 ?
      formData.append("projectCode", data.projectCode);
      formData.append("subjectId", data.subjectId);
      formData.append("category", categoryName || null);
      formData.append("label", label || null);
      formData.append("title", data.title || "[제목 없음]");
      formData.append("content", data.content || "");
      formData.append("user", data.user);
      fileArr.forEach((file, idx) => formData.append("attachment", file));
      for (const x of formData.entries()) {
        const name = x[0] == "attachment" && x[1].name;
        if (x[0] == "attachment") formData.append("attachment_name", name);
      }
      if (isMode == "update" && item?.attachment) {
        const remainFiles = fileNameArr.filter((name) =>
          item.attachment
            .split("|")
            .map((f) => f.split(",")[1])
            .includes(name)
        );
        formData.append("remain_files", JSON.stringify(remainFiles));
      }
      const req =
        isMode === "update"
          ? axios.patch(`${API_URL}/update?idx=${item.idx}`, formData, {
              headers: { "Content-Type": "multipart/form-data" },
            })
          : axios.post(`${API_URL}`, formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
      const res = await req;
      if (res.data.msg === "전송 성공") {
        alert(isMode === "update" ? "수정되었습니다." : "등록되었습니다.");
        // sessionStorage.setItem("fromWrite", "1");
        navigate(`${basePath}?category=${categoryName}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const fatchCategory = async () => {
    if (searchParams.has("category")) {
      const categoryName = searchParams.get("category");
      setCategoryNameKr(changeCateName(categoryName));
      setCategoryName(categoryName);
    }
  };

  const fatchData = async () => {
    fatchCategory();
    const boardIndex = searchParams.get("no");
    const response = await axios.get(`${API_URL}/detail`, {
      params: {
        boardIndex: boardIndex,
      },
    });
    const item = response.data[0];
    if (isMode == "update") {
      setData((prev) => ({
        ...prev,
        category: item.category,
        title: item.title,
        content: item.content,
        attachment: item.attachment,
      }));
    }
    setItem(item);
    setCategoryName(item.category);
    setCategoryNameKr(changeCateName(item.category));
  };

  useEffect(() => {
    file !== null && setFileList(true);
    if (fileNameArr.length == 0) setFileList(false);
  }, [file, fileArr]);

  useEffect(() => {
    isMode == "write" && fatchCategory();
    isMode == "update" && fatchData();
    isMode == "reply" && fatchData();
  }, []);

  const test = () => {
    console.log("테스트 버튼 클릭 categoryNameKr ==>", categoryNameKr);
  };

  return (
    <>
      게시판 : {categoryNameKr}
      <B.ButtonWrap>
        <S.Button onClick={test}>test</S.Button>
        <S.Button onClick={handleSubmit}>
          {isMode == "update" ? "수정" : "등록"}
        </S.Button>
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
        {categoryName == "common" && (
          <B.Option>
            <div>
              <p>말머리</p>
            </div>
            <div>
              <B.Select
                name="label"
                value={label}
                onKeyDown={(e) => {
                  e.preventDefault();
                }}
                onChange={(e) => {
                  setLabel(e.target.value);
                  handleChange(e);
                }}
              >
                {labelArr.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </B.Select>
            </div>
          </B.Option>
        )}
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
