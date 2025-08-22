import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import S from "../styled/GlobalBlock.jsx";
import C from "../styled/CardStyled.jsx";
import axios from "axios";

import AttIcon from "./AttachmentIcon.jsx";
import AttachmentIcon from "../assets/icon/attachment.svg?react";
import LinkIcon from "../assets/icon/link-out.svg?react";

import Modal from "./Modal.jsx";

const CardItem = ({ data, dataIdx, openPopoverIdx, setOpenPopoverIdx }) => {
  const navigate = useNavigate();
  const item = data;
  const itemTag = data.tag ? data.tag.split(',') : [];
  const [atta, setAtta] = useState(data.attachment || []);
  // const [itemTag, setItemTag] = useState(data.tag.split(',') || []);
  // 모달 관련
  const isPopover = openPopoverIdx === data.index;
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 모달 열기
  const openModal = () => {
    // setIsBoardIdx(code);
    // setModalData(data); // 추가 데이터 설정
    setIsModalOpen(!isModalOpen);
  };
  // 모달 관련 끝

  
  return (
    <C.CardWrapper
      onClick={() => {
        // openModal();
        console.log("페이지 이동");
        navigate(`/${dataIdx}`);
      }}
    >
      {/* <Modal
        data={item}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      /> */}
      <C.Thumbnail></C.Thumbnail>

      <C.Content>
        <C.Block>
          <div className="title">{item.title}</div>
          <div className="description">{item.description}</div>
        </C.Block>

        <C.Block $type="tag">
          {itemTag.map((tag, idx) => (
            <C.Tag key={idx}>{tag}</C.Tag>
          ))}
        </C.Block>

        <C.ButtonWrap>
          {atta.length > 0 && (
            <C.Attachment
              onClick={(e) => {
                e.stopPropagation();
                if (openPopoverIdx === item.index) {
                  setOpenPopoverIdx(null); // 팝오버 닫기
                } else {
                  setOpenPopoverIdx(item.index); // 팝오버 열기
                }
              }}
            >
              <AttachmentIcon width="20px" height="20px" />
              {isPopover && (
                <C.AttachmentPop>
                  <ul>
                    <li>
                      <AttIcon width="20px" height="20px" />
                    </li>
                  </ul>
                </C.AttachmentPop>
              )}
            </C.Attachment>
          )}

          <a
            href={item.outerUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{ display: "inline-flex" }}
            title="링크로 이동"
          >
            <LinkIcon width="20px" height="20px" />
          </a>
        </C.ButtonWrap>
      </C.Content>
    </C.CardWrapper>
  );
};

export default CardItem;
