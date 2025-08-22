import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import M from "../styled/MainStyled.jsx";

const SamplePage = () => {
  const API_URL = "http://192.168.23.2:5100/item";
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [SampleGroup, setSampleGroup] = useState([]);

  const fetchItems = async () => {
    const category = searchParams.get("category");
    const year = searchParams.get("year");

    const customerRes = await axios.get(`${API_URL}/sample`, {
      params: { category, year },
    });
    const chasiRes = await axios.get(`${API_URL}/sample`, {
      params: { category, year, depth: 2 },
    });

    // console.log("Customer Data:", customerRes.data);
    
    const uniqueCustomer = Array.isArray(customerRes.data)
      ? customerRes.data.filter((item, index, self) => index === self.findIndex((t) => JSON.stringify(t) === JSON.stringify(item)))
      : [];

    const grouped = uniqueCustomer.map((customerItem) => ({
      index: customerItem.index,
      customer: customerItem.title,
      list: chasiRes.data
        .filter((item) => item.customer === customerItem.title)
        .sort((a, b) => a.index - b.index)
        .map((item) => ({
          type: item.type || "자체",
          title: item.title,
          outerUrl: item.outerUrl,
          width: item.width,
          height: item.height,
        })),
    }));

    if (grouped.length > 0) {
      setSampleGroup(grouped);
    }
  };

  const openPopup = (e, item) => {
    e.stopPropagation();
    const __item = item;
    if (__item.outerUrl == "") {
      alert("링크가 없습니다.");
      return;
    }
    window.open(__item.outerUrl, "_blank", `width=${__item.width || 1280},height=${__item.height || 760}`);
  };

  useEffect(() => {
    fetchItems();
  }, [searchParams.get("year")]);

  return (
    <M.SamplePageWrapper>
      <M.RightBox>
        <M.WriteBtn
          onClick={() => {
            const selectedCategory = searchParams.get("category");
            navigate(`write?category=${encodeURIComponent(selectedCategory)}`);
          }}
        >
          등록
        </M.WriteBtn>
      </M.RightBox>

      {SampleGroup.map((group, index) => (
        <M.SampleGroup
          key={index}
          onClick={() => {
            navigate(`detail?no=${group.index}`);
          }}
        >
          <M.SampleCustomer className="customer" $row={group.list.length} title="클릭하여 상세보기">
            {group.customer}
          </M.SampleCustomer>
          {group.list.map((item, itemIndex) => (
            <M.SampleChasiItem key={itemIndex} onClick={(e) => openPopup(e, item)} title={item.title}>
              <M.SampleTypeIcon className={item.type}>{item.type == "self" ? "자체" : "활용"}</M.SampleTypeIcon>
              <div className="title">{item.title}</div>
            </M.SampleChasiItem>
          ))}
        </M.SampleGroup>
      ))}
    </M.SamplePageWrapper>
  );
};

export default SamplePage;
