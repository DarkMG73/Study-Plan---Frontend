import { Fragment } from "react";
import Styles from "./InputURL.module.scss";
import useAddInputData from "../../../../../../Hooks/useAddInputData";

const InputURL = (props) => {
  const addInputData = useAddInputData();
  const {
    passedKey,
    studyPlanItemsObj,
    parentMasterID,
    parentsParentKey,
    parentKey,
    emptyForm,
    editedField,
    setEditedField,
  } = props;

  const key = passedKey;

  return (
    <Fragment>
      {studyPlanItemsObj[key] && (
        <a
          id={
            "arrow" +
            parentMasterID +
            "-" +
            parentsParentKey +
            "-" +
            parentKey +
            "-" +
            key +
            "url"
          }
          key={"arrow" + parentKey + "-" + key}
          href={studyPlanItemsObj[key]}
          rel="noreferrer"
          target="_blank"
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
          className={Styles["url-arrow"]}
        >
          Go &rarr;
        </a>
      )}
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
        {key}
      </label>
      <input
        type="url"
        id={
          parentMasterID +
          "-" +
          parentsParentKey +
          "-" +
          parentKey +
          "-" +
          key +
          "url"
        }
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
        onChange={(e) => {
          addInputData(e, { emptyForm, editedField, setEditedField });
        }}
      />
    </Fragment>
  );
};

export default InputURL;
