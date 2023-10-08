import { formInputDataActions as allFormInputDataActions } from "../store/formInputDataSlice";
import { sha256 } from "js-sha256";
import { useDispatch } from "react-redux";
const useProcessAllFormInputData = () => {
  const dispatch = useDispatch();
  const outputFunction = (props) => {
    const {
      user,

      allFormInputData,
      getSchemaForStudyPlanItem,
      saveManyStudyPlanItems,
      getSchemaForContentItem,
      saveManyContentItems,
    } = props;
    if (allFormInputData && allFormInputData.allNewForms && user) {
      let getSchema = getSchemaForStudyPlanItem;
      let saveManyItems = saveManyStudyPlanItems;
      Object.keys(allFormInputData.allNewForms).forEach((formName) => {
        for (const categoryName in allFormInputData.allNewForms[formName]) {
          if (categoryName === "content") {
            getSchema = getSchemaForContentItem;
            saveManyItems = saveManyContentItems;
          }
        }
      });

      getSchema()
        .then((schema) => {
          const outputDataArray = [];
          const requiredFields = [];
          const groomedBlankForm = {};

          /////// Functions for later use ///////
          const lookForMissingRequirements = (measureArray, testObj) => {
            const filteredTestObj = {};
            for (const [key, value] of Object.entries(testObj)) {
              const groomedValue =
                value.constructor === String ? value.replace(/\s/g, "") : value;
              if (groomedValue !== "") filteredTestObj[key] = groomedValue;
            }
            const missingRequiredFields = measureArray.filter(
              (requiredFiledName) =>
                !Object.keys(filteredTestObj).includes(requiredFiledName)
            );
            return missingRequiredFields;
          };

          const flattenNestedObjToArr = (nestedObj) => {
            const outputArray = [];
            // new-form
            for (const l1Key in nestedObj) {
              // StudyPlan
              for (const l2Key in nestedObj[l1Key]) {
                // The base form
                const newObject = {};
                for (const l3Key in nestedObj[l1Key][l2Key]) {
                  newObject[l3Key] = nestedObj[l1Key][l2Key][l3Key];
                }
                outputArray.push(newObject);
              }
            }
            return outputArray;
          };

          /////// Begin processing  ///////
          // Prepare blank form and required fields
          for (const schemaKey in schema.tree) {
            if (schemaKey === "_id") continue;
            if (
              schema.tree[schemaKey].hasOwnProperty("required") &&
              schema.tree[schemaKey].required
            )
              requiredFields.push(schemaKey);

            groomedBlankForm[schemaKey] = "";
          }

          const flatInputDataArray = flattenNestedObjToArr(
            allFormInputData.allNewForms,
            2
          );

          // Check requirements
          const missingRequiredFields = [];
          flatInputDataArray.forEach((form) => {
            missingRequiredFields.push(
              lookForMissingRequirements(requiredFields, form)
            );
          });

          const cleanMissingFieldsArray = new Set();
          missingRequiredFields.forEach((arr) => {
            if (arr) arr.forEach((value) => cleanMissingFieldsArray.add(value));
          });

          if (cleanMissingFieldsArray.size > 0) {
            const errorMessage =
              "Unfortunately, there is missing required data preventing this from submitting. Please fill out the " +
              [...cleanMissingFieldsArray]
                .toString()
                .replace(/,(?=[^,]+$)/, ", and ") +
              " fields on each form.";
            alert(errorMessage);
            return;
          }

          // Requirements met and ready to prepare upload data
          const newFormData = flatInputDataArray.map((formData) => {
            const newForm = { ...groomedBlankForm };
            Object.keys(newForm).forEach((key) => {
              let value = formData[key] ? formData[key] : newForm[key];

              // Handle special identifier
              const date = new Date();
              let year = date.getFullYear();
              if (key === "identifier") {
                const hashID = sha256(JSON.stringify(formData["title"]));
                value = year + "-" + hashID;
              }

              // Special dates
              if (key === "createdAt" || key === "updatedAt") {
                value = date;
              }

              newForm[key] = value;
            });
            return newForm;
          });

          outputDataArray.push(...newFormData);
          saveManyItems({ user, outputDataArray }).then((data) => {
            console.log("Success! An item has been saved to the studyPlan.");
            dispatch(allFormInputDataActions.resetSubmitAllNewForms());
          });
        })
        .catch((err) => {
          console.log("ERROR GETTING SCHEMA: ", err);
          throw Error("ERROR GETTING SCHEMA: " + err);
        });
    }
  };

  return outputFunction;
};

export default useProcessAllFormInputData;
