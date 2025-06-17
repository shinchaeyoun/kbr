import React, { useState, useRef, useEffect, useCallback } from "react";
import Draggable from "react-draggable";
import TextareaAutosize from "react-textarea-autosize";

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import C from "../styled/CalenderStyle.jsx";
import axios from "axios";

const localizer = momentLocalizer(moment);

const DialogComponent = ({
  mode,
  eventId,
  showDialog,
  setShowDialog,
  pos,
  eventSave,
  eventEdit,
  onCloseDialog,
  selectedTime,
}) => {
  const nodeRef = useRef(null);
  const textareaRef = useRef(null); // textarea ref

  const INITIAL_EVENT = {
    id: null,
    title: "",
    start: "",
    end: "",
    label: "",
    memo: "",
  };

  const [event, setEvent] = useState(INITIAL_EVENT);
  const [editMode, setEditMode] = useState(false);
  const labels = [
    { name: "pink", color: "#ff7eb3" },
    { name: "green", color: "#a2ab58" },
    { name: "blue", color: "#66a6ff" },
    { name: "yellow", color: "#f7b733" },
  ];
  const [labelColor, setLabelColor] = useState("pink");
  const [active, setActive] = useState(false);

  const getEvent = async () => {
    if (mode == "read") {
      await axios
        .get(`http://192.168.23.2:5000/sched/events?id=${eventId}`)
        .then((res) => {
          setEvent(res.data[0] || INITIAL_EVENT); // 데이터가 없을 때 초기값으로 설정
          setLabelColor(res.data[0]?.label || "pink"); // 라벨 색상 설정
        })
        .catch((err) => {
          console.error("Error fetching event data:", err);
          setEvent(INITIAL_EVENT); // 에러 발생 시 초기값으로 설정
        });
    } else if (mode == "write") {
      setEvent(INITIAL_EVENT); // 초기값으로 리셋
      setEvent((INITIAL_EVENT) => ({
        ...INITIAL_EVENT,
        start: selectedTime.start,
        end: selectedTime.end,
      })); // 초기값으로 리셋
    }
  };

  const formatIsoDate = (value) => {
    const parsedDate = new Date(value); // 입력된 값을 Date 객체로 변환
    const isoDate = parsedDate.toISOString();
    return isoDate;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "start" || name === "end") {
      setEvent((event) => ({ ...event, [name]: formatIsoDate(value) }));
    } else {
      setEvent((event) => ({ ...event, [name]: value }));
    }
  };

  const closeDialog = (e) => {
    setShowDialog(false);
    setActive(false);
    
  };

  const handleSave = () => {
    if (mode == "read") {
      setEditMode(!editMode);
      setEvent({ ...event, label: labelColor });
      const updateEvent = { ...event, label: labelColor };
      if (eventEdit) eventEdit(eventId, updateEvent);
    } else if (mode === "write") {
      const newEvent = {
        ...event,
        title: event.title || "(제목 없음)",
        label: labelColor,
      };
      if (eventSave) eventSave(newEvent); // 제목이 없을 경우 기본값 설정
    }
    setShowDialog(false);
  };

  const handleDelete = async () => {
    const delCheck = confirm("삭제하시겠습니까?");

    if (delCheck) {
      await axios.delete(
        `http://192.168.23.2:5000/sched/delete?id=${eventId}`
      );
      setShowDialog(false);
      setEvent(INITIAL_EVENT);
      if (onCloseDialog) onCloseDialog("delete", eventId); // 부모 컴포넌트로 삭제 이벤트 전달
    }
  };

  const handleResizeHeight = useCallback(() => {
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
  }, []);

  useEffect(() => {
    if (showDialog) {
      getEvent();
    }
  }, [showDialog]);

  useEffect(() => {
    getEvent();
  }, []);

  const formatDate = (date) => {
    if (date === "") return ""; // 빈 문자열 처리
    return new Date(date).toISOString().split("T")[0];
  };

  const [onCalendar, setOnCalendar] = useState(0);
  const [onMiniCalendar, setOnMiniCalendar] = useState('');
  const onOpenCalendar = (e) => {
    console.log("onOpenCalendar ==",e.currentTarget.name);
    setOnMiniCalendar(e.currentTarget.name)
    if (onCalendar === 0) setOnCalendar(230);
    else setOnCalendar(0);
  };

  const formatToShowDate = (jsDateStr) => {
    const date = new Date(jsDateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = date.getDay();
    let hours = "";
    const minutes = date.getMinutes();
    let pmAm = "PM";
    date.getHours() > 12
      ? (hours = date.getHours() - 12)
      : (hours = date.getHours());
    date.getHours() > 12 ? (pmAm = "PM") : (pmAm = "AM");
    const week = ["일", "월", "화", "수", "목", "금", "토"];
    const formattedDate = (
      <div>
        <span>
          {month}월 {day}일 ({week[weekday]}요일)
        </span>
        {/* <br />
        <span className="hoursMinutes">
          {pmAm} {hours} : {minutes}
        </span> */}
      </div>
    );
    return formattedDate;
  };

  const handleMiniCalendar = (date) => {
    console.log("onMiniCalendar",onMiniCalendar);
    console.log("handleMiniCalendar //",formatIsoDate(date));
    setEvent((event) => ({ ...event, [onMiniCalendar]: formatIsoDate(date) }));
  };

  return (
    <>
      {showDialog && (
        <C.DialogWrap onClick={closeDialog}>
          <Draggable
            nodeRef={nodeRef} // nodeRef 전달
            defaultPosition={pos}
            handle=".dialog-header"
          >
            <C.DialogContent ref={nodeRef} onClick={(e) => e.stopPropagation()}>
              <C.DialogHeader className="dialog-header">
                <C.CloseBtn onClick={closeDialog}>
                  <svg
                    width="15"
                    height="17"
                    viewBox="0 0 30 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line
                      x1="0.707107"
                      y1="1.29289"
                      x2="28.7071"
                      y2="29.2929"
                      stroke="black"
                      strokeWidth="4"
                    />
                    <line
                      x1="28.7071"
                      y1="2.70711"
                      x2="0.707107"
                      y2="30.7071"
                      stroke="black"
                      strokeWidth="4"
                    />
                  </svg>
                </C.CloseBtn>
              </C.DialogHeader>

              <C.DialogBody>
                <C.Content $labels={labels}>
                  <C.DialogInput
                    type="text"
                    name="title"
                    value={event.title}
                    placeholder="제목 및 시간 추가"
                    onChange={onChange}
                  />
                  {/* <C.DialogInput
                    type="date"
                    name="start"
                    value={formatDate(event.start) || ""}
                    onChange={onChange}
                    placeholder="날짜"
                  />
                  <C.DialogInput
                    type="date"
                    name="end"
                    value={formatDate(event.end) || ""}
                    onChange={onChange}
                    placeholder="날짜"
                  /> */}

                  {/* <div className="changeDate">
                    <button className="setDate" onClick={onOpenCalendar}>
                      {newEventData && formatToShowDate(newEventData.slots[0])}
                    </button>
                    <button className="setDate" onClick={onOpenCalendar}>
                      {newEventData &&
                        formatToShowDate(
                          newEventData.slots[newEventData.slots.length - 1]
                        )}
                    </button>
                  </div> */}

                  <button
                    onClick={onOpenCalendar}
                    name="start"
                    onChange={onChange}
                  >
                    {event.start && formatToShowDate(event.start)}
                    {/* {newEventData && formatToShowDate(newEventData.slots[0])} */}
                  </button>
                  <button name="end" onClick={onOpenCalendar}>
                    {event.end && formatToShowDate(event.end)}
                    {/* {newEventData && formatToShowDate(newEventData.slots[0])} */}
                  </button>
                  <C.InputCalendar style={{ height: onCalendar }}>
                    <C.MiniCalendar
                      localizer={momentLocalizer(moment)}
                      // events={event}
                      selectable
                      // onSelectSlot={handleMiniCalendar}
                      onDrillDown={handleMiniCalendar}
                      toolbar={false}
                    />
                  </C.InputCalendar>

                  <C.DialogInput type="text" placeholder="참석자" />
                  <C.DialogTextarea
                    className="textarea"
                    rows={1}
                    placeholder="설명"
                  />

                  <div className="label">
                    <ul>
                      {labels.map((label) => {
                        return (
                          <li
                            key={label.name}
                            className={
                              label.name == labelColor
                                ? `active ${label.name}`
                                : `${label.name}`
                            }
                            onClick={() => {
                              setLabelColor(label.name);
                            }}
                          >
                            <label htmlFor={label.name}></label>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </C.Content>
              </C.DialogBody>

              <C.DialogButtonWrap>
                {/* <C.DialogButton theme="light" onClick={handleEdit}>
                    수정모드
                  </C.DialogButton> */}

                <C.DialogButton theme="dark" onClick={handleSave}>
                  저장
                </C.DialogButton>

                <C.DialogButton theme="light" onClick={handleDelete}>
                  삭제
                </C.DialogButton>
              </C.DialogButtonWrap>
            </C.DialogContent>
          </Draggable>
        </C.DialogWrap>
      )}
    </>
  );
};

export default DialogComponent;
