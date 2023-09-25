import styles from "./ServiceSelector.module.css";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { musicPlayerActions } from "../../../store/musicPlayerSlice";

const ServiceSelector = (props) => {
  const { serviceSelected } = useSelector((state) => state.musicPlayer);
  const defaultServiceAndURL = {
    serviceName: "soundCloud",
    sourceURL:
      "https://w.soundCloud.com/player/?url=https%3A//api.soundCloud.com/playlists/1309354504&color=%23070d07&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true",
  };
  const [activeTab, setActiveTab] = useState(
    serviceSelected ? serviceSelected : defaultServiceAndURL.serviceName
  );

  useEffect(() => {
    dispatch(
      musicPlayerActions.updateServiceSelected(defaultServiceAndURL.serviceName)
    );
  }, []);

  useEffect(() => {
    setActiveTab(
      serviceSelected ? serviceSelected : defaultServiceAndURL.serviceName
    );
  }, [serviceSelected]);

  const dispatch = useDispatch();

  const serviceSelectionButtonHandler = (e) => {
    dispatch(musicPlayerActions.updateServiceSelected(e.target.value));
  };

  return (
    <div className={styles["tab-container"]} style={props.styles}>
      {props.title && (
        <div className={styles["player-title-wrap"]}>
          <h2 className={styles["player-title"]}>{props.title}</h2>
        </div>
      )}
      <div className={styles["tab-container-inner-wrap"]}>
        <button
          value="spotify"
          onClick={serviceSelectionButtonHandler}
          className={
            styles["tab-name"] +
            " " +
            styles["active-" + (activeTab === "spotify")]
          }
        >
          <h3>Spotify</h3>
        </button>
        <button
          value="soundCloud"
          onClick={serviceSelectionButtonHandler}
          className={
            styles["tab-name"] +
            " " +
            styles["active-" + (activeTab === "soundCloud")]
          }
        >
          <h3>SoundCloud</h3>
        </button>
        <button
          value="appleMusic"
          onClick={serviceSelectionButtonHandler}
          className={
            styles["tab-name"] +
            " " +
            styles["active-" + (activeTab === "appleMusic")]
          }
        >
          <h3>Apple Music</h3>
        </button>
      </div>
    </div>
  );
};

export default ServiceSelector;
