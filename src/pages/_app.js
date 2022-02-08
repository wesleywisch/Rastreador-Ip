import { ToastContainer } from 'react-toastify';
import { GlobalStyle } from '../styles/GlobalStyles';

import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <ToastContainer />
      <GlobalStyle />
    </>
  )
}

export default MyApp
