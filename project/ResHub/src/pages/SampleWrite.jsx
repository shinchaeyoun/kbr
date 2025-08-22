import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import D from "../styled/DetailStyle.jsx";
import M from "../styled/MainStyled.jsx";

const SampleWrite = () => {
  const API_URL = "http://192.168.23.2:5100/item";
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // 카테고리 관련 상태
  const [year, setYear] = useState();
  const [yearArr, setYearArr] = useState(["2025", "2024", "2023", "2022", "2021", "2020"]);
  const currentYear = new Date().getFullYear(); // 현재 연도 가져오기
  const [selectYear, setSelectYear] = useState(currentYear); // selectYear 변수에 현재 연도 저장

  // 폼 데이터 상태
  const [data, setData] = useState({
    category: searchParams.get("category"),
    title: "",
    year: selectYear,
  });

  // 등록 버튼 클릭 핸들러 (SampleWrite 전용으로 수정 가능)
  const handleSubmit = async () => {
    if (!data.title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/customer`, data);
      if (response.data.msg === "등록 완료") {
        alert("등록되었습니다.");
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
    setData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <D.Wrapper>
      <D.RightBox>
        <M.WriteBtn style={{ width: "auto" }} onClick={handleSubmit}>
          고객사 정보 등록
        </M.WriteBtn>
      </D.RightBox>

      <D.BlockWrapper>
        <D.Block>
          <div>
            <p>연도</p>
          </div>
          <div>
            <D.Select
              type="text"
              name="year"
              value={selectYear}
              onChange={(e) => {
                setSelectYear(e.target.value);
                handleChange(e);
              }}
            >
              {/* {yearArr.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))} */}
              {Array.from({ length: 7 }, (_, i) => {
                const year = currentYear + 1 - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </D.Select>
          </div>
        </D.Block>

        <D.Block>
          <div>
            <p>고객사</p>
          </div>
          <div>
            <D.Input type="text" name="title" value={data.title} onChange={handleChange} placeholder="제목을 입력하세요." />
          </div>
        </D.Block>
      </D.BlockWrapper>
    </D.Wrapper>
  );
};

export default SampleWrite;
