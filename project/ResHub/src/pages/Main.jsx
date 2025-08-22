import axios from "axios";
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import S from "../styled/GlobalBlock.jsx";
import Login from "./Login.jsx";
// import RegisteredCourses from "../components/AdminSummary/RegisteredCourses";

import List from "./List.jsx";
import CardItem from "../components/CardItem.jsx"; // 카드 아이템 컴포넌트
import ListItem from "../components/ListItem.jsx"; // 리스트 아이템 컴포넌트
import M from "../styled/MainStyled.jsx"; // 스타일 컴포넌트

import NavigationItem from "../components/NavigationItem.jsx"; // 네비게이션 아이템 컴포넌트

const Main = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const API_URL = import.meta.env.VITE_API_URL || "http://192.168.23.2:5100";
  const isLogin = props.isLogin;

  const [item, setItem] = useState([]);
  const [openPopoverIdx, setOpenPopoverIdx] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [category, setCategory] = useState([]);
  const [nowCategory, setNowCategory] = useState("");

  const [yearShow, setYearShow] = useState(false);
  const [yearList, setYearList] = useState([]);

  // 카테고리 변경 시 데이터 재조회
  const handleCategoryChange = async (cate) => {
    try {
      setSearchParams({ category: cate });
      setNowCategory(cate);
      const response = await axios.get(`${API_URL}/item/${cate}`);
      setItem(response.data);
    } catch (error) {
      console.error("카테고리 데이터를 가져오는 중 오류 발생:", error);
    }
  };

  const fetchData = async (reset) => {
    // try {
    //   const res = await axios.get(`${API_URL}/info/cate`);
    //   const categoryValue = res.data[0].value.split(",").map((cate) => cate.trim());
    //   setCategory(categoryValue);

    //   const searchTerm = searchParams.get("search");
    //   const categoryTerm = searchParams.get("category") || categoryValue[0];
    //   const tag = searchParams.get("tag");

    //   if (searchTerm) {
    //     // 검색어로 조회
    //     const response = await axios.get(`${API_URL}/item/search/${encodeURIComponent(searchTerm)}`);
    //     setItem(response.data);
    //   } else if (tag) {
    //     // 태그로 조회
    //     const response = await axios.get(`${API_URL}/item/tag/${tag}`);
    //     setItem(response.data);
    //   } else {
    //     // 카테고리별 조회
    //     const response = await axios.get(`${API_URL}/item/${categoryTerm}`);
    //     setItem(response.data);
    //   }
    // } catch (error) {
    //   console.error("데이터를 가져오는 중 오류 발생:", error);
    // }
    try {
      const res = await axios.get(`${API_URL}/info/cate`);
      const categoryValue = res.data[0].value.split(",").map((cate) => cate.trim());
      setCategory(categoryValue);

      const searchTerm = searchParams.get("search");
      const categoryTerm = searchParams.get("category") || categoryValue[0];
      const tag = searchParams.get("tag");

      if (searchTerm) {
        // 검색어로 조회
        const response = await axios.get(`${API_URL}/item/search/${encodeURIComponent(searchTerm)}`);
        console.log("검색어로 조회:", response.data);
        setItem(response.data);
      } else if (tag) {
        // 태그로 조회
        const response = await axios.get(`${API_URL}/item/tag/${tag}`);
        setItem(response.data);
      } else {
        // 카테고리별 조회
        const response = await axios.get(`${API_URL}/item/${categoryTerm}`);
        setItem(response.data);
      }
    } catch (error) {
      console.error("데이터를 가져오는 중 오류 발생:", error);
    }
  };

  const fetchYearList = async () => {
    try {
      const response = await axios.get(`${API_URL}/item/year`);
      setYearList([...new Set(response.data.map((item) => item.year))].sort((a, b) => b - a));
    } catch (error) {
      console.error("연도 목록을 가져오는 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    // fetchData();
    fetchYearList();
  }, [location]);

  useEffect(() => {
    if (!isModalOpen) {
      fetchData();
    }
  }, [isModalOpen, searchParams.get("tag"), searchParams.get("search")]);

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
    <M.MainWrapper>
      <nav>
        <ul>
          {category.map((cate, index) => {
            const selectedCategory = searchParams.get("category");
            return (
              <div key={index} className={selectedCategory === cate || cate == category[2] && location.pathname.includes("sample") ? "on" : ""}>
                {cate == category[2]? (
                  <li key={index}>
                    <div
                      onClick={() => {
                        handleCategoryChange(cate);
                        navigate(`/sample?category=${cate}`);
                        // setYearShow((prev) => (prev === index ? null : index));
                        setYearShow(true);
                      }}
                    >
                      {cate}
                    </div>

                    {yearShow && (
                      <ul>
                        {yearList.map((yearItem, yearIndex) => (
                          <li
                            key={yearIndex}
                            onClick={() => {
                              // setSearchParams({ category: cate, year: yearItem });
                              navigate(`/sample?category=${cate}&year=${yearItem}`);
                            }}
                            className={searchParams.get("year") === yearItem ? "on" : ""}
                          >
                            {yearItem}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ) : (
                  <li
                    key={index}
                    onClick={() => {
                      handleCategoryChange(cate);
                      navigate(`/list?category=${cate}`);
                      setYearShow(false);
                    }}
                    // className={selectedCategory === cate ? "on" : ""}
                  >
                    {cate}
                  </li>
                )}
              </div>
            );
          })}
        </ul>
      </nav>

      <main>{location.pathname === "/" ? <List /> : <Outlet />}</main>
    </M.MainWrapper>
  );
};

export default Main;
