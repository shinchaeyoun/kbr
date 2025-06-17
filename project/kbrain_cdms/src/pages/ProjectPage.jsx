import React, { use, useEffect, useState } from "react";
import {
  Routes,
  Route,
  Link,
  useNavigate,
  Outlet,
  useParams,
  useLocation,
} from "react-router-dom";
import axios from "axios";

import ProjectMain from "./ProjectMain.jsx";
import NavigationItem from "../components/NavigationItem.jsx";

import S from "../styled/GlobalBlock";
import P from "../styled/ProjectStyled.jsx";

const ProjectPage = () => {
  const API_URL = "http://192.168.23.2:5001/project"; // API URL 상수화
  const navigate = useNavigate();
  const location = useLocation();
  const { code } = useParams();
  const [projectName, setProjectName] = useState(null);
  const [subjectShow, setSubjectShow] = useState(false);

  const [project, setProject] = useState({
    idx: code,
    title: "",
  });

  const { idx, title } = project;

  const fetchProjectData = async () => {
    const params = { code }; // 파라미터 상수화

    try {
      const response = await axios.get(API_URL, { params });
      const { idx, title } = response.data;
      setProject({ idx, title });
    } catch (error) {
      console.error("프로젝트 데이터를 가져오는 중 오류 발생:", error);
      alert(
        "프로젝트 데이터를 불러오는 중 문제가 발생했습니다. 다시 시도해주세요."
      );
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, []);

  return (
    <P.Wrap className="flex project-page ">
      <P.Tabs>
        <P.ProjectTitle onClick={() => navigate(`/${code}`)}>
          {title}
        </P.ProjectTitle>

        <li>
          <NavigationItem
            label="공통게시판"
            path={`/${code}/board`}
            navigate={navigate}
          />
        </li>
        <li>
          <NavigationItem
            label="진행률"
            path={`/${code}/progress`}
            navigate={navigate}
          />
        </li>
        <li>
          <p>과정리스트</p>
          <P.SubTabs>
            <li>
              <NavigationItem
                label="과정명1101"
                navigate={navigate}
                onClick={() => {
                  setSubjectShow(!subjectShow);
                }}
              />

              {/* <p onClick={()=>{setSubjectShow(!subjectShow)}}> 과정명1101</p> */}
              {subjectShow && (
                <ul>
                  <li>과정</li>
                  <li>원고</li>
                  <li>스토리보드</li>
                  <li>영상</li>
                  <li>과정 진행률</li>
                </ul>
              )}
            </li>
            <li>
              <p>과정명1102</p>
            </li>
            <li>
              <p>과정명1103</p>
            </li>
          </P.SubTabs>
        </li>
      </P.Tabs>

      <section>
        {location.pathname === `/${code}` ? (
          <ProjectMain code={code} />
        ) : (
          <Outlet />
        )}
      </section>
    </P.Wrap>
  );
};

export default ProjectPage;
