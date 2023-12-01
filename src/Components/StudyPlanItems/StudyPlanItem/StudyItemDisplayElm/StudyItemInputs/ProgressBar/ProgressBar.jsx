import { Fragment } from "react";
import ProgressBar from "@ramonak/react-progress-bar";

const Progressbar = (props) => {
  const {
    passedKey,
    studyPlanItemsObj,
    parentMasterID,
    parentsParentKey,
    parentKey,
  } = props;

  const key = passedKey;

  return (
    <Fragment>
      <label
        id={
          parentMasterID +
          "-" +
          parentsParentKey +
          "-" +
          parentKey +
          "-" +
          key +
          "label"
        }
        htmlFor={parentKey + "-" + key}
      >
        {key}:
      </label>

      <ProgressBar
        key={parentKey + "-" + key}
        completed={+studyPlanItemsObj["status"]}
        maxCompleted={100}
        className="wrapper"
        baseBgColor="transparent"
        bgColor="var(--spt-color-accent-light)"
        height="100%"
        width="100%"
        padding="0 1em 0 0"
        borderRadius="50px"
        labelAlignment="center"
        labelColor="var(--spt-color-accent"
        labelSize="0.5em"
        animateOnRender={true}
        dir="auto"
        transitionDuration="3s"
        customLabelStyles={{ background: "transparent" }}
      />
    </Fragment>
  );
};

export default Progressbar;
