import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
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
      const response = await fetch("http://192.168.23.65:5000/signup", {
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
      <h1>signup</h1>
      <label> ID 입력 :</label>
      <br />
      <input type="text" name="id" value={id} onChange={onChange}/>
      <br />
      <br />
      <label> password 입력 :</label>
      <br />
      <input type="password" name="password" value={password} onChange={onChange}/>
      <br />
      <br />
      <button onClick={onSubmit}> signup </button>
    </>
  );
};

export default Signup;
