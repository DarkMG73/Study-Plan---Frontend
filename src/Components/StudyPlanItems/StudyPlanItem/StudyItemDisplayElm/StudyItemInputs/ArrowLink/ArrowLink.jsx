import Styles from "./ArrowLink.module.scss";

const ArrowLink = (props) => {
  const {
    passedKey,
    studyPlanItemsObj,
    parentMasterID,
    parentsParentKey,
    parentKey,
    displayConditions,
  } = props;

  const key = passedKey;

  return (
    <li
      id={
        "arrow" +
        parentMasterID +
        "-" +
        parentsParentKey +
        "-" +
        parentKey +
        "-" +
        passedKey +
        "url"
      }
      data-elm-type="arrow-link"
      key={"arrow" + parentKey + "-" + key}
      className={
        Styles["featured-url-arrow-wrap"] +
        " " +
        Styles[
          "protectedHidden-" + displayConditions.protectedHidden.includes(key)
        ]
      }
    >
      <a
        href={studyPlanItemsObj[key]}
        rel="noreferrer"
        target="_blank"
        key={parentKey + "-" + key}
        name={parentKey + "-" + key}
        defaultValue={studyPlanItemsObj[key]}
        data-category={key}
        placeholder={"Valid URL only..."}
        title={key}
        data-parentkey={parentKey}
        data-parentsparentkey={
          parentsParentKey ? parentsParentKey.toString() : ""
        }
        data-parentmasterid={parentMasterID}
        className={
          Styles["button"] +
          " " +
          Styles["featured-url-arrow"] +
          " " +
          Styles[
            "protectedHidden-" + displayConditions.protectedHidden.includes(key)
          ]
        }
      >
        Go &rarr;
      </a>
    </li>
  );
};

export default ArrowLink;
