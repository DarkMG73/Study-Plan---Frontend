import { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./SessionResultsRows.module.css";
import SessionResultsRow from "../SessionResultsRow/SessionResultsRow";
import Card from "../../UI/Cards/Card/Card";
import BarLoader from "../../UI/Loaders/BarLoader/BarLoader";
import { loadingRequestsActions } from "../../store/loadingRequestsSlice";
import useViewport from "../../Hooks/useViewport";
import CollapsibleElm from "../../UI/CollapsibleElm/CollapsibleElm";

function SessionResultsRows(props) {
  const questionHistory = props.questionHistory;
  const dispatch = useDispatch();
  const questionHistoryCategories = [];
  const refToPass = props.refToPass;
  const scrollToID = props.scrollToID;
  const questionHistoryRows = {};
  let questionHistoryCount = 0;
  const displayedCategories = ["correct", "incorrect", "unmarked", "questions"];
  const [width, height] = useViewport();
  const breakpoint = 900;
  const [overBreakpoint, setOverBreakPoint] = useState(width > breakpoint);
  const maxHeight = props.hideCollapsibleElm
    ? "none"
    : props.overBreakpoint
    ? "4em"
    : "7em";
  ///////////////////////////////
  ///      Effects
  //////////////////////////////
  useEffect(() => {
    setOverBreakPoint(width > breakpoint);
  }, [width]);

  for (const k in questionHistory) {
    if (displayedCategories.includes(k)) {
      questionHistoryCategories.push(k);
      questionHistoryRows[k] = [];
      for (const key in questionHistory[k]) {
        // Add the row
        questionHistoryRows[k].push(key);
        questionHistoryCount++;
      }
    }
  }
  const elementOutput = questionHistoryCategories.map((cat, i) => {
    if (questionHistoryRows[cat].length > 0) {
      const output = (
        <CollapsibleElm
          key={cat + Object.keys(questionHistory[cat]).length}
          elmId={"session-results-see-more-btn"}
          maxHeight={props.hideCollapsibleElm ? "none" : "26em"}
          inputOrButton="button"
          styles={{ maxWidth: "100%" }}
          buttonStyles={{
            display: props.hideCollapsibleElm ? "none" : "flex",
            margin: "0 auto",
            letterSpacing: "0.25em",
            fontVariant: "small-caps",
            transform: "translateY(14%)",
            minWidth: "5em",
            textAlign: "center",
            alignItems: "center",
            width: "100%",
            justifyContent: "center",
            borderRadius: "0 0 50px 50px",
            height: "100%",
            padding: "2em 0",
            marginBottom: "1em",
            boxShadow:
              "inset 7px 7px 10px rgb(255 255 255 / 25%), inset 1px -1px 1px rgb(0 0 0 / 15%), 3px 4px 10px -7px black",
          }}
          colorType="primary"
          data=""
          size="large"
          buttonTextClosed={`See more ${cat} questions`}
          buttonTextOpened={`See fewer ${cat} questions`}
          showBottomGradient={false}
        >
          <div
            key={"session-results-" + i}
            className={styles[cat] + " " + styles["section-wrap"]}
          >
            {!props.hideSectionTitles && (
              <h3 className={styles["history-section-title"]}>{cat}</h3>
            )}
            {questionHistoryRows[cat].map((key) => {
              if (key === scrollToID) {
                return (
                  <Fragment>
                    <a ref={refToPass}></a>
                    <SessionResultsRow
                      key={"session-results-row" + cat + key + i}
                      questionHistory={questionHistory}
                      keyOne={cat}
                      keyTwo={key}
                      open={true}
                      overBreakpoint={overBreakpoint}
                      customButtonsJSX={props.customButtonsJSX}
                      hideStockRowButtons={props.hideStockRowButtons}
                      hideCollapsibleElm={props.hideCollapsibleElm}
                    />
                  </Fragment>
                );
              } else {
                return (
                  <SessionResultsRow
                    key={"session-results-row" + cat + key + i}
                    questionHistory={questionHistory}
                    keyOne={cat}
                    keyTwo={key}
                    overBreakpoint={overBreakpoint}
                    customButtonJSKFunction={props.customButtonJSKFunction}
                    hideStockRowButtons={props.hideStockRowButtons}
                    hideCollapsibleElm={props.hideCollapsibleElm}
                  />
                );
              }
            })}
          </div>
        </CollapsibleElm>
      );

      return output;
    }
  });
  // dispatch(loadingRequestsActions.removeFromLoadRequest());

  return (
    <div
      key="session-results-container"
      className={styles["session-results-container"]}
    >
      {questionHistoryCount > 0 ? (
        elementOutput.map((row) => row)
      ) : (
        <Card styles={{ borderRadius: "30px", padding: "3em" }}>
          {!props.showLoader && (
            <p>
              You do not have a history yet on this browser. Answer a few
              questions and they will be saved tot his browser's memory. This
              history will remain available until you decide to erase it."
            </p>
          )}
          {props.showLoader && (
            <div className={styles["loader-wrap"]}>
              <BarLoader />
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

export default SessionResultsRows;
