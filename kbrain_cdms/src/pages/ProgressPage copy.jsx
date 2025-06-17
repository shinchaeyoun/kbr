import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled, { css } from "styled-components";
import S from "../styled/GlobalBlock.jsx";
import P from "../styled/ProgressStyled.jsx";
import axios from "axios";

const ProgressPage = () => {
  const API_SUB = "http://192.168.23.2:5001/subject";
  const location = useLocation();
  const projectCode = location.state?.code || 0; // 과정 코드
  const subjectId = location.state?.id || 0; // 과목 ID
  const [progressCate, setProgressCate] = useState(
    location.state?.progress
      .split(",")
      .map((c) => c.trim())
      .filter((c) => c) || []
  );
  const [progressItem, setProgressItem] = useState([]);
  const [chasiTotal, setChasiTotal] = useState(0);
  const [progressValues, setProgressValues] = useState({});

  const optionArr = ["진행전", "진행중", "수정중", "1차 완료", "완료"];

  const fetchData = async () => {
    const getChasiTotal = await axios.get(`${API_SUB}/chasiTotal`, {
      params: {
        progress: location.state?.progress,
        subjectId: location.state?.id,
      },
    });
    setChasiTotal(getChasiTotal.data.chasiTotal);

    // progressItem 누적 방지: 새 배열로 생성 후 한 번만 set
    const newProgressItem = [];
    for (let i = 0; i < progressCate.length; i++) {
      let setItem = "";
      if (progressCate[i] === "script") setItem = "원고";
      if (progressCate[i] === "sb") setItem = "스토리보드";
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
    const response = await axios.get(`${API_SUB}/setData`, {
      params: {
        progressItem: progressCate,
        subjectId: subjectId,
        projectCode: location.state?.code, // 프로젝트 코드
      },
    });
    setProgressValues(response.data);
  };

  const getData = async () => {};

  // const changeProgress = (e, item, index) => {
  //   const { checked } = e.target;
  //   // setProgressValues((prev) => ({
  //   //   ...prev,
  //   //   [item]: checked ? chasiTotal : 0, // 체크되면 전체 차시 수, 아니면 0
  //   // }));
  //   console.log("changeProgress", item, checked, index);
  //   console.log("progressCate", progressCate);
  //   console.log("progressItem", progressItem);
  //   console.log("progressValues", progressValues);

  // };

  const changeProgress = (e, item, index) => {
    console.log('changeProgress', item, index);
    
    // const { checked } = e.target;
    // if (item == "원고") item = "script";
    // if (item == "스토리보드") item = "sb";
    // if (item == "음성") item = "voice";
    // if (item == "애니") item = "animation";
    // if (item == "영상") item = "video";
    // if (item == "디자인") item = "design";
    // if (item == "개발") item = "content";
    // // console.log('item',item);
    // setProgressValues((prev) => {
    //   // console.log("prev[item]",prev[item]);
    //   // 기존 배열이 있으면 복사, 없으면 0으로 채운 새 배열 생성
    //   const arr = prev[item]
    //     ? [...prev[item]]
    //     : Array.from({ length: chasiTotal }, () => 0);
    //   arr[index] = checked ? 1 : 0;
    //   return {
    //     ...prev,
    //     [item]: arr,
    //   };
    // });
  };

  const saveBtn = async () => {
    const response = await axios.patch(`${API_SUB}/saveProgress`, {
      progressValues,
      projectCode,
      subjectId,
    });
  };

  useEffect(() => {
    fetchData();
    setData();

    getData();
  }, []);

  return (
    <>
      <div>
        <P.Title>과목1101 진행률</P.Title>
        <P.BarContainer>
          {progressItem.map((item, index) => (
            <P.Group key={index}>
              <P.BarTitle>{item}</P.BarTitle>
              <P.BarContent>
                <P.Bar>
                  <P.BarProgress $per="50%"></P.BarProgress>
                </P.Bar>
                <P.NumCate>
                  <P.Num>5/{chasiTotal}</P.Num>
                </P.NumCate>
              </P.BarContent>
            </P.Group>
          ))}
        </P.BarContainer>

        <P.CheckContainer>
          <P.Button onClick={saveBtn}>저장하기</P.Button>
          {progressItem.map((item, index) => {
            return (
              <P.Group key={index}>
                <P.CheckTitle>{item}</P.CheckTitle>
                <P.CheckGroup>
                  {/* 체크박스 */}
                  {/* {Array.from({ length: chasiTotal }, (_, i) => (
                    <div key={i}>
                      <div>{String(i + 1).padStart(2, "0")}차시</div>
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          console.log("changeProgress", e.target.checked);
                          
                          changeProgress(e, item, i);
                        }}
                      />
                    </div>
                  ))} */}

                  {/* <S.Select>
                    {Array.from({ length: chasiTotal }, (_, i) => (
                      <option key={i}>
                        <div>{String(i + 1).padStart(2, "0")}차시</div>
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            changeProgress(e, item, i);
                          }}
                        />
                      </option>
                    ))}
                  </S.Select> */}

                  {Array.from({ length: chasiTotal }, (item, i) => (
                    <div key={i}>
                      <div>{String(i + 1).padStart(2, "0")}차시</div>
                      <S.Select
                        onChange={(e) => {
                          changeProgress(e, item, i);
                        }}
                      >
                        {optionArr.map((option, idx) => (
                          <option key={idx} value={option}>
                            {option}
                          </option>
                        ))}
                      </S.Select>
                    </div>
                  ))}
                </P.CheckGroup>
              </P.Group>
            );
          })}
        </P.CheckContainer>
      </div>
    </>
  );
};

export default ProgressPage;
