import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Rubik', sans-serif;

    :root{
      --gray900: hsl(0, 0%, 17%);
      --gray700: hsl(0, 0%, 59%);
    }
  }
`;