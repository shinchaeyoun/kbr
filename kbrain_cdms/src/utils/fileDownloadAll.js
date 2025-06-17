import axios from "axios";

export async function downloadAllZip({ url, params, defaultFileName = "attachments.zip" }) {
  try {
    const response = await axios.get(url, {
      params,
      responseType: "blob",
    });

    let fileName = defaultFileName;
    const disposition = response.headers["content-disposition"];
    if (disposition && disposition.indexOf("filename=") !== -1) {
      const matches = /filename[^;=\n]*=((['\"]).*?\2|[^;\n]*)/.exec(disposition);
      if (matches != null && matches[1]) {
        fileName = decodeURIComponent(matches[1].replace(/['"]/g, ""));
      }
    }

    const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = fileName;
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