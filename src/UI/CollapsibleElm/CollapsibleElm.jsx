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
  }, [isOverflowActive]);

  useEffect(() => {
    setTimeout(() => {
      if (!isOverflowActive(textRef.current)) {
        setMaxHeight("10000px");
        return;
      } else {
        setMaxHeight(props.maxHeight);
      }
    }, 2000);
  }, [props.maxHeight]);

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
    elmOpenStyles = { maxHeight: "100000px", ...props.styles };
    seeMoreButtonText = (
      <span>
        &uarr; {props.buttonTextOpened ? props.buttonTextOpened : "See Less"}{" "}
        &uarr;
      </span>
    );
  } else {
    elmOpenStyles = { maxHeight: maxHeight, ...props.styles };
    seeMoreButtonText = (
      <span>
        &darr; {props.buttonTextClosed ? props.buttonTextClosed : "See More"}{" "}
        &darr;
      </span>
    );
  }

  const theChildren = { ...props.children };
  // theChildren((item) => {
  //   console.log("item", item);
  // });

  // In case props need to be passed in the future.
  const childrenWithProps = React.Children.map(props.children, (child) => {
    // Checking isValidElement is the safe way and avoids a
    // typescript error too.
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
          styles[props.showBottomGradient && "show-bottom-gradient"]
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
