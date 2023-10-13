import useSortList from "./useSortList";
import useAssembleStudyPlanList from "./useAssembleStudyPlanList";
import { useSelector, useDispatch } from "react-redux";
import { studyPlanDataActions } from "../store/studyPlanDataSlice";

const useInitStudyPlanItems = () => {
  const dispatch = useDispatch();
  const studyPlanItemSchema = useSelector(
    (state) => state.studyPlanData.schema
  );
  console.log(
    "%c --> %cline:6%cstudyPlanItemSchema",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(17, 63, 61);padding:3px;border-radius:2px",
    studyPlanItemSchema
  );
  const sortList = useSortList();
  const assembleStudyPlanList = useAssembleStudyPlanList();
  const outputFunction = (props) => {
    const {
      id,
      typeArray,
      sortMethod,
      dataObjForEdit,
      getSchemaForContentItem,
      allStudyPlanItems,
      setAllStudyPlanItems,
      setFormInputData,
    } = props;

    const findDependencies = (objectIdentifier, masterListObj) => {
      const output = [];

      for (const value of Object.values(masterListObj)) {
        if (value.hasOwnProperty("msup") && value.msup === objectIdentifier)
          output.push(value.identifier);
      }
      return output;
    };

    let schema = studyPlanItemSchema;
    // if (id === "content") {
    //   schema = getSchemaForContentItem;
    // }

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
      console.log(
        "%c --> %cline:106%cgroomedOutput",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(251, 178, 23);padding:3px;border-radius:2px",
        groomedOutput
      );
      const sortedGroomedOutput = sortList({
        sortMethod: sortBy,
        objectToBeSorted: groomedOutput,
      });
      setAllStudyPlanItems(groomedAllItemOutput);
      setFormInputData(sortedGroomedOutput);
    };

    processDataWithSchema(schema);
    // if (!studyPlanItemSchema)
    //   getSchema()
    //     .then((data) => {
    //       console.log(
    //         "%c uuuuuuuuuuu--> %cline:40%cdata",
    //         "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    //         "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    //         "color:#fff;background:rgb(3, 38, 58);padding:3px;border-radius:2px",
    //         data
    //       );

    //       dispatch(studyPlanDataActions.updateSchema(data.tree));

    //       processDataWithSchema(data.tree);
    //     })
    //     .catch((err) => {
    //       console.log("ERROR->", err);
    //     });
  };
  return outputFunction;
};

export default useInitStudyPlanItems;
