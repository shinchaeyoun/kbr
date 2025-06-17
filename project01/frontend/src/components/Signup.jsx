import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const navigate = useNavigate();

    const submitBtn = async () => {
        if (id === '' || pw === '') {
            alert("아이디 또는 비밀번호를 입력해주시기 바랍니다");
            return;
        } else {
            try {
                const res = await fetch('/api/signup', {
                    method: 'POST',
                    body: JSON.stringify({userID: id, userPW: pw}),
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                });
                const data = await res.json();

                alert(data);
                if (res.status === 200) {
                    navigate('/');
                } else {
                    setId('');
                    setPw('');
                    return;
                }
            } catch(err) {
                console.log(err);
            }
        }
    }

    return (
        <div>
            {/* <h1>회원가입</h1> */}
            <div>
                <input type="text" value={id} onChange={(e) => setId(e.target.value)}/>
                <input type="password" value={pw} onChange={(e) => setPw(e.target.value)}/>
                <button type='submit' onClick={submitBtn}>가입</button>
            </div>
        </div>
    );
};

export default Signup;