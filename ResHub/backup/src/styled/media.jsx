import { css } from "styled-components";

const sizes = {
  mbl: 480,
  tab: 768,
  desk: 1020,
  deskL: 1280,
};

const media = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media screen and (max-width: ${sizes[label]}px) {
      ${css(...args)};
    }
  `;
  return acc;
}, {});

export default media;
