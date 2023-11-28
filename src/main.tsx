import ReactDOM from "react-dom/client";

import App from "./window";
import Header from "./components/Header";

import "./styles/index.scss";
import "./styles/app.scss";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <Header />
    <App />
  </>
);
