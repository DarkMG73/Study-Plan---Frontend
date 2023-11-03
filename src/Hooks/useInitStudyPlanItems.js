import useSortList from "./useSortList";
import useAssembleStudyPlanList from "./useAssembleStudyPlanList";
import { useSelector } from "react-redux";

const useInitStudyPlanItems = () => {
  const studyPlanItemSchema = useSelector(
    (state) => state.studyPlanData.schema
  );
  const sortList = useSortList();
  const assembleStudyPlanList = useAssembleStudyPlanList();
  const outputFunction = (props) => {
    const {
      typeArray,
      sortMethod,
      dataObjForEdit,
      allStudyPlanItems,
      setAllStudyPlanItems,
      setFormInputData,
    } = props;

    const findDependencies = (objectIdentifier, masterListObj) => {
      const output = [];

      for (const value of Object.values(masterListObj)) {
        if (Object.hasOwn(value, "msup") && value.msup === objectIdentifier)
          output.push(value.identifier);
      }
      return output;
    };

    let schema = studyPlanItemSchema;
    // if (id === "content") {
    //   schema = getSchemaForContentItem;
    // }
    if (!schema) return false;
    const processDataWithSchema = (schema) => {
      // const groomedSchema = {}
      // // Organize Schema
      // orderOfOutputArray.forEach(topic=>{
      //   groomedSchema[topic] = data.tree[topic]
      // })

      // Gather items to list based on typeArray.
      const { groomedOutput, groomedAllItemOutput } = assembleStudyPlanList({
        typeArray,
        keysToUseArray: Object.keys(schema),
        dataObjForEdit,
        allStudyPlanItems,
      });

      ////////////////////////////////////////////////////////////////////////
      /// Sort groomedOutput
      ////////////////////////////////////////////////////////////////////////
      const sortBy = Object.keys(schema).includes(
        sortMethod.replace("-reverse", "")
      )
        ? sortMethod
        : "priority";

      const sortedGroomedOutput = sortList({
        sortMethod: sortBy,
        objectToBeSorted: groomedOutput,
      });
      setAllStudyPlanItems(groomedAllItemOutput);
      setFormInputData(sortedGroomedOutput);
    };

    processDataWithSchema(schema);
  };
  return outputFunction;
};

export default useInitStudyPlanItems;
