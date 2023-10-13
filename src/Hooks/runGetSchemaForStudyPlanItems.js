import { getSchemaForStudyPlanItem } from "../storage/studyPlanDB";

const runGetSchemaForStudyPlanItems = async () => {
  return getSchemaForStudyPlanItem()
    .then((data) => {
      return data.tree;
    })
    .catch((err) => {
      console.log("ERROR->", err);
    });
};
export default runGetSchemaForStudyPlanItems;
