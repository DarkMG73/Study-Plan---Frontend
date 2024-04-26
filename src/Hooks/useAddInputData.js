import { useDispatch } from "react-redux";
import { formInputDataActions } from "../store/formInputDataSlice";

const useAddInputData = () => {
  const dispatch = useDispatch();

  const outputFunction = (e, props) => {
    e.preventDefault();
    let typingTimer = null;
    const target = e.target;
    console.log(
      "%c⚪️►►►► %cline:10%ctarget",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(130, 57, 53);padding:3px;border-radius:2px",
      target,
    );
    const outputValue = target.value;
    console.log(
      "%c⚪️►►►► %cline:11%coutputValue",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(217, 104, 49);padding:3px;border-radius:2px",
      outputValue,
    );
    const { emptyForm, editedField, setEditedField } = props;

    // Allows the form to show only inputs needed by each type
    const parentMasterID = target.getAttribute("data-parentmasterid");
    let title = target.getAttribute("title");

    if (title === "type")
      document
        .getElementById(parentMasterID)
        .setAttribute("newFormType", outputValue);

    clearTimeout(typingTimer);

    typingTimer = setTimeout(() => {
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
    }, 2000);
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

    setTimeout(() => {
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
    }, 0);

    if (!editedField) setEditedField(true);
  }

  return outputFunction;
};

export default useAddInputData;
