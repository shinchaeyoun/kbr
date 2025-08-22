import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled, { css } from "styled-components";
import S from "../styled/GlobalBlock.jsx";
import axios from "axios";

import User from "../components/User.jsx";


const UserDetail_test = ({userIdx}) => {
  return (
    <>
     {userIdx}
     <User />
    </>
  );
};

export default UserDetail_test;