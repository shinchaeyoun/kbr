03.19

db에 저장된 board 값은
0: {idx: 1, title: '2024 다문화학생 한국어교육 지원 시스템 고도화', …}
1: {idx: 2, title: '2024 문화인력 교육체계 수립 및 온라인교육', …}
2: {idx: 3, title: 'asd', …}
3: {idx: 5, title: 'index5', …}

이런 식이라

```
<Link to={`/board/${board.idx}`}>{board.title}</Link>
```

해당 코드로 index5 게시물을 클릭하면
/board/5
의 링크로 이동해서 오류가 난다.

서버에 저장되는 인덱스와 쌓이는 인덱스가 달라서 생기는 오류라서
아이템 인덱스를 따라가야하는데 오브젝트 인덱스를 찾아가서 생기는 오류

link to 대신에 onClick 함수를 이용해서 linkToBoard 함수를 만들었다.
onClick 함수는 1개의 파라미터 값만 전달하기 때문에

```
onclick(e, params)
```

라는 코드의 params 는 undefined로 전달된다.

linkToBoard 함수를 화살표 함수로 감싸주어 함수의 호출부에서 인자를 넘겨준다.

```
onClick={(e) => {linkToBoard(board.idx, e)}}
```

linkToBoard 함수

```
  const linkToBoard = (idx, e) => {
    const index = boardList.findIndex(item => item.idx === idx);
    navigate(`/board/${index}`);
  };
```

오브젝트의 인덱스를 index 변수 안에 저장
보드리스트 오브젝트를 파인드인덱스로 돌려서 item의 idx가 파라미터로 전달받은 idx와 동일하면 index에 저장하게 만들고

네비게이트를 사용해서 board/index로 이동할 수 있게 수정했다.

=====

server.js에서 app.post('/board') 코드

이전
```
app.post("/board", (req, res) => {
  const title = req.body.title;
  const customer = req.body.customer;
  const pm1 = req.body.pm1;
  const pm2 = req.body.pm2;
  const pm3 = req.body.pm3;
  const startAt = req.body.startAt;
  const scheduledAt = req.body.scheduledAt;
  const completedAt = req.body.completedAt;
  const totalCha = req.body.totalCha;
  const lmsTime = req.body.lmsTime;
  const lmsCode = req.body.lmsCode;
  const innerUrl = req.body.innerUrl;
  const outerUrl = req.body.outerUrl;
  const customerName = req.body.customerName;
  const customerTel = req.body.customerTel;
  const customerPlan = req.body.customerPlan;
  const pottingComp = req.body.pottingComp;
  const etc = req.body.etc;

  const query = `
    INSERT INTO board (title,customer,pm1,pm2,pm3,startAt,scheduledAt,completedAt,totalCha,lmsTime,lmsCode,innerUrl,outerUrl,customerName,customerTel,customerPlan,pottingComp,etc)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);
  `;
  const params = [
    title,
    customer,
    pm1,
    pm2,
    pm3,
    startAt,
    scheduledAt,
    completedAt,
    totalCha,
    lmsTime,
    lmsCode,
    innerUrl,
    outerUrl,
    customerName,
    customerTel,
    customerPlan,
    pottingComp,
    etc,
  ];

  connection.query(query, params, (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      console.log("전송 실패", err);
      res.send({ msg: "전송 실패" });
    }
  });

  console.log("??? board");
});
```

간소화
```

```



-------------- 03.20

# 회원가입 + 수정 기능

1. 유저 정보
index, id, pw, name, team, tel, e-mail auth, etc1, etc2, etc3

2. 회원 등급 만들기
비회원, 회원, 과정 관리자, 최고 관리자


Guest: 비회원 (사이트를 탐색하거나 제한된 기능만 이용 가능)
Member: 회원 (일반적인 사용자 권한)
Course Manager: 과정 관리자 (과정 관련 데이터 및 관리 권한)
Administrator: 최고 관리자 (전체 시스템 관리 권한)


---
### Role Levels
Level 1: Guest
Level 2: Member
Level 3: Manager
Level 4: Admin

---
### Access Names
Viewer (Guest)
User (Member)
Manager (Course Manager)
Owner (Administrator)


----

권한 별 할 수 있는 행동 지정

Level 0: 비 로그인 = 로그인 화면만 접근 가능   
Level 1: Guest = 로그인하면 "승인대기중" 화면   
Level 2: Member = 조회만 가능 / 로그인 하면 게시판 리스트   
Level 3: Manager = 수정 가능, 삭제 불가   
Level 4: Admin = 모든 권한

guest   
member   
manager   
admin   

----
엔터로 로그인   
레벨 별 게시물 조회 or 수정   
현재 로그인된 계정 정보랑 로그아웃 버튼 헤더에서 보여주기


====
### 회원 가입 페이지 만들기


==== 
03.21   
어드민 계정에서 현재 가입되어 있는 아이디 모두 조회하기, 권한 부여하기