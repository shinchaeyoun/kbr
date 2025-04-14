import { useState, useCallback } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "../styled/react-big-calendar.scss";
import C from "../styled/CalenderStyle.jsx";
import ToolbarComponent from "../components/ToolbarComponent.jsx";
import axios from "axios";

const localizer = momentLocalizer(moment);

const CalendarComponent = ({ height, events, setEvents, onSelectSlot, onSelectEvent }) => {
  const [handleDate, setHandleDate] = useState();
  const [currentView, setCurrentView] = useState();
  
  //클릭한 날짜의 정보를 받아옴
  const handleDateChange = (date) => setHandleDate(date);
  //클릭한 view의 정보를 받아옴
  const handleViewChange = (newView) => setCurrentView(newView);

  const eventPropGetter = (event,currentView) => {
    const className = `${event.label}`;
    return { className };
  };

  //이벤트 이동 기능
  const moveEvent = useCallback(({ event, start, end }) => {
    setEvents((prev) => {
      const updatedEvent = { ...event, start: new Date(start), end: new Date(end) };
      return prev.map((ev) => (ev.id === event.id ? updatedEvent : ev));
    });
  }, [setEvents]);

  const validatedEvents = events.map((event) => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
  }));

  console.log('currentView',currentView);
  

  return (
    <C.CalendarComponent style={{ height: height }}>
      <Calendar
        localizer={localizer} // 시간 현지화
        events={validatedEvents} // 가져올 이벤트 데이터
        startAccessor="start" // 시작 시간
        endAccessor="end" // 종료 시간
        onSelectSlot={onSelectSlot} // 새로운 이벤트 생성
        onSelectEvent={onSelectEvent} // 일정 클릭 이벤트
        eventPropGetter={eventPropGetter} // 클래스 설정
        onEventDrop={moveEvent} //위치 재정의
        date={handleDate} // onNavigate 에서 가져온 값으로 현재 날짜를 바꿈
        onNavigate={handleDateChange} // 날짜 변경 이벤트
        onView={handleViewChange} // 뷰 변경 이벤트 toolbar에 있는 모든 값을 받을 수 있다.
        view={currentView} //보여질 화면
        selectable // 드래그로 일정 추가 가능
        components={{ toolbar: ToolbarComponent }}
      />
    </C.CalendarComponent>
  );
};

export default CalendarComponent;
