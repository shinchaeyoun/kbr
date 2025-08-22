import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
//styled
import S from "../styled/GlobalBlock.jsx";
import P from "../styled/ProgressStyled.jsx";
// components
import PercentBar from "../components/PercentBar.jsx";
// utils
import { changeCateName } from "@/utils/changeCateName";

const fetchProgressCate = async (projectCode) => {
  const res = await axios.get("http://192.168.23.2:5001/project/category", {
    params: { code: projectCode },
  });
  return res.data.progress
    .split(",")
    .map((c) => c.trim())
    .filter((c) => c);
};

const fetchChasiTotal = async ({ projectCode, subjectId }) => {
  const res = await axios.get("http://192.168.23.2:5001/subject/chasiTotal", {
    params: { progress: projectCode, subjectId },
  });
  return res.data.chasiTotal;
};

const fetchProgressValues = async ({
  progressCate,
  subjectId,
  projectCode,
}) => {
  const res = await axios.get("http://192.168.23.2:5001/subject/setData", {
    params: { progressItem: progressCate, subjectId, projectCode },
  });
  return res.data;
};

const ProgressPage = () => {
  const API_SUB = "http://192.168.23.2:5001/subject";
  const location = useLocation();
  const projectCode = location.pathname.split("/")[1] || 0; // 과정 코드
  const subjectId = location.pathname.split("/")[2] || 0; // 과목 ID

  const optionArr = ["진행전", "진행중", "수정중", "1차 완료", "완료"];
  const optionCss = ["before", "ing", "edit", "firstDone", "done"];
  const [changeData, setChangeData] = useState({});

  // react-query
  const { data: progressCate = [], isLoading: cateLoading } = useQuery({
    queryKey: ["progressCate", projectCode],
    queryFn: () => fetchProgressCate(projectCode),
    enabled: !!projectCode,
  });

  const { data: chasiTotal = 0, isLoading: chasiLoading } = useQuery({
    queryKey: ["chasiTotal", projectCode, subjectId],
    queryFn: () => fetchChasiTotal({ projectCode, subjectId }),
    enabled: !!projectCode && !!subjectId,
  });

  const { data: progressValues = {}, isLoading: valuesLoading } = useQuery({
    queryKey: ["progressValues", progressCate, subjectId, projectCode],
    queryFn: () =>
      fetchProgressValues({ progressCate, subjectId, projectCode }),
    enabled: progressCate.length > 0 && !!subjectId && !!projectCode,
  });

  console.log("progressValues", progressValues);

  // 진행 항목 한글명 매핑
  const progressItem = progressCate.map((cate) => {
    return changeCateName(cate);
  });

  // 저장 mutation
  const queryClient = useQueryClient();
  const saveMutation = useMutation({
    mutationFn: ({ progressValues, projectCode, subjectId }) =>
      axios.patch(`${API_SUB}/saveProgress`, {
        progressValues,
        projectCode,
        subjectId,
      }),
    onSuccess: () => {
      alert("진행률이 저장되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["progressValues"] });
    },
  });

  // 저장 버튼 클릭 시
  const handleSave = () => {
    saveMutation.mutate({ progressValues, projectCode, subjectId });
  };

  // 셀렉트 박스 스타일 및 값 변경
  const changeProgress = (e, item, index) => {
    const checked = e.target.value;
    const optionIndex = optionArr.indexOf(checked);
    const className = optionCss[optionIndex] || "";
    const currentClasses = e.target.className
      .split(" ")
      .filter((cls) => !optionCss.includes(cls))
      .join(" ");
    e.target.className = `${currentClasses} ${className}`.trim();
    // react-query 데이터는 불변이므로 별도 상태관리 필요시 mutation 등 활용
    // 진행 상태 변경 시 changeData에 반영
    setChangeData((prev) => ({
      ...prev,
      [`${item}_${index}`]: e.target.value,
    }));
  };

  if (cateLoading || chasiLoading || valuesLoading) return <div>로딩중...</div>;

  return (
    <>
      <div>
        <P.Title>과목1101 진행률</P.Title>
        <PercentBar changeData={changeData} setChangeData={setChangeData} />

        <P.CheckContainer>
          <P.Button onClick={handleSave}>저장하기</P.Button>

          <P.TitleWrap $repeat={progressCate.length + 1}>
            <div>차시</div>
            {progressItem.map((item, index) => (
              <div key={index}>{item}</div>
            ))}
          </P.TitleWrap>

          <P.InnerContainer>
            {Array.from({ length: chasiTotal }, (_, i) => (
              <P.Line
                key={i}
                className="selectLine"
                $repeat={progressCate.length + 1}
              >
                <div>{String(i + 1).padStart(2, "0")}</div>
                {progressCate.map((item, index) => (
                  <S.Select
                    id={item}
                    key={index}
                    onChange={(e) => changeProgress(e, item, i)}
                    className={optionCss[0]}
                  >
                    {optionArr.map((option, idx) => (
                      <option
                        key={idx}
                        value={option}
                        className={`${optionCss[idx]}`}
                      >
                        {option}
                      </option>
                    ))}
                  </S.Select>
                ))}
              </P.Line>
            ))}
          </P.InnerContainer>
        </P.CheckContainer>
      </div>
    </>
  );
};

export default ProgressPage;
