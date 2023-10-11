import useSortList from "./useSortList";
import useAssembleStudyPlanList from "./useAssembleStudyPlanList";

const useInitStudyPlanItems = () => {
  const sortList = useSortList();
  const assembleStudyPlanList = useAssembleStudyPlanList();
  const outputFunction = (props) => {
    const {
      id,
      typeArray,
      sortMethod,
      dataObjForEdit,
      getSchemaForStudyPlanItem,
      getSchemaForContentItem,
      allStudyPlanItems,
      setAllStudyPlanItems,
      setFormInputData,
    } = props;

    console.log(
      "%c --> %cline:14%ctypeArray",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(23, 44, 60);padding:3px;border-radius:2px",
      typeArray
    );
    const findDependencies = (objectIdentifier, masterListObj) => {
      const output = [];
      for (const value of Object.values(masterListObj)) {
        if (value.hasOwnProperty("msup") && value.msup === objectIdentifier)
          output.push(value.identifier);
      }
      return output;
    };

    if (dataObjForEdit) {
      let getSchema = getSchemaForStudyPlanItem;
      if (id === "content") {
        getSchema = getSchemaForContentItem;
      }

      getSchema()
        .then((data) => {
          // const groomedSchema = {}
          // // Organize Schema
          // orderOfOutputArray.forEach(topic=>{
          //   groomedSchema[topic] = data.tree[topic]
          // })

          // Gather items to list based on typeArray.
          const { groomedOutput, groomedAllItemOutput } = assembleStudyPlanList(
            {
              typeArray,
              keysToUseArray: Object.keys(data.tree),
              dataObjForEdit,
              allStudyPlanItems,
            }
          );

          ////////////////////////////////////////////////////////////////////////
          /// Sort groomedOutput
          ////////////////////////////////////////////////////////////////////////
          const sortBy = Object.keys(data.tree).includes(
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
        })
        .catch((err) => {
          console.log("ERROR->", err);
        });
    } else {
      getSchemaForStudyPlanItem()
        .then((data) => {
          setFormInputData((prevState) => {
            const existingState = { ...prevState };
            existingState.studyPlan = data.tree;
            return existingState;
          });
        })
        .catch((err) => {
          console.log("ERROR->", err);
        });
    }
  };
  return outputFunction;
};

export default useInitStudyPlanItems;
