import React from "react";
import PropTypes from "prop-types";

const NavigationItem = ({ label, path, navigate }) => {
  return (
    <p onClick={() => {
      navigate(path)
      }} style={{ cursor: "pointer" }}>
      {label}
    </p>
  );
};

NavigationItem.propTypes = {
  label: PropTypes.string.isRequired, // 표시할 텍스트
  path: PropTypes.string.isRequired,  // 이동할 경로
  navigate: PropTypes.func.isRequired // 네비게이션 함수
};

export default NavigationItem;