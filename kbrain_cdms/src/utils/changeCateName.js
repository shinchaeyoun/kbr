export function changeCateName(ogName) {
  switch (ogName) {
    case "script": return "원고";
    case "sb": return "보드";
    case "voice": return "음성";
    case "animation": return "애니";
    case "video": return "영상";
    case "design": return "디자인";
    case "content": return "개발";
    case "common": return "공통 게시판";
    
    default: return ogName;
  }
}
