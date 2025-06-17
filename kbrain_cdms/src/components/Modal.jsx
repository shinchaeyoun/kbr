import React, { useEffect } from "react";
import BoardForm from "./forms/BoardForm.jsx";
import M from "../styled/ModalStyled.jsx";
import SubjectForm from "./forms/SubjectForm.jsx";

const Modal = (props) => {
  let content;
  const itemIdx = props.itemIdx;
  const mode = props.mode;

  if (mode === "add") {
    content = (
      <SubjectForm
        code={props.code}
        mode={mode}
        isModalOpen={props.isModalOpen}
        setIsModalOpen={props.setIsModalOpen}
        fetchProjectData={props.fetchProjectData}
      />
    );
  }

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
          <M.ModalContent
            style={{ height: "600px" }}
            className="content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* <ModalForm
              mode={mode}
              idx={itemIdx}
              isModalOpen={props.isModalOpen}
              setIsModalOpen={props.setIsModalOpen}
              onModalClose={props.onModalClose}
              level={props.level}
            /> */}

            {content}
          </M.ModalContent>
        </M.ModalWrap>
      )}
    </>
  );
};

export default Modal;
