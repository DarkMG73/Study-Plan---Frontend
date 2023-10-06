import { useSelector } from "react-redux";
import styles from "./Stats.module.scss";

const Stats = (props) => {
  const { studyPlan, studyPlanMetadata } = useSelector(
    (state) => state.studyPlanData
  );
  const totalLabTime = studyPlanMetadata && studyPlanMetadata.labTime[1];
  const totalLectureTime =
    studyPlanMetadata && studyPlanMetadata.lectureTime[1];
  const totalHours = totalLectureTime + totalLabTime;
  const reviewHoursTotal = findAndAddTime("markforreview", studyPlanMetadata);
  const completedHoursTotal = findAndAddTime("markcomplete", studyPlanMetadata);
  const simulatedCollegeCreditHours = (completedHoursTotal / 45).toFixed(2);

  function addTime(fieldName, studyPlanMetadata) {
    let outputTime = 0;
    if (studyPlanMetadata && studyPlanMetadata.hasOwnProperty(fieldName))
      studyPlanMetadata[fieldName].forEach((time) => {
        outputTime += time * 1;
      });
    return outputTime;
  }
  function findAndAddTime(fieldName, studyPlanMetadata) {
    let outputTotalHours = 0;
    if (
      studyPlanMetadata &&
      studyPlanMetadata.hasOwnProperty(fieldName) &&
      studyPlanMetadata[fieldName] &&
      studyPlanMetadata[fieldName] !== "false"
    ) {
      studyPlanMetadata[fieldName].forEach((id) => {
        if (id.constructor !== String) return;

        if (
          studyPlan.hasOwnProperty(id) &&
          studyPlan[id].hasOwnProperty("labTime")
        ) {
          outputTotalHours += studyPlan[id].labTime * 1;
        }
        if (studyPlan[id].hasOwnProperty("lectureTime")) {
          outputTotalHours += studyPlan[id].lectureTime * 1;
        }
      });
    }

    return outputTotalHours;
  }

  return (
    <div id="stats-container">
      <div className={styles["block"] + " " + styles["hours-wrap"]}>
        <div
          className={styles["inner-block"] + " " + styles["completehrstotal"]}
        >
          {completedHoursTotal}
        </div>
        <div
          className={styles["inner-block"] + " " + styles["collegecredithours"]}
        >
          {simulatedCollegeCreditHours}
        </div>
        <div
          className={styles["inner-block"] + " " + styles["reviewhrsadjusted"]}
        >
          {reviewHoursTotal}
        </div>
        <div className={styles["inner-block"] + " " + styles["labhrstotal"]}>
          {totalLabTime}
        </div>
        <div
          className={styles["inner-block"] + " " + styles["lecturehrstotal"]}
        >
          {totalLectureTime}
        </div>
        <div className={styles["totalhours"]}>{totalHours}</div>
      </div>
    </div>
  );
};

export default Stats;
