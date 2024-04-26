import { useDispatch, useSelector } from "react-redux";
import { loadingRequestsActions } from "../store/loadingRequestsSlice";

const useProcessUpdateStudyPlan = () => {
  const dispatch = useDispatch();
  const { isInDemoMode } = useSelector((state) => state.auth);
  const outputFunction = ({
    updateStudyPlan,
    updateAContentItem,
    updateAStudyPlanItem,
    studyPlanDataActions,
  }) => {
    if (!updateStudyPlan || isInDemoMode) return;
    dispatch(loadingRequestsActions.addToLoadRequest());
    const { itemWithNewEdits, user, parentSection } = updateStudyPlan;

    // Ensure expected Boolean values are correct
    const outputItemWithNewEdits = { ...itemWithNewEdits };
    for (const key in outputItemWithNewEdits) {
      if (
        (key === "markcomplete" || key === "markforreview") &&
        typeof outputItemWithNewEdits[key] !== "boolean"
      ) {
        if (
          outputItemWithNewEdits[key] === "false" ||
          outputItemWithNewEdits[key] === ""
        )
          outputItemWithNewEdits[key] = false;
        else {
          outputItemWithNewEdits[key] = true;
        }
      }

      // Convert to boolean.
      if (key === "markcomplete" || key === "markforreview") {
        const innerItem = outputItemWithNewEdits[key];

        if (typeof innerItem === String) {
          outputItemWithNewEdits[key] =
            innerItem.trim().toLowerCase() === "true" ? true : false;
        } else {
          outputItemWithNewEdits[key] = innerItem;
        }
      }
    }
    ///////////////////////////////////////////

    const updateAnItem =
      parentSection === "content" ? updateAContentItem : updateAStudyPlanItem;

    /* eslint eqeqeq: 0 */
    if (user) {
      // updateAnItem(outputItemWithNewEdits, user)
      //   .then((res) => {
      //     dispatch(loadingRequestsActions.removeFromLoadRequest());
      //     if (Object.hasOwn(res, "code") && res.code === "ERR_NETWORK") {
      //       alert(
      //         "There was an problem sending the data to the server: " +
      //           res.message,
      //       );
      //       return;
      //     }
      //     const status = res.status ? res.status : res.response.status;

      //     if (status >= 400) {
      //       alert("There was an error: " + res.response.data.message);
      //     } else if (status >= 200) {
      //       // dispatch(
      //       //   studyPlanDataActions.updateOneStudyPlanItem({
      //       //     _id: outputItemWithNewEdits._id,
      //       //     item: outputItemWithNewEdits,
      //       //   }),
      //       // );
      //       const resetPage = window.confirm(
      //         'Success! The item has been updated.\n\nClick "OK" to refresh the page and show the changes.\n\nClicking "Cancel" will return to the page. If you "Cancel" here, you will need to refresh manually later to populate the changes throughout the app.',
      //       );
      //       if (resetPage) window.location.reload();
      //     } else {
      //       alert("There was an error: " + res.message);
      //     }
      //   })
      //   .catch((err) => {
      //     alert(err);
      //     dispatch(loadingRequestsActions.removeFromLoadRequest());
      //   });
      alert("yep");
      console.log(
        "%c⚪️►►►► %cline:48%cupdateAnItem",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(56, 13, 49);padding:3px;border-radius:2px",
        updateAnItem,
      );
      // dispatch(studyPlanDataActions.resetUpdateStudyPlan(false));
    } else {
      const sendEmail = window.confirm(
        'Thank you for contributing. All contributions must be reviewed before becoming public. Click "OK" to send this via email for review and, if approved, to be included. Click "Cancel" to cancel this and not send an email.',
      );
      if (sendEmail) {
        const questionAdminEmail = "general@glassinteractive.com";
        const subject = "An Edit Request for the Study Plan Tool";
        const body = `A question edit is being recommended: ${JSON
          .stringify
          // editedQuestions.current.edits
          ()}`;
        window.open(
          `mailto:${questionAdminEmail}?subject=${subject}l&body=${encodeURIComponent(
            body,
          )}`,
        );
      }
      dispatch(studyPlanDataActions.resetUpdateStudyPlan(false));

      dispatch(loadingRequestsActions.removeFromLoadRequest());
    }
  };

  return outputFunction;
};

export default useProcessUpdateStudyPlan;
