import React, { Fragment } from "react";

const useExtractNestedObjectsToEdit = (props) => {
  const extractNestedObjectsToEdit = (
    obj,
    parentKey,
    parentsParentKey,
    parentMasterID,
    displayConditions,
    styles
  ) => {
    if (obj)
      return Object.keys(obj).map((key) => {
        if (typeof obj[key] === "object")
          return (
            <ul
              id={key}
              className={
                styles.subgroup +
                " " +
                styles[!!parentKey && !parentsParentKey && "subgroup-set"] +
                " " +
                styles[!!parentKey && "subgroup-set-child"] +
                " " +
                styles["subgroup-" + key] +
                " " +
                styles[key] +
                " " +
                styles[parentKey] +
                " " +
                styles[parentMasterID]
              }
            >
              <h2
                className={
                  styles["group-title"] +
                  " " +
                  styles[parentKey] +
                  " " +
                  styles.title
                }
              >
                {obj[key] && obj[key].hasOwnProperty("title") ? (
                  <Fragment>
                    <div>{obj[key].title}</div>
                    <div>{key}</div>
                  </Fragment>
                ) : (
                  key
                )}
              </h2>
              {extractNestedObjectsToEdit(
                obj[key],
                key,
                parentKey,
                parentMasterID ? parentMasterID : key,
                displayConditions,
                styles
              )}

              {!parentMasterID && (
                <button
                  className={styles["submit-form-button"]}
                  value={key}
                  parentmasterid={key}
                  onClick={submitFormButtonHandler}
                >
                  Submit Changes <span>{key}</span>
                </button>
              )}
            </ul>
          );
        return (
          <li
            className={
              styles[
                "protectedHidden-" +
                  (!showProtectedHidden &&
                    displayConditions.protectedHidden.includes(key))
              ] +
              " " +
              styles[parentKey] +
              " " +
              styles[parentKey + "-" + key] +
              " " +
              styles[key]
            }
          >
            {key === "_id" && <h4 name={parentKey + "-" + key}>{obj[key]}</h4>}
            {key !== "_id" &&
              !displayConditions.isBoolean.includes(key) &&
              !displayConditions.isDate.includes(key) &&
              !displayConditions.isURL.includes(key) && (
                <Fragment>
                  {" "}
                  <label
                    for={parentKey + "-" + key}
                    className={
                      styles[
                        "protectedVisible-" +
                          (displayConditions.protectedVisible.includes(key) &&
                            !unlockProtectedVisible)
                      ]
                    }
                  >
                    {key}:
                  </label>
                  <textarea
                    key={parentKey + "-" + key}
                    name={parentKey + "-" + key}
                    category={obj[key]}
                    placeholder={key}
                    title={key}
                    parentkey={parentKey}
                    parentsparentkey={parentsParentKey}
                    parentmasterid={parentMasterID}
                    onChange={addInputData}
                    className={
                      styles[
                        "protectedVisible-" +
                          (displayConditions.protectedVisible.includes(key) &&
                            !unlockProtectedVisible)
                      ]
                    }
                  >
                    {obj[key]}
                  </textarea>
                </Fragment>
              )}
            {displayConditions.isBoolean.includes(key) && (
              <Fragment>
                <label
                  for={parentKey + "-" + key}
                  className={
                    styles[
                      "protectedHidden-" +
                        displayConditions.protectedHidden.includes(key)
                    ] +
                    " " +
                    styles[
                      "protectedVisible-" +
                        (displayConditions.protectedVisible.includes(key) &&
                          !unlockProtectedVisible)
                    ]
                  }
                >
                  {key}:
                </label>
                <select
                  key={parentKey + "-" + key}
                  name={parentKey + "-" + key}
                  category={obj[key]}
                  placeholder={key}
                  title={key}
                  parentkey={parentKey}
                  parentsparentkey={parentsParentKey}
                  parentmasterid={parentMasterID}
                  onChange={addInputData}
                  className={
                    styles[
                      "protectedHidden-" +
                        displayConditions.protectedHidden.includes(key)
                    ] +
                    " " +
                    styles[
                      "protectedVisible-" +
                        (displayConditions.protectedVisible.includes(key) &&
                          !unlockProtectedVisible)
                    ]
                  }
                >
                  <option selected={obj[key] == true}>True</option>
                  <option selected={obj[key] == false}>False</option>
                  {obj[key]}
                </select>
              </Fragment>
            )}
            {displayConditions.isDate.includes(key) && (
              <Fragment>
                <label
                  for={parentKey + "-" + key}
                  className={
                    styles[
                      "protectedHidden-" +
                        displayConditions.protectedHidden.includes(key)
                    ] +
                    " " +
                    styles[
                      "protectedVisible-" +
                        (displayConditions.protectedVisible.includes(key) &&
                          !unlockProtectedVisible)
                    ]
                  }
                >
                  {key}:
                </label>
                <input
                  key={parentKey + "-" + key}
                  name={parentKey + "-" + key}
                  type="datetime-local"
                  placeholder={obj[key]}
                  title={key}
                  parentkey={parentKey}
                  parentsparentkey={parentsParentKey}
                  parentmasterid={parentMasterID}
                  onChange={addInputData}
                  defaultValue={new Date(
                    new Date(obj[key]).getTime() -
                      new Date().getTimezoneOffset() * 60000
                  )
                    .toISOString()
                    .slice(0, 19)}
                  className={
                    styles[
                      "protectedHidden-" +
                        displayConditions.protectedHidden.includes(key)
                    ] +
                    " " +
                    styles[
                      "protectedVisible-" +
                        (displayConditions.protectedVisible.includes(key) &&
                          !unlockProtectedVisible)
                    ]
                  }
                />
              </Fragment>
            )}
          </li>
        );
      });
  };
  return extractNestedObjectsToEdit;
};

export default useExtractNestedObjectsToEdit;
