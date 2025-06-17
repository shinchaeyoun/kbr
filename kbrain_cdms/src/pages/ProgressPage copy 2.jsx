import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import S from "../styled/GlobalBlock.jsx";
import P from "../styled/ProgressStyled.jsx";
import axios from "axios";

const optionArr = ["진행전", "진행중", "수정중", "1차 완료", "완료"];
const optionCss = ["before", "ing", "edit", "firstDone", "done"];

// progressCate 배열을 한글로 변환
const mapProgressItemToKorean = (progressCate) => {
  const map = {
    script: "원고",
    sb: "스토리보드",
    voice: "음성",
    animation: "애니",
    video: "영상",
    design: "디자인",
    content: "개발",
  };
  return progressCate.map((item) => map[item] || item);
};

// progressValues에서 완료(4) 개수 계산
const getProgressPercent = (progressValues) => {
  const percent = {};
  Object.entries(progressValues).forEach(([key, value]) => {
    percent[key] = Array.isArray(value)
      ? value.filter((v) => v === 4).length
      : 0;
  });
  return percent;
};

const ProgressPage = () => {
  const API_SUB = "http://192.168.23.2:5001/subject";
  const location = useLocation();
  const projectCode = location.state?.code || 0;
  const subjectId = location.state?.id || 0;
  const [progressCate, setProgressCate] = useState(
    location.state?.progress
      ?.split(",")
      .map((c) => c.trim())
      .filter((c) => c) || []
  );
  const [progressItem, setProgressItem] = useState([]);
  const [chasiTotal, setChasiTotal] = useState(0);
  const [progressValues, setProgressValues] = useState({});
  const [progressPercent, setProgressPercent] = useState({});

  // 데이터 fetch 및 상태 세팅
  const fetchData = async () => {
    const { data: chasiData } = await axios.get(`${API_SUB}/chasiTotal`, {
      params: {
        progress: location.state?.progress,
        subjectId: location.state?.id,
      },
    });
    setChasiTotal(chasiData.chasiTotal);

    const { data: progressDataRaw } = await axios.get(`${API_SUB}/setData`, {
      params: {
        progressItem: progressCate,
        subjectId,
        projectCode,
      },
    });

    const setArray = Array.from({ length: chasiData.chasiTotal }, () => 0);
    const progressData = {};
    Object.entries(progressDataRaw).forEach(([key, value]) => {
      progressData[key] =
        typeof value === "string" ? value.split(",").map(Number) : setArray;
    });
    setProgressValues(progressData);
    setProgressPercent(getProgressPercent(progressData));
    setProgressItem(mapProgressItemToKorean(progressCate));
  };

  // select 박스 상태 동기화
  const setData = () => {
    Object.entries(progressValues).forEach(([key, value]) => {
      const arr = value;
      const select = document.querySelectorAll(`.selectLine`);
      if (Array.isArray(arr)) {
        arr.forEach((val, idx) => {
          const selectElement = select[idx]?.querySelector(
            `select[id="${key}"]`
          );
          if (selectElement) {
            selectElement.selectedIndex = Number(val);
            optionCss.forEach((cls) => selectElement.classList.remove(cls));
            selectElement.classList.add(optionCss[Number(val)]);
          }
        });
      }
    });
  };

  // 진행상태 변경
  const changeProgress = (e, item, index) => {
    const checked = e.target.value;
    const optionIndex = optionArr.indexOf(checked);
    const className = optionCss[optionIndex] || "";
    const currentClasses = e.target.className
      .split(" ")
      .filter((cls) => !optionCss.includes(cls))
      .join(" ");
    e.target.className = `${currentClasses} ${className}`.trim();

    setProgressValues((prev) => {
      const arr = prev[item]
        ? [...prev[item]]
        : Array.from({ length: chasiTotal }, () => 0);
      arr[index] = !checked ? 0 : optionIndex;
      return {
        ...prev,
        [item]: arr,
      };
    });
  };

  // 저장 및 percent 갱신
  const saveBtn = async () => {
    const response = await axios.patch(`${API_SUB}/saveProgress`, {
      progressValues,
      projectCode,
      subjectId,
    });
    if (response.data.msg === "전송 성공") {
      alert("진행률이 저장되었습니다.");
      setProgressPercent(getProgressPercent(progressValues));
    }
  };

  useEffect(() => {
    setData();
  }, [progressValues]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div>
        <P.Title>과목1101 진행률</P.Title>
        <P.BarContainer>
          {progressItem.map((item, index) => {
            const percent = Object.values(progressPercent)[index] || 0;
            const percentValue =
              chasiTotal > 0 ? Math.round((percent / chasiTotal) * 100) : 0;
            return (
              <P.Group key={index}>
                <P.BarTitle>{item}</P.BarTitle>
                <P.BarContent>
                  <P.Bar>
                    <P.BarProgress $per={percentValue + "%"}></P.BarProgress>
                  </P.Bar>
                  <P.NumCate>
                    <P.Num>
                      {percent} / {chasiTotal}
                    </P.Num>
                  </P.NumCate>
                </P.BarContent>
              </P.Group>
            );
          })}
        </P.BarContainer>

        <P.CheckContainer>
          <P.Button onClick={saveBtn}>저장하기</P.Button>

          <P.TitleWrap>
            <div>차시</div>
            {progressItem.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </P.TitleWrap>

          <P.InnerContainer>
            {Array.from({ length: chasiTotal }, (_, i) => (
              <P.Line key={i} className="selectLine">
                <div>{String(i + 1).padStart(2, "0")}</div>
                {progressCate.map((item, index) => (
                  <S.Select
                    id={item}
                    key={index}
                    onChange={(e) => {
                      changeProgress(e, item, i);
                    }}
                    className={optionCss[0]}
                  >
                    {optionArr.map((option, idx) => (
                      <option
                        key={idx}
                        value={option}
                        className={`${optionCss[idx]}`}
                      >
                        {option}
                      </option>
                    ))}
                  </S.Select>
                ))}
              </P.Line>
            ))}
          </P.InnerContainer>
        </P.CheckContainer>
      </div>
    </>
  );
};

export default ProgressPage;
