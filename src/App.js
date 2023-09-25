import "./App.css";
import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect, Fragment } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Manage from "./pages/Manage/Manage";
import CardTransparent from "./UI/Cards/CardTransparent/CardTransparent";
import Header from "./Components/Header/Header";
import { authActions } from "./store/authSlice";
import BarLoader from "./UI/Loaders/BarLoader/BarLoader";
import { ErrorBoundary } from "./HOC/ErrorHandling/ErrorBoundary/ErrorBoundary";
import LocalErrorDisplay from "./HOC/ErrorHandling/LocalErrorDisplay/LocalErrorDisplay";
import { useUserDataInit } from "./Hooks/useUserDataInit";
import { useRunGatherCatalogData } from "./Hooks/useRunGatherCatalogData";
import { useRunGatherContentData } from "./Hooks/useRunGatherContentData";
import axios from "axios";
import { loadingRequestsActions } from "./store/loadingRequestsSlice";
import { statusUpdateActions } from "./store/statusUpdateSlice";
import * as icons from "react-icons/fa";

function App() {
  const fallbackArtistSocialLInks = [
    {
      name: "Spotify",
      profileLink: "https://open.spotify.com/user/313ndmlrf7icszoy3cat7wikxwqi",
      faIcon: "FaSpotify",
    },
    {
      name: "SoundCloud",
      profileLink: "https://soundcloud.com/ignite-revolution-music",
      faIcon: "FaSoundcloud",
    },
  ];
  const loadingStatus = useSelector(
    (state) => state.loadingRequests.pendingLoadRequests
  );
  const dispatch = useDispatch();
  // const catalogData = GatherCatalogData();
  const catalog = useSelector((state) => state.catalogData);
  const contentData = useSelector((state) => state.contentData);
  if (
    (!process.env.NODE_ENV || process.env.NODE_ENV === "development") &&
    catalog.hasOwnProperty("catalog") &&
    catalog.catalog
  ) {
    console.log(
      "%cCatalog Data:",
      "color:#fff;background:#be6502;padding:5px;border-radius:0 25px 25px 0",
      catalog
    );
    console.log(
      "%cContent Data:",
      "color:#fff;background:#007215;padding:5px;border-radius:0 25px 25px 0",
      contentData
    );
  }
  const [user, setUser] = useState();
  const { userLoggedIn = user } = useSelector((state) => state.auth);
  const [localError, setLocalError] = useState({
    title: null,
    active: false,
    message: null,
  });
  const userDataInit = useUserDataInit();
  const [noDBErrors, setNoDBErrors] = useState({
    status: true,
    message: "All is well.",
  });
  let aboutIsActive = false;

  if (contentData.content) {
    aboutIsActive = Object.values(contentData.content).filter((value) => {
      if (value.type.replace(" ", "") !== "about") return false;
      const activeValue = value.hasOwnProperty("active")
        ? value.active.replace(" ", "")
        : null;
      return activeValue && activeValue !== "false";
    });
    aboutIsActive = aboutIsActive.length > 0;
  }

  ////////////////////////////////////////
  /// Network Communication
  ////////////////////////////////////////
  axios.interceptors.request.use(
    (request) => {
      dispatch(loadingRequestsActions.addToLoadRequest());
      return request;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      const serverRateLimitRemaining = response.headers["ratelimit-remaining"];
      if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        console.log(
          "%cRate Limit Remaining: ",
          "color:#fff;background:#ccd62d;padding:5px;border-radius:0 25px 25px 0",
          serverRateLimitRemaining
        );
      }
      dispatch(loadingRequestsActions.removeFromLoadRequest());
      dispatch(
        statusUpdateActions.updateStatus({
          status: response.status,
          statusText: response.statusText,
          rateLimitRemaining: serverRateLimitRemaining,
        })
      );
      setTimeout(() => {
        dispatch(authActions.resetRecentLogout());
        dispatch(authActions.resetRecentLogin());
      }, 3000);

      return response;
    },
    (error) => {
      console.log(
        "%cERROR:",
        "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
        error
      );
      dispatch(
        statusUpdateActions.updateStatus({
          status:
            error.hasOwnProperty("response") && error.response.status
              ? error.response.status
              : 500,
          statusText:
            error.hasOwnProperty("response") && error.response.statusText
              ? error.response.statusText
              : error.message,
        })
      );
      return Promise.reject(error);
    }
  );

  ////////////////////////////////////////
  /// FUNCTIONALITY
  ////////////////////////////////////////
  const runGatherCatalogData = useRunGatherCatalogData();
  const runGatherContentData = useRunGatherContentData();

  ////////////////////////////////////////
  /// EFFECTS
  ////////////////////////////////////////

  ///////
  // Initial user & data setup.
  // Login user if needed (triggers data setup on user change).
  // If no user, initiate data gathering.
  useEffect(() => {
    userDataInit({ setLocalError, setUser });
  }, []);

  useEffect(() => {
    runGatherCatalogData({ user: false, setLocalError });
    runGatherContentData({ user: false, setLocalError });
  }, []);

  // Register error if catalog DB not accessible.
  useEffect(() => {
    if (localError.active) {
      setNoDBErrors({
        status: false,
        message: localError.message,
      });
    }
  }, [localError]);

  useEffect(() => {
    if (
      (userLoggedIn && !process.env.NODE_ENV) ||
      process.env.NODE_ENV === "development"
    )
      setUser(userLoggedIn);
    if (userLoggedIn !== "not logged in") dispatch(authActions.logIn(user));
  }, [userLoggedIn]);

  useEffect(() => {
    if (!noDBErrors.status)
      dispatch(
        statusUpdateActions.updateStatus({
          status: 500,
          statusText: noDBErrors.message,
        })
      );
  }, [noDBErrors.status]);

  ////////////////////////////////////////
  /// Output
  ////////////////////////////////////////
  return (
    <div className="App">
      <ErrorBoundary>
        <header className="App-header">
          <CardTransparent>
            <Header aboutIsActive={aboutIsActive} musicIsActive={true} />
          </CardTransparent>
        </header>
      </ErrorBoundary>
      <ErrorBoundary>
        {localError.active && (
          <div className="local-error-container">
            <div className="local-error-inner-wrap">
              <LocalErrorDisplay
                title={localError.title}
                message={localError.message}
              />
              <p>
                If you prefer, connect with Ignite Revolution Music using the
                links below!
              </p>
              <ul className="error-modal-link-wrap">
                {fallbackArtistSocialLInks.map((item) => (
                  <a href={item.profileLink} target="_blank">
                    {icons[item.faIcon]} {item.name}
                  </a>
                ))}
              </ul>
            </div>
          </div>
        )}
        {loadingStatus && (
          <div className="bar-loader-container">
            <div className="bar-loader-wrap">
              <BarLoader />
            </div>
          </div>
        )}
        <Routes>
          <Fragment>
            {loadingStatus && <Route path="/*" element={<BarLoader />} />}

            <Fragment>
              <Route
                path="/manage"
                element={
                  <Manage
                    noDBErrors={noDBErrors}
                    setNoDBErrors={setNoDBErrors}
                  />
                }
              />
              <Route
                path="/"
                element={
                  <Home
                    noDBErrors={noDBErrors}
                    setNoDBErrors={setNoDBErrors}
                    aboutIsActive={aboutIsActive}
                    musicIsActive={true}
                  />
                }
              />
              <Route
                path="*"
                element={
                  <Home
                    notFound={true}
                    noDBErrors={noDBErrors}
                    setNoDBErrors={setNoDBErrors}
                    aboutIsActive={aboutIsActive}
                    musicIsActive={true}
                  />
                }
              />
            </Fragment>
          </Fragment>
        </Routes>
      </ErrorBoundary>
    </div>
  );
}

export default App;
