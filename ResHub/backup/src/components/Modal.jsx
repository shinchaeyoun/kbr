import { useEffect, useState } from "react";

import S from "../styled/GlobalBlock.jsx";
import M from "../styled/ModalStyled.jsx";

const Modal = (props) => {
  const level = localStorage.getItem("level") || "user";
  const data = props.data;
  const mode = props.mode || "view"; // 모드가 없으면 기본값 'view'로 설정

  
  const closeModal = () => {
    props.setIsModalOpen(false);
  };

  // 취소 버튼 동작
  const handleCancel = () => {
    props.setIsModalOpen(false);
  };


  // 제출 버튼 동작
  const handleSubmit = async () => {
    
    
  };

  // 게시글 삭제
  const deleteBoard = async () => {
    // if (level < 9) {
    //   alert("삭제 권한 없음");
    //   return;
    // }
    // const deleteCode = "dd";
    // const userInput = prompt("삭제 암호를 입력하세요", "");
    // if (userInput === deleteCode) {
    //   try {
    //     await axios.delete(`http://192.168.23.2:5000/project/delete`, {
    //       data: { idx },
    //     });
    //     setIsModalOpen(false);
    //     if (onModalClose) onModalClose("delete", idx); // 부모 컴포넌트에 변경 알림
    //   } catch (error) {
    //     console.error("삭제 중 오류 발생:", error);
    //   }
    // } else {
    //   alert("잘못된 비밀번호입니다.");
    // }
  };

  return (
    <>
      {props.isModalOpen && (
        <M.ModalWrap onClick={closeModal}>
          <M.ModalContent onClick={(e) => e.stopPropagation()}>
            {mode == "create" ? (
              <M.Wrap>
                <M.GridContainer>
                  <M.GridItem>
                    <M.SubTitle>제목</M.SubTitle>

                    <M.Input />
                  </M.GridItem>

                  <M.GridItem>
                    <M.SubTitle>상세설명</M.SubTitle>
                    <M.Textarea />
                  </M.GridItem>

                  <M.GridItem>
                    <M.SubTitle>년도</M.SubTitle>

                    <M.Group>
                      <S.Select>
                      </S.Select>
                    </M.Group>
                  </M.GridItem>

                  <M.GridItem>
                    <M.SubTitle>과정경로(서버경로)</M.SubTitle>
                    <M.Input />
                  </M.GridItem>

                  <M.GridItem>
                    <M.SubTitle>과정URL(검수사이트)</M.SubTitle>
                    <M.Input />
                  </M.GridItem>

                  <M.GridItem $margin="0 0 5px 0">
                    <M.Form>
                      <M.SubTitle>썸네일 이미지</M.SubTitle>
                      <M.Input />
                    </M.Form>
                  </M.GridItem>

                  <M.GridItem></M.GridItem>

                  {level == "admin" && <M.Button onClick={handleSubmit}>사업(과정) 등록</M.Button>}
                </M.GridContainer>

                <M.CloseBtn >
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    strokeWidth={2}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M1 1L29 29" stroke="black" />
                    <path d="M29 1L1 29" stroke="black" />
                  </svg>
                </M.CloseBtn>
              </M.Wrap>
            ) : (
              <M.Wrap>
                <M.GridContainer>
                  <M.GridItem>
                    <M.SubTitle>제목</M.SubTitle>

                    <M.Input value={data.title} />
                  </M.GridItem>

                  <M.GridItem>
                    <M.SubTitle>상세설명</M.SubTitle>
                    <M.Textarea value={data.description} />
                  </M.GridItem>

                  <M.GridItem>
                    <M.SubTitle>년도</M.SubTitle>

                    <M.Group>
                      <S.Select
                        type="text"
                        name="year"
                        value={data.year || "SelectYear"}
                        // disabled={level == "user"}
                        // onChange={onChange}
                      >
                        {Array.from({ length: 7 }, (_, i) => {
                          const year = data.year + 1 - i; // SelectYear부터 이전 5년까지 옵션 생성
                          return (
                            <option key={year} value={data.year}>
                              {data.year}
                            </option>
                          );
                        })}
                      </S.Select>
                    </M.Group>
                  </M.GridItem>

                  <M.GridItem>
                    <M.SubTitle>과정경로(서버경로)</M.SubTitle>
                    <M.Input value={data.innerUrl} />
                  </M.GridItem>

                  <M.GridItem>
                    <M.SubTitle>과정URL(검수사이트)</M.SubTitle>
                    <M.Input value={data.outerUrl} />
                  </M.GridItem>

                  <M.GridItem $margin="0 0 5px 0">
                    <M.Form>
                      <M.SubTitle>썸네일 이미지</M.SubTitle>
                      <M.Input value={data.thumb} />
                    </M.Form>
                  </M.GridItem>

                  <M.GridItem></M.GridItem>

                  {level == "admin" && <M.Button>사업(과정) 수정</M.Button>}
                  {level == "admin" && (
                    <M.DeleteBtn
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteBoard();
                      }}
                    >
                      삭제하기
                    </M.DeleteBtn>
                  )}
                </M.GridContainer>

                <M.CloseBtn onClick={handleCancel}>
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    strokeWidth={2}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M1 1L29 29" stroke="black" />
                    <path d="M29 1L1 29" stroke="black" />
                  </svg>
                </M.CloseBtn>
              </M.Wrap>
            )}
          </M.ModalContent>
        </M.ModalWrap>
      )}
    </>
  );
};

export default Modal;
