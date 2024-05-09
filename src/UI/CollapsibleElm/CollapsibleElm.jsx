import React, { useState, useEffect, useRef, Fragment } from "react";
import styles from "./CollapsibleElm.module.scss";
import PushButton from "../Buttons/PushButton/PushButton";

function CollapsibleElm(props) {
  const [elmOpen, setElmOpen] = useState(props.open);
  const [maxHeight, setMaxHeight] = useState(props.maxHeight);
  const [overflowActive, setOverflowActive] = useState(false);
  const textRef = useRef();

  // See if div is overflowing and See More button is needed
  function isOverflowActive(e) {
    if (e)
      return e.offsetHeight < e.scrollHeight || e.offsetWidth < e.scrollWidth;
  }

  useEffect(() => {
    if (isOverflowActive(textRef.current)) {
      setOverflowActive(true);
      return;
    }
    setOverflowActive(false);
  }, [isOverflowActive, textRef.current]);

  useEffect(() => {
    let timerTripCount = 0;
    const heightCheckTimerInterval = setInterval(() => {
      timerTripCount++;
      if (timerTripCount > 5) clearInterval(heightCheckTimerInterval);
      console.log(
        "%c⚪️►►►► %cline:28%ctimerTripCount",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(237, 222, 139);padding:3px;border-radius:2px",
        timerTripCount,
      );
      if (!isOverflowActive(textRef.current)) {
        setMaxHeight("max-content");
        return;
      } else {
        setMaxHeight(props.maxHeight);
      }
      console.log(
        "%c⚪️►►►► %cline:36%ctextRef.current",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(38, 157, 128);padding:3px;border-radius:2px",
        textRef.current,
      );
    }, 1000);
    if (timerTripCount > 5) clearInterval(heightCheckTimerInterval);
  }, [props.maxHeight]);

  useEffect(() => {
    if (props.recheckHeight && isOverflowActive(textRef.current)) {
      setOverflowActive(true);
      return;
    }
    setOverflowActive(false);
  }, [props.recheckHeight]);

  const seeMoreButtonHandler = (e) => {
    e.preventDefault();
    setElmOpen(!elmOpen);
    if (props.onClickCallback) props.onClickCallback();
  };

  // This allows the elm to be opened without a click by setting the open props
  useEffect(() => {
    setElmOpen(props.open);
  }, [props.open]);

  let output;

  let elmOpenStyles;
  let seeMoreButtonText;

  if (elmOpen) {
    elmOpenStyles = { maxHeight: "max-content", ...props.styles };
    seeMoreButtonText = (
      <span>
        {!props.hideButtonArrows && <Fragment>&uarr;</Fragment>}
        {props.buttonTextOpened ? props.buttonTextOpened : "See Less"}
        {!props.hideButtonArrows && <Fragment>&uarr;</Fragment>}
      </span>
    );
  } else {
    elmOpenStyles = { maxHeight: maxHeight, ...props.styles };
    seeMoreButtonText = (
      <span>
        {!props.hideButtonArrows && <Fragment>&darr;</Fragment>}{" "}
        {props.buttonTextClosed ? props.buttonTextClosed : "See More"}{" "}
        {!props.hideButtonArrows && <Fragment>&darr;</Fragment>}
      </span>
    );
  }

  // In case props need to be passed in the future.
  const childrenWithProps = React.Children.map(props.children, (child) => {
    // Checking isValidElement is the safe process.
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {});
    }
    return child;
  });

  output = (
    <Fragment key={props.elmId}>
      <div
        id={props.elmId}
        ref={textRef}
        className={
          styles["collapsible-elm"] +
          " " +
          styles[elmOpen ? "elm-open" : "elm-closed"] +
          " " +
          styles[
            props.showBottomGradient && overflowActive && "show-bottom-gradient"
          ]
        }
        style={elmOpenStyles}
        data-container-type="collapsibleElm"
      >
        {childrenWithProps}
      </div>
      {!elmOpen && !overflowActive ? null : (
        <PushButton
          inputOrButton={props.inputOrButton}
          styles={props.buttonStyles}
          identifier={props.elmId + "-see-more-btn"}
          colorType={props.colorType}
          value={seeMoreButtonText}
          data={props.data}
          size={props.size}
          onClick={seeMoreButtonHandler}
        >
          {seeMoreButtonText}
        </PushButton>
      )}
    </Fragment>
  );

  return output;
}

export default CollapsibleElm;
