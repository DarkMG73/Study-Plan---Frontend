import styles from "./MusicPlayer.module.css";
import React from "react";
import { useSelector } from "react-redux";
import Iframe from "react-iframe";
import ServiceSelector from "./ServiceSelector/ServiceSelector";
import { toCamelCase } from "../../Hooks/utility";

const MusicPlayer = (props) => {
  const { serviceSelected } = useSelector((state) => state.musicPlayer);
  const { serviceEmbedJSXObj } = useSelector((state) => state.studyPlanData);
  const isFeatured = props.isFeaturedPlaylist;
  const serviceEmbedJSX =
    serviceEmbedJSXObj && serviceEmbedJSXObj.hasOwnProperty(serviceSelected)
      ? serviceEmbedJSXObj[serviceSelected]
      : null;

  const outputIframeAttributesObj = {};

  if (serviceEmbedJSX) {
    for (const attribute of Object.values(serviceEmbedJSX.split("|"))) {
      const attNameValueArray = attribute
        .replaceAll('"', "")
        .replaceAll("\n", "")
        .split(/[=:]/);

      const name = toCamelCase(attNameValueArray[0].replaceAll(" ", ""));
      let value = "";
      if (attNameValueArray.length === 1) {
        value = "true";
      } else if (attNameValueArray.length >= 2) {
        value = attNameValueArray[1].trim();
      }

      outputIframeAttributesObj[name] = value;
    }
  }

  const sourceURL =
    props.hasOwnProperty("sourceURLObj") &&
    props.sourceURLObj &&
    props.sourceURLObj.hasOwnProperty(serviceSelected) &&
    props.sourceURLObj[serviceSelected] &&
    props.sourceURLObj[serviceSelected].trim() !== ""
      ? props.sourceURLObj[serviceSelected]
      : false;

  const activeTabAndURL = {
    sourceURL,
    serviceName: serviceSelected,
  };

  let isValidUrl = false;

  try {
    isValidUrl = Boolean(new URL(activeTabAndURL.sourceURL));
  } catch {}

  return (
    <div
      className={
        styles["music-player-container"] +
        " " +
        styles["stock-box-shadow-" + props.showStockBoxShadow] +
        " " +
        styles[isFeatured ? "featured" : "not-featured"]
      }
      style={props.passedStyles}
    >
      <h3>{props.title}</h3>
      {!props.hideServiceSelector && (
        <div className={styles["music-player-selector-wrap"]}>
          <ServiceSelector sourceURLObj={props.sourceURLObj} />
        </div>
      )}
      <div
        className={
          styles["music-player-wrap"] +
          " " +
          styles["player-frame-1-" + props.showPlayerFrame1]
        }
      >
        {!activeTabAndURL ||
          (!isValidUrl && (
            <div
              className={
                styles["music-service-container"] +
                " " +
                styles["no-service-container"]
              }
              style={props.passedStyles}
            >
              <h3>
                Unfortunately, this item is not listed on{" "}
                {serviceSelected ? serviceSelected : "this service"}. Please
                select a different service to access this content.
              </h3>
            </div>
          ))}
        {activeTabAndURL && activeTabAndURL.sourceURL && isValidUrl && (
          <div
            className={
              styles.tab +
              " " +
              styles["active-" + !!activeTabAndURL.serviceName]
            }
          >
            {" "}
            <div
              className={styles["music-service-container"]}
              style={props.passedStyles}
            >
              <Iframe
                styles={{
                  border: "none",
                  borderRadius: "30px",
                  boxShadow: "-2px -2px 3px -2px black, 2px 2px 3px -2px white",
                  margin: "0",
                }}
                src={activeTabAndURL.sourceURL}
                width={
                  outputIframeAttributesObj &&
                  outputIframeAttributesObj.hasOwnProperty("width") &&
                  outputIframeAttributesObj.width
                    ? outputIframeAttributesObj.width
                    : "100%"
                }
                max-width={
                  outputIframeAttributesObj.maxWidth
                    ? outputIframeAttributesObj.maxWidth
                    : ""
                }
                height={
                  outputIframeAttributesObj.height
                    ? outputIframeAttributesObj.height
                    : "300"
                }
                max-height={
                  outputIframeAttributesObj.maxHeight
                    ? outputIframeAttributesObj.maxHeight
                    : ""
                }
                scrolling={
                  outputIframeAttributesObj.scrolling
                    ? outputIframeAttributesObj.scrolling
                    : "no"
                }
                frameborder={
                  outputIframeAttributesObj.frameborder
                    ? outputIframeAttributesObj.frameborder
                    : "no"
                }
                allow={
                  outputIframeAttributesObj.allow
                    ? outputIframeAttributesObj.allow
                    : "autoplay"
                }
                title={
                  outputIframeAttributesObj.title
                    ? outputIframeAttributesObj.title
                    : "Music Player"
                }
                loading={
                  outputIframeAttributesObj.loading
                    ? outputIframeAttributesObj.loading
                    : "lazy"
                }
                allowtransparency={
                  outputIframeAttributesObj.allowtransparency
                    ? outputIframeAttributesObj.allowtransparency
                    : "true"
                }
                allowfullscreen={
                  outputIframeAttributesObj.allowfullscreen
                    ? outputIframeAttributesObj.allowfullscreen
                    : "true"
                }
              >
                You need a Frames Capable browser to view this content.
              </Iframe>
            </div>{" "}
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicPlayer;
