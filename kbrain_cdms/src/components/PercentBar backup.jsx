import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import P from "../styled/ProgressStyled.jsx";

import axios from "axios";

const PercentBar = ({ changeData, setChangeData }) => {
  const API_SUB = "http://192.168.23.2:5001/subject";
  const location = useLocation();
  const projectCode = location.pathname.split("/")[1];
  const subjectId = location.pathname.split("/")[2];

  const [progressCate, setProgressCate] = useState([]);
  const [progressItem, setProgressItem] = useState([]);
  const [chasiTotal, setChasiTotal] = useState(0);
  const [progressValues, setProgressValues] = useState([{}]);
  const [progressPercent, setProgressPercent] = useState({});
  const [inProgress, setInProgress] = useState({});
  const totalPrecent = Object.values(progressPercent).reduce(
    (acc, cur) => acc + cur,
    0
  );
  const totalInPrecent = Object.values(inProgress).reduce(
    (acc, cur) => acc + cur,
    0
  );

  const optionCss = ["before", "ing", "edit", "firstDone", "done"];

  // progress 데이터 파싱 및 percent 계산 함수 분리
  const parseProgressData = (progressValues, progressCate, setArray) => {
    const progressData = {};
    const percentName = {};
    const inprogress = {};

    if (progressValues && Object.keys(progressValues).length > 0) {
      Object.entries(progressValues).forEach(([key, value]) => {
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
      progressCate.forEach((key) => {
        percentName[key] = 0;
        progressData[key] = setArray;
        inprogress[key] = 0;
      });
    }

    return { progressData, percentName, inprogress };
  };

  const fetchData = async () => {
    const projectData = await axios.get(`http://192.168.23.2:5001/project`, {
      params: { code: projectCode },
    });
    const progress = projectData.data.progress
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c);
    setProgressCate(progress);

    const getChasiTotal = await axios.get(`${API_SUB}/chasiTotal`, {
      params: {
        progress: projectData.data.progress,
        subjectId: subjectId,
      },
    });
    setChasiTotal(getChasiTotal.data.chasiTotal);

    const getProgressValues = await axios.get(`${API_SUB}/setData`, {
      params: {
        progressItem: progress,
        subjectId: subjectId,
        projectCode: projectCode, // 프로젝트 코드
      },
    });

    const setArray = Array.from(
      { length: getChasiTotal.data.chasiTotal },
      () => 0
    );

    // 파싱 함수 사용
    const { progressData, percentName, inprogress } = parseProgressData(
      getProgressValues.data,
      progress,
      setArray
    );

    setProgressValues(progressData);
    setProgressPercent(percentName);
    setInProgress(inprogress);

    // progressItem 누적 방지: 새 배열로 생성 후 한 번만 set
    const newProgressItem = [];
    for (let i = 0; i < progress.length; i++) {
      let setItem = "";
      if (progress[i] === "script") setItem = "원고";
      if (progress[i] === "sb") setItem = "스토리보드";
      if (progress[i] === "voice") setItem = "음성";
      if (progress[i] === "animation") setItem = "애니";
      if (progress[i] === "video") setItem = "영상";
      if (progress[i] === "design") setItem = "디자인";
      if (progress[i] === "content") setItem = "개발";
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

  const updateData = async () => {
    console.log("updateData called");
    const setArray = Array.from({ length: chasiTotal }, () => 0);
    const { percentName: newPercent, inprogress: newInprogress } =
      parseProgressData(progressValues, progressCate, setArray);
    setProgressPercent(newPercent);
    setInProgress(newInprogress);
    await setData();
  };

  // useEffect(() => {
  //   updateData();
  //   setData();
  // }, [progressValues, subjectId, changeData]);

  useEffect(() => {
    console.log();
    
    if (!changeData) return;
    updateData();
    setChangeData(false);
  }, [changeData]);

  useEffect(() => {
    fetchData();
  }, [subjectId]);

  return (
    <div>
      <P.BarContainer>
        <P.Group>
          <P.BarTitle>전체</P.BarTitle>
          <P.BarContent>
            <P.Bar>
              <P.BarProgress
                $per={
                  Math.round((totalPrecent / progressItem.length*chasiTotal)) +
                  "%"
                }
              >
                <span>{Math.round((totalPrecent / progressItem.length*chasiTotal)) +
                  "%"}</span>
              </P.BarProgress>
              <P.BarProgress2
                $per={
                  Math.round((totalInPrecent / progressItem.length*chasiTotal)) +
                  "%"
                }
              >
                <span>{Math.round((totalInPrecent / progressItem.length*chasiTotal)) +
                  "%"}</span>
              </P.BarProgress2>
            </P.Bar>
            {/* <P.NumCate>
              <P.Num>
                완료 : {totalPrecent} /{" "}
                {Math.round((totalPrecent / chasiTotal) * 100) + "%"}
                <br />
                진행 : {totalInPrecent} /{" "}
                {Math.round((totalInPrecent / chasiTotal) * 100) + "%"}
              </P.Num>
            </P.NumCate> */}
          </P.BarContent>
        </P.Group>

        {progressItem.map((item, index) => {
          const percent = Object.values(progressPercent)[index];
          const inPer = Object.values(inProgress)[index];
          const percentValue =
            chasiTotal > 0 ? Math.round((percent / chasiTotal) * 100) : 0;
          const inPerValue =
            chasiTotal > 0 ? Math.round((inPer / chasiTotal) * 100) : 0;
          return (
            <P.Group key={index}>
              <P.BarTitle>{item}</P.BarTitle>
              <P.BarContent>
                <P.Bar>
                  <P.BarProgress $per={percentValue + "%"}><span>{percent}개</span></P.BarProgress>
                  <P.BarProgress2 $per={inPerValue + "%"}><span>{inPer}개</span></P.BarProgress2>
                </P.Bar>
                {/* <P.NumCate>
                  <P.Num>
                    {percent} / {chasiTotal} (진행중 : {inPer})
                  </P.Num>
                </P.NumCate> */}
              </P.BarContent>
            </P.Group>
          );
        })}
      </P.BarContainer>
    </div>
  );
};

export default PercentBar;
