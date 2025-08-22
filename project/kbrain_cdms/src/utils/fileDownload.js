import axios from "axios";

/**
 * 개별 파일 다운로드 공통 함수
 * @param {Object} options
 * @param {string} options.url - 다운로드 API URL
 * @param {Object} options.params - axios 요청 params (idx, fileIdx 등)
 * @param {Object} options.item - 게시글 데이터(attachment 포함)
 * @param {number} options.index - 파일 인덱스
 */
export async function downloadFile({ url, params, item, index }) {
  console.log('item',item);
  
  try {
    // 원본 파일명 추출
    const originalName = item.attachment
      .split("|")
      .map((file) => file.split(",")[1])[index];

    const response = await axios.get(url, {
      params,
      responseType: "blob",
    });

    const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = originalName || "download";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl);
      a.remove();
    }, 100);
  } catch (err) {
    alert("파일 다운로드 실패");
    console.error(err);
  }
}
