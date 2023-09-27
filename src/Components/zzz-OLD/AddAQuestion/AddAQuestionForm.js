import { useState, Fragment } from "react";
import { useSelector } from "react-redux";
import styles from "./AddAQuestionForm.module.css";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import AddAQuestionFormElms from "./AddAQuestionFormElms";
import { sha256 } from "js-sha256";
import { addDocToDB } from "../../storage/interviewQuestionsDB";

function AddAQuestionForm(props) {
  const user = useSelector((state) => state.auth.user);
  const allQuestions = useSelector((state) => state.studyPlanData.allQuestions);
  const [formJSX, setFormJSX] = useState([<AddAQuestionFormElms />]);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  function addAnotherQuestionFormButtonHandler(e) {
    e.preventDefault();
    setFormJSX([...formJSX, <AddAQuestionFormElms />]);
  }

  function submitButtonHandler(e) {
    e.preventDefault();

    const data = new FormData(e.target.parentNode);
    const numberOfFieldsPerQuestion = 9;

    const dataEntries = [...data.entries()];
    const questions = [];

    // Cycle through data array
    let tempID;
    dataEntries.forEach((group, i) => {
      // If i =0 or is divisible evenly by numberOfFieldsPerQuestion, set a new object id
      if (i % numberOfFieldsPerQuestion === 0) {
        // Set a temp sequential ID to be replaced with a hash later
        tempID = i / numberOfFieldsPerQuestion;
        questions[tempID] = {};
      }
      questions[tempID][group[0]] = group[1];
    });

    // Replace the temp ID's with a hash based on the question title
    const questionsGroomed = {};
    for (const i in questions) {
      const d = new Date();
      let year = d.getFullYear();
      const hasId = sha256(JSON.stringify(questions[i]));
      const newId = year + "-" + hasId;
      questionsGroomed[newId] = questions[i];
      questionsGroomed[newId].identifier = newId;
    }

    for (const key in questionsGroomed) {
      const theData = questionsGroomed[key];
      if (!theData.hasOwnProperty("title") || theData.title.trim() === "") {
        alert(
          " Titles are required, but it appears a title field is not filled in. Please find the empty title field and add the title before submitting the form."
        );
        return;
      }

      // Make sure each title is unsptue.
      if (theData.hasOwnProperty("title")) {
        const titlesArray = Object.keys(allQuestions).map((key) =>
          allQuestions[key].title.trim()
        );
        if (titlesArray.includes(theData.title.trim())) {
          alert(
            " Titles need to be unsptue. It appears a title field is exactly the same as one we already have for a questions. Please make sure each title is, in some way, different from existing questions."
          );
          return;
        }
      }
      if (!theData.hasOwnProperty("answer") || theData.answer.trim() === "") {
        alert(
          " Answers are required, but it appears an answer field is not filled in. Please find the empty answer field and add the answer before submitting the form."
        );
        return;
      }
    }
    // Access FormData fields with `data.get(fieldName)`
    // For example, converting to upper case
    // data.set('username', data.get('username').toUpperCase());
    for (const key in questionsGroomed) {
      const theData = questionsGroomed[key];
      if (!theData.hasOwnProperty("title") || theData.title.trim() === "") {
        alert(
          " Titles are required, but it appears a title field is not filled in. Please find the empty title field and add the title before submitting the form."
        );
        return;
      }
      if (!theData.hasOwnProperty("answer") || theData.answer.trim() === "") {
        alert(
          " Answers are required, but it appears an answer field is not filled in. Please find the empty answer field and add the answer before submitting the form."
        );
        return;
      }
      if (user && user.isAdmin == true) {
        addDocToDB({ user, theData })
          .then((res) => {
            if (res.hasOwnProperty("status") && res.status <= 200) {
              setSubmitSuccess(
                "Success! The question was added to the question library."
              );
            } else {
              alert(
                "There was an error trying to save the question. Error: " +
                  res.message
              );
            }
          })
          .catch((err) => {
            alert(
              "There was an error trying to save the question. Error: " + err
            );
            console.log(
              "%cThere was an error trying to save the question. Error: ",
              "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
              err
            );
          });
      } else {
        const questionAdminEmail = "general@glassinteractive.com";
        const subject = "A New Question for the Interview Questions Tool";
        const body = `A new question is being offered: ${JSON.stringify(
          theData
        )}`;
        window.open(
          `mailto:${questionAdminEmail}?subject=${subject}l&body=${body}`
        );
        setSubmitSuccess("Success! The Question form(s) have been sent.");
      }
    }
  }

  return (
    <Fragment>
      {!submitSuccess && (
        <form
          action=""
          id="add-quest-form"
          className={
            styles["inner-wrap"] +
            " " +
            styles["form"] +
            " " +
            styles["add-quest-form"]
          }
        >
          <div className={styles["inner-wrap"]}>
            {formJSX.map((formElms) => formElms)}
            <PushButton
              inputOrButton="button"
              id="quest-submit-btn"
              colorType="primary"
              value="Add another Question"
              data=""
              size="small"
              onClick={addAnotherQuestionFormButtonHandler}
            >
              Add another Question
            </PushButton>
          </div>

          <PushButton
            inputOrButton="input"
            type="submit"
            id="quest-submit-btn"
            colorType="primary"
            value="Submit"
            data=""
            size="small"
            onClick={submitButtonHandler}
          >
            Submit
          </PushButton>
        </form>
      )}
      {submitSuccess && (
        <div className={styles["success-wrap"]}>
          <p>{submitSuccess}</p>
        </div>
      )}
    </Fragment>
  );
}
export default AddAQuestionForm;
