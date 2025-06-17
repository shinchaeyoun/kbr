import React, { useEffect } from "react";
import styled from "styled-components";
import S from "../styled/GlobalBlock.jsx";
import BoardForm from "./forms/BoardForm.jsx";

const ModalWrap = styled.div`
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  z-index: 999;

  background-color: rgba(0, 0, 0, 0.6);

  h2 {
    border-bottom: 2px solid pink;
    margin-bottom: 10px;
    padding-bottom: 10px;
  }

  h3 {
  }

  content {
    div {
      display: flex;

      > p {
        font-weight: bold;
      }
    }
  }
`;

const Content = styled.div`
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;

  padding: 30px;

  overflow-y: scroll;

  > div {
    display: flex;

    > p {
      margin-right: 10px;
      font-weight: bold;
      flex-shrink: 0;
    }
  }
`;

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
                <ModalWrap className="modal-wrap" onClick={closeModal}>
                    <Content className="content" onClick={(e) => e.stopPropagation()}>
                        <BoardForm
                            mode={mode}
                            idx={itemIdx}
                            isModalOpen={props.isModalOpen}
                            setIsModalOpen={props.setIsModalOpen}
                        />
                    </Content>
                </ModalWrap>
            )}
        </>
    );
};

export default Modal;
