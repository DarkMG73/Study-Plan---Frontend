import styles from "./MusicCatalog.module.css";
import React from "react";
import { useSelector } from "react-redux";
import MusicPlayer from "../MusicPlayer/MusicPlayer";
import ServiceSelector from "../MusicPlayer/ServiceSelector/ServiceSelector";

const MusicCatalog = (props) => {
  // Can use https://www.browserling.com/tools/extract-urls
  // for extracting URL from iframe code (mostly works)

  const { welcomeScrollPosition } = useSelector(
    (state) => state.scrollPosition
  );
  const allowedCatalogTypes = ["song", "album", "playlist"];

  const sortedCatalogItems = {
    featured: [],
    nonFeatured: [],
    defaultPlaylist: [],
  };
  for (const itemValues of Object.values(props.catalogData.catalog)) {
    if (
      itemValues.hasOwnProperty("isFeaturedPlaylist") &&
      itemValues.isFeaturedPlaylist
    ) {
      sortedCatalogItems.featured.push(itemValues);
    } else {
      if (
        sortedCatalogItems.defaultPlaylist.length <= 0 &&
        itemValues.hasOwnProperty("isDefaultPlaylist") &&
        itemValues.isDefaultPlaylist
      )
        sortedCatalogItems.defaultPlaylist.push(itemValues);

      if (!sortedCatalogItems.nonFeatured.hasOwnProperty(itemValues.type))
        sortedCatalogItems.nonFeatured[itemValues.type] = [];
      sortedCatalogItems.nonFeatured[itemValues.type].push(itemValues);
    }
  }

  return (
    <div
      id="music-catalog"
      className={
        styles["music-catalog-container"] +
        " " +
        styles[
          "hasFeaturedElm-" +
            (sortedCatalogItems.featured &&
              sortedCatalogItems.featured.length > 0)
        ]
      }
    >
      <div className={styles["music-catalog"]}>
        <div className={styles["title-wrap"]}>
          <h2>Music Catalog</h2>
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
        {sortedCatalogItems.featured && sortedCatalogItems.featured.length > 0 && (
          <div className={styles["featured-container"]}>
            <ul
              className={
                styles["music-player-list"] + " " + styles["featured-list"]
              }
            >
              {Object.keys(sortedCatalogItems.featured).map((key) => {
                const categoryObj = sortedCatalogItems.featured;
                if (
                  Object.keys(categoryObj[key]).length <= 0 ||
                  (categoryObj[key].hasOwnProperty("type") &&
                    !allowedCatalogTypes.includes(categoryObj[key].type))
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
        {Object.keys(sortedCatalogItems.nonFeatured).map((cat) => {
          const categoryObj = sortedCatalogItems.nonFeatured[cat];

          if (
            Object.keys(categoryObj).length <= 0 ||
            !allowedCatalogTypes.includes(cat)
          )
            return false;

          return (
            <ul key={cat} className={styles["music-player-list"]}>
              {Object.keys(categoryObj).map((key) => {
                if (
                  Object.keys(categoryObj[key]).length <= 0 ||
                  (categoryObj[key].hasOwnProperty("type") &&
                    !allowedCatalogTypes.includes(categoryObj[key].type))
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

export default MusicCatalog;
