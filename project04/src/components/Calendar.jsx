import React, { useState } from "react";
import Calendar from "react-calendar";
import "../styled/calendar.scss";
import S from "../styled/GlobalBlock";
import C from "../styled/CalenderStyle.jsx";
import moment from "moment";

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());
  const [isSet, setStartDate] = useState(new Date());

  const title = {
    marginBottom: "20px",
    fontSize: "18px",
  };

  const test = () => {
    console.log("test");
  };

  return (
    <C.CalendarContainer>
      <Calendar
        onClick={test}
        onChange={setDate}
        value={date}
        calendarType="gregory"
        view="month"
        prev2Label={null}
        next2Label={null}
        // showNeighboringMonth={false}
        formatDay={(locale, date) => moment(date).format("DD")}
      />
    </C.CalendarContainer>
  );
};

export default CalendarComponent;
