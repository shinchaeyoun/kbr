공통게시판 페이지
CommonBoard
-> BoardListForm
  -> BoardWrite
  -> BoardDetail
    -> BoardWrite


ProjectPage
->
subjectBoard // 해당 게시물 목록을 받아옴
과목 게시판 컴포넌트
-> BoardListForm (상위 컴포넌트에서 목록을 받아옴)
  -> BoardWrite 
  -> BoardDetail (상위 컴포넌트에서 인덱스를 받아오고, 인덱스로 정보 새로 받아오기)
    -> BoardWrite

게시판 연결 유닛
-> ZIP 파일 다운로드
-> 개별 파일 다운로드
-> 조회수 카운트
-> 


공통게시판 페이지에는 category column이 빈칸인 값만, subjectBoard는 해당 카테고리만

------

게시물 수정 시 바로 반영 안되는 중 / 06.01 //완

보드디테일 상위 컴포넌트인 보드리스트폼에서 데이터를 받아온 후 디테일 페이지로 넘겨주는 중이라
디테일 페이지에서 수정되어도 리스트폼에서 다시 데이터를 받아오기 전까진 디테일 페이지 안에서는 정보가 업데이트 되지 않는 중


** view 관련 함수 컴포넌트화 필요
** 새로고침 시 조회수 증가하도록 수정 //완
** 게시물 수정 바로 반영 필요  //완
** 게시판 인덱스 수정하기 //완
** 과목등록 모달창으로 구현하기 //완
** 날짜 저장값 그대로 나오게 수정하기 //완
** 전체페이지에서 과목등록 버튼 표시
** 진행률 페이지 만들기





```jsx
-- 새로고침 시 조회수 증가
 // 원래 코드 

   useEffect(() => {
    // 페이지가 로드되면 조회수 증가
    console.log("조회수 증가 로직 실행", detail);
    
    if (detail && detail.idx && !hasViewedRef.current) {
      axios.patch(`${API_URL}/views/${detail.idx}`).then(() => {
        setViews((prev) => prev + 1);
      });
      hasViewedRef.current = true;
    }
  }, [detail]);


  // 새로고침 시 조회수 증가
  useEffect(() => {
    const handleReload = () => {
      if (detail && detail.idx) {
        axios.patch(`${API_URL}/views/${detail.idx}`);
      }
    };
    window.addEventListener("beforeunload", handleReload);
    return () => {
      window.removeEventListener("beforeunload", handleReload);
    };
  }, [detail]);
```





  // 새로고침(페이지 이탈 포함) 시 조회수 증가
  useEffect(() => {
    const handleReload = () => {
      if (detail && detail.idx) {
        axios.patch(`${API_URL}/views/${detail.idx}`);
      }
    };
    window.addEventListener('beforeunload', handleReload);
    return () => {
      window.removeEventListener('beforeunload', handleReload);
    };
  }, [detail]);

  useEffect(() => {
    // 페이지가 로드되면 조회수 증가
    console.log("조회수 증가 로직 실행", detail);

    if (detail && detail.idx && !hasViewedRef.current) {
      axios.patch(`${API_URL}/views/${detail.idx}`).then(() => {
        setViews((prev) => prev + 1);
      });
      hasViewedRef.current = true;
    }
  }, [detail]);








    // 새로고침(진짜 reload) 시에만 조회수 증가
  useEffect(() => {
    const handleReload = (e) => {
      if (e.type === "beforeunload" && e.returnValue !== undefined) {
        // 새로고침(진짜 reload)만 허용, 페이지 이동/닫기 등은 제외
        if (detail && detail.idx) {
          axios.patch(`${API_URL}/views/${detail.idx}`);
        }
      }
    };
    window.addEventListener("beforeunload", handleReload);
    return () => {
      window.removeEventListener("beforeunload", handleReload);
    };
  }, [detail]);










----------- 공백 제거
setSubjectCategories(
  (response.data.category || "")
    .split(',')
    .map((c) => c.trim())
    .filter((c) => c)
);



-------- 과목명 저장하는 법, 과목아이디 지정하는 법 생각하기
과목명,1|과목명,2
숫자가 앞에 필요한 것인가



---------
과목등록 페이지

모달창
과목명
차시정보 ??
- 차시명
- 차시갯수
- 
몇개의 차시가 있는지 ?

ProjectMain


과목 등록
과목명 input
