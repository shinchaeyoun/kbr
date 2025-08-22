import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #888;
  font-size: 1.5rem;
  border-radius: 12px;
`;

const SearchEmptyPage = () => {
  return (
    <Container>
      검색결과없음
    </Container>
  );
};

export default SearchEmptyPage;