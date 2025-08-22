import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import styled, { css } from "styled-components";
import S from "../styled/GlobalBlock.jsx";

import CardItem from "../components/CardItem.jsx"; // 카드 아이템 컴포넌트
import ListItem from "../components/ListItem.jsx"; // 리스트 아이템 컴포넌트
import M from "../styled/MainStyled.jsx"; // 스타일 컴포넌트

const List = (props) => {
  const navigate = useNavigate();
  // const { category: categoryParam } = useParams(); // URL 파라미터에서 category 가져오기
  const [searchParams, setSearchParams] = useSearchParams();
  const API_URL = import.meta.env.VITE_API_URL || "http://192.168.23.2:5100";
  const isLogin = props.isLogin;

  const [item, setItem] = useState([]);
  const [openPopoverIdx, setOpenPopoverIdx] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [category, setCategory] = useState([]);

  const fetchData = async (reset) => {
    try {
      const res = await axios.get(`${API_URL}/info/cate`);
      const categoryValue = res.data[0].value.split(",").map((cate) => cate.trim());
      setCategory(categoryValue);

      const searchTerm = searchParams.get("search");
      const tag = searchParams.get("tag");

      // URL 파라미터에서 가져온 카테고리 사용 (URL 디코딩)
      const categoryTerm = searchParams.get("category") ? searchParams.get("category") : categoryValue[0];

      if (searchTerm) {
        // 검색어로 조회
        console.log("검색어로 조회:", searchTerm);
        const response = await axios.get(`${API_URL}/item/search/${encodeURIComponent(searchTerm)}`);
        setItem(response.data);
      } else if (tag) {
        // 태그로 조회
        console.log("태그로 조회:", tag);
        const response = await axios.get(`${API_URL}/item/tag/${tag}`);
        setItem(response.data);
      } else {
        // 카테고리별 조회
        console.log("카테고리별 조회:", categoryTerm);
        const response = await axios.get(`${API_URL}/item/${encodeURIComponent(categoryTerm)}`);
        setItem(response.data);
      }
    } catch (error) {
      console.error("데이터를 가져오는 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [searchParams.get("category")]);

  // 팝오버 닫기
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
    <div>
      <M.RightBox>
        <M.WriteBtn
          onClick={() => {
            const selectedCategory = searchParams.get("category");
            selectedCategory ? navigate(`/write?category=${encodeURIComponent(selectedCategory)}`) : navigate("/write");
          }}
        >
          등록
        </M.WriteBtn>
      </M.RightBox>

      {searchParams.get("category") === category[1] ? (
        <M.ListItemWrapper>
          {item.map((itemData, index) => {
            const isPopover = openPopoverIdx === itemData.index;
            console.log("is popover", isPopover);

            return <ListItem key={index} data={itemData} openPopoverIdx={isPopover} setOpenPopoverIdx={setOpenPopoverIdx} />;
          })}
        </M.ListItemWrapper>
      ) : (
        <M.CardItemWrapper>
          {item.map((itemData, index) => {
            const isPopover = openPopoverIdx === itemData.index;
            console.log("is popover", isPopover);

            return <CardItem key={index} data={itemData} openPopoverIdx={isPopover} setOpenPopoverIdx={setOpenPopoverIdx} />;
          })}
        </M.CardItemWrapper>
      )}
    </div>
  );
};

export default List;
