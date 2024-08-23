import styled from "styled-components";

type StyledHyphaWindowProps = {
  $loaded: boolean;
};

const StyledHyphaWindow = styled.div<StyledHyphaWindowProps>`
  iframe {
    opacity: ${({ $loaded }) => ($loaded ? "100%" : "0%")};
    transition: opacity 0.25s ease-in;
  }

  .loading {
    &::before {
      color: #fff;
      font-weight: 500;
      mix-blend-mode: normal;
      text-shadow: 1px 2px 3px rgba(0, 0, 0, 50%);
    }
  }
`;

export default StyledHyphaWindow;
