import React, { useState } from "react";
import axios from "axios";

const Signup = ({setShowSignup}) => {
  const [data, setData] = useState({ id: "", password: "" });
  const [idCheck, setIdCheck] = useState(false);
  const { id, password } = data;

  const checkUserId = async () => {
    if (data.id.length == 0) {
      alert("ID를 입력하세요.");
      return;
    }
    await axios
      .get(`http://192.168.23.65:5000/auth/signup?id=${data.id}`)
      .then((res) => {
        if (res.data.result === 0) {
          setIdCheck(true);
        }
        alert(res.data.msg);
      });
  };
  
  const onChange = (e) => {
    const nextData = {
      ...data,
      [e.target.name]: e.target.value,
    };
    setData(nextData);
  };

  const onSubmit = async () => {
    if (!idCheck) {
      alert("아이디 중복 체크를 진행하세요.");
      return;
    }
    if (!data.id || !data.password) {
      alert("모든 입력값을 입력해주세요.");
      return;
    }
    await axios.post("http://192.168.23.65:5000/auth/signup", data).then(() => {
      alert("회원가입 완료");
      setShowSignup(false);
    });
  };

  return (
    <>
      <h1>회원가입</h1>
      <label> ID 입력 :</label>
      <br />
      <input type="text" name="id" value={id} onChange={onChange} />
      <button onClick={checkUserId}>아이디 중복 확인</button>
      <br />
      <br />
      <label> password 입력 :</label>
      <br />
      <input
        type="password"
        name="password"
        value={password}
        onChange={onChange}
      />
      <br />
      <br />
      <button onClick={onSubmit}> 회원가입 </button>
      <button onClick={()=>{setShowSignup(false)}}> 이전 </button>
    </>
  );
};

export default Signup;
