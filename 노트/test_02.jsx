// 이미지 업로드 엔드포인트
router.post("/upload", (req, res) => {
  const { base64Image, originalName, idx } = req.body;

  // 데이터베이스와 테이블 이름을 안전하게 설정
  const databaseName = "mytest"; // 데이터베이스 이름
  const tableName = "board"; // 테이블 이름

  // idx 값이 undefined일 경우 AUTO_INCREMENT 값을 가져옴
  if (idx === undefined) {
    const sqlIdx = `
      SELECT AUTO_INCREMENT
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_SCHEMA = ?
      AND TABLE_NAME = ?;
    `;

    query(sqlIdx, [databaseName, tableName])
      .then((data) => {
        if (!data || data.length === 0) {
          return res.status(404).send({ msg: "AUTO_INCREMENT 값을 찾을 수 없습니다." });
        }

        const autoIncrementValue = data[0].AUTO_INCREMENT;
        console.log("AUTO_INCREMENT 값:", autoIncrementValue);

        // 이미지 저장 및 데이터베이스 업데이트
        handleImageUpload(autoIncrementValue, base64Image, originalName, res);
      })
      .catch((err) => {
        console.error("AUTO_INCREMENT 값을 가져오는 중 오류 발생:", err);
        res.status(500).send({ msg: "AUTO_INCREMENT 값을 가져오는 중 오류 발생" });
      });
  } else {
    console.log("이미 존재하는 idx 값 사용:", idx);

    // 이미지 저장 및 데이터베이스 업데이트
    handleImageUpload(idx, base64Image, originalName, res);
  }
});

// 이미지 저장 및 데이터베이스 업데이트 함수
const handleImageUpload = (id, base64Image, originalName, res) => {
  // Base64 데이터 유효성 검사
  if (!base64Image) {
    return res.status(400).send({ msg: "이미지 데이터가 필요합니다." });
  }

  // Base64 데이터에서 파일 정보 추출
  const matches = base64Image.match(/^data:(.+);base64,(.+)$/);

  if (!matches || matches.length !== 3) {
    return res.status(400).send({ msg: "유효하지 않은 Base64 데이터입니다." });
  }

  const base64Data = matches[2]; // Base64 인코딩된 데이터
  const filePath = `public/images/thumbnail/${id}_${originalName}`;

  // Base64 데이터를 파일로 저장
  fs.writeFile(filePath, base64Data, { encoding: "base64" }, (err) => {
    if (err) {
      console.error("파일 저장 실패:", err);
      return res.status(500).send({ msg: "파일 저장 중 오류가 발생했습니다." });
    }

    // 파일 경로를 데이터베이스에 저장
    const sql = "UPDATE board SET thumb = ? WHERE idx = ?";
    query(sql, [filePath, id])
      .then((data) => {
        res.send({ msg: "이미지 업로드 성공", thumb: filePath });
      })
      .catch((err) => {
        console.error("데이터베이스 저장 실패:", err);
        res
          .status(500)
          .send({ msg: "데이터베이스 저장 중 오류가 발생했습니다." });
      });
  });
};