// 사용자 정보 관리 관련 라우트

import express from "express";
import { query } from "../helpers/dbHelper.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const index = req.query.idx;
  const sql = `SELECT * FROM user WHERE idx = ?`;

  query(sql, [index])
    .then((data) => res.send(data[0]))
    .catch((err) => {
      console.error("쿼리 실행 중 오류 발생:", err);
      res.status(500).send({ msg: "쿼리 실행 실패", error: err });
    });
});

router.get("/list", async (req, res) => {
  const limit = parseInt(req.query.limit) || 20; // 한 번에 가져올 데이터 수
  const offset = parseInt(req.query.offset) || 0; // 시작 위치

  try {
    // 승인 대기 데이터(레벨 2 미만) 개수 확인
    const lowLevelCountSql = `SELECT COUNT(*) AS lowLevelCount FROM user WHERE level < 2`;
    const lowLevelCountResult = await query(lowLevelCountSql);
    const lowLevelCount = lowLevelCountResult[0].lowLevelCount;

    const totalCountSql = "SELECT COUNT(*) AS totalCount FROM user";
    const totalCountResult = await query(totalCountSql);
    const totalCount = totalCountResult[0].totalCount;

    // 승인 대기 데이터(레벨 2 미만) 가져오기
    let sql = `
      SELECT * 
      FROM user 
      WHERE level < 2
      ORDER BY level ASC, idx ASC
      LIMIT ${limit} OFFSET ${offset}
    `;
    const userList = await query(sql);

    // 승인 대기 데이터가 limit보다 적을 경우 권한 레벨 높은 데이터 추가로 가져오기
    if (userList.length < limit) {
      const remainingLimit = limit - userList.length; // 부족한 데이터 개수 계산
      const highLevelSql = `
        SELECT * 
        FROM user 
        WHERE level >= 2
        ORDER BY level DESC, idx ASC
        LIMIT ${remainingLimit}
      `;
      const highLevelUsers = await query(highLevelSql);

      // 승인 대기 데이터와 권한 레벨 높은 데이터를 합침
      userList.push(...highLevelUsers);
    }

    // 클라이언트로 데이터 전송
    res.send({
      totalCount,
      lowLevelCount,
      userList,
    });
  } catch (err) {
    console.error("데이터 조회 중 오류 발생:", err);
    res.status(500).send({ msg: "데이터 조회 실패", error: err });
  }
});

// 사용자 검색
router.post("/search", async (req, res) => {
  const searchVal = req.body.isSearch.search;
  const limit = req.body.limit;
  const offset = req.body.offset;
  // const sql = `SELECT * FROM user WHERE id LIKE ? ORDER BY level ASC, idx ASC LIMIT ${limit} OFFSET ${offset}`;
console.log("searchVal", searchVal);

  try {
    const totalCountSql = `
      SELECT COUNT(*) AS totalCount FROM user 
      WHERE CONCAT_WS(' ', id, name, team) LIKE ?
    `;
    const totalCountResult = await query(totalCountSql, [`%${searchVal}%`]);
    const totalCount = totalCountResult[0].totalCount;
    console.log("totalCount", totalCount);
    console.log("limit", limit, "offset", offset);
    

    const sql = `
      SELECT * FROM user 
      WHERE CONCAT_WS(' ', id, name, team) LIKE ? 
      ORDER BY level ASC, idx ASC 
      LIMIT ${limit} OFFSET ${offset}
    `;
    const allUsersSql = `SELECT * FROM user LIMIT ${limit} OFFSET ${offset}`;

    const searchResult = await query(sql, [`%${searchVal}%`]);
    const allResult = await query(allUsersSql, [`%${searchVal}%`]);

    console.log('searchResult',searchResult.length);
    // console.log('allResult',allResult.length);
    // .then((data) => {
    //   if (data.length > 0) {
    //     res.send({ msg: "", result: data });
    //   } else {
    //     query(allUsersSql)
    //       .then((allData, totalCount) => {
    //         res.send({
    //           msg: "검색하신 내용이 없습니다.",
    //           result: allData,
    //           totalCount: totalCount,
    //         });
    //       })
    //       .catch((err) => {
    //         console.error("전체 사용자 정보 가져오기 실패:", err);
    //         res.status(500).send({
    //           msg: "전체 사용자 정보를 가져오는 데 실패했습니다.",
    //           error: err,
    //         });
    //       });
    //   }
    // });


    // 검색된 값이 없을 때 처리
    if (searchResult.length === 0) {
      return res.send({
        msg: "검색 결과가 없습니다.",
        totalCount: 0,
        searchResult: [],
        allResult: allResult,
      });
    }

    // 검색된 값이 있을 때 처리
    res.send({
      msg: "",
      totalCount,
      searchResult,
    });
  } catch (err) {
    console.error("데이터 조회 중 오류 발생:", err);
    res.send({ msg: "데이터 조회 실패", error: err });
  }

  // console.log("limit", limit, "offset", offset);

  // query(sql, [`%${searchVal}%`])
  //   .then((data) => {
  //     if (data.length > 0) {
  //       res.send({ msg: "", result: data });
  //     } else {
  //       query(allUsersSql)
  //         .then((allData, totalCount) => {
  //           res.send({
  //             msg: "검색하신 내용이 없습니다.",
  //             result: allData,
  //             totalCount: totalCount,
  //           });
  //         })
  //         .catch((err) => {
  //           console.error("전체 사용자 정보 가져오기 실패:", err);
  //           res.status(500).send({
  //             msg: "전체 사용자 정보를 가져오는 데 실패했습니다.",
  //             error: err,
  //           });
  //         });
  //     }
  //   })
  //   .catch((err) => {
  //     console.error("쿼리 실행 중 오류 발생:", err);
  //     res.status(500).send({ msg: "쿼리 실행 실패", error: err });
  //   });
});

// 사용자 정보 수정
// 클라이언트가 보낸 사용자 정보를 기반으로 특정 사용자의 데이터를 수정합니다.
router.patch("/update", (req, res) => {
  const index = req.query.idx;
  const { id, password, level, name, team, tel, email, etc1, etc2, etc3 } =
    req.body;

  const sql = `
    UPDATE user SET 
    id = ?, password = ?, level = ?, name = ?, team = ?, tel = ?, email = ?, 
    etc1 = ?, etc2 = ?, etc3 = ? 
    WHERE idx = ?
  `;
  const params = [
    id,
    password,
    level,
    name,
    team,
    tel,
    email,
    etc1,
    etc2,
    etc3,
    index,
  ];

  query(sql, params)
    .then((data) => {
      console.log("수정된 데이터 params:", params);

      res.send(data);
    })
    .catch((err) => res.send({ msg: "수정 실패", err }));
});

// 사용자 레벨 변경
router.patch("/setlevel", (req, res) => {
  const index = req.query.idx;
  const sql = `UPDATE user SET level = ? WHERE idx = ?`;

  query(sql, [2, index])
    .then((data) => res.send(data))
    .catch((err) => res.send({ msg: "수정 실패", err }));
});

// 사용자 계정 삭제
router.delete("/delete", (req, res) => {
  const index = req.query.idx;
  const sql = `DELETE FROM user WHERE idx = ?`;

  query(sql, [index]).then((data) => res.send(data));
});

export default router;
