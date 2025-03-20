# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.




--- 03.14

권한별 페이지 접근 까지는 만들었는데
어드민 계정에 마스터 권한까지 주는 방법 찾아야함



------------ 0318

http://192.168.23.143:5001/
해당 페이지 대로 만들기

게시판 구조의 과정 등록 페이지



idx
title
contents
createdBy
createdAt


border_num
title
content
writer
wr_date
view_cnt

idx
title
customer
pm1
pm2
pm3
startAt
scheduledAt
completedAt
totalCha
lmsTime
lmsCode
insideUrl
outsideUrl
customerName
customerTel
customerPlan
pottingComp
etc



게시물 옵션

사업명(과정명) *
세부 과정명
고객사
총괄PM/과정PM/개발PM
착수시작/완료예정/완료일
총차시수/신고시간/운영코드
수주/예상/완료비용
내부 경로 
외부 경로
업체담당자/연락처/교육예정일
포팅업체
기타사항 

게시판 리스트
(과정명, 기관명, 과정 경로, url)

============

1. 게시물 등록
2. 게시물 검색
3. 게시물 수정
