import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CalendarComponent from "../components/Calendar.jsx";
import styled, { css } from "styled-components";
import S from "../styled/GlobalBlock.jsx";
import C from "../styled/CalenderStyle.jsx";
import axios from "axios";
import moment from "moment";

const Scheduled = () => {
  const [sideCalendar, setSideCalendar] = useState(false);
  const [events, setEvents] = useState([]);

  const getEvent = async () => {
    await axios.get(`http://192.168.23.65:5000/sched/events`).then((res) => {
      console.log("res", res.data);
      setEvents(res.data);
    });
  };

  // 일정 추가 이벤트 핸들러
  const handleSelectNewData = ({ start, end }) => {
    const title = window.prompt("스케줄을 입력해주세요.");
    if (title) {
      const newEvent = {
        start: moment(start).toDate(),
        end: moment(end).toDate(),
        title,
      };

      // 로컬 상태 업데이트
      setEvents((prevEvents) => [...prevEvents, newEvent]);

      // 서버에 일정 추가 요청
      axios.post(`http://192.168.23.65:5000/sched/events`, newEvent).then((res) => {
        console.log("새 일정이 추가되었습니다.",res.data);
      });
    }
  };

  // 일정 클릭 이벤트 핸들러
  const handleSelectEvent = (event) => {
    alert(`선택된 일정: ${event.title}`);
  };

  // 백엔드에서 이벤트 가져오기
  useEffect(() => {
    getEvent();
  }, []);

  return (
    <C.CalendarWrap $sideCalendar={sideCalendar}>
      {sideCalendar && (
        <C.SideContainer>
          <CalendarComponent height="300px" events={events} />
          <div>some</div>
        </C.SideContainer>
      )}

      <C.ContentContainer>
        <CalendarComponent 
          height="100%"
          events={events}
          onSelectSlot={handleSelectNewData} // 일정 추가 핸들러 전달
          onSelectEvent={handleSelectEvent} // 일정 클릭 핸들러 전달
        />
      </C.ContentContainer>
    </C.CalendarWrap>
  );
};

export default Scheduled;
