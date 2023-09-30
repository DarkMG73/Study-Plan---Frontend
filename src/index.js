import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import "@fontsource/kodchasan"; // Defaults to weight 400.
import "@fontsource/covered-by-your-grace"; // Defaults to weight 400
import "@fontsource/covered-by-your-grace/400.css"; // Specify weight
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./store/store";
import axios from "axios";
import { ErrorBoundary } from "./HOC/ErrorHandling/ErrorBoundary/ErrorBoundary";
import "./assets/fonts/good_times/good_times_rg.ttf";

////////////////////////
///    Axios Config
///////////////////////
const inDevelopment = process.env.NODE_ENV === "development";
axios.defaults.baseURL = "https://api.ignite-revolution.com/";

console.log(
  "%cAxios Default Base URL:",
  "color:#fff;background:#287094;padding:5px;border-radius:0 25px 25px 0",
  axios.defaults.baseURL
);

if (inDevelopment) {
  // axios.defaults.baseURL = "https://api.ignite-revolution.com/";
  axios.defaults.baseURL = "http://localhost:8000";
  console.log(
    "%cRunning in DEV MODE with the base URL:",
    "color:#fff;background:#287094;padding:5px;border-radius:0 25px 25px 0",
    axios.defaults.baseURL
  );
  console.log(
    "%cprocess.env.NODE_ENV:",
    "color:#287094;background:#f0f0ef;padding:5px;border-radius:0 25px 25px 0",
    process.env.NODE_ENV
  );
  console.log(
    "%cinDevelopment:",
    "color:#287094;background:#f0f0ef;padding:5px;border-radius:0 25px 25px 0",
    inDevelopment
  );
}

axios.defaults.headers.common["Authorization"] = "AUTH TOKEN";
axios.defaults.headers.post["Content-Type"] = "application/json";

axios.interceptors.request.use(
  (request) => {
    // alert("In REQ");
    if (inDevelopment)
      console.log(
        "%cRequest:",
        "color:#94283a;background:#f0f0ef;padding:5px;border-radius:0 25px 25px 0",
        request
      );
    // Edit request config
    return request;
  },
  (error) => {
    // alert("In REQ Error");
    if (inDevelopment)
      console.log(
        "%cERROR:",
        "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
        error
      );
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    // alert("In Res");
    if (inDevelopment)
      console.log(
        "%cResponse:",
        "color:#f0f0ef;background:#94283a;padding:5px;border-radius:0 25px 25px 0",
        response
      );

    return response;
  },

  (error) => {
    if (inDevelopment)
      console.log(
        "%cERROR:",
        "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
        error
      );
    return Promise.reject(error);
  }
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Router basename={process.env.PUBLIC_URL}>
    <React.StrictMode>
      <Provider store={store}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </Provider>
    </React.StrictMode>
  </Router>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
