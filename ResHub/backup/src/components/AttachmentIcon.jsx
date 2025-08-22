import React from "react";
import HwpIcon from "../assets/icon/hwp.svg?react";
import PdfIcon from "../assets/icon/pdf.svg?react";
import DocIcon from "../assets/icon/doc.svg?react";
import XlsIcon from "../assets/icon/xls.svg?react";
import PptIcon from "../assets/icon/ppt.svg?react";
import ZipIcon from "../assets/icon/zip.svg?react";
import ImageIcon from "../assets/icon/hwp.svg?react";
import DefaultIcon from "../assets/icon/default-attachment.svg?react";

/**
 * 확장자별 첨부파일 아이콘 컴포넌트
 * @param {string} filename - 파일명 (확장자 추출용)
 * @param {object} props - 기타 svg props
 */

const AttachmentIcon = ({ filename = "", ...props }) => {
  const ext = filename.split(".").pop().toLowerCase();
  if (["hwp"].includes(ext)) return <HwpIcon {...props} />;
  if (["pdf"].includes(ext)) return <PdfIcon {...props} />;
  if (["doc", "docx"].includes(ext)) return <DocIcon {...props} />;
  if (["xls", "xlsx"].includes(ext)) return <XlsIcon {...props} />;
  if (["ppt", "pptx"].includes(ext)) return <PptIcon {...props} />;
  if (["zip", "rar"].includes(ext)) return <ZipIcon {...props} />;
  if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext)) return <ImageIcon {...props} />;
  return <DefaultIcon {...props} />;
};

export default AttachmentIcon;
