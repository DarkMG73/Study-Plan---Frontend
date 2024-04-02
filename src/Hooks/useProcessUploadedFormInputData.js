import { useSelector } from "react-redux";
// import { sha256 } from "js-sha256";

const useProcessUploadedFormInputData = () => {
  const studyPlanItemSchema = useSelector(
    (state) => state.studyPlanData.schema,
  );
  const outputFunction = (props) => {
    const { user, dataForSendingToDB } = props;
    const unusedFieldsForGoals = [
      "url",
      "priority",
      "method",
      "lectureTime",
      "labTime",
      "author",
      "status",
      "platform",
      "method",
      "acomp",
    ];
    const unusedFieldsForHolds = ["priority", "status", "acomp", "start"];

    if (dataForSendingToDB && user) {
      let schema = studyPlanItemSchema;
      // Object.keys(dataForSendingToDB).forEach((formName) => {
      //   for (const categoryName in dataForSendingToDB[formName]) {
      //     if (categoryName === "content") {
      //       schema = getSchemaForContentItem;
      //       saveManyItems = saveManyContentItems;
      //     }
      //   }
      // });

      const processWithSchema = (schema) => {
        const outputDataArray = [];
        const requiredFields = [];
        const groomedBlankForm = {};

        /////// Functions ///////
        const lookForMissingRequirements = (measureArray, testObj) => {
          const filteredTestObj = {};
          for (const [key, value] of Object.entries(testObj)) {
            const groomedValue =
              value.constructor === String ? value.replace(/\s/g, "") : value;
            if (groomedValue !== "") filteredTestObj[key] = groomedValue;
          }
          const missingRequiredFields = measureArray.filter(
            (requiredFiledName) =>
              !Object.keys(filteredTestObj).includes(requiredFiledName),
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
        for (const schemaKey in schema) {
          if (schemaKey === "_id") continue;
          if (
            Object.hasOwn(schema[schemaKey], "required") &&
            schema[schemaKey].required
          )
            requiredFields.push(schemaKey);

          groomedBlankForm[schemaKey] = "";
        }

        const flatInputDataArray = flattenNestedObjToArr(dataForSendingToDB, 2);

        // Check requirements
        const missingRequiredFields = [];
        flatInputDataArray.forEach((form) => {
          missingRequiredFields.push(
            lookForMissingRequirements(requiredFields, form),
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
            // let year = date.getFullYear();

            // if (key === "identifier") {
            //   const hashID = sha256(JSON.stringify(formData["name"]));

            //   value = year + "-" + hashID;
            // }

            // Special dates
            if (key === "createdAt" || key === "updatedAt") {
              value = date;
            }

            if (key === "priority" && value === "") {
              value = "0";
            }

            // Clean Goals unused data (available before selecting type "goal")
            if (Object.hasOwn(formData, "type") && formData.type === "goal") {
              if (unusedFieldsForGoals.includes(key)) {
                value = "";
              }
            }

            if (Object.hasOwn(formData, "type") && formData.type === "hold") {
              if (unusedFieldsForHolds.includes(key)) {
                value = "";
              }
            }
            newForm[key] = value;
          });
          return newForm;
        });

        outputDataArray.push(...newFormData);

        return outputDataArray;
      };

      const data = processWithSchema(schema);
      return data;
    }
  };

  return outputFunction;
};

export default useProcessUploadedFormInputData;
