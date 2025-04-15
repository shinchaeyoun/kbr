import { useEffect, useState, useRef } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "../styled/react-big-calendar.scss";
import C from "../styled/CalenderStyle.jsx";
import ToolbarComponent from "../components/ToolbarComponent.jsx";
import axios from "axios";

const localizer = momentLocalizer(moment);

const CalendarComponent = ({
  height,
  events,
  date,
  view,
  onSelectSlot,
  onSelectEvent,
  toolbar: Toolbar,
}) => {
  const calendarRef = useRef(null);

  const [handleDate, setHandleDate] = useState(date);
  const [currentView, setCurrentView] = useState(view);

  const handleDateChange = (date) => {
    if (calendarRef.current) {
      console.log('calendarRef',calendarRef);
      
      const parent = calendarRef.current.closest(".side-container");
      if (parent) {
        console.log('if parent',parent);
        setCurrentView("month");
      } else {
        console.log(date,'else parent',parent);
        
        setHandleDate(date);
      }
    }
  };
  const handleViewChange = (newView) => {
    setCurrentView(newView);
  };

  // 이벤트 클래스 생성
  const eventPropGetter = (event) => {
    const className = `${event.label}`;
    return { className };
  };

  const validatedEvents = events.map((event) => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end),
  }));

  return (
    <C.CalendarComponent style={{ height: height }} ref={calendarRef}>
      <Calendar
        localizer={localizer} // 시간 현지화
        events={validatedEvents} // 가져올 이벤트 데이터
        startAccessor="start" // 시작 시간
        endAccessor="end" // 종료 시간
        onSelectSlot={onSelectSlot} // 새로운 이벤트 생성
        onSelectEvent={onSelectEvent} // 일정 클릭 이벤트
        eventPropGetter={eventPropGetter} // 클래스 설정
        date={handleDate} // onNavigate 에서 가져온 값으로 현재 날짜를 바꿈
        onNavigate={handleDateChange} // 날짜 변경 이벤트
        onView={handleViewChange} // 뷰 변경 이벤트 toolbar에 있는 모든 값을 받을 수 있다.
        view={currentView} //보여질 화면
        selectable // 드래그로 일정 추가 가능
        // components={{ toolbar: toolbar }}
        components={{
          toolbar: (props) => <Toolbar {...props} currentView={currentView} />,
        }}
      />
    </C.CalendarComponent>
  );
};

export default CalendarComponent;
