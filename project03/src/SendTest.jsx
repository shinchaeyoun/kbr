import React, { useState } from "react";

const SendTest = () => {
  const [data, setData] = useState({
    id: "",
    password: "",
  });

  const { id, password } = data;

  const onChange = (e) => {
    const nextData = {
      ...data,
      [e.target.name]: e.target.value,
    };
    setData(nextData);
  };

  const onSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("데이터가 성공적으로 전송되었습니다.");
        // 성공적으로 데이터를 보냈다면, 필요한 후속 조치를 여기에 추가할 수 있습니다.
        setData({
          id: "",
          password: ""
        });
      } else {
        alert("데이터 전송에 실패했습니다.");
      }
    } catch (error) {
      alert("라우터 접근에 문제가 있습니다.");
    }
  };

  return (
    <>
      <label> ID 입력 :</label>
      <br />
      <input type="text" name="id" onChange={onChange} value={id} />
      <br />
      <br />
      <label> password 입력 :</label>
      <br />
      <input
        type="password"
        name="password"
        onChange={onChange}
        value={password}
      />
      <button onClick={onSubmit}> 전송하기 </button>
    </>
  );
};

export default SendTest;
