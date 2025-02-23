import { useSelector } from "react-redux";
import styles from "./Stats.module.scss";

const Stats = () => {
  const { studyPlan, studyPlanMetadata } = useSelector(
    (state) => state.studyPlanData,
  );
  const totalLabTime =
    studyPlanMetadata &&
    Object.hasOwn(studyPlanMetadata, "labTime") &&
    studyPlanMetadata.labTime[1];
  const totalLectureTime =
    studyPlanMetadata &&
    Object.hasOwn(studyPlanMetadata, "lectureTime") &&
    studyPlanMetadata.lectureTime[1];
  const totalHours = totalLectureTime + totalLabTime;
  const reviewHoursTotal = findAndAddTime("markforreview", studyPlanMetadata);
  const completedHoursTotal = findAndAddTime("markcomplete", studyPlanMetadata);
  const simulatedCollegeCreditHours = (completedHoursTotal / 45).toFixed(1);

  // function addTime(fieldName, studyPlanMetadata) {
  //   let outputTime = 0;
  //   if (studyPlanMetadata && Object.hasOwn(studyPlanMetadata, fieldName))
  //     studyPlanMetadata[fieldName].forEach((time) => {
  //       outputTime += time * 1;
  //     });
  //   return outputTime;
  // }
  function findAndAddTime(fieldName, studyPlanMetadata) {
    let outputTotalHours = 0;
    if (
      studyPlanMetadata &&
      Object.hasOwn(studyPlanMetadata, fieldName) &&
      studyPlanMetadata[fieldName] &&
      studyPlanMetadata[fieldName] !== "false"
    ) {
      studyPlanMetadata[fieldName].forEach((id) => {
        if (id.constructor !== String) return;

        if (
          Object.hasOwn(studyPlan, id) &&
          Object.hasOwn(studyPlan[id], "labTime")
        ) {
          outputTotalHours += studyPlan[id].labTime * 1;
        }
        if (Object.hasOwn(studyPlan[id], "lectureTime")) {
          outputTotalHours += studyPlan[id].lectureTime * 1;
        }
      });
    }

    return Math.round((outputTotalHours + Number.EPSILON) * 100) / 100;
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
          {totalLabTime ? totalLabTime.toFixed(1) : 0}
        </div>
        <div
          className={styles["inner-block"] + " " + styles["lecturehrstotal"]}
        >
          {totalLectureTime ? totalLectureTime : 0}
        </div>
        <div className={styles["totalhours"]}>
          {totalHours ? totalHours.toFixed(1) : 0}
        </div>
      </div>
    </div>
  );
};

export default Stats;
