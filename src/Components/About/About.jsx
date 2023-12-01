import styles from "./About.module.scss";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const About = () => {
  const { content } = useSelector((state) => state.contentData);
  const [aboutData, setAboutData] = useState({});

  useEffect(() => {
    if (content) {
      Object.keys(content).forEach((key) =>
        Object.entries(content[key]).forEach((entry) => {
          const test = entry[0].includes("type") && entry[1] === "about";
          if (test) setAboutData(content[key]);
        })
      );
    }
  }, [content]);

  return (
    <div className={styles["about-container"]}>
      <div className={styles["about-text-container"]}>
        {(aboutData.imageOneURL || aboutData.title) && (
          <div className={styles["title-container"]}>
            {aboutData.imageOneURL && (
              <div className={styles["image-wrap"]}>
                <img
                  src={aboutData.imageOneURL}
                  className={
                    styles["image"] +
                    " " +
                    styles["image-one"] +
                    " " +
                    styles["content"]
                  }
                  alt={aboutData.title + " first image "}
                />
              </div>
            )}

            {aboutData.title && (
              <div className={styles["sub-title-background"]}>
                <a
                  name="about"
                  href="#about"
                  className={styles["anchor-page-bookmark"]}
                >
                  About page bookmark
                </a>
                <br />
                <h3 className={`sub-title ${styles["sub-title"]}`}>
                  {aboutData.title}
                </h3>
              </div>
            )}
          </div>
        )}
        {aboutData.text && (
          <p
            className={
              styles["text"] +
              " " +
              styles["text-one"] +
              " " +
              styles["content"]
            }
          >
            {aboutData.text}
          </p>
        )}
        {(aboutData.imageOneURL || aboutData.textTwo) && (
          <div
            className={
              styles["text-pic-container"] +
              " " +
              styles["text-pic-container-two"]
            }
          >
            {aboutData.imageTwoURL && (
              <div className={styles["image-wrap"]}>
                <img
                  src={aboutData.imageTwoURL}
                  className={
                    styles["image"] +
                    " " +
                    styles["image-two"] +
                    " " +
                    styles["content"]
                  }
                  alt={aboutData.title + " second image "}
                />
              </div>
            )}{" "}
            {aboutData.textTwo && (
              <p
                className={
                  styles["text"] +
                  " " +
                  styles["text-two"] +
                  " " +
                  styles["content"]
                }
              >
                {aboutData.textTwo}
              </p>
            )}{" "}
          </div>
        )}
        {(aboutData.imageThreeURL || aboutData.textThree) && (
          <div
            className={
              styles["text-pic-container"] +
              " " +
              styles["text-pic-container-three"]
            }
          >
            {aboutData.textThree && (
              <p
                className={
                  styles["text"] +
                  " " +
                  styles["text-three"] +
                  " " +
                  styles["content"]
                }
              >
                {aboutData.textThree}
              </p>
            )}
            {aboutData.imageThreeURL && (
              <div className={styles["image-wrap"]}>
                <img
                  src={aboutData.imageThreeURL}
                  className={
                    styles["image"] +
                    " " +
                    styles["image-three"] +
                    " " +
                    styles["content"]
                  }
                  alt={aboutData.title + " third image "}
                />{" "}
              </div>
            )}
          </div>
        )}
        {(aboutData.imageFourURL || aboutData.textFour) && (
          <div
            className={
              styles["text-pic-container"] +
              " " +
              styles["text-pic-container-four"]
            }
          >
            {" "}
            {aboutData.textFour && (
              <p
                className={
                  styles["text"] +
                  " " +
                  styles["text-four"] +
                  " " +
                  styles["content"]
                }
              >
                {aboutData.textFour}
              </p>
            )}
            {aboutData.imageFourURL && (
              <div className={styles["image-wrap"]}>
                {" "}
                <img
                  src={aboutData.imageFourURL}
                  className={
                    styles["image"] +
                    " " +
                    styles["image-four"] +
                    " " +
                    styles["content"]
                  }
                  alt={aboutData.title + " fourth image "}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default About;
