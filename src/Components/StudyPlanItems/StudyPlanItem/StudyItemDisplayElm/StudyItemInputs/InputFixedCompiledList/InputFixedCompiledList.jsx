import { Fragment } from "react";
import { useSelector } from "react-redux";
import useAddInputData from "../../../../../../Hooks/useAddInputData";

const InputFixedCompiledList = (props) => {
  const studyPlanMetadata = useSelector(
    (state) => state.studyPlanData.studyPlanMetadata,
  );
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
      <select
        id={
          parentMasterID +
          "-" +
          parentsParentKey +
          "-" +
          parentKey +
          "-" +
          key +
          "select"
        }
        key={parentKey + "-" + key}
        name={parentKey + "-" + key}
        defaultValue={studyPlanItemsObj[key]}
        data-category={key}
        placeholder={key}
        title
        data-parentkey={parentKey}
        data-parentsparentkey={
          parentsParentKey ? parentsParentKey.toString() : ""
        }
        data-parentmasterid={parentMasterID}
        onChange={(e) => {
          addInputData(e, { emptyForm, editedField, setEditedField });
        }}
      >
        {Object.hasOwn(studyPlanMetadata, key) &&
          studyPlanMetadata[key].slice(1).map((option) => (
            <option
              key={
                option +
                parentMasterID +
                "-" +
                parentsParentKey +
                "-" +
                parentKey +
                "-" +
                key +
                "-" +
                "option"
              }
              value={option}
            >
              {option}
            </option>
          ))}
      </select>
    </Fragment>
  );
};

export default InputFixedCompiledList;
