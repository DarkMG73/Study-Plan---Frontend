import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Timer.module.css";
import { timerActions } from "../../store/timerSlice";

function Timer() {
  const time = useSelector((state) => state.timer.time);

  const timerRunning = useSelector((state) => state.timer.timerRunning);

  const dispatch = useDispatch();

  useEffect(() => {
    let timer = null;
    if (timerRunning) {
      timer = setInterval(() => {
        dispatch(timerActions.add());
      }, 1000);
    } else if (!timerRunning && time !== 0) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [timerRunning, time]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    const timeDisplay =
      minutes.toString().padStart(2, "0") +
      ":" +
      seconds.toString().padStart(2, "0");
    return timeDisplay;
  };
  const formattedTime = formatTime(time);
  return (
    <div id="timer-wrap" className={styles["timer-wrap"]}>
      <span id="timer" className={styles.timer}>
        {formattedTime}
      </span>
    </div>
  );
}

export default Timer;
