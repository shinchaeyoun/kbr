//MainStyled
import styled, { css } from "styled-components";
import S from "./GlobalBlock.jsx";

// 제안 샘플 페이지
const SampleTypeIcon = styled.div`
  padding: 3px 7px 3px 5px;
  color: #fff;
  font-size: 14px;
  border-radius: 5px;
  background-color: #5598ff;

  &.self {
    background-color: #5598ff;
  }
  &.use {
    background-color: #30a330;
  }
`;
const SampleChasiItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px;
  border-radius: 5px;

  &:hover {
    background-color: #f0f4f8;
    cursor: pointer;
  }
`;
const SampleCustomer = styled.div`
  grid-row: 1 / span ${({ $row }) => $row || 1};
  padding: 5px 0;

  &:hover {
    color: #3c5b7cff;
    font-weight: bold;
  }
`;
const SampleGroup = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 1fr;
  gap: 5px 10px;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #e4e6eb;

  cursor: pointer;
  .customer {
  }
  .list {
  }
`;
const SamplePageWrapper = styled.div``;
// 제안 샘플 페이지

const Thumbnail = styled.div`
  width: 100%;
  height: 180px;
  overflow: hidden;
  border-radius: 5px 5px 0 0;
  background-image: ${({ $bg }) => ($bg && $bg !== "null" ? `url(${$bg})` : "url(/images/thumbnail/default.png)")};
  background-size: cover;
  background-position: center;
`;

const Tag = styled.span`
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  padding: 5px 10px 5px 22px;
  position: relative;
  &::before {
    content: "#";
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 15px;
    height: 15px;
    color: rgb(75, 144, 201);
  }
`;
const MainWrapper = styled.div`
  display: grid;
  grid-template-columns: 256px 1fr;
  bacground-color: #edf2f6;

  nav {
    margin-top: 50px;
    // margin-right: 20px;
    // border-right: 1px solid #e4e6eb;

    div.on {
      color: #007bff;
      font-weight: bold;
    }

    li {
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 0;
      }

      ul {
        margin-top: 5px;
        padding-left: 15px;
        color: initial;
        font-weight: 500;

        li.on {
          color: #007bff;
          font-weight: bold;
        }
      }
    }
  }

  main {
    // border: 1px solid #ccc;

    section {
    }
  }
`;

const CardItemWrapper = styled(S.GridContainer)`
  justify-content: start;
  grid-template-columns: repeat(auto-fill, minmax(280px, 320px));
  gap: 20px;
`;
const ListItemWrapper = styled(S.GridContainer)`
  grid-template-columns: repeat(1, 1fr);
  gap: 5px;
`;

// 검색 페이지 스타일
const SearchCategoryWrapper = styled(S.Block)`
  border: none;
`;
const SearchPageWrapper = styled(S.GridContainer)`
  grid-template-columns: repeat(1, 1fr);
  gap: 5px;
`;
const SearchPageItem = styled(S.Group)`
  justify-content: space-between;
  align-items: flex-start;

  width: 100%;
  border-width: 1px;
  padding: 10px 15px;
  margin: 10px 3px;
  border: 2px solid #000;
  border-radius: 7px;
`;
const SearchBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  height: 100%;

  ${Tag} {
    font-size: 14px;
    padding: 3px 5px 3px 15px;
    &::before {
      left: 5px;
    }
  }

  .top_block {
    .title {
      font-size: 18px;
      font-weight: bold;
      margin-top: 10px;
      margin-bottom: 5px;
    }

    .description {
      font-size: 14px;
      color: #6f8ab3ff;
      margin-bottom: 10px;
    }
  }
  .bottom_block {
    padding-bottom: 10px;

    .tag {
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
    }
  }
`;

const SearchThumbnail = styled(Thumbnail)`
  height: 120px;
  width: 120px;
  border-radius: 5px;
`;
// 검색 페이지 스타일

// main 페이지 카드 스타일
const CardWrapper = styled(S.Block)`
  width: 320px;
  height: 410px;
  border-radius: 8px;

  padding: 0;
  margin: 0;
`;
const ListWrapper = styled(S.Block)`
  width: 100%;
  border-width: 2px;
  padding: 10px 15px;
  margin: 3px;
  border-radius: 5px;

  display: flex;
  justify-content: space-between;
`;
const Thumb = styled.img``;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 230px;
`;

const Block = styled(S.Block)`
  margin: 0;
  padding: 10px;
  height: 100%;
  border: none;

  .title {
    font-size: 18px;
    font-weight: bold;
    margin: 10px 0;
    // padding: 0 10px;

    p {
      font-size: 14px;
      font-weight: normal;
      color: rgb(172, 185, 201);
      margin-top: 5px;
    }
  }

  .description {
    color: #718096;
    // background-color: #f7fafc;

    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    // min-height: 66px; /* 3 lines x 22px line-height (adjust as needed) */
    // max-height: 66px; /* 3 lines x 22px line-height (adjust as needed) */
    line-height: 22px;

    height: auto;
  }

  ${(props) =>
    props.$type === "tag" &&
    css`
      display: flex;
      flex-wrap: wrap;
      gap: 5px;

      margin-bottom: 15px;
      height: auto;
    `}
`;

const Attachment = styled.div`
  position: relative;
  border: none;
`;

const AttachmentPop = styled.div`
  position: absolute;
  right: 10px;

  display: block;

  min-width: 200px;
  max-width: 400px;
  width: fit-content;

  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;

  font-family: initial;

  z-index: 1;
  cursor: default;
  box-sizing: border-box;
  word-break: break-all;
  overflow-wrap: anywhere;
  ul {
    margin: 0;
    padding: 0;
    li {
      align-items: center;
      display: flex;
      gap: 10px;

      margin: 10px;
      padding: 0px 10px;
      cursor: pointer;
      font-size: 16px;

      background-color: #fff;
      &:hover {
        color: #007bff;
      }

      svg {
        flex-shrink: 0;
      }

      p {
        text-align: left;
        white-space: normal;
        max-width: 560px;
        box-sizing: border-box;
        overflow-wrap: anywhere;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
`;

const ButtonWrap = styled.div`
  position: relative;

  margin: 0;
  padding: 10px;

  > ${Attachment}, > a {
    position: absolute;
    bottom: 10px;
    padding: 5px;
    border-radius: 5px;
  }
  > ${Attachment} {
    left: 10px;
    height: 30px;
  }
  > a {
    right: 10px;
    &:hover {
      background-color: #edf2f6;
    }
  }
`;

const WriteBtn = styled(S.Button)`
  width: 120px;
  height: 30px;

  border-color: #000;
  border-width: 2px;

  font-size: 16px;
  font-weight: bold;
`;

const RightBox = styled.div`
  display: flex;
  justify-content: flex-end;

  margin-bottom: 20px;
`;

const M = {
  SamplePageWrapper,
  SampleGroup,
  SampleCustomer,
  SampleChasiItem,
  SampleTypeIcon,
  MainWrapper,
  CardItemWrapper,
  ListItemWrapper,
  SearchCategoryWrapper,
  SearchPageWrapper,
  SearchPageItem,
  SearchBlock,
  SearchThumbnail,
  CardWrapper,
  ListWrapper,
  Thumb,
  Thumbnail,
  Content,
  Block,
  Tag,
  Attachment,
  AttachmentPop,
  ButtonWrap,
  WriteBtn,
  RightBox,
};

export default M;
