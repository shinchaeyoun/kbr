import axios from "axios";
import { useState, useEffect, use } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styled, { css } from "styled-components";
import S from "../styled/GlobalBlock.jsx";
import D from "../styled/DetailStyle.jsx";

const SampleDetailPage = () => {
  const API_URL = "http://192.168.23.2:5100/item";
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const itemIndex = searchParams.get("no");
  const [data, setData] = useState({});
  const [chasiData, setChasiData] = useState([]);

  const currentYear = new Date().getFullYear(); // 현재 연도 가져오기
  const [selectYear, setSelectYear] = useState(currentYear); // selectYear 변수에 현재 연도 저장

  const [chasiAdd, setChasiAdd] = useState(false);

  const [submitData, setSubmitData] = useState({});

  const fatchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/detail/${itemIndex}`);
      const chasiDataResponse = await axios.get(`${API_URL}/chasi`, {
        params: { customer: response.data.title, year: response.data.year },
      });

      setData(response.data);
      setChasiData(chasiDataResponse.data);
    } catch (error) {
      console.error("Error fetching item data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubmitData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChasiSubmit = async () => {
    const updateChasiData = {
      ogIndex: data.index,
      category: data.category,
      title: submitData.title,
      innerUrl: submitData.innerUrl,
      outerUrl: submitData.outerUrl,
      type: submitData.type || "self",
      customer: data.title,
      year: data.year,
      customer: data.title,
      width: submitData.width || 1280,
      height: submitData.height || 760,
    };
    try {
      const response = await axios.post(`${API_URL}/chasi`, updateChasiData);

      if (response.data.msg === "등록 완료") {
        alert("차시가 등록되었습니다.");
        setChasiAdd(false);
        setSubmitData((prev) => ({ ...prev, title: "", outerUrl: "" }));
        fatchData(); // 차시 데이터 재조회
      }
    } catch (error) {
      // console.error("차시 등록 실패:", error);
      // alert("차시 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  useEffect(() => {
    fatchData();
  }, []);

  const [titleEditMode, setTitleEditMode] = useState(false);

  const onChangeTitle = (e) => {
    setData((prev) => ({ ...prev, title: e.target.value }));
    if (e.key === "Enter") {
      handleTitleEdit();
    }
  };

  const openOuterUrl = () => {
    // console.log('data.outerUrl',data);
    
    // window.open(data.outerUrl, "_blank");
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

  const handleTitleEdit = async () => {
    try {
      const response = await axios.patch(`${API_URL}/sample/title`, {
        index: data.index,
        title: data.title,
        year: data.year,
      });
      if (response.data.msg === "수정 완료") {
        alert("제목이 수정되었습니다.");
        fatchData(); // 데이터 재조회
      }
    } catch (error) {
      console.error("제목 수정 실패:", error);
      alert("제목 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleSampleDelete = async () => {
    if (window.confirm("삭제하시겠습니까?")) {
      try {
        const response = await axios.delete(`${API_URL}/sample/delete`, {
          params: { idx: data.index },
        });
        if (response.data.msg === "삭제 완료") {
          alert("샘플이 삭제되었습니다.");
          navigate(-1);
        }
      } catch (error) {
        console.error("샘플 삭제 실패:", error);
        alert("샘플 삭제에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleChasiEdit = async (chasiData) => {
    try {
      const response = await axios.patch(`${API_URL}/chasi`, chasiData);
      if (response.data.msg === "수정 완료") {
        alert("차시가 수정되었습니다.");
        fatchData(); // 차시 데이터 재조회
      }
    } catch (error) {
      console.error("차시 수정 실패:", error);
      alert("차시 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleDelete = async (index) => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      try {
        const response = await axios.delete(`${API_URL}/delete`, {
          params: { idx: index },
        });
        if (response.data.msg === "삭제 완료") {
          alert("차시가 삭제되었습니다.");
          fatchData(); // 차시 데이터 재조회
        }
      } catch (error) {
        console.error("차시 삭제 실패:", error);
        alert("차시 삭제에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  return (
    <D.ChasiWrapper>
      <div className="title">
        <D.Title>
          <D.Select
            type="text"
            name="year"
            value={data.year}
            disabled={!titleEditMode}
            onChange={(e) => {
              if (!titleEditMode) return false; // 제목 수정 모드가 아닐 때는 변경 불가
              setSelectYear(e.target.value);
              setData((prev) => ({ ...prev, year: e.target.value }));
            }}
          >
            {Array.from({ length: 7 }, (_, i) => {
              const year = currentYear + 1 - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </D.Select>

          <D.Input className={titleEditMode ? "edit" : ""} value={data.title || ""} onChange={onChangeTitle} onClick={openOuterUrl}/>
        </D.Title>
        <S.ButtonWrap style={{ flexDirection: "row" }}>
          <S.Button
            onClick={() => {
              setTitleEditMode(!titleEditMode);
              if (titleEditMode) {
                handleTitleEdit();
              }
            }}
          >
            {titleEditMode ? "저장하기" : "수정하기"}
          </S.Button>
          <S.Button onClick={handleSampleDelete}>삭제하기</S.Button>
        </S.ButtonWrap>
      </div>

      {/* 차시등록 */}
      <D.BlockWrapper className="chasi-form">
        <D.Block className="title_">
          <div>
            <p>차시명</p>
          </div>

          <div>
            <D.Input type="text" name="title" onChange={handleChange} value={submitData.title || ""} placeholder="제목을 입력하세요." />
          </div>
        </D.Block>
        <D.Block className="type">
          <div>
            <p>타입</p>
          </div>

          <div>
            <D.RadioItem>
              <input type="radio" name="type" value="self" onChange={handleChange} checked={submitData.type === "self" || !submitData.type} />
              자체
            </D.RadioItem>
            <D.RadioItem>
              <input type="radio" name="type" value="use" onChange={handleChange} checked={submitData.type === "use"} />
              활용
            </D.RadioItem>
          </div>
        </D.Block>
        <D.Block>
          <div>
            <p>내부 경로</p>
          </div>

          <div>
            <D.Input type="text" name="innerUrl" onChange={handleChange} value={submitData.innerUrl || ""} placeholder="내부 경로" />
          </div>
        </D.Block>
        <D.Block>
          <div>
            <p>외부 경로</p>
          </div>

          <div>
            <D.Input type="text" name="outerUrl" onChange={handleChange} value={submitData.outerUrl || ""} placeholder="외부 경로" />
          </div>
        </D.Block>
        <D.Block>
          <div>
            <p>팝업창 사이즈</p>
          </div>

          <S.Group>
            <D.Input type="text" name="width" onChange={handleChange} value={submitData.width || "1280"} placeholder="width" />
            <D.Input type="text" name="height" onChange={handleChange} value={submitData.height || "760"} placeholder="height" />
          </S.Group>
        </D.Block>

        <D.RightBox>
          <S.Button
            onClick={() => {
              handleChasiSubmit();
            }}
          >
            차시 등록하기
          </S.Button>
        </D.RightBox>
      </D.BlockWrapper>
      {/* 차시등록 끝 */}

      {chasiData
        // .sort((a, b) => a.index - b.index)
        .map((item, idx) => (
          <D.ChasiContent key={item.index || idx} $isEditMode={!item.editMode} className={item.editMode ? "edit-mode" : ""}>
            <D.Block>
              <div>차시명</div>
              <D.Input
                type="text"
                name="title"
                value={item.title || ""}
                readOnly={!item.editMode}
                onChange={(e) => {
                  const newChasiData = [...chasiData];
                  newChasiData[idx] = { ...item, title: e.target.value };
                  setChasiData(newChasiData);
                }}
              />
            </D.Block>
            <D.Block className="type">
              <div>
                <p>타입</p>
              </div>
              <div>
                <D.RadioItem>
                  <input
                    type="radio"
                    name={`type-${idx}`}
                    value="self"
                    checked={item.type === "self"}
                    disabled={!item.editMode}
                    onChange={(e) => {
                      const newChasiData = [...chasiData];
                      newChasiData[idx] = { ...item, type: e.target.value };
                      setChasiData(newChasiData);
                    }}
                  />
                  자체
                </D.RadioItem>
                <D.RadioItem>
                  <input
                    type="radio"
                    name={`type-${idx}`}
                    value="use"
                    checked={item.type === "use"}
                    disabled={!item.editMode}
                    onChange={(e) => {
                      const newChasiData = [...chasiData];
                      newChasiData[idx] = { ...item, type: e.target.value };
                      setChasiData(newChasiData);
                    }}
                  />
                  활용
                </D.RadioItem>
              </div>
            </D.Block>
            <D.Block>
              <div>내부 경로</div>
              <D.Input
                type="text"
                name="innerUrl"
                value={item.innerUrl || ""}
                readOnly={!item.editMode}
                onChange={(e) => {
                  const newChasiData = [...chasiData];
                  newChasiData[idx] = { ...item, innerUrl: e.target.value };
                  setChasiData(newChasiData);
                }}
                onClick={handleCopyClick}
                className={!item.editMode ? "activated" : ""}
              />
            </D.Block>
            <D.Block>
              <div>외부 경로</div>
              <D.Input
                type="text"
                name="outerUrl"
                value={item.outerUrl || ""}
                readOnly={!item.editMode}
                onChange={(e) => {
                  const newChasiData = [...chasiData];
                  newChasiData[idx] = { ...item, outerUrl: e.target.value };
                  setChasiData(newChasiData);
                }}
                onClick={(e) => {
                  if (!item.editMode) {
                    e.preventDefault();
                    window.open(item.outerUrl, "_blank", `width=${item.width || 1280},height=${item.height || 760}`);
                  }
                }}
                className={!item.editMode ? "activated" : ""}
              />
            </D.Block>
            <D.Block>
              <div>
                <p>팝업창 사이즈</p>
              </div>
              <S.Group>
                <D.Input
                  type="text"
                  name="width"
                  value={item.width || 1280}
                  readOnly={!item.editMode}
                  onChange={(e) => {
                    const newChasiData = [...chasiData];
                    newChasiData[idx] = { ...item, width: e.target.value };
                    setChasiData(newChasiData);
                  }}
                  placeholder="width"
                />
                <D.Input
                  type="text"
                  name="height"
                  value={item.height || 760}
                  readOnly={!item.editMode}
                  onChange={(e) => {
                    const newChasiData = [...chasiData];
                    newChasiData[idx] = { ...item, height: e.target.value };
                    setChasiData(newChasiData);
                  }}
                  placeholder="height"
                />
              </S.Group>
            </D.Block>
            <S.ButtonWrap>
              <S.Button
                onClick={() => {
                  const newChasiData = [...chasiData];
                  newChasiData[idx] = { ...item, editMode: !item.editMode };
                  setChasiData(newChasiData);
                  // 저장 로직 추가 필요시 여기에
                  handleChasiEdit(newChasiData);
                }}
              >
                {item.editMode ? "저장하기" : "수정하기"}
              </S.Button>
              <S.Button onClick={() => handleDelete(item.index)}>삭제하기</S.Button>
            </S.ButtonWrap>
          </D.ChasiContent>
        ))}
    </D.ChasiWrapper>
  );
};

export default SampleDetailPage;
