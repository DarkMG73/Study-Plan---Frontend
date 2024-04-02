import useSortList from "./useSortList";
import useAssembleStudyPlanList from "./useAssembleStudyPlanList";
import { useSelector } from "react-redux";

const useInitStudyPlanItems = () => {
  const studyPlanItemSchema = useSelector(
    (state) => state.studyPlanData.schema,
  );
  const sortList = useSortList();
  const assembleStudyPlanList = useAssembleStudyPlanList();
  const outputFunction = async (props) => {
    const { typeArray, sortMethod, dataObjForEdit, allStudyPlanItems } = props;

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
      console.log(
        "%c⚪️►►►► %cline:27%cgroomedOutput",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(248, 214, 110);padding:3px;border-radius:2px",
        groomedOutput,
      );
      ////////////////////////////////////////////////////////////////////////
      /// Sort groomedOutput
      ////////////////////////////////////////////////////////////////////////
      const sortBy = Object.keys(schema).includes(
        sortMethod.replace("-reverse", ""),
      )
        ? sortMethod
        : "priority";

      const sortedGroomedOutput = sortList({
        sortMethod: sortBy,
        objectToBeSorted: groomedOutput,
      });
      console.log(
        "%c⚪️►►►► %cline:49%csortedGroomedOutput",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(1, 77, 103);padding:3px;border-radius:2px",
        sortedGroomedOutput,
      );
      return { groomedAllItemOutput, sortedGroomedOutput };
    };

    return processDataWithSchema(schema);
  };
  return outputFunction;
};

export default useInitStudyPlanItems;
