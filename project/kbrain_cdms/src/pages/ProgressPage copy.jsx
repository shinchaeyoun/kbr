import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import S from "../styled/GlobalBlock.jsx";
import P from "../styled/ProgressStyled.jsx";
import axios from "axios";
import PercentBar from "../components/PercentBar.jsx";

const ProgressPage = () => {
  const API_SUB = "http://192.168.23.2:5001/subject";
  const location = useLocation();
  const projectCode = location.pathname.split("/")[1] || 0; // 과정 코드
  const subjectId = location.pathname.split("/")[2] || 0; // 과목 ID

  const [progressCate, setProgressCate] = useState([]);
  const [progressItem, setProgressItem] = useState([]);
  const [chasiTotal, setChasiTotal] = useState(0);
  const [progressValues, setProgressValues] = useState([{}]);

  const optionArr = ["진행전", "진행중", "수정중", "1차 완료", "완료"];
  const optionCss = ["before", "ing", "edit", "firstDone", "done"];
  const [changeData, setChangeData] = useState({});

  const fetchData = async () => {
    const getProgress = await axios.get(
      `http://192.168.23.2:5001/project/category`,
      {
        params: {
          code: projectCode,
        },
      }
    );
    const progressCate =
      getProgress.data.progress
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c) || [];
    setProgressCate(progressCate);

    const getChasiTotal = await axios.get(`${API_SUB}/chasiTotal`, {
      params: {
        progress: projectCode,
        subjectId: subjectId,
      },
    });
    setChasiTotal(getChasiTotal.data.chasiTotal);

    const getProgressValues = await axios.get(`${API_SUB}/setData`, {
      params: {
        progressItem: progressCate,
        subjectId: subjectId,
        projectCode: projectCode, // 프로젝트 코드
      },
    });

    const setArray = Array.from(
      { length: getChasiTotal.data.chasiTotal },
      () => 0
    );
    const progressData = {};
    const percentName = {};
    const inprogress = {};

    if (
      getProgressValues.data &&
      Object.keys(getProgressValues.data).length > 0
    ) {
      Object.entries(getProgressValues.data).forEach(([key, value]) => {
        let perNum = 0;
        let inproNum = 0;
        let arr = [];
        if (typeof value === "string") {
          arr = value.split(",").map(Number);
        } else if (Array.isArray(value)) {
          arr = value.map(Number);
        } else {
          arr = setArray;
        }

        arr.forEach((val) => {
          if (val === 4) perNum++;
          if (val !== 0 && val !== 4) inproNum++;
        });
        percentName[key] = perNum;
        progressData[key] = arr;
        inprogress[key] = inproNum;
      });
    } else {
      // 데이터가 없을 때 기본값 세팅
      progressCate.forEach((key) => {
        percentName[key] = 0;
        progressData[key] = setArray;
      });
    }

    setProgressValues(progressData);

    const newProgressItem = [];
    for (let i = 0; i < progressCate.length; i++) {
      let setItem = "";
      if (progressCate[i] === "script") setItem = "원고";
      if (progressCate[i] === "sb") setItem = "보드";
      if (progressCate[i] === "voice") setItem = "음성";
      if (progressCate[i] === "animation") setItem = "애니";
      if (progressCate[i] === "video") setItem = "영상";
      if (progressCate[i] === "design") setItem = "디자인";
      if (progressCate[i] === "content") setItem = "개발";
      newProgressItem.push(setItem);
    }
    setProgressItem(newProgressItem);
  };

  const setData = async () => {
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
      arr[index] = !checked ? 0 : optionIndex; // 체크되지 않으면 0, 체크되면 해당 인덱스 값 저장
      return {
        ...prev,
        [item]: arr,
      };
    });
  };

  const saveBtn = async () => {
    const response = await axios.patch(`${API_SUB}/saveProgress`, {
      progressValues,
      projectCode,
      subjectId,
    });

    if (response.data.msg === "전송 성공") {
      alert("진행률이 저장되었습니다.");
      const newPercent = {};
      Object.entries(progressValues).forEach(([key, value]) => {
        let perNum = 0;
        if (Array.isArray(value)) {
          value.forEach((val) => {
            if (val === 4) perNum++;
          });
        }
        newPercent[key] = perNum;
      });

      setChangeData(newPercent);
    }
  };

  useEffect(() => {
    setData();
  }, [progressValues]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div>
        <P.Title>과목1101 진행률</P.Title>

        <PercentBar changeData={changeData} setChangeData={setChangeData} />

        <P.CheckContainer>
          <P.Button onClick={saveBtn}>저장하기</P.Button>

          <P.TitleWrap $repeat={progressCate.length + 1}>
            <div>차시</div>
            {progressItem.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </P.TitleWrap>

          <P.InnerContainer>
            {Array.from({ length: chasiTotal }, (_, i) => (
              <P.Line
                key={i}
                className="selectLine"
                $repeat={progressCate.length + 1}
              >
                <div>{String(i + 1).padStart(2, "0")}</div>
                {progressCate.map((item, index) => (
                  <S.Select
                    id={item}
                    key={index}
                    onChange={(e) => {
                      changeProgress(e, item, i);
                    }}
                    className={optionCss[0]} // 기본값은 "진행전"
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
