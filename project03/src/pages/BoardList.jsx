import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";

import axios from "axios";

const BoardList = () => {
  const [borderList, setBorderList] = useState([]);

  const getBorderList = async () => {
    const resp = await (await axios.get('http://192.168.23.65:5000/border')).data;
    setBorderList(resp.data);
    console.log('border list', borderList);
    
  }

  useEffect(()=>{
    getBorderList()
  }, [])

  return (
    <>
     BoardList
    </>
  );
};

export default BoardList;