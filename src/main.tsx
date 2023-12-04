import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./redux/store";

import App from "./window";
import Header from "./components/Header";

import "./styles/index.scss";
import "./styles/app.scss";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <Header />
    <App />
  </Provider>
);
