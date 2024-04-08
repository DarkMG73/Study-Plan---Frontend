import { Fragment, useState } from "react";
// import Styles from "./AddToPlanButton.module.scss"
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import { toTitleCase } from "../../Hooks/utility";
import NewStudyPlanForm from "../NewStudyPlanForm/NewStudyPlanForm";
import { FaPlus } from "react-icons/fa6";

const AddToPlanButton = (props) => {
  const { id, title, user, formType, setFormType } = props.data;
  const [outputFormJSX, setOutputFormJSX] = useState(false);
  const addFormButtonHandler = (e) => {
    e.preventDefault();
    if (user) {
      const amountToAdd = prompt("How many would you like to add?");

      if (amountToAdd <= 0) return false;
      setOutputFormJSX(
        <NewStudyPlanForm
          data={{
            id,
            user,
            amountToAdd,
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
        styles={{ margin: "auto" }}
        value={id}
        parentmasterid={id}
        data=""
        size="medium"
        onClick={addFormButtonHandler}
      >
        {title && <span>{toTitleCase(title, true)}</span>}
        {!title && (
          <span>
            <FaPlus />
          </span>
        )}
      </PushButton>
      {outputFormJSX && outputFormJSX}
    </Fragment>
  );
};

export default AddToPlanButton;
