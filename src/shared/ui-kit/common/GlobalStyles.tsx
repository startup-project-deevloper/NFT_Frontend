import reset from "styled-reset";
import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  ${reset}

  body, * {
    font-family: "Agrandir", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;
