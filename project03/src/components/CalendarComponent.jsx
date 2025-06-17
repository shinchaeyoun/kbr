import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // 기본 스타일 추가
import "../styles/calendar.scss";
import S from "../styled/GlobalBlock.jsx";
import moment from "moment";

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());

  const title = {
    marginBottom: "20px",
    fontSize: '18px',
  }
  return (
    <S.Wrap>
      <div style={title}>{moment(date).format("YYYY년 MM월 DD일")}</div>

      <Calendar
        onChange={setDate}
        value={date}
        calendarType="gregory"
        // showNeighboringMonth={false}
        formatDay={(locale, date) => moment(date).format("DD")}
      />
    </S.Wrap>
  );
};

export default CalendarComponent;
