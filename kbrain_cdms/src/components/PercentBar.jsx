import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import P from "../styled/ProgressStyled.jsx";

import axios from "axios";

const PercentBar = ({ changeData, setChangeData }) => {
  const API_SUB = "http://192.168.23.2:5001/subject";
  const location = useLocation();
  const projectCode = location.pathname.split("/")[1];
  const subjectId = location.pathname.split("/")[2];

  const [progressItem, setProgressItem] = useState([]);
  const [chasiTotal, setChasiTotal] = useState(0);
  const [progressPercent, setProgressPercent] = useState(changeData || {});
  const [inProgress, setInProgress] = useState({});
  const [totalPercent, setTotalPercent] = useState(0);
  const [totalInPercent, setTotalInPercent] = useState(0);

  const parseProgressData = (data, progressCate, setArray) => {
    const percentName = {};
    const inprogress = {};

    if (data && Object.keys(data).length > 0) {
      Object.entries(data).forEach(([key, value]) => {
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
        inprogress[key] = inproNum;
      });
    } else {
      progressCate.forEach((key) => {
        percentName[key] = 0;
        inprogress[key] = 0;
      });
    }

    return { percentName, inprogress };
  };

  const fetchData = async () => {
    const projectData = await axios.get(`http://192.168.23.2:5001/project`, {
      params: { code: projectCode },
    });
    const progress = projectData.data.progress
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c);
    // setProgressCate(progress);

    const getChasiTotal = await axios.get(`${API_SUB}/chasiTotal`, {
      params: {
        progress: projectData.data.progress,
        subjectId: subjectId,
      },
    });
    setChasiTotal(getChasiTotal.data.chasiTotal);

    const setArray = Array.from(
      { length: getChasiTotal.data.chasiTotal },
      () => 0
    );

    const getProgressValues = await axios.get(`${API_SUB}/setData`, {
      params: {
        progressItem: progress,
        subjectId: subjectId,
        projectCode: projectCode, // 프로젝트 코드
      },
    });

    const { percentName, inprogress } = parseProgressData(
      getProgressValues.data,
      progress,
      setArray
    );
    
    setProgressPercent(percentName);
    setInProgress(inprogress);
    setTotalPercent(
      Object.values(percentName).reduce((acc, cur) => acc + cur, 0)
    );
    setTotalInPercent(
      Object.values(inprogress).reduce((acc, cur) => acc + cur, 0)
    );

    // progressItem 누적 방지: 새 배열로 생성 후 한 번만 set
    const newProgressItem = [];
    for (let i = 0; i < progress.length; i++) {
      let setItem = "";
      if (progress[i] === "script") setItem = "원고";
      if (progress[i] === "sb") setItem = "보드";
      if (progress[i] === "voice") setItem = "음성";
      if (progress[i] === "animation") setItem = "애니";
      if (progress[i] === "video") setItem = "영상";
      if (progress[i] === "design") setItem = "디자인";
      if (progress[i] === "content") setItem = "개발";
      newProgressItem.push(setItem);
    }
    setProgressItem(newProgressItem);
  };

  useEffect(() => {
    setProgressPercent(changeData);
    // updateData();
    fetchData();
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
                    totalPercent / (progressItem.length * chasiTotal) * 100
                  ) + "%"
                }
              >
                <span>
                  {Math.round(
                    totalPercent / (progressItem.length * chasiTotal) * 100
                  ) + "%"}
                </span>
              </P.BarProgress>
              <P.BarProgress2
                $per={
                  Math.round(
                    totalInPercent / (progressItem.length * chasiTotal) * 100
                  ) + "%"
                }
              >
                <span>
                  {Math.round(
                    totalInPercent / (progressItem.length * chasiTotal) * 100
                  ) + "%"
                }
                </span>
              </P.BarProgress2>
            </P.Bar>
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
              </P.BarContent>
            </P.Group>
          );
        })}
      </P.BarContainer>
    </div>
  );
};

export default PercentBar;
