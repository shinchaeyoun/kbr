import { useEffect, useState } from "react";
import { useNavigate, Outlet, useParams, useLocation } from "react-router-dom";
import axios from "axios";

import ProjectMain from "./ProjectMain.jsx";
import NavigationItem from "../components/NavigationItem.jsx";

import P from "../styled/ProjectStyled.jsx";

const ProjectPage = () => {
  // const API_URL = "http://192.168.23.2:5001/project"; // API URL 상수화
  const API_URL = "http://192.168.23.2:5001"; // API URL 상수화
  const navigate = useNavigate();
  const location = useLocation();
  const { code } = useParams();
  const [subjectShow, setSubjectShow] = useState(null);
  const id = subjectShow + 1;
  const [project, setProject] = useState({
    idx: code,
    title: "",
    progress: "",
  });
  const [data, setData] = useState({});

  const { idx, title, progress } = project;

  const [subjectCategories, setSubjectCategories] = useState([]);
  // const subjectCategories = ["원고", "스토리보드", "영상"];
  const [subjectArr, setSubjectArr] = useState([]);

  const fetchProjectData = async () => {
    // console.log('project ==> ',project);

    const params = { code }; // 파라미터 상수화

    try {
      const projectData = await axios.get(`${API_URL}/project`, { params });
      const subjectData = await axios.get(`${API_URL}/subject/setMainList`, {
        params,
      });

      // console.log('projectData ==> ',projectData);
      const { idx, title, progress } = projectData.data;

      setSubjectArr(subjectData.data.map((x) => x.name));
      setData(projectData.data);
      setProject({ idx, title, progress });
      setSubjectCategories(
        (projectData.data.category || "")
          .split(",")
          .map((c) => c.trim())
          .filter((c) => c)
      );
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

  useEffect(() => {
    // console.log("subjectShow", subjectShow,'id',id);
  }, [subjectShow]);

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
            label="일정표"
            path={`/${code}/schedule`}
            navigate={navigate}
          />
        </li>
        <li>
          <p style={{ cursor: "default" }}>과목리스트</p>
          <P.SubTabs>
            {subjectArr.map((subject, index) => {
              return (
                <li key={index}>
                  <div>
                    <NavigationItem
                      label={subject}
                      path={`${index + 1}`}
                      navigate={navigate}
                      onClick={() => {
                        setSubjectShow((prev) =>
                          prev === index ? null : index
                        );
                      }}
                    />
                  </div>

                  {subjectShow === index && (
                    <ul>
                      <NavigationItem
                        label="진행률"
                        path={`${id}/progress`}
                        // navigate={navigate}
                        navigate={(path) =>
                          navigate(path, { state: { progress, id, code } })
                        }
                        as="li"
                      />

                      {subjectCategories.map((category, cidx) => {
                        return (
                          <NavigationItem
                            key={cidx}
                            label={category}
                            path={`${index + 1}/board`}
                            navigate={(path) =>
                              navigate(path, { state: { category } })
                            }
                            as="li"
                            category={category}
                          />
                        );
                      })}

                      {/* <NavigationItem
                        label="기타 게시판"
                        path={`${id}/board`}
                        navigate={navigate}
                        as="li"
                      /> */}
                    </ul>
                  )}
                </li>
              );
            })}
          </P.SubTabs>
        </li>
      </P.Tabs>

      <section>
        {location.pathname === `/${code}` ? (
          <ProjectMain code={code} fetchProjectData={fetchProjectData} />
        ) : (
          <Outlet />
        )}
      </section>
    </P.Wrap>
  );
};

export default ProjectPage;
