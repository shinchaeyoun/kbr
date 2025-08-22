import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import S from "../styled/GlobalBlock.jsx";
import M from "../styled/MainStyled.jsx";
import axios from "axios";


const SearchPage = () => {
  const API_URL = "http://192.168.23.2:5100/item";
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTrim = searchParams.get("search") ? searchParams.get("search").trim() : "";
  const [items, setItems] = useState({});
  const [category, setCategory] = useState([]);
  const [hasMoreObj, setHasMoreObj] = useState({});
  const [limits, setLimits] = useState({});

  const fetchData = async () => {
    const response = await axios.get(`${API_URL}/search`, { params: { searchTrim, limits } });
    const { data, totalCounts } = response.data;

    if (Object.values(response.data.totalCounts).every(count => count === 0)){
      navigate("/search/empty");
      return;
    }
    
    let currentLimits = limits;
    
    if (Object.keys(limits).length === 0) {
      const initialLimits = {};
      Object.keys(data).forEach((key) => {
        initialLimits[key] = 3;
      });
      setLimits(initialLimits);
      currentLimits = initialLimits;
    }
    setItems(data);
    setCategory(Object.keys(data));
    setHasMoreObj(
      Object.entries(totalCounts).reduce((acc, [key, totalCount]) => {
        const currentLimit = currentLimits[key] || 3;
        acc[key] = totalCount > currentLimit; // 전체 개수와 현재 limit 비교
        return acc;
      }, {})
    );
  };

  const moreList = (index) => {
    const cate = category[index];
    setLimits((prevLimits) => {
      const newLimits = { ...prevLimits };
      newLimits[cate] = (newLimits[cate] || 3) + 3;
      return newLimits;
    });
  };

  const moveToDetail = (cate, item) => {
    if(cate == "제안 샘플") {
      navigate(`/sample/detail?no=${item.index}`)
    } else {
      navigate(`/detail?no=${item.index}`)
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchParams, limits]);

  return (
    <M.SearchPageWrapper>
      {category.map((cate, index) => {
        return (
          items[cate].length > 0 && (
            <M.SearchCategoryWrapper key={index}>
              <div>{cate}</div>
              {items[cate].map((item, idx) => {
                const itemTag = item.tag ? item.tag.split(",") : [];
                return (
                  <M.SearchPageItem className="item" key={idx} onClick={() => moveToDetail(cate, item)}>
                    <M.SearchBlock>
                      <div className="top_block">
                        <div className="title">{item.title}</div>
                        <div className="description">{item.description}</div>
                      </div>

                      <div className="bottom_block">
                        <div className="tag">
                          {itemTag.map((tag, idx) => (
                            <M.Tag key={idx}>{tag}</M.Tag>
                          ))}
                        </div>
                      </div>
                    </M.SearchBlock>
                    {item.thumb && <M.SearchThumbnail $bg={item.thumb}></M.SearchThumbnail>}
                  </M.SearchPageItem>
                );
              })}

              <S.CenterBox>{hasMoreObj[cate] && <S.Button onClick={() => moreList(index)}>더보기</S.Button>}</S.CenterBox>
            </M.SearchCategoryWrapper>
          )
        );
      })}
    </M.SearchPageWrapper>
  );
};

export default SearchPage;
