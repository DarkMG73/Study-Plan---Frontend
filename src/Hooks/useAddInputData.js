import { useDispatch } from "react-redux";
import { formInputDataActions } from "../store/formInputDataSlice";

const useAddInputData = () => {
  const dispatch = useDispatch();

  const outputFunction = (e, props) => {
    e.preventDefault();
    // let typingTimer = null;
    const target = e.target;
    const outputValue = target.value;
    const { emptyForm, editedField, setEditedField } = props;

    // Allows the form to show only inputs needed by each type
    const parentMasterID = target.getAttribute("data-parentmasterid");
    let title = target.getAttribute("title");

    if (title === "type") {
      document
        .querySelectorAll(`[id *= "${parentMasterID}"]`)
        .forEach((item) => item.setAttribute("data-newFormType", outputValue));
    }

    if (outputValue || outputValue === "") {
      groomAndAddInputData(
        target,
        parentMasterID,
        outputValue,
        emptyForm,
        editedField,
        setEditedField,
      );
    }
  };

  function groomAndAddInputData(
    target,
    parentMasterID,
    outputValue,
    emptyForm,
    editedField,
    setEditedField,
  ) {
    const parentKey = target.getAttribute("data-parentkey");
    const parentsParentKey = target.getAttribute("parentsParentKey");
    let title = target.getAttribute("title");

    if (parentMasterID !== parentKey) {
      if (parentMasterID === parentsParentKey) {
        outputValue = { [parentKey]: outputValue };
        title = parentKey;
      } else {
        outputValue = { [title]: outputValue };
        title = parentKey;
      }
    }

    if (emptyForm)
      dispatch(
        formInputDataActions.addToNewFormInputDataObj({
          parentMasterID,
          title,
          outputValue,
        }),
      );

    if (!emptyForm)
      dispatch(
        formInputDataActions.addToExistingFormInputDataObj({
          parentMasterID,
          title,
          outputValue,
        }),
      );

    if (!editedField) setEditedField(true);
  }

  return outputFunction;
};

export default useAddInputData;
