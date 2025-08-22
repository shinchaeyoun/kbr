import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import M from "../styled/MainStyled.jsx";

import { downloadFile } from "@/utils/fileDownload";

import AttIcon from "./AttachmentIcon.jsx";
import AttachmentIcon from "../assets/icon/attachment.svg?react";

const ListItem = ({ data, openPopoverIdx, setOpenPopoverIdx }) => {
  const navigate = useNavigate();
  const item = data;

  const [atta, setAtta] = useState(data.attachment || []);
  const [attachmentList, setAttachmentList] = useState([]);

  // 파일 다운로드
  const handleDownload = (item, index) => {
    console.log('item.idx',item.index);
    console.log('index',index);
    
    
    downloadFile({
      url: `http://192.168.23.2:5100/item/filedownload`,
      params: { idx: item.index, fileIdx: index },
      item,
      index,
    });
  };

  useEffect(() => {
    setAtta(data.attachment || []);

    console.log("openPopoverIdx", openPopoverIdx);
  }, [data]);

  return (
    <M.ListWrapper
      onClick={() => {
        navigate(`/detail?no=${item.index}`);
      }}
    >
      {item.title}

      <div>
        {atta.length > 0 && (
          <M.Attachment
            onClick={(e) => {
              e.stopPropagation();
              setOpenPopoverIdx(openPopoverIdx ? null : item.index);
              setAttachmentList(data.attachment.split("|"));
            }}
          >
            <AttachmentIcon width="20px" height="20px" />
            {openPopoverIdx && (
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
                        <p>{originalName}</p>
                      </li>
                    );
                  })}
                </ul>
              </M.AttachmentPop>
            )}
          </M.Attachment>
        )}
      </div>
    </M.ListWrapper>
  );
};

export default ListItem;
