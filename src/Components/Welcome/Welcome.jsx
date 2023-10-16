import React from "react";
import Styles from "./Welcome.module.scss";

const Welcome = () => {
  return (
    <div className={Styles["welcome-container"]}>
      <div className={Styles["text-container"]}>
        <h2>Welcome!</h2>
        Time to get started on your journey!
        <p>
          First, this is NOT a todo list or planner app. This is a tool to
          effectively take one huge, possibly overwhelming goal and provide an
          easy space to quickly break it down into the steps to conquer...no
          matter how small, large, easy or difficult...and actually work each
          step and achieve the main goal.
        </p>
        <p>
          Start with one huge main goal. Quickly put it in. That is what every
          item added after this point will support. Next, add two or three
          sub-goals that are needed to achieve the main goal. THen add any other
          sup-goals to support those two or three support goals. From there find
          corses, books, tutorials, projects...anything...as a step to support
          each sub-goal.
        </p>
        <p>
          Assuming you use the ""Goal or Step this Directly Works Towards" (and
          you will need to), you will end up with just one goal in the Goals &
          Curriculum section that, when opened, will reveals the tree of goals
          and steps to get there.
        </p>
        <p>
          Syllabus section provides an organized list of steps. Work and
          complete each of these steps. Add new steps as you move forward in
          this journey and learn more of what is needed.
        </p>
        <p>
          When every step is completed, you will have achieved the main goal!
        </p>
        <h3>Basic Use</h3>
        <ol>
          {" "}
          <li>
            click the "Add to Study Plan button" to open the new entry form.
          </li>
          <li>
            Fill out the small form. The name and type are required, and the
            "Goal or Step this Directly Works Towards" setting is important to
            be filled out for every item except one main goal.
          </li>
          <li>Submit the form using the button at the bottom.</li>
          <li>
            Make sure there is no more or less than one goal showing in the
            Goals and Curriculum section. opening this goal will reveal all
            supporting goals and steps.
          </li>
          <li>
            The Syllabus section shows all of the steps in order of the priority
            you set. WOrk this list from the highest priority first. (of course,
            you can change the sort order of these items with this sort tool,
            but it will always go back to sorting be priority).
          </li>
          <li>
            Mark the "Status" as you progress through a step to keep a clear
            view of where you are at with each item.{" "}
          </li>
          <li>
            When finished, fill out the "Skill Demonstrations" boxes with detail
            about what you did, what you learned and, ideally, specific
            takeaways that can be used later on a resume or as part of
            conversations at an interview. A link box is provided if you have a
            link to where an example of what you created would be.
          </li>
          <li>
            Mark the "Status" as 100 and click the "Complete" button. If you
            feel you need to come back at a later date and review the material,
            click the Review Needed? button.
          </li>
          <li>
            Move on to the next item in the Syllabus list until every ons is
            completed.
          </li>
          <li>
            At this point, <b>you have achieved your main goal!</b> Time to
            celebrate briefly, then get to work using this new knowledge to
            improve your life and the lives of others.
          </li>
        </ol>
        <p>
          <b>IMPORTANT NOTE</b>:{" "}
          <i>
            The most important setting in any new addition here is the
            aforementioned "Goal or Step this Directly Works Towards" dropdown
            menu. It will be empty when making your original main goal, but with
            each subsequent goal or step all previous goals or steps will be
            available to select. THis directly points them towards some part of
            your main goal. If you find yourself adding something that does not
            actually support an existing goal or step, either do not add it
            (because it is not actually helping you) or mark the "Type" setting
            as "Hold" until you figure where it fits into this journey to the
            one main goal. When it is time to add it to the flow, just change
            the Type to a Step or Goal.
          </i>
        </p>
      </div>
    </div>
  );
};

export default Welcome;
