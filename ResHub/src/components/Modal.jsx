import React, { useEffect, useState } from "react";
import BoardForm from "./forms/BoardForm.jsx";
import UserDetail from "../pages/UserDetail_test.jsx";
import User from "../components/User.jsx";

import M from "../styled/ModalStyled.jsx";

const Modal = (props) => {
  const itemIdx = props.itemIdx;
  const mode = props.mode;

  const [isMouseDownInside, setIsMouseDownInside] = useState(false);

  const closeModal = () => {
    if (mode !== "view") {
      const closeConfirm = confirm("창 닫기");
      closeConfirm && props.setIsModalOpen(false);
    } else {
      props.setIsModalOpen(false);
    }
  };

  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  
    if (props.isModalOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    }
  
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    };
  }, [props.isModalOpen]);

  if (!props.isModalOpen) return null;

  return (
    <>
      {props.isModalOpen && (
        <M.ModalWrap
          onMouseDown={(e) => {
            // ModalContent 내부에서 마우스 다운 여부를 추적
            if (e.target === e.currentTarget) {
              setIsMouseDownInside(false);
            } else {
              setIsMouseDownInside(true);
            }
          }}
          onMouseUp={(e) => {
            // ModalContent 외부에서 마우스를 떼면 모달 닫기
            if (!isMouseDownInside && e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <M.ModalContent
            onMouseDown={() => setIsMouseDownInside(true)} // ModalContent 내부에서 마우스 다운
          >
            {props.type === "userList" ? (
              <User
                idx={props.userIdx}
                isModalOpen={props.isModalOpen}
                setIsModalOpen={props.setIsModalOpen}
              />
            ) : (
              <BoardForm
                mode={mode}
                idx={itemIdx}
                isModalOpen={props.isModalOpen}
                setIsModalOpen={props.setIsModalOpen}
                onModalClose={props.onModalClose}
                level={props.level}
                isEmptyLink={props.isEmptyLink}
                setIsEmptyLink={props.setIsEmptyLink}
              />
            )}
          </M.ModalContent>
        </M.ModalWrap>
      )}
    </>
  );
};

export default Modal;