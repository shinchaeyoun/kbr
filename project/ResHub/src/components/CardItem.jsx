import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import M from "../styled/MainStyled.jsx";

import { downloadFile } from "@/utils/fileDownload";

import AttIcon from "./AttachmentIcon.jsx";
import AttachmentIcon from "../assets/icon/attachment.svg?react";
import LinkIcon from "../assets/icon/link-out.svg?react";

const CardItem = ({ data, openPopoverIdx, setOpenPopoverIdx }) => {
  const API_URL = window.location.protocol === "https:" ? "https://192.168.23.2:5100/item" : "http://192.168.23.2:5100/item";
  const navigate = useNavigate();
  const item = data;
  const itemTag = data.tag ? data.tag.split(",") : [];
  const [atta, setAtta] = useState(data.attachment || []);
  const isPopover = openPopoverIdx === data.index;
  const [attachmentList, setAttachmentList] = useState([]);

  // 파일 다운로드
  const handleDownload = (item, index) => {
    downloadFile({
      url: `${API_URL}/filedownload`,
      params: { idx: item.index, fileIdx: index },
      item,
      index,
    });
  };

  useEffect(()=>{
    console.log('data.attachment',data.attachment);
    setAtta(data.attachment || []);
    
  }, [data])

  return (
    <M.CardWrapper
      onClick={() => {
        navigate(`/detail?no=${item.index}`);
      }}
    >
      <M.Thumbnail $bg={`${item.thumb}`}></M.Thumbnail>

      <M.Content>
        <M.Block>
          <div className="title">
            {item.title}
            {/* <p>{item.date}</p> */}
          </div>

          <div className="description">{item.description}</div>
        </M.Block>

        <M.Block $type="tag">
          {itemTag.map((tag, idx) => (
            <M.Tag
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/?tag=${tag}`);
              }}
            >
              {tag}
            </M.Tag>
          ))}
        </M.Block>

        <M.ButtonWrap>
          {atta.length > 0 && (
            <M.Attachment
              onClick={(e) => {
                e.stopPropagation();
                setOpenPopoverIdx(isPopover ? null : item.index);
                setAttachmentList(data.attachment.split("|"));
              }}
            >
              <AttachmentIcon width="20px" height="20px" />
              {isPopover && (
                <M.AttachmentPop>
                  <ul>
                    {attachmentList.map((file, idx) => {
                      const [savedName, originalName] = file.split(",");
                      return (
                        <li
                          key={idx}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(item, idx);
                          }}
                        >
                          <AttIcon filename={originalName} width="20px" height="20px" />
                          {originalName}
                        </li>
                      );
                    })}
                  </ul>
                </M.AttachmentPop>
              )}
            </M.Attachment>
          )}

          <a
            href={item.outerUrl}
            onClick={e => {
              e.stopPropagation();
              window.open(item.outerUrl, "_blank", `width=${item.width || 1280},height=${item.height || 720}`);
              e.preventDefault();
            }}
            style={{ display: "inline-flex" }}
            title="링크로 이동"
          >
            <LinkIcon width="20px" height="20px" />
          </a>
        </M.ButtonWrap>
      </M.Content>
    </M.CardWrapper>
  );
};

export default CardItem;
