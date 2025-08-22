import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import D from "../styled/DetailStyle.jsx";
import M from "../styled/MainStyled.jsx";

import AttIcon from "../components/AttachmentIcon.jsx";

const Write = () => {
  const API_URL = "http://192.168.23.2:5100";
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [itemNo, setItemNo] = useState(searchParams.get("no") || "");

  // 파일 관련 상태
  const [fileArr, setFileArr] = useState([]);
  const [fileNameArr, setFileNameArr] = useState([]);
  const [fileList, setFileList] = useState(false);
  const fileInputRef = useRef();

  // 썸네일 관련 상태
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);

  // 카테고리 관련 상태
  const [labelArr, setLabelArr] = useState([]);
  const [label, setLabel] = useState("");

  // 폼 데이터 상태
  const [data, setData] = useState({
    title: "",
    category: "",
    description: "",
    innerUrl: "",
    outerUrl: "",
    thumb: "",
    tag: "",
    user: localStorage.getItem("userId") || "anonymous",
  });

  const [tagArr, setTagArr] = useState([]);
  const [tagItemList, setTagItemList] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  // 수정모드 진입시
  const fetchItem = async () => {
    setIsEditMode(true);
    try {
      const response = await axios.get(`${API_URL}/item/edit/${itemNo}`);
      console.log("response.data", response.data);

      if (response.data) {
        setData(response.data);
        const tag = response.data.tag
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag);
        setTagArr(tag);
        setPreviewUrl(response.data.thumb);
      }
    } catch (error) {
      console.error("Error fetching item data:", error);
    }
  };

  // 페이지 초기화 시 카테고리 데이터 가져오기
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/info/cate`);
      if (response.data && Array.isArray(response.data)) {
        const categories = response.data[0].value.split(",");
        setLabelArr(categories);
        if (searchParams.get("category")) {
          setLabel(searchParams.get("category"));
          setData((prev) => ({ ...prev, category: searchParams.get("category") }));
        } else {
          setLabel(categories[0]);
        }
      } else {
        console.error("Invalid category data format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // 등록 버튼 클릭 핸들러
  const handleSubmit = async () => {
    // 필수 필드 검증
    if (!data.title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("category", label);
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("innerUrl", data.innerUrl);
      formData.append("outerUrl", data.outerUrl);
      formData.append("tag", data.tag);
      formData.append("user", data.user);

      // 첨부파일 추가
      fileArr.forEach((file) => formData.append("attachment", file));
      fileArr.forEach((file) => formData.append("attachment_name", file.name));

      // 썸네일 업로드 처리
      let uploadedFilePath = "";
      if (previewFile) {
        uploadedFilePath = await handleFileUpload(previewFile);
        formData.append("thumb", uploadedFilePath);
      }

      const response = await axios.post(`${API_URL}/item`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.msg === "등록 완료") {
        alert("등록되었습니다.");
        navigate(-1);
      }
    } catch (error) {
      console.error("등록 실패:", error);
      alert("등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleUpdate = async () => {
    console.log('handleUpdate');
    
    // 필수 필드 검증
    if (!data.title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("category", label);
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("innerUrl", data.innerUrl);
      formData.append("outerUrl", data.outerUrl);
      formData.append("tag", data.tag);
      formData.append("user", data.user);

      // 첨부파일 추가
      fileArr.forEach((file) => formData.append("attachment", file));
      fileArr.forEach((file) => formData.append("attachment_name", file.name));

      // 썸네일 업로드 처리
      let uploadedFilePath = "";
      if (previewFile) {
        // 새로 업로드한 썸네일이 있으면 업로드
        uploadedFilePath = await handleFileUpload(previewFile);
        formData.append("thumb", uploadedFilePath);
      } else {
        // 새로 업로드하지 않았다면 기존 썸네일 유지
        formData.append("thumb", data.thumb || "");
      }

      const response = await axios.patch(`${API_URL}/item/update?index=${data.index}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.msg === "수정 완료") {
        alert("수정되었습니다.");
        navigate(-1);
      }
    } catch (error) {
      console.error("등록 실패:", error);
      alert("등록에 실패했습니다. 다시 시도해주세요.");
    }

  };

  // 폼 데이터 변경 핸들러
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "thumb" && files && files[0]) {
      const file = files[0];
      handleImageUpload(file);
      setData((prev) => ({ ...prev, [name]: file.name }));
    } else {
      setData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const fetchTagList = async () => {
    try {
      const response = await axios.get(`${API_URL}/item/tag`);

      // console.log("전체 태그 조회",response.data);
      response.data.map((tag) => {
        // console.log("태그:", tag.tag);
        let tagItem = tag.tag.split(",");
        // setTagArr((prev) => [...prev, tag.tag]);

        setTagItemList((prev) => {
          const merged = [...prev, ...tagItem];
          // 중복 제거 및 공백 제거
          return Array.from(new Set(merged.map((t) => t.trim()).filter(Boolean)));
        });

        // tagItem.forEach((item) => {
        //   if (item && !tagArr.includes(item.trim())) {
        //     setTagArr((prev) => [...prev, item.trim()]);
        //   }
        // }
      });

      // if (response.data && Array.isArray(response.data)) {
      //   setTagArr(response.data.map((tag) => tag.name));
      // } else {
      //   console.error("Invalid tag data format:", response.data);
      // }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  // 태그 입력 처리
  const handleTagChange = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (newTag && !tagArr.includes(newTag)) {
        const updatedTags = [newTag, ...tagArr];
        setTagArr(updatedTags);
        setData((prev) => ({ ...prev, tag: updatedTags.join(",") }));
      }
      e.target.value = "";
    }
  };

  // 태그 삭제 핸들러
  const handleTagDelete = (index) => {
    setTagArr((prev) => {
      const newTags = prev.filter((_, idx) => idx !== index);
      setData((prevData) => ({ ...prevData, tag: newTags.join(",") }));
      return newTags;
    });
  };

  // 이미지 미리보기 생성
  const handleImageUpload = (file) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setPreviewFile(file);
  };

  // 이미지 파일 서버 업로드
  const handleFileUpload = async (file = previewFile) => {
    if (!file) {
      return data.thumb || "";
    }

    const reader = new FileReader();
    const fileName = data.thumb && data.thumb !== "" ? data.thumb.split("/").pop() : file.name;

    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        const base64Image = reader.result;
        const originalName = fileName === "default.png" ? file.name : fileName;

        try {
          const response = await axios.post(`${API_URL}/item/thumbupload`, {
            base64Image,
            originalName,
          });

          setData((prevData) => ({
            ...prevData,
            thumb: response.data.thumb,
          }));

          resolve(response.data.thumb);
        } catch (error) {
          console.error("이미지 업로드 실패:", error);
          alert("이미지 업로드 실패");
          reject(error);
        }
      };

      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // 첨부파일 등록
  const handleFileChange = (e) => {
    if (fileNameArr.length >= 3) {
      alert("첨부파일은 최대 3개까지 등록할 수 있습니다.");
      e.target.value = "";
      return;
    }

    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFileArr((prev) => [...prev, selectedFile]);
      setFileNameArr((prev) => [...prev, selectedFile.name]);
      setFileList(true);
    }
  };

  // 첨부파일 삭제
  const handleFileDelete = (e, index) => {
    e.stopPropagation();

    setFileArr((prev) => prev.filter((_, idx) => idx !== index));
    setFileNameArr((prev) => prev.filter((_, idx) => idx !== index));

    if (fileNameArr.length <= 1) {
      setFileList(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // 첨부파일 상태 업데이트
  useEffect(() => {
    setFileList(fileNameArr.length > 0);
  }, [fileNameArr]);

  // 페이지 초기화
  useEffect(() => {
    if (itemNo) {
      fetchItem();
    }
    fetchCategories();
    fetchTagList();
  }, []);

  // 메모리 해제
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <D.Wrapper>
      <D.RightBox>{isEditMode ? <M.WriteBtn onClick={() => handleUpdate()}>수정</M.WriteBtn> : <M.WriteBtn onClick={() => handleSubmit()}>저장</M.WriteBtn>}</D.RightBox>

      <D.BlockWrapper>
        <D.Block className="category">
          <div>
            <p>카테고리</p>
          </div>
          <div>
            <D.Select
              name="category"
              value={data.category}
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
            </D.Select>
          </div>
        </D.Block>

        <D.Block className="title_">
          <div>
            <p>제목</p>
          </div>

          <div>
            <D.Input type="text" name="title" value={data.title || ""} onChange={handleChange} placeholder="제목을 입력하세요." />
          </div>
        </D.Block>

        <D.Block className="description">
          <div>
            <p>내용</p>
          </div>

          <div>
            <D.Textarea placeholder="내용을 입력하세요." name="description" value={data.description || ""} onChange={handleChange}></D.Textarea>
          </div>
        </D.Block>

        {label !== "포팅 가이드" && (
          <D.Block className="thumbnail">
            <div>
              <p>썸네일</p>
            </div>

            <div>
              <D.Input type="file" accept="image/*" name="thumb" onChange={handleChange} />
            </div>
            {previewUrl !== null && (
              <>
                <div>썸네일 미리보기</div>
                <D.Thumbnail $bg={previewUrl} alt="previewUrl 미리보기" />
              </>
            )}
          </D.Block>
        )}

        <D.Block className="attachment">
          <div>
            <p>첨부파일</p>
          </div>

          <div>
            <D.Content>
              <D.Input type="file" name="attachment" onChange={handleFileChange} ref={fileInputRef} />

              {fileList && (
                <div className="fileList">
                  {fileNameArr.map((item, index) => {
                    return (
                      <div className="flex" key={index}>
                        <div className="box">
                          <AttIcon filename={item} width="20px" height="20px" />
                          <p>{item}</p>
                        </div>
                        <span onClick={(e) => handleFileDelete(e, index)}>삭제</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </D.Content>
          </div>
        </D.Block>

        {label !== "포팅 가이드" && (
          <D.Block className="innerUrl">
            <div>
              <p>내부 경로</p>
            </div>

            <div>
              <D.Input type="text" name="innerUrl" value={data.innerUrl || ""} onChange={handleChange} placeholder="내부 경로" />
            </div>
          </D.Block>
        )}

        {label !== "포팅 가이드" && (
          <D.Block className="outerUrl">
            <div>
              <p>외부 경로</p>
            </div>

            <div>
              <D.Input type="text" name="outerUrl" value={data.outerUrl || ""} onChange={handleChange} placeholder="외부 경로" />
            </div>
          </D.Block>
        )}

        {label !== "포팅 가이드" && (
          <D.Block className="tag">
            <div>
              <p>태그</p>
            </div>

            <div>
              <D.TagWrap>
                <D.Input type="text" name="tag" onChange={handleTagChange} onKeyDown={handleTagChange} placeholder="Enter로 추가하세요." />

                {tagArr.length > 0 && (
                  <div>
                    {tagArr.map((tag, index) => (
                      <D.Tag key={index} onClick={() => handleTagDelete(index)}>
                        {tag}
                      </D.Tag>
                    ))}
                  </div>
                )}
              </D.TagWrap>
            </div>

            <div></div>
            <D.TagList>
              {tagItemList.length > 0 &&
                tagItemList.map((tag, index) => (
                  <D.Tag
                    key={index}
                    onClick={() => {
                      if (!tagArr.includes(tag)) {
                        setTagArr((prev) => [...prev, tag]);
                        setData((prev) => ({
                          ...prev,
                          tag: [...prev.tag.split(","), tag].join(","),
                        }));
                      }
                    }}
                  >
                    {tag}
                  </D.Tag>
                ))}
            </D.TagList>
          </D.Block>
        )}
      </D.BlockWrapper>
    </D.Wrapper>
  );
};

export default Write;
