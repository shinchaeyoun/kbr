import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "../styled/react-big-calendar.scss";
import C from "../styled/CalenderStyle.jsx";

import axios from "axios";


const localizer = momentLocalizer(moment);

const CalendarComponent = ({height, events, onSelectSlot, onSelectEvent}) => {
  //데이터 입력 함수

  const eventPropGetter = (event) => {
    const className = `${event.label}`;
    return {className};
  };

  return (
    <C.CalendarComponent style={{ height: height }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable // 드래그로 일정 추가 가능
        onSelectSlot={onSelectSlot} // 빈 공간 클릭/드래그 이벤트
        onSelectEvent={onSelectEvent} // 일정 클릭 이벤트
        eventPropGetter={eventPropGetter} // 클래스 설정
      />
    </C.CalendarComponent>
  );
};

export default CalendarComponent;
