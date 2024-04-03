import { Fragment, useState } from "react";
// import Styles from "./AddToPlanButton.module.scss"
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import { toTitleCase } from "../../Hooks/utility";
import NewStudyPlanForm from "../NewStudyPlanForm/NewStudyPlanForm";

const AddToPlanButton = (props) => {
  const {
    styles,
    setNewFormJSX,
    id,
    user,
    setNewFormInputValuesObj,
    newFormInputValuesObjRef,
    formType,
    setFormType,
  } = props.data;
  console.log(
    "%c⚪️►►►► %cline:17%cprops",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(3, 101, 100);padding:3px;border-radius:2px",
    props,
  );
  const [outputFormJSX, setOutputFormJSX] = useState(false);
  const addFormButtonHandler = (e) => {
    e.preventDefault();
    if (user) {
      const parentMasterID = e.target.getAttribute("data-parentmasterid");

      const amountToAdd = prompt("How many would you like to add?");
      console.log(
        "%c⚪️►►►► %cline:69%camountToAdd",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(248, 147, 29);padding:3px;border-radius:2px",
        amountToAdd,
      );
      if (amountToAdd <= 0) return false;
      setOutputFormJSX(
        <NewStudyPlanForm
          data={{
            id,
            user,
            amountToAdd,
            parentMasterID,
            styles,
            setNewFormJSX,
            setNewFormInputValuesObj,
            currentNewFormInputValuesObjRef: newFormInputValuesObjRef,
            formTypeGroup: { formType, setFormType },
            formActive: setOutputFormJSX,
          }}
        />,
      );
    } else {
      alert(
        'Please log in to add to your study plan. If you do not yet have a profile, click "Sign Up" at the top of the page to get started.',
      );
    }
  };
  return (
    <Fragment key={id}>
      <PushButton
        key={id}
        inputOrButton="button"
        id={"create-entry-btn" + id}
        colorType="primary"
        styles={{}}
        value={id}
        parentmasterid={id}
        data=""
        size="medium"
        onClick={addFormButtonHandler}
      >
        Add to Your <span>{toTitleCase(id, true)}</span>
      </PushButton>
      {outputFormJSX && outputFormJSX}
    </Fragment>
  );
};

export default AddToPlanButton;
