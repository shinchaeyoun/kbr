import { useState, useEffect, use } from "react";
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
  const [progressValues, setProgressValues] = useState([]);
  const [progressPercent, setProgressPercent] = useState(changeData || {});
  const [inProgress, setInProgress] = useState({});
  const [totalPercent, setTotalPercent] = useState(0);
  const [totalInPercent, setTotalInPercent] = useState(0);

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

    // const progressData = {};
    // const percentName = {};
    // const inprogress = {};

    // if (
    //   getProgressValues.data &&
    //   Object.keys(getProgressValues.data).length > 0
    // ) {
    //   Object.entries(getProgressValues.data).forEach(([key, value]) => {
    //     let perNum = 0;
    //     let inproNum = 0;
    //     let arr = [];
    //     if (typeof value === "string") {
    //       arr = value.split(",").map(Number);
    //     } else if (Array.isArray(value)) {
    //       arr = value.map(Number);
    //     } else {
    //       arr = setArray;
    //     }

    //     arr.forEach((val) => {
    //       if (val === 4) perNum++;
    //       if (val !== 0 && val !== 4) inproNum++;
    //     });
    //     percentName[key] = perNum;
    //     progressData[key] = arr;
    //     inprogress[key] = inproNum;
    //   });
    // } else {
    //   // 데이터가 없을 때 기본값 세팅
    //   progressCate.forEach((key) => {
    //     percentName[key] = 0;
    //     progressData[key] = setArray;
    //   });
    // }
    
    const { progressData, percentName, inprogress } = parseProgressData(
      getProgressValues.data,
      progress,
      setArray
    );


    setProgressValues(progressData);
    setProgressPercent(percentName);
    setInProgress(inprogress);

    setTotalPercent(Object.values(percentName).reduce((acc, cur) => acc + cur, 0));
    setTotalInPercent(Object.values(percentName).reduce((acc, cur) => acc + cur, 0));

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


  const updateData = async () => {
    const projectData = await axios.get(`http://192.168.23.2:5001/project`, {
      params: { code: projectCode },
    });
    const progress = projectData.data.progress
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c);

    const getChasiTotal = await axios.get(`${API_SUB}/chasiTotal`, {
      params: {
        progress: projectData.data.progress,
        subjectId: subjectId,
      },
    });
    
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
    const { progressData, percentName, inprogress } = parseProgressData(
      getProgressValues.data,
      progress,
      setArray
    );

    setInProgress(inprogress);
  };

  useEffect(() => {
    setProgressPercent(changeData);
    updateData();
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
                  Math.round(
                    (totalPercent / progressItem.length) * chasiTotal
                  ) + "%"
                }
              >
                <span>
                  {Math.round(
                    (totalPercent / progressItem.length) * chasiTotal
                  ) + "%"}
                </span>
              </P.BarProgress>
              <P.BarProgress2
                $per={
                  Math.round(
                    (totalInPercent / progressItem.length) * chasiTotal
                  ) + "%"
                }
              >
                <span>
                  {Math.round(
                    (totalInPercent / progressItem.length) * chasiTotal
                  ) + "%"}
                </span>
              </P.BarProgress2>
            </P.Bar>
            {/* <P.NumCate>
              <P.Num>
                완료 : {totalPercent} /{" "}
                {Math.round((totalPercent / chasiTotal) * 100) + "%"}
                <br />
                진행 : {totalInPercent} /{" "}
                {Math.round((totalInPercent / chasiTotal) * 100) + "%"}
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
                  <P.BarProgress $per={percentValue + "%"}>
                    <span>{percent}개</span>
                  </P.BarProgress>
                  <P.BarProgress2 $per={inPerValue + "%"}>
                    <span>{inPer}개</span>
                  </P.BarProgress2>
                </P.Bar>
                {/* <P.NumCate>
                  <P.Num>
                    {percent} / {chasiTotal} ({Object.values(inProgress)[index]}
                    )
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
