import AppContextProvider from "../components/context-providers/AppContextProvider";
import Header from "../components/Header";
import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.css";

function MyApp({ Component, pageProps }) {
  return (
    <AppContextProvider>
      <Header />
      <Component {...pageProps} />
    </AppContextProvider>
  );
}

export default MyApp;
