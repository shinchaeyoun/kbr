import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CalendarComponent from "../components/CalendarComponent.jsx";
import styled, { css } from "styled-components";
import S from "../styled/GlobalBlock.jsx";
import C from "../styled/CalenderStyle.jsx";
import axios from "axios";
import moment from "moment";
import DialogComponent from "../components/DialogComponent"; // 모달 컴포넌트

const Scheduled = () => {
  // EventModal / CalendarEventPopup / DraggableDialog
  // Dialog가 더 적합할 것 같음
  const [showDialog, setShowDialog] = useState(false);
  const [sideCalendar, setSideCalendar] = useState(false);
  const [mode, setMode] = useState("write"); // write, read, edit
  const [events, setEvents] = useState([]);
  const [eventId, setEventId] = useState();
  const [isPos, setIsPos] = useState({ x: 0, y: 0 }); // 클릭 좌표 상태
  const [selectedTime, setSelectedTime] = useState({ start: null, end: null }); // 선택된 시간 범위 상태
  const [labelColor, setLabelColor] = useState("pink"); // 라벨 색상 상태

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
    // box === undefined && bounds === undefined ? setMode("read",eventId) : setMode("write"); // 모달 모드 설정
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
      // try {
      //   // 새로 등록된 데이터를 가져오기 위해 서버에서 최신 데이터를 요청
      //   const response = await axios.get(`http://192.168.23.65:5000/board`, {
      //     params: { offset: 0, limit: 1 }, // 최신 데이터 1개만 가져옴
      //   });

      //   if (response.data[0].id >= isBoardid) return; // 방금 수정된 데이터는 제외
      //   const newBoard = response.data[0]; // 새로 등록된 데이터
      //   setBoardList((prevList) => [newBoard, ...prevList]); // 새 데이터를 맨 앞에 추가
      // } catch (error) {
      //   console.error("새 데이터를 가져오는 중 오류 발생:", error);
      // }
    }
  };

  // 일정 저장 이벤트 핸들러
  const eventSave = (event) => {
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
    await axios.patch(
      `http://192.168.23.65:5000/sched/update?id=${id}`,
      updateEvent
    );
    await axios
      .get(`http://192.168.23.65:5000/sched/events`)
      .then((res) => setEvents(res.data));
  };

  // 일정 추가 이벤트 핸들러
  const handleSelectNewData = ({ start, end, action, box }) => {
    // const title = window.prompt("스케줄을 입력해주세요.");
    // console.log("box 객체:", box); // box의 구조를 확인
    // console.log("선택된 시간 범위:", start, end);
    // // 마우스 클릭 좌표 가져오기
    // // const { clientX, clientY } = box;
    // openDialog({ clientX, clientY }, start, end);
    // if (title) {
    //   const newEvent = {
    //     start: moment(start).toDate(),
    //     end: moment(end).toDate(),
    //     title,
    //   };
    //   // 로컬 상태 업데이트
    //   setEvents((prevEvents) => [...prevEvents, newEvent]);
    //   // 서버에 일정 추가 요청
    //   axios
    //     .post(`http://192.168.23.65:5000/sched/events`, newEvent)
    //     .then((res) => {
    //       console.log("새 일정이 추가되었습니다.", res.data);
    //     });
    // }
  };

  // 일정 클릭 이벤트 핸들러
  const handleSelectEvent = (event) => {
    setShowDialog(true);
    // alert(`선택된 일정: ${event.title}`);
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
        // events={events}
        showDialog={showDialog}
        setShowDialog={setShowDialog}
        pos={isPos}
        // selectedTime={selectedTime} // 선택된 시간 범위
        eventSave={eventSave}
        eventEdit={eventEdit}
        onCloseDialog={onCloseDialog} // 모달 닫기 핸들러
      />

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
            setEvents={setEvents}
            onSelectSlot={openDialog} // 일정 추가 핸들러 전달
            onSelectEvent={openDialog} // 일정 클릭 핸들러 전달
          />
        </C.ContentContainer>
      </C.CalendarWrap>
    </C.Wrap>
  );
};

export default Scheduled;
