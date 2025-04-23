import React, { useEffect, useState, useCallback } from "react";
import CalendarComponent from "../components/CalendarComponent.jsx";
import C from "../styled/CalenderStyle.jsx";
import axios from "axios";
import moment from "moment";
import DialogComponent from "../components/DialogComponent"; // 모달 컴포넌트
import ToolbarComponent from "../components/ToolbarComponent.jsx";
import ToolbarMini from "../components/ToolbarMiniComponent.jsx";

const Scheduled = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [sideCalendar, setSideCalendar] = useState(false);
  const [mode, setMode] = useState("write"); // write, read, edit
  const [emptyEvents, setEmptyEvents] = useState([]);
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState();
  const [isPos, setIsPos] = useState({ x: 0, y: 0 }); // 클릭 좌표 상태
  const [selectedTime, setSelectedTime] = useState({ start: null, end: null }); // 선택된 시간 범위 상태
  const [labelColor, setLabelColor] = useState("pink"); // 라벨 색상 상태
  const [handleDate, setHandleDate] = useState();
  const [viewDate, setViewDate] = useState();
  const [currentView, setCurrentView] = useState();

  const openDialog = ({ start, end, box, bounds, id }) => {
    const clientX = box?.clientX || bounds?.x || window.event.clientX;
    const clientY = box?.clientY || bounds?.y || window.event.clientY;
    setIsPos({ x: clientX, y: clientY }); // 클릭 좌표 저장
    setSelectedTime({ start, end }); // 선택된 시간 범위 저장
    setShowDialog(true); // 모달 열기
    setEventId(id); // 선택된 이벤트 ID 저장

    if (box === undefined && bounds === undefined) {
      setMode("read"); // 모달 모드 설정
    } else {
      setMode("write"); // 모달 모드 설정
    }
  };

  
  const handleDateChange = (date) => {
    console.log('date', date);
    setHandleDate(date);
  };
  
  const handleViewChange = (newView) => {
    setCurrentView(newView);
  };


  // 이벤트 가져오기
  const getEvent = async () => {
    // if (mode == "write") {
    await axios.get(`http://192.168.23.65:5000/sched/events`).then((res) => {
      setEvents(res.data);
    });
    // }
  };

  const onCloseDialog = async (val, id) => {
    if (val === "delete") {
      setEvents((prevList) => prevList.filter((item) => item.id !== id));
    } else {
      axios.get(`http://192.168.23.65:5000/sched/events`).then((res) => {
        setEvents(res.data);
      });
    }
  };

  // 일정 저장 이벤트 핸들러
  const eventSave = (event) => {
    console.log("save Event", event);
    
    const newEvent = {
      title: event.title,
      start: moment(selectedTime.start).toDate(),
      end: moment(selectedTime.end).toDate(),
      label: event.label,
      memo: event.memo,
    };

    setEvents((prevEvents) => [...prevEvents, newEvent]);

    axios.post(`http://192.168.23.65:5000/sched/events`, newEvent);
  };

  // 일정 수정 이벤트 핸들러
  const eventEdit = async (id, updateEvent) => {
    console.log("update Event", updateEvent.start);
    
    await axios.patch(
      `http://192.168.23.65:5000/sched/update?id=${id}`,
      updateEvent
    );
    await axios
      .get(`http://192.168.23.65:5000/sched/events`)
      .then((res) => setEvents(res.data));
  };

  // 백엔드에서 이벤트 가져오기
  useEffect(() => {
    getEvent();
  }, []);

  useEffect(() => {}, [showDialog]);

  return (
    <C.Wrap $events={events}>
      {/* 모달 컴포넌트 */}
      <DialogComponent
        mode={mode}
        eventId={eventId}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        pos={isPos}
        eventSave={eventSave}
        eventEdit={eventEdit}
        onCloseDialog={onCloseDialog}
        selectedTime={selectedTime}
      />

      <C.CalendarWrap $sideCalendar={sideCalendar}>
        {sideCalendar && (
          <C.SideContainer className="side-container">
            <CalendarComponent
              height="300px"
              events={emptyEvents}
              onSelectSlot={() => {}}
              onSelectEvent={() => {}} // 이벤트 클릭 시 아무 동작도 하지 않음
              // onNavigate={() => {}}
              onNavigate={handleDateChange}
              onView={() => {}}
              date={viewDate}
              view="month"
              toolbar={ToolbarMini}
            />
          </C.SideContainer>
        )}

        <C.ContentContainer className="main-container">
          <CalendarComponent
            height="100%"
            events={events}
            onSelectSlot={openDialog}
            onSelectEvent={openDialog}
            onNavigate={handleDateChange}
            onView={handleViewChange}
            date={handleDate}
            view={currentView}
            toolbar={ToolbarComponent}
          />
        </C.ContentContainer>
      </C.CalendarWrap>
    </C.Wrap>
  );
};

export default Scheduled;
