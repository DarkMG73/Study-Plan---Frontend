import { Fragment } from "react";
import { useSelector } from "react-redux";
import useAddInputData from "../../../../../../Hooks/useAddInputData";

const InputSuggestionList = (props) => {
  const studyPlanMetadata = useSelector(
    (state) => state.studyPlanData.studyPlanMetadata
  );
  const addInputData = useAddInputData();
  const {
    passedKey,
    studyPlanItemsObj,
    parentMasterID,
    parentsParentKey,
    parentKey,
    displayConditions,
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
        htmlFor={parentKey + "-" + key + "datalist"}
      >
        {key}:
      </label>{" "}
      {/*name={parentKey + "-" + key}*/}
      <input
        type="text"
        list={parentKey + "-" + key + "datalist"}
        id={parentKey + "-" + key}
        size="50"
        autoComplete="off"
        data-category={key}
        placeholder={""}
        title={key}
        name={parentKey + "-" + key + "datalist"}
        defaultValue={studyPlanItemsObj[key]}
        data-parentkey={parentKey}
        data-parentsparentkey={
          parentsParentKey ? parentsParentKey.toString() : ""
        }
        data-parentmasterid={parentMasterID}
        onChange={(e) => {
          addInputData(e, { emptyForm, editedField, setEditedField });
        }}
      />
      <datalist
        id={parentKey + "-" + key + "datalist"}
        key={parentKey + "-" + key + "datalist"}
        name={parentKey + "-" + key + "datalist"}
        defaultValue={studyPlanItemsObj[key]}
        data-category={key}
        placeholder={key}
        title={key}
        data-parentkey={parentKey}
        data-parentsparentkey={
          parentsParentKey ? parentsParentKey.toString() : ""
        }
        data-parentmasterid={parentMasterID}
      >
        {Object.values(displayConditions["isSuggestionsList"][key]).map(
          (option) => (
            <option key={option} value={option}></option>
          )
        )}

        {Object.hasOwn(studyPlanMetadata, key) &&
          studyPlanMetadata[key].slice(1).map((option) => {
            if (!displayConditions["isSuggestionsList"][key].includes(option))
              return <option key={option} value={option}></option>;
          })}
      </datalist>
    </Fragment>
  );
};

export default InputSuggestionList;
