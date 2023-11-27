import ReactDOM from "react-dom/client";
import App from "./window";

import "./styles/index.scss";
import Header from "./components/Header";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <Header />
    <App />
  </>
);
