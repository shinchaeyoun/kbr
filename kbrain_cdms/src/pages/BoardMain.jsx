import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// Components
import BoardListForm from "../components/forms/BoardListForm.jsx";

// utils
import { changeCateName } from "@/utils/changeCateName";

const BoardMain = () => {
  const location = useLocation();
  const category = location.search.split("=")[1];
  const [categoryName, setCategoryName] = useState(category || ""); // 카테고리 이름 상태

  useEffect(() => {
    setCategoryName(changeCateName(category));
  }, [location]);

  return (
    <>
      {category && (
        <div>
          <h1>board {categoryName}</h1>
          <BoardListForm />
        </div>
      )}
    </>
  );
};

export default BoardMain;
