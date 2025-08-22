import axios from "axios";
import { useEffect, useState } from "react";
import Login from "./Login.jsx";
// import RegisteredCourses from "../components/AdminSummary/RegisteredCourses";

import CardItem from "../components/CardItem.jsx"; // 카드 아이템 컴포넌트 임포트
import M from "../styled/MainStyled.jsx"; // 스타일 컴포넌트 임포트

const Main = (props) => {
  // Vite에서는 import.meta.env를 사용
  const API_URL = import.meta.env.VITE_API_URL || "http://192.168.23.2:5100";
  const isLogin = props.isLogin;

  const [item, setItem] = useState([]);
  const [openPopoverIdx, setOpenPopoverIdx] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);


  // console.log("현재 API URL:", API_URL); // 디버깅용

  const onLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("level");
    document.location.href = "/main";
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${API_URL}/item`);
      setItem(response.data);
    } catch (error) {
      console.error("데이터를 가져오는 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log("Modal 상태 변경:", isModalOpen);
    
    if (!isModalOpen) {
      fetchData();
    }
  }, [isModalOpen]);

  useEffect(() => {
    const handleClick = (e) => {
      setOpenPopoverIdx(null);
    };
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <M.MainWrapper>
      <nav>
        <ul>
          <li>샘플 개발물</li>
          <li>포팅 가이드</li>
          {/* 맵으로 반복문 */}
        </ul>
      </nav>

      <main>
        <div className="title">All</div>
        <M.ItemWrapper>
          {item.map((itemData, index) => (
            <CardItem
              key={index}
              data={itemData}
              dataIdx={index + 1}
              openPopoverIdx={openPopoverIdx}
              setOpenPopoverIdx={setOpenPopoverIdx}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
            />
          ))}
        </M.ItemWrapper>
      </main>
    </M.MainWrapper>
  );
};

export default Main;
