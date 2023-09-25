import styles from "./WorkArea.module.css";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Iframe from "react-iframe";
import Answer from "../Answer/Answer";
import CollapsibleElm from "../../UI/CollapsibleElm/CollapsibleElm";
import PushButton from "../../UI/Buttons/PushButton/PushButton";
import { ErrorBoundary } from "../../HOC/ErrorHandling/ErrorBoundary/ErrorBoundary";

function WorkArea(props) {
  const [questionCompleted, setQuestionCompleted] = useState(false);
  const { timerRunning, quizInitiated } = useSelector((state) => state.timer);
  const answerElm = useRef();
  const [openTab, SetOpenTab] = useState(false);

  useEffect(() => {
    props.setScrollToAnswer(answerElm);
  }, []);

  useEffect(() => {
    if (!timerRunning && quizInitiated) {
      setQuestionCompleted(true);
    } else {
      setQuestionCompleted(false);
    }
  }, [timerRunning]);

  const editorTabButtonHandler = (e) => {
    SetOpenTab(!openTab);
  };

  return (
    <div id="work-area" className={styles["outerwrap"]} ref={answerElm}>
      <h2 className="section-title">Answer Workspace</h2>
      <div className={styles["description-text"]}>
        <CollapsibleElm
          id={"column-collapsible-elm"}
          styles={{
            position: "relative",
          }}
          maxHeight="3.5em"
          inputOrButton="button"
          buttonStyles={{
            margin: "0 auto",
            letterSpacing: "0.25em",
            fontVariant: "small-caps",
            minWidth: "5em",
            textAlign: "center",
            display: "flex",
            alignItems: "center",
          }}
          colorType="primary"
          data=""
          size="small"
          buttonTextClosed="Click for Workspace Instructions"
          buttonTextOpened="Hide Workspace Instructions"
        >
          <p>
            <b>
              Use this area as a scratchpad for working out your thoughts. There
              are two editors for this below. This is only a scratchpad and is
              not saved in your question history.
            </b>
          </p>
          <div className={styles["description-text-col-wrap"]}>
            <p>
              <b>Editor</b> 1: A live editor for HTML, CSS & JavaScript. The
              "Rerun" button in the lower corner runs the code. Use your
              browser's dev tools console to see any errors.
            </p>
            <p>
              <b>Editor 2:</b> A JavaScript console with two advantages over the
              browser's console: It is a nicer user experience plus it can be
              opened to a larger side-by-side editor using the "Open in Replit"
              button in the upper right corner.
            </p>
          </div>
        </CollapsibleElm>
      </div>
      <div
        id="user-interaction-area"
        className={styles["user-interaction-area"]}
      >
        {questionCompleted && <Answer />}
        <div className={styles["editor-tab-btn-wrap"]}>
          <PushButton
            inputOrButton="button"
            styles={{}}
            id="editor-button-one"
            colorType={!openTab && "secondary"}
            data={props.data}
            size={props.size}
            onClick={editorTabButtonHandler}
          >
            HTM/CSS/JS Editor
          </PushButton>
          <PushButton
            inputOrButton="button"
            styles={{}}
            id="editor-button-two"
            colorType={openTab && "secondary"}
            data={props.data}
            size={props.size}
            onClick={editorTabButtonHandler}
          >
            Console Style Editor
          </PushButton>
        </div>
        <div
          id="workspace-editor-wrap"
          className={"outer-wrap" + " " + styles["workspace-editor-wrap"]}
        >
          <div
            className={
              styles["editor-tab"] + " " + (openTab === false && styles["open"])
            }
          >
            <ErrorBoundary>
              <Iframe
                styles={{
                  borderRadius: "25px",
                  border: "3px inset #3590bd85",
                }}
                height="400px"
                width="100%"
                scrolling="no"
                title="Workspace for Interview Questions"
                src="https://codepen.io/DarkMG73/embed/RwJvKjX?default-tab=js%2Cresult&editable=true&theme-id=light"
                frameborder="no"
                loading="lazy"
                allowtransparency="true"
                allowfullscreen="true"
              >
                See the Pen{" "}
                <a href="https://codepen.io/DarkMG73/pen/RwJvKjX">
                  Workspace for Interview Questions
                </a>{" "}
                by Mike (<a href="https://codepen.io/DarkMG73">@DarkMG73</a>) on{" "}
                <a href="https://codepen.io">CodePen</a>.
              </Iframe>{" "}
            </ErrorBoundary>
          </div>
          <div
            className={
              styles["editor-tab"] + " " + (openTab === true && styles["open"])
            }
          >
            <ErrorBoundary>
              <Iframe
                styles={{
                  borderRadius: "25px",
                  border: "3px inset #3590bd85",
                }}
                height="400px"
                width="100%"
                src="https://repl.it/@DarkMG73/InterviewQuestionWorkspace?embed=true"
                scrolling="no"
                frameborder="no"
                allowtransparency="true"
                allowfullscreen="true"
                // sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"
              ></Iframe>
            </ErrorBoundary>
          </div>
          <div id="output" className="inner-wrap closed"></div>
        </div>
      </div>
    </div>
  );
}

export default WorkArea;
