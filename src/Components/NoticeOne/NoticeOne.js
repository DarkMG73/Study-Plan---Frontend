import styles from "./NoticeOne.module.css";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const NoticeOne = () => {
  const { content } = useSelector((state) => state.contentData);
  const [noticeOneData, setNoticeOneData] = useState({});

  useEffect(() => {
    if (content) {
      Object.keys(content).forEach((key) =>
        Object.entries(content[key]).forEach((entry) => {
          const test =
            entry[0].includes("type") && entry[1].includes("noticeOne");
          if (test) setNoticeOneData(content[key]);
        })
      );
    }
  }, [content]);

  return (
    <div className={styles["noticeOne-container"]}>
      <a
        name="noticeOne"
        href="#noticeOne"
        className={styles["anchor-page-bookmark"]}
      >
        <span></span>
      </a>
      <div className={styles["noticeOne-text-container"]}>
        {(noticeOneData.imageOneURL || noticeOneData.title) && (
          <div className={styles["title-container"]}>
            {noticeOneData.imageOneURL && (
              <div className={styles["image-wrap"]}>
                {" "}
                <img
                  src={noticeOneData.imageOneURL}
                  className={
                    styles["image"] +
                    " " +
                    styles["image-one"] +
                    " " +
                    styles["content"]
                  }
                  alt={noticeOneData.title + " fist image"}
                />
              </div>
            )}
            {noticeOneData.title && (
              <div className={styles["sub-title-background"]}>
                <h3 className={`sub-title ${styles["sub-title"]}`}>
                  {noticeOneData.title}
                </h3>
              </div>
            )}
          </div>
        )}
        {noticeOneData.text && (
          <p
            className={
              styles["text"] +
              " " +
              styles["text-one"] +
              " " +
              styles["content"]
            }
          >
            {noticeOneData.text}
          </p>
        )}
        {(noticeOneData.imageOneURL || noticeOneData.textTwo) && (
          <div
            className={
              styles["text-pic-container"] +
              " " +
              styles["text-pic-container-two"]
            }
          >
            {" "}
            {noticeOneData.imageTwoURL && (
              <div className={styles["image-wrap"]}>
                <img
                  src={noticeOneData.imageTwoURL}
                  className={
                    styles["image"] +
                    " " +
                    styles["image-two"] +
                    " " +
                    styles["content"]
                  }
                  alt={noticeOneData.title + " second image"}
                />
              </div>
            )}{" "}
            {noticeOneData.textTwo && (
              <p
                className={
                  styles["text"] +
                  " " +
                  styles["text-two"] +
                  " " +
                  styles["content"]
                }
              >
                {noticeOneData.textTwo}
              </p>
            )}{" "}
          </div>
        )}
        {(noticeOneData.imageThreeURL || noticeOneData.textThree) && (
          <div
            className={
              styles["text-pic-container"] +
              " " +
              styles["text-pic-container-three"]
            }
          >
            {noticeOneData.textThree && (
              <p
                className={
                  styles["text"] +
                  " " +
                  styles["text-three"] +
                  " " +
                  styles["content"]
                }
              >
                {noticeOneData.textThree}
              </p>
            )}
            {noticeOneData.imageThreeURL && (
              <div className={styles["image-wrap"]}>
                <img
                  src={noticeOneData.imageThreeURL}
                  className={
                    styles["image"] +
                    " " +
                    styles["image-three"] +
                    " " +
                    styles["content"]
                  }
                  alt={noticeOneData.title + " third image"}
                />{" "}
              </div>
            )}
          </div>
        )}
        {(noticeOneData.imageFourURL || noticeOneData.textFour) && (
          <div
            className={
              styles["text-pic-container"] +
              " " +
              styles["text-pic-container-four"]
            }
          >
            {" "}
            {noticeOneData.textFour && (
              <p
                className={
                  styles["text"] +
                  " " +
                  styles["text-four"] +
                  " " +
                  styles["content"]
                }
              >
                {noticeOneData.textFour}
              </p>
            )}
            {noticeOneData.imageFourURL && (
              <div className={styles["image-wrap"]}>
                {" "}
                <img
                  src={noticeOneData.imageFourURL}
                  className={
                    styles["image"] +
                    " " +
                    styles["image-four"] +
                    " " +
                    styles["content"]
                  }
                  alt={noticeOneData.title + " fourth image"}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeOne;
