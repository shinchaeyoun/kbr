import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "../styled/react-big-calendar.scss";

import { Link, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import S from "../styled/GlobalBlock.jsx";
import axios from "axios";

import Toolbar from "../components/Toolbar.jsx";
const localizer = momentLocalizer(moment);

const Scheduled = () => {
  const { code } = useParams();

  const [handleDate, setHandleDate] = useState();
  const [viewDate, setViewDate] = useState();
  const [currentView, setCurrentView] = useState();
  const [events, setEvents] = useState([]);
  // const code = "1"; // 코드값
  const handleDateChange = (date) => {
    setHandleDate(date);
  };

  const handleViewChange = (newView) => {
    setCurrentView(newView);
  };

  // const validatedEvents = events.map((event) => ({
  //   ...event,
  //   start: new Date(event.start),
  //   end: new Date(event.end),
  // }));

  // 이벤트 가져오기
  const getEvent = async () => {
    await axios
      .get(`http://192.168.23.65:5001/sched/events?code=${code}`)
      .then((res) => {
        setEvents(res.data);
      });
  };

  useEffect(() => {
    getEvent();
    
  }, []);

  // 이벤트 클래스 생성
  const eventPropGetter = (event) => {
    const className = `${event.label}`;
    return { className };
  };

  return (
    <>
      <div style={{ height: "600px" }}>
        <Calendar
          localizer={localizer}
          // events={validatedEvents}
          events={events}
          startAccessor="start"
          endAccessor="end"
          date={handleDate} // onNavigate 에서 가져온 값으로 현재 날짜를 바꿈
          view={currentView}
          // onSelectSlot={onSelectSlot} // 새로운 이벤트 생성
          // onSelectEvent={onSelectEvent} // 일정 클릭 이벤트
          onNavigate={handleDateChange}
          onView={handleViewChange}
          eventPropGetter={eventPropGetter} // 클래스 설정
          // selectable // 드래그로 일정 추가 가능
          components={{
            toolbar: (props) => <Toolbar {...props} />,
          }}
          popup={true}
        />
      </div>
    </>
  );
};

export default Scheduled;
