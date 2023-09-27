import styles from "./StudyPlan.module.css";
import React from "react";
import { useSelector } from "react-redux";

const StudyPlan = (props) => {
  console.log(
    "%c --> %cline:5%cprops",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(227, 160, 93);padding:3px;border-radius:2px",
    props
  );
  // Can use https://www.browserling.com/tools/extract-urls
  // for extracting URL from iframe code (mostly works)

  const { welcomeScrollPosition } = useSelector(
    (state) => state.scrollPosition
  );
  const allowedStudyPlanTypes = ["step", "goal"];

  const sortedStudyPlanItems = {
    steps: [],
    goals: [],
  };

  console.log(
    "%c --> %cline:21%csortedStudyPlanItems",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(3, 38, 58);padding:3px;border-radius:2px",
    sortedStudyPlanItems
  );

  for (const itemValues of Object.values(props.studyPlanData.studyPlan)) {
    if (itemValues.hasOwnProperty("type") && itemValues.type === "step") {
      sortedStudyPlanItems.steps.push(itemValues);
    } else {
      if (itemValues.hasOwnProperty("type") && itemValues.type === "goal")
        sortedStudyPlanItems.goals.push(itemValues);
    }
  }

  return (
    <div
      id="music-studyPlan"
      className={
        styles["music-studyPlan-container"] +
        " " +
        styles[
          "hasFeaturedElm-" +
            (sortedStudyPlanItems.steps &&
              sortedStudyPlanItems.steps.length > 0)
        ]
      }
    >
      <div className={styles["music-studyPlan"]}>
        <div className={styles["title-wrap"]}>
          <h2>Music StudyPlan</h2>
        </div>
        <div
          className={
            styles["service-selector-wrap"] +
            " " +
            styles[
              "hide-" +
                (welcomeScrollPosition &&
                  welcomeScrollPosition.hasOwnProperty("top") &&
                  welcomeScrollPosition.top >= -50)
            ]
          }
        >
          {" "}
        </div>
        {sortedStudyPlanItems.goals.map((entry) => (
          <ul key={entry._id} className={styles["music-player-list"]}>
            <h3>Goals</h3>
            <div
              key={entry._id}
              className={
                styles["playlist"] +
                " " +
                (props.playlist &&
                  props.playlist.length > 0 &&
                  styles[props.playlists[0].slug]) +
                " " +
                styles[entry.isFeaturedPlaylist ? "featured" : "not-featured"]
              }
            >
              {entry.name}
            </div>
          </ul>
        ))}
        {sortedStudyPlanItems.steps.map((entry) => (
          <ul key={entry._id} className={styles["music-player-list"]}>
            <h3>Steps</h3>
            <div
              key={entry._id}
              className={
                styles["playlist"] +
                " " +
                (props.playlist &&
                  props.playlist.length > 0 &&
                  styles[props.playlists[0].slug]) +
                " " +
                styles[entry.isFeaturedPlaylist ? "featured" : "not-featured"]
              }
            >
              {entry.name}
            </div>
          </ul>
        ))}
      </div>
    </div>
  );
};

export default StudyPlan;
