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
  onSelectSlot,
  onSelectEvent,
  onNavigate,
  onView,
  date,
  view,
  toolbar: Toolbar,
}) => {
  const calendarRef = useRef(null);

  const [handleDate, setHandleDate] = useState(date);
  const [currentView, setCurrentView] = useState(view);

  const handleDateChange = (date) => {
    setHandleDate(date);
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
        localizer={localizer}
        events={validatedEvents}
        startAccessor="start"
        endAccessor="end"
        date={handleDate} // onNavigate 에서 가져온 값으로 현재 날짜를 바꿈
        view={view} //보여질 화면
        onSelectSlot={onSelectSlot} // 새로운 이벤트 생성
        onSelectEvent={onSelectEvent} // 일정 클릭 이벤트
        onNavigate={handleDateChange} // 날짜 변경 이벤트
        // onNavigate={onNavigate} // 날짜 변경 이벤트
        onView={onView} // 뷰 변경 이벤트 toolbar에 있는 모든 값을 받을 수 있다.
        eventPropGetter={eventPropGetter} // 클래스 설정
        selectable // 드래그로 일정 추가 가능
        components={{
          toolbar: (props) => <Toolbar {...props} viewClass={view} />,
        }}
        popup={true}
      />
    </C.CalendarComponent>
  );
};

export default CalendarComponent;
