import React from "react";
import PropTypes from "prop-types";

const NavigationItem = ({ label, path, navigate, onClick, as = "p", category }) => {
  const Tag = as;
  return (
    <Tag
      onClick={(e) => {
        if (onClick) onClick(e);
        if (navigate && path) navigate(path);
      }}
      style={{ cursor: "pointer" }}
      data-category={category}
    >
      {label}
    </Tag>
  );
};

NavigationItem.propTypes = {
  label: PropTypes.string.isRequired, // 표시할 텍스트
  path: PropTypes.string,  // 이동할 경로 (필수 아님)
  navigate: PropTypes.func, // 네비게이션 함수 (필수 아님)
  onClick: PropTypes.func, // 클릭 이벤트 (선택)
  as: PropTypes.string, // 추가
  category: PropTypes.string, // category prop 추가
};

export default NavigationItem;