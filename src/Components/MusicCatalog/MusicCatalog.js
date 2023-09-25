import styles from "./MusicStudyPlan.module.css";
import React from "react";
import { useSelector } from "react-redux";
import MusicPlayer from "../MusicPlayer/MusicPlayer";
import ServiceSelector from "../MusicPlayer/ServiceSelector/ServiceSelector";

const MusicStudyPlan = (props) => {
  // Can use https://www.browserling.com/tools/extract-urls
  // for extracting URL from iframe code (mostly works)

  const { welcomeScrollPosition } = useSelector(
    (state) => state.scrollPosition
  );
  const allowedStudyPlanTypes = ["song", "album", "playlist"];

  const sortedStudyPlanItems = {
    featured: [],
    nonFeatured: [],
    defaultPlaylist: [],
  };
  for (const itemValues of Object.values(props.studyPlanData.studyPlan)) {
    if (
      itemValues.hasOwnProperty("isFeaturedPlaylist") &&
      itemValues.isFeaturedPlaylist
    ) {
      sortedStudyPlanItems.featured.push(itemValues);
    } else {
      if (
        sortedStudyPlanItems.defaultPlaylist.length <= 0 &&
        itemValues.hasOwnProperty("isDefaultPlaylist") &&
        itemValues.isDefaultPlaylist
      )
        sortedStudyPlanItems.defaultPlaylist.push(itemValues);

      if (!sortedStudyPlanItems.nonFeatured.hasOwnProperty(itemValues.type))
        sortedStudyPlanItems.nonFeatured[itemValues.type] = [];
      sortedStudyPlanItems.nonFeatured[itemValues.type].push(itemValues);
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
            (sortedStudyPlanItems.featured &&
              sortedStudyPlanItems.featured.length > 0)
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
          {!props.hideServiceSelector && (
            <ServiceSelector
              sourceURLObj={props.sourceURLObj}
              styles={{
                borderRadius: "0 0 50px 50px",
                flexDirection: "column",
                width: "fit-content",
                margin: " 0 auto",
                padding: "0 4em",
              }}
            />
          )}
        </div>
        {sortedStudyPlanItems.featured &&
          sortedStudyPlanItems.featured.length > 0 && (
            <div className={styles["featured-container"]}>
              <ul
                className={
                  styles["music-player-list"] + " " + styles["featured-list"]
                }
              >
                {Object.keys(sortedStudyPlanItems.featured).map((key) => {
                  const categoryObj = sortedStudyPlanItems.featured;
                  if (
                    Object.keys(categoryObj[key]).length <= 0 ||
                    (categoryObj[key].hasOwnProperty("type") &&
                      !allowedStudyPlanTypes.includes(categoryObj[key].type))
                  )
                    return false;

                  const entry = categoryObj[key];

                  return (
                    <div
                      key={entry.title}
                      className={
                        styles["playlist"] +
                        " " +
                        (props.playlist &&
                          props.playlist.length > 0 &&
                          styles[props.playlists[0].slug]) +
                        " " +
                        styles[
                          entry.isFeaturedPlaylist ? "featured" : "not-featured"
                        ]
                      }
                    >
                      <MusicPlayer
                        title={entry.title}
                        passedStyles={{ boxShadow: "none" }}
                        sourceURLObj={entry.sourceURLObj}
                        hideServiceSelector={true}
                        showPlayerFrame1={true}
                        isFeaturedPlaylist={entry.isFeaturedPlaylist}
                      />
                    </div>
                  );
                })}
              </ul>
            </div>
          )}
        {Object.keys(sortedStudyPlanItems.nonFeatured).map((cat) => {
          const categoryObj = sortedStudyPlanItems.nonFeatured[cat];

          if (
            Object.keys(categoryObj).length <= 0 ||
            !allowedStudyPlanTypes.includes(cat)
          )
            return false;

          return (
            <ul key={cat} className={styles["music-player-list"]}>
              {Object.keys(categoryObj).map((key) => {
                if (
                  Object.keys(categoryObj[key]).length <= 0 ||
                  (categoryObj[key].hasOwnProperty("type") &&
                    !allowedStudyPlanTypes.includes(categoryObj[key].type))
                )
                  return false;

                const entry = categoryObj[key];

                return (
                  <div
                    key={entry._id}
                    className={
                      styles["playlist"] +
                      " " +
                      (props.playlist &&
                        props.playlist.length > 0 &&
                        styles[props.playlists[0].slug]) +
                      " " +
                      styles[
                        entry.isFeaturedPlaylist ? "featured" : "not-featured"
                      ]
                    }
                  >
                    <MusicPlayer
                      title={entry.title}
                      passedStyles={{ boxShadow: "none" }}
                      sourceURLObj={entry.sourceURLObj}
                      hideServiceSelector={true}
                      showPlayerFrame1={true}
                      isFeaturedPlaylist={entry.isFeaturedPlaylist}
                    />
                  </div>
                );
              })}
            </ul>
          );
        })}
      </div>
    </div>
  );
};

export default MusicStudyPlan;
