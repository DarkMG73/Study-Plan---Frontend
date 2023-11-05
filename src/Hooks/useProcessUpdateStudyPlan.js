import { useDispatch } from "react-redux";

const useProcessUpdateStudyPlan = () => {
  const dispatch = useDispatch();
  const outputFunction = ({
    updateStudyPlan,
    updateAContentItem,
    updateAStudyPlanItem,
    studyPlanDataActions,
  }) => {
    if (!updateStudyPlan) return;

    const { itemWithNewEdits, user, parentSection } = updateStudyPlan;

    const updateAnItem =
      parentSection === "content" ? updateAContentItem : updateAStudyPlanItem;

    /* eslint eqeqeq: 0 */
    if (user) {
      updateAnItem(itemWithNewEdits, user)
        .then((res) => {
          const status = res.status ? res.status : res.response.status;
          if (status >= 400) {
            alert("There was an error: " + res.response.data.message);
          } else if (status >= 200) {
            dispatch(
              studyPlanDataActions.updateOneStudyPlanItem({
                _id: itemWithNewEdits._id,
                item: itemWithNewEdits,
              })
            );
            alert("Success! The item has been updated.");

            // setInEditMode(false);
          } else {
            alert("there was an error: " + res.message);
          }
        })
        .catch((err) => {
          alert(err);
        });
      dispatch(studyPlanDataActions.resetUpdateStudyPlan(false));
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
      dispatch(studyPlanDataActions.resetUpdateStudyPlan(false));
    }
  };

  return outputFunction;
};

export default useProcessUpdateStudyPlan;
