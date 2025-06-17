import React, { use, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled, { css } from "styled-components";
import S from "../styled/GlobalBlock.jsx";
import B from "../styled/BoardStyled.jsx";
import axios from "axios";
import P from "../styled/ProjectStyled.jsx";

const BoardWrite = () => {
  const API_URL = "http://192.168.23.2:5001/board";
  const location = useLocation();
  const navigate = useNavigate();
  const projectCode = location.pathname.split("/")[1];
  const { item } = location.state || {};

  const [isEdit, setIsEdit] = useState(item ? true : false);

  const [file, setFile] = useState(null);
  const [fileArr, setFileArr] = useState([]);
  const [fileNameArr, setFileNameArr] = useState([]);
  const [fileList, setFileList] = useState(false);
  const [fileNo, setFileNo] = useState(fileArr.length);

  const [data, setData] = useState({
    projectCode: location.pathname.split("/")[1],
    subjectId: location.state?.subjectId || "NULL",
    title: "" || item?.title,
    content: "" || item?.content,
    attachment: file || item?.attachment,
    user: localStorage.getItem("userId"),
  });

  const handleFileDelete = (e) => {
    e.stopPropagation();
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);

    setFileArr((prev) => [...prev, e.target.files[0]]);
    setFileNameArr((prev) => [...prev, e.target.files[0].name]);
    setFileNo((prev) => prev + 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("projectCode", data.projectCode);
      formData.append("subjectId", data.subjectId);
      formData.append("title", data.title);
      formData.append("content", data.content || "");
      formData.append("user", data.user);
      // if (file) formData.append("attachment", file);

      fileArr.forEach((file, idx) => {
        formData.append("attachment", file);
        // formData.append("attachment_name", file.name);
      });

      for (const x of formData.entries()) {
        const name = x[0] == "attachment" && x[1].name;
        if (x[0] == "attachment") formData.append("attachment_name", name);
      }

      if (isEdit) {
        const res = await axios.patch(
          `${API_URL}/update?idx=${item.idx}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        console.log("res", res.data.msg);
      } else if (!isEdit) {
        const res = await axios.post(`${API_URL}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("res", res.data.msg, res.data);
      }

      alert(isEdit ? "수정되었습니다." : "등록되었습니다.");
      navigate(`/${projectCode}/board`);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    file !== null && setFileList(true);
  }, [file, fileArr]);

  return (
    <>
      <B.ButtonWrap>
        <S.Button onClick={handleSubmit}>{item ? "수정" : "등록"}</S.Button>
        {/* <S.Button>등록예약</S.Button>
            <S.Button>임시저장</S.Button>
            <S.Button>미리보기</S.Button> */}
      </B.ButtonWrap>
      <B.OptionWrap>
        <B.Option>
          <div>제목</div>
          <div>
            <B.Input
              type="text"
              name="title"
              value={data.title || ""}
              onChange={handleChange}
            />
          </div>
        </B.Option>
      </B.OptionWrap>
      <B.Content>
        <B.Input type="file" name="attachment" onChange={handleFileChange} />
        {/* {fileList && <>fileArr{fileArr}</>} */}
        {fileList && (
          <>
            {fileNameArr.map((item, index) => {
              return (
                <>
                  <div className="flex" key={index}>
                    <p>{item}</p>
                    <span onClick={handleFileDelete}>삭제</span>
                  </div>
                </>
              );
            })}
          </>
        )}
        <B.Textarea
          name="content"
          value={data.content || ""}
          onChange={handleChange}
        ></B.Textarea>
      </B.Content>
    </>
  );
};

export default BoardWrite;
