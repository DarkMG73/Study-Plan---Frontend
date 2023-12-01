import styles from "./NoticeTwo.module.scss";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const NoticeTwo = () => {
  const { content } = useSelector((state) => state.contentData);
  const [noticeTwoData, setNoticeTwoData] = useState({});

  useEffect(() => {
    if (content) {
      Object.keys(content).forEach((key) =>
        Object.entries(content[key]).forEach((entry) => {
          const test =
            entry[0].includes("type") && entry[1].includes("noticeTwo");
          if (test) setNoticeTwoData(content[key]);
        })
      );
    }
  }, [content]);

  return (
    <div className={styles["noticeTwo-container"]}>
      <a
        name="noticeTwo"
        href="#noticeTwo"
        className={styles["anchor-page-bookmark"]}
      >
        <span></span>
      </a>
      <div
        className={styles["noticeTwo-fixed-image-container"]}
        style={{ backgroundImage: `url(${noticeTwoData.imageOneURL})` }}
      >
        {(noticeTwoData.imageOneURL || noticeTwoData.title) && (
          <div className={styles["title-container"]}>
            {noticeTwoData.title && (
              <div className={styles["sub-title-background"]}>
                <h3 className={`sub-title ${styles["sub-title"]}`}>
                  {noticeTwoData.title}
                </h3>{" "}
                {noticeTwoData.text && (
                  <p
                    className={
                      styles["text"] +
                      " " +
                      styles["text-one"] +
                      " " +
                      styles["content"]
                    }
                  >
                    {noticeTwoData.text}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <div className={styles["noticeTwo-text-container"]}>
        {(noticeTwoData.imageOneURL || noticeTwoData.textTwo) && (
          <div
            className={
              styles["text-pic-container"] +
              " " +
              styles["text-pic-container-two"]
            }
          >
            {" "}
            {noticeTwoData.imageTwoURL && (
              <div className={styles["image-wrap"]}>
                <img
                  src={noticeTwoData.imageTwoURL}
                  className={
                    styles["image"] +
                    " " +
                    styles["image-two"] +
                    " " +
                    styles["content"]
                  }
                  alt={noticeTwoData.title + " photo 1"}
                />
              </div>
            )}{" "}
            {noticeTwoData.textTwo && (
              <p
                className={
                  styles["text"] +
                  " " +
                  styles["text-two"] +
                  " " +
                  styles["content"]
                }
              >
                {noticeTwoData.textTwo}
              </p>
            )}{" "}
          </div>
        )}
        {(noticeTwoData.imageThreeURL || noticeTwoData.textThree) && (
          <div
            className={
              styles["text-pic-container"] +
              " " +
              styles["text-pic-container-three"]
            }
          >
            {noticeTwoData.textThree && (
              <p
                className={
                  styles["text"] +
                  " " +
                  styles["text-three"] +
                  " " +
                  styles["content"]
                }
              >
                {noticeTwoData.textThree}
              </p>
            )}
            {noticeTwoData.imageThreeURL && (
              <div className={styles["image-wrap"]}>
                <img
                  src={noticeTwoData.imageThreeURL}
                  className={
                    styles["image"] +
                    " " +
                    styles["image-three"] +
                    " " +
                    styles["content"]
                  }
                  alt={noticeTwoData.title + " photo 2"}
                />
              </div>
            )}
          </div>
        )}
        {(noticeTwoData.imageFourURL || noticeTwoData.textFour) && (
          <div
            className={
              styles["text-pic-container"] +
              " " +
              styles["text-pic-container-four"]
            }
          >
            {" "}
            {noticeTwoData.textFour && (
              <p
                className={
                  styles["text"] +
                  " " +
                  styles["text-four"] +
                  " " +
                  styles["content"]
                }
              >
                {noticeTwoData.textFour}
              </p>
            )}
            {noticeTwoData.imageFourURL && (
              <div className={styles["image-wrap"]}>
                {" "}
                <img
                  src={noticeTwoData.imageFourURL}
                  className={
                    styles["image"] +
                    " " +
                    styles["image-four"] +
                    " " +
                    styles["content"]
                  }
                  alt={noticeTwoData.title + " photo 3"}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeTwo;
