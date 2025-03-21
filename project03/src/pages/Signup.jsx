import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = ({setShowSignup}) => {
  const navigate = useNavigate();
  const [data, setData] = useState({ id: "", password: "" });
  const [idCheck, setIdCheck] = useState(false);

  const { id, password } = data;

  const checkUserId = async () => {
    if (data.id.length == 0) {
      alert("ID를 입력하세요.");
      return;
    }
    await axios
      .get(`http://192.168.23.65:5000/signup?id=${data.id}`)
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
    await axios.post("http://192.168.23.65:5000/signup", data).then(() => {
      alert("회원가입 완료");
      navigate("/login"); // 회원가입 후 로그인 페이지로 이동
    });

    // if (data.id.length < 1 || data.password.length < 1) return false;
    // if (!idCheck) {
    //   alert("아이디 중복 체크 필요");
    //   return false;
    // }

    // await axios.post(`http://192.168.23.65:5000/signup`, data).then((res) => {
    //   console.log(res);
    //   navigate("/");
    //   // window.location.reload();
    // });

    // await axios.post(`http://192.168.23.65:5000/signup`, data).then((res) => {
    //   console.log("??res.data.msg", res);
    //   // if (res.data.msg == undefined) {
    //   //   alert("등록되었습니다.");
    //   //   navigate("/board");
    //   // } else {
    //   //   alert("강조박스의 내용을 모두 작성해주세요.");
    //   //   console.log("??res.data.msg", res.data.msg);
    //   // }
    // });

    // try {
    //   const response = await fetch("http://192.168.23.65:5000/signup", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(data),
    //   });

    //   if (response.ok) {
    //     alert("회원가입 완료");
    //     setData({
    //       id: "",
    //       password: "",
    //     });
    //     navigate(0);

    //   } else {
    //     alert("데이터 전송에 실패했습니다.");
    //   }
    // } catch (error) {
    //   alert("라우터 접근에 문제가 있습니다.");
    // }
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
