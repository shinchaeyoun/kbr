import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Draggable, { DraggableCore } from "react-draggable"; // Both at the same time
import C from "../styled/CalenderStyle.jsx";
import axios from "axios";

const DialogComponent = ({
  mode,
  eventId,
  showDialog,
  setShowDialog,
  pos,
  eventSave,
  eventEdit,
  onCloseDialog,
}) => {
  const nodeRef = useRef(null);
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

  const getEvent = async () => {
    if (mode == "read") {
      await axios
        .get(`http://192.168.23.65:5000/sched/events?id=${eventId}`)
        .then((res) => {
          setEvent(res.data[0] || INITIAL_EVENT); // 데이터가 없을 때 초기값으로 설정
        })
        .catch((err) => {
          console.error("Error fetching event data:", err);
          setEvent(INITIAL_EVENT); // 에러 발생 시 초기값으로 설정
        });
    } else if (mode == "write") {
      setEvent(INITIAL_EVENT); // 초기값으로 리셋
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setEvent((event) => ({ ...event, [name]: value }));
  };

  const closeDialog = (e) => {
    setShowDialog(false);
  };

  const handleEdit = async () => {
    // console.log("수정모드", event);
    // setEditMode(!editMode);
    // setEvent({ ...event, color: labelColor });
    // const updateEvent = {
    //   ...event,
    //   color: labelColor,
    // };
    // const response = await axios.patch(
    //   `http://192.168.23.65:5000/sched/update?id=${eventId}`,
    //   updateEvent,
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );
  };

  const handleSave = () => {
    if (mode == "read") {
      // alert("수정하시겠습니까?");
      // handleEdit();
      setEditMode(!editMode);
      setEvent({ ...event, label: labelColor });

      const updateEvent = {
        ...event,
        label: labelColor,
      };

      if (eventEdit) eventEdit(eventId, updateEvent);
    } else if (mode === "write") {
      const newEvent = {
        ...event,
        title: event.title || "(제목 없음)",
        label: labelColor,
      };

      // if (eventSave) eventSave(event.title || "제목 없음", labelColor); // 제목이 없을 경우 기본값 설정
      if (eventSave) eventSave(newEvent); // 제목이 없을 경우 기본값 설정
    }
    setShowDialog(false);
  };

  const handleDelete = async () => {
    const delCheck = confirm("삭제하시겠습니까?");

    if (delCheck) {
      await axios.delete(
        `http://192.168.23.65:5000/sched/delete?id=${eventId}`
      );
      setShowDialog(false);
      setEvent(INITIAL_EVENT);
      if (onCloseDialog) onCloseDialog("delete", eventId); // 부모 컴포넌트로 삭제 이벤트 전달
    }
  };

  useEffect(() => {
    if (showDialog) {
      getEvent();
    }
  }, [showDialog]);

  useEffect(() => {
    getEvent();
  }, []);

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
                  {/* {event && ( */}
                    <C.DialogInput
                      type="text"
                      name="title"
                      value={event.title}
                      placeholder="제목 및 시간 추가"
                      onChange={onChange}
                    />
                  {/* )} */}
                  {/* <C.DialogInput type="text" placeholder="내용" />
                  <C.DialogInput type="text" placeholder="날짜" />
                  <C.DialogInput type="text" placeholder="시간" /> */}

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
                            {/* <input type="checkbox" id={label.name} /> */}
                            <label htmlFor={label.name}></label>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </C.Content>

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
              </C.DialogBody>
            </C.DialogContent>
          </Draggable>
        </C.DialogWrap>
      )}
    </>
  );
};

export default DialogComponent;
