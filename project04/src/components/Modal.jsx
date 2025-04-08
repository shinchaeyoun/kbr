import React, { useEffect } from "react";
import styled from "styled-components";
import BoardForm from "./forms/BoardForm.jsx";
import M from "../styled/ModalStyled.jsx";


const Modal = (props) => {
  const itemIdx = props.itemIdx;
  const mode = props.mode;

  const closeModal = () => {
    if (mode !== "view") {
      const closeConfirm = confirm("창 닫기");
      closeConfirm && props.setIsModalOpen(false);
    } else {
      props.setIsModalOpen(false);
    }
  };

  useEffect(() => {
    if (props.isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [props.isModalOpen]);
  if (!props.isModalOpen) return null;

  return (
    <>
      {props.isModalOpen && (
        <M.ModalWrap className="modal-wrap" onClick={closeModal}>
          <M.ModalContent className="content" onClick={(e) => e.stopPropagation()}>
            <BoardForm
              mode={mode}
              idx={itemIdx}
              isModalOpen={props.isModalOpen}
              setIsModalOpen={props.setIsModalOpen}
              onModalClose={props.onModalClose}
              level={props.level}
            />
          </M.ModalContent>
        </M.ModalWrap>
      )}
    </>
  );
};

export default Modal;
