import React, { useState, useEffect, Fragment, useRef } from "react";
import { useSelector } from "react-redux";
import styles from "./CatalogItemsList.module.css";
import CatalogItemsSubList from "../CatalogItemsSubList/CatalogItemsSubList";
import CatalogItem from "../CatalogItem/CatalogItem";
import {
  updateACatalogItem,
  deleteDocFromDb,
} from "../../../storage/catalogDB";

import {
  updateAContentItem,
  deleteContentDocFromDb,
} from "../../../storage/contentDB";
import CollapsibleElm from "../../../UI/CollapsibleElm/CollapsibleElm";

const CatalogItemsList = (props) => {
  const [refresh, setRefresh] = useState(1);
  const catalogItemsObj = props.catalogItemsObj;
  const { catalogMetadata } = catalogItemsObj;
  let availableServices =
    catalogMetadata && catalogMetadata.hasOwnProperty("availableServices")
      ? [...catalogMetadata.availableServices]
      : [""];
  const user = useSelector((state) => state.auth.user);
  const parentKey = props.parentKey;
  const parentsParentKey = props.parentsParentKey;
  const parentMasterID = props.parentMasterID;
  const section = props.section;
  const subListLevel = props.subListLevel;
  const formInputData = useSelector((state) => state.formInputData);
  const displayConditions = props.displayConditions;
  const onlyList = props.onlyList;
  const [showProtectedHidden, setShowProtectedHidden] = useState(
    props.showProtectedHidden ? props.showProtectedHidden : []
  );
  const showProtectedHiddenRef = useRef();
  showProtectedHiddenRef.current = showProtectedHidden;
  const [unlockProtectedVisible, setUnlockProtectedVisible] = useState(
    props.unlockProtectedVisible ? props.unlockProtectedVisible : []
  );
  const unlockProtectedVisibleRef = useRef();
  unlockProtectedVisibleRef.current = unlockProtectedVisible;
  const [existingFormInputValuesObj, setExistingFormInputValuesObj] = useState(
    {}
  );
  const existingFormInputValuesObjRef = useRef();

  ////////////////////////////////////////////////////////////////
  /// Functionality
  ////////////////////////////////////////////////////////////////
  const updateExistingFormState = (
    parentMasterID,
    parentKey,
    title,
    outputValue
  ) => {
    existingFormInputValuesObjRef.current = outputValue;

    setExistingFormInputValuesObj((prevState) => {
      const outputObj = { ...prevState };

      if (!outputObj.hasOwnProperty(parentMasterID)) {
        outputObj[parentMasterID] = { [title]: outputValue };
      } else if (
        outputObj[parentMasterID].hasOwnProperty(title) &&
        !["String", "Array", "number", "Boolean"].includes(
          outputObj[parentMasterID][title].constructor.name
        )
      ) {
        outputObj[parentMasterID][title] = {
          ...outputObj[parentMasterID][title],
          ...outputValue,
        };
      } else {
        outputObj[parentMasterID][title] = outputValue;
      }

      return outputObj;
    });

    //////
  };

  existingFormInputValuesObjRef.current = existingFormInputValuesObj;

  ////////////////////////////////////////////////////////////////////////
  /// Effects
  ////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    setRefresh(refresh + 1);
  }, [showProtectedHidden, unlockProtectedVisible]);

  useEffect(() => {
    existingFormInputValuesObjRef.current = existingFormInputValuesObj;
  }, [existingFormInputValuesObj]);

  useEffect(() => {}, [existingFormInputValuesObjRef.current]);

  ////////////////////////////////////////////////////////////////////////
  /// HANDLERS
  ////////////////////////////////////////////////////////////////////////
  const unlockProtectedVisibleHandler = (e) => {
    e.preventDefault();
    const buttonMasterID = e.target.value;

    setUnlockProtectedVisible((prevState) => {
      const output = [...prevState];
      if (output.includes(buttonMasterID)) {
        output.splice(output.indexOf(buttonMasterID), 1);
      } else {
        output.push(buttonMasterID);
      }
      return output;
    });
  };

  const showProtectedHiddenHandler = (e) => {
    e.preventDefault();

    const buttonMasterID = e.target.value;
    setShowProtectedHidden((prevState) => {
      const output = [...prevState];
      if (output.includes(buttonMasterID)) {
        output.splice(output.indexOf(buttonMasterID), 1);
      } else {
        output.push(buttonMasterID);
      }
      return output;
    });
  };

  const submitFormButtonHandler = (e) => {
    e.preventDefault();

    const parentMasterID = e.target.getAttribute("parentmasterid");
    const parentSection = e.target.getAttribute("section");
    const updateAnItem =
      parentSection === "content" ? updateAContentItem : updateACatalogItem;
    const rawItemWithNewEdits = { ...catalogItemsObj[parentMasterID] };
    const itemWithNewEdits = {};
    const itemIdentifier = rawItemWithNewEdits.identifier;

    const existingFormEdits = { ...formInputData.existingFormInputDataObj };

    for (const key in existingFormEdits[parentMasterID]) {
      if (key === "sourceURLObj") {
        const newInnerItemWithNewEdits = {
          ...rawItemWithNewEdits[key],
        };

        for (const [entryKey, value] of Object.entries(
          existingFormEdits[parentMasterID][key]
        )) {
          newInnerItemWithNewEdits[entryKey] = value;
        }

        for (const i in newInnerItemWithNewEdits) {
          if (
            !newInnerItemWithNewEdits[i] ||
            newInnerItemWithNewEdits[i] === ""
          ) {
            delete newInnerItemWithNewEdits[i];
          }
        }

        availableServices.forEach((serviceName) => {
          if (!newInnerItemWithNewEdits.hasOwnProperty(serviceName)) {
            newInnerItemWithNewEdits[serviceName] = "";
          } else {
            newInnerItemWithNewEdits[serviceName] =
              existingFormEdits[parentMasterID][key][serviceName];
          }
        });
        itemWithNewEdits[key] = newInnerItemWithNewEdits;
      } else if (
        existingFormEdits[parentMasterID][key] &&
        existingFormEdits[parentMasterID][key].constructor === Object
      ) {
        const newInnerItemWithNewEdits = {};

        for (const innerKey in existingFormEdits[parentMasterID][key]) {
          newInnerItemWithNewEdits[innerKey] =
            existingFormEdits[parentMasterID][key][innerKey];
        }

        if (key == 0) {
          const newKey = Object.keys(newInnerItemWithNewEdits)[0];
          itemWithNewEdits[newKey] = newInnerItemWithNewEdits[newKey];
        } else {
          itemWithNewEdits[key] = { ...newInnerItemWithNewEdits };
        }
      } else {
        itemWithNewEdits[key] = existingFormEdits[parentMasterID][key];
      }
    }

    /* eslint eqeqeq: 0 */
    if (user && user.isAdmin == true) {
      // if (true) {
      updateAnItem(itemIdentifier, itemWithNewEdits, user).then((res) => {
        const status = res.status ? res.status : res.response.status;
        if (status >= 400) {
          alert("There was an error: " + res.response.data.message);
        } else if (status >= 200) {
          alert("Success! The item has been updated.");
          // setInEditMode(false);
        } else {
          alert("there was an error: " + +res.message);
        }
      });
    } else {
      const sendEmail = window.confirm(
        'Thank you for contributing. All contributions must be reviewed before becoming public. Click "OK" to send this via email for review and, if approved, to be included. Click "Cancel" to cancel this and not send an email.'
      );
      if (sendEmail) {
        const questionAdminEmail = "general@glassinteractive.com";
        const subject =
          "A Question Edit Request for the Interview Questions Tool";
        const body = `A question edit is being recommended: ${JSON
          .stringify
          // editedQuestions.current.edits
          ()}`;
        window.open(
          `mailto:${questionAdminEmail}?subject=${subject}l&body=${encodeURIComponent(
            body
          )}`
        );
      }
    }
  };

  const deleteFormButtonHandler = (e) => {
    e.preventDefault();

    const parentMasterID = e.target.getAttribute("parentmasterid");
    const parentSection = e.target.getAttribute("section");
    const itemIdentifier = catalogItemsObj[parentMasterID].identifier;
    const deleteItemFromDB =
      parentSection === "content" ? deleteContentDocFromDb : deleteDocFromDb;
    const confirm = window.confirm(
      "Are you sure you want to delete the " +
        catalogItemsObj[parentMasterID].type +
        ' titled "' +
        catalogItemsObj[parentMasterID].title +
        ' "?'
    );
    if (confirm && user && user.isAdmin == true) {
      // if (true) {

      deleteItemFromDB(itemIdentifier, user).then((res) => {
        const status = res.status ? res.status : res.response.status;
        if (status >= 400) {
          alert("There was an error: " + res.response.data.message);
        } else if (status >= 200) {
          alert("Success! The item has been deleted.");
          // setInEditMode(false);
        } else {
          alert("there was an error: " + +res.message);
        }
      });
    } else if (confirm) {
      const sendEmail = window.confirm(
        'Thank you for contributing. All contributions must be reviewed before becoming public. Click "OK" to send this via email for review and, if approved, to be included. Click "Cancel" to cancel this and not send an email.'
      );
      if (sendEmail) {
        const questionAdminEmail = "general@glassinteractive.com";
        const subject =
          "A Question Edit Request for the Interview Questions Tool";
        const body = `A question edit is being recommended: ${JSON
          .stringify
          // editedQuestions.current.edits
          ()}`;
        window.open(
          `mailto:${questionAdminEmail}?subject=${subject}l&body=${encodeURIComponent(
            body
          )}`
        );
      }
    }
  };

  if (catalogItemsObj)
    return Object.keys(catalogItemsObj).map((key) => {
      if (catalogItemsObj[key] && typeof catalogItemsObj[key] === "object")
        return (
          <ul
            marker="CATALOG-ITEM-LIST"
            section={section}
            key={key}
            id={key}
            className={
              (subListLevel > 0 &&
                styles.subgroup +
                  " " +
                  styles[!!parentKey && !parentsParentKey && "subgroup-set"] +
                  " " +
                  styles[!!parentKey && "subgroup-set-child"] +
                  " " +
                  styles["subgroup-" + key] +
                  " " +
                  styles["sub-level-" + subListLevel]) +
              " " +
              ((!subListLevel || subListLevel <= 0) &&
                styles["master-parent-group"]) +
              " " +
              styles[key] +
              " " +
              styles[parentKey] +
              " " +
              styles[parentMasterID] +
              " " +
              (unlockProtectedVisible.includes(key) && styles["edited-list"]) +
              (props.inModal && styles["in-modal"])
            }
          >
            <CollapsibleElm
              id={key + "-collapsible-elm"}
              styles={{
                position: "relative",
              }}
              maxHeight={"6em"}
              s
              inputOrButton="button"
              buttonStyles={{
                margin: "0 auto",
                padding: "0.5em 2em",
                letterSpacing: "0.25em",
                fontVariant: "small-caps",
                transform: "translateY(5%)",
                transition: "0.7s all ease",
                minWidth: "80%",
                maxWidth: "80%",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                borderRadius: "50px",
                fontFamily: "Arial",
                border: "none",
                boxShadow: "none",
              }}
              colorType="primary"
              data=""
              size="small"
              open={false}
            >
              <h2
                key={styles.title + parentKey}
                className={
                  styles["group-title"] +
                  " " +
                  styles[parentKey] +
                  " " +
                  styles.title
                }
              >
                {catalogItemsObj[key] &&
                catalogItemsObj[key].hasOwnProperty("title") ? (
                  <Fragment>
                    <span className={styles["title"]}>
                      {catalogItemsObj[key].title}
                    </span>
                  </Fragment>
                ) : (
                  key
                )}
              </h2>
              <CatalogItemsSubList
                catalogItemsObj={catalogItemsObj[key]}
                parentKey={key}
                parentsParentKey={parentKey}
                parentMasterID={
                  parentMasterID ? parentMasterID : catalogItemsObj[key]._id
                }
                section={section}
                displayConditions={displayConditions}
                subListLevel={subListLevel}
                unlockProtectedVisible={
                  props.unlockProtectedVisible
                    ? props.unlockProtectedVisible
                    : unlockProtectedVisible
                }
                showProtectedHidden={
                  props.showProtectedHidden
                    ? props.showProtectedHidden
                    : showProtectedHidden
                }
                refresh={refresh}
                onlyList={onlyList}
                emptyForm={props.emptyForm}
              />{" "}
              {!onlyList && !subListLevel && (
                <div className={styles["button-container"]}>
                  <button
                    className={
                      styles["form-button"] + " " + styles["edit-form-button"]
                    }
                    value={key}
                    parentmasterid={key}
                    onClick={unlockProtectedVisibleHandler}
                  >
                    Edit
                  </button>{" "}
                  <button
                    className={
                      styles["form-button"] +
                      " " +
                      styles["show-hidden-form-button"]
                    }
                    value={key}
                    parentmasterid={key}
                    onClick={showProtectedHiddenHandler}
                  >
                    Show Hidden
                  </button>
                  {!onlyList && unlockProtectedVisible.includes(key) && (
                    <Fragment>
                      {" "}
                      <button
                        className={
                          styles["form-button"] +
                          " " +
                          styles["submit-form-button"]
                        }
                        value={key}
                        parentmasterid={key}
                        section={section}
                        onClick={submitFormButtonHandler}
                      >
                        Submit Changes
                      </button>{" "}
                      <button
                        className={
                          styles["form-button"] +
                          " " +
                          styles["delete-form-button"]
                        }
                        value={key}
                        parentmasterid={key}
                        section={section}
                        onClick={deleteFormButtonHandler}
                      >
                        Delete
                      </button>
                    </Fragment>
                  )}
                </div>
              )}{" "}
            </CollapsibleElm>
          </ul>
        );
      return (
        <CatalogItem
          key={key}
          catalogItemsObj={props}
          passedKey={key}
          parentKey={parentKey}
          parentsParentKey={parentsParentKey}
          parentMasterID={parentMasterID}
          displayConditions={displayConditions}
          unlockProtectedVisible={
            props.unlockProtectedVisible
              ? props.unlockProtectedVisible
              : unlockProtectedVisible
          }
          showProtectedHidden={
            props.showProtectedHidden
              ? props.showProtectedHidden
              : showProtectedHidden
          }
          refresh={refresh}
          setExistingFormInputValuesObj={updateExistingFormState}
          emptyForm={props.emptyForm}
          onlyList={onlyList}
        />
      );
    });
  return (
    <div>
      <h2>There are no Category Items to List.</h2>
    </div>
  );
};

export default CatalogItemsList;
