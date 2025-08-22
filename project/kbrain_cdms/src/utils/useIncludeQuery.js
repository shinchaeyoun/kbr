import { useEffect } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";

export function useIncludeQuery({ query, redirectValue }) {
  console.log('redirectValue',redirectValue);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  // useEffect(() => {
  //   if (!searchParams.get(query)) {
  //     searchParams.set(query, redirectValue);
  //     // 현재 경로에 쿼리스트링을 추가하여 이동
  //     navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
  //   }
  // }, [searchParams, query, redirectValue, navigate, location]);

  if (!searchParams.get(query)) {
    searchParams.set(query, redirectValue);
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
  }

  
}

// export default useIncludeQuery;
