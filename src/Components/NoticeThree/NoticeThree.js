import styles from "./NoticeThree.module.css";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const NoticeThree = () => {
  const { content } = useSelector((state) => state.contentData);
  const [noticeThreeData, setNoticeThreeData] = useState({});

  useEffect(() => {
    if (content) {
      Object.keys(content).forEach((key) =>
        Object.entries(content[key]).forEach((entry) => {
          const test =
            entry[0].includes("type") && entry[1].includes("noticeThree");
          if (test) setNoticeThreeData(content[key]);
        })
      );
    }
  }, [content]);

  return (
    <div className={styles["noticeThree-container"]}>
      <div className={styles["noticeThree-text-container"]}>
        {(noticeThreeData.imageOneURL || noticeThreeData.title) && (
          <div className={styles["title-container"]}>
            {noticeThreeData.imageOneURL && (
              <div className={styles["image-wrap"]}>
                {" "}
                <img
                  src={noticeThreeData.imageOneURL}
                  className={
                    styles["image"] +
                    " " +
                    styles["image-one"] +
                    " " +
                    styles["content"]
                  }
                  alt={noticeThreeData.title + " first image "}
                />
              </div>
            )}
            {noticeThreeData.title && (
              <div className={styles["sub-title-background"]}>
                {" "}
                <a
                  name="noticeThree"
                  href="#noticeThree"
                  className={styles["anchor-page-bookmark"]}
                >
                  <span></span>
                </a>
                <h3 className={`sub-title ${styles["sub-title"]}`}>
                  {noticeThreeData.title}
                </h3>{" "}
              </div>
            )}
          </div>
        )}
        {noticeThreeData.text && (
          <p
            className={
              styles["text"] +
              " " +
              styles["text-one"] +
              " " +
              styles["content"]
            }
          >
            {noticeThreeData.text}
          </p>
        )}
        {(noticeThreeData.imageOneURL || noticeThreeData.textTwo) && (
          <div
            className={
              styles["text-pic-container"] +
              " " +
              styles["text-pic-container-two"]
            }
          >
            {" "}
            {noticeThreeData.imageTwoURL && (
              <div className={styles["image-wrap"]}>
                <img
                  src={noticeThreeData.imageTwoURL}
                  className={
                    styles["image"] +
                    " " +
                    styles["image-two"] +
                    " " +
                    styles["content"]
                  }
                  alt={noticeThreeData.title + " second image "}
                />
              </div>
            )}{" "}
            {noticeThreeData.textTwo && (
              <p
                className={
                  styles["text"] +
                  " " +
                  styles["text-two"] +
                  " " +
                  styles["content"]
                }
              >
                {noticeThreeData.textTwo}
              </p>
            )}{" "}
          </div>
        )}
        {(noticeThreeData.imageThreeURL || noticeThreeData.textThree) && (
          <div
            className={
              styles["text-pic-container"] +
              " " +
              styles["text-pic-container-three"]
            }
          >
            {noticeThreeData.textThree && (
              <p
                className={
                  styles["text"] +
                  " " +
                  styles["text-three"] +
                  " " +
                  styles["content"]
                }
              >
                {noticeThreeData.textThree}
              </p>
            )}
            {noticeThreeData.imageThreeURL && (
              <div className={styles["image-wrap"]}>
                <img
                  src={noticeThreeData.imageThreeURL}
                  className={
                    styles["image"] +
                    " " +
                    styles["image-three"] +
                    " " +
                    styles["content"]
                  }
                  alt={noticeThreeData.title + " third image "}
                />{" "}
              </div>
            )}
          </div>
        )}
        {(noticeThreeData.imageFourURL || noticeThreeData.textFour) && (
          <div
            className={
              styles["text-pic-container"] +
              " " +
              styles["text-pic-container-four"]
            }
          >
            {" "}
            {noticeThreeData.textFour && (
              <p
                className={
                  styles["text"] +
                  " " +
                  styles["text-four"] +
                  " " +
                  styles["content"]
                }
              >
                {noticeThreeData.textFour}
              </p>
            )}
            {noticeThreeData.imageFourURL && (
              <div className={styles["image-wrap"]}>
                {" "}
                <img
                  src={noticeThreeData.imageFourURL}
                  className={
                    styles["image"] +
                    " " +
                    styles["image-four"] +
                    " " +
                    styles["content"]
                  }
                  alt={noticeThreeData.title + " fourth image "}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeThree;
