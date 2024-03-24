import GatherContentData from "./GatherContentData";
import { contentDataActions } from "../store/contentDataSlice";
import { loadingRequestsActions } from "../store/loadingRequestsSlice";
import { useSelector, useDispatch } from "react-redux";
import { statusUpdateActions } from "../store/statusUpdateSlice";

export const useRunGatherContentData = () => {
  const makeLoadingRequest = function () {
    return dispatch(loadingRequestsActions.addToLoadRequest());
  };
  const removeLoadingRequest = function () {
    dispatch(loadingRequestsActions.removeFromLoadRequest());
  };
  const currentStatus = useSelector((state) => state.statusUpdate);
  const dispatch = useDispatch();

  const runGatherContentData = (props) => {
    const user = props.user;
    const setLocalError = props.setLocalError;
    makeLoadingRequest();
    GatherContentData(user)
      .then((data) => {
        if (process.env.NODE_ENV === "development")
          console.log(
            "%c Getting tool data from DB:",
            "color:#fff;background:#777;padding:5px;border-radius:0 25px 25px 0",
            data,
          );

        if (data) {
          console.log(
            "%c⚪️►►►► %cline:30%cdata",
            "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
            "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
            "color:#fff;background:rgb(60, 79, 57);padding:3px;border-radius:2px",
            data,
          );
          dispatch(contentDataActions.initState(data));
          if (user) {
            dispatch(
              statusUpdateActions.updateStatus({
                status: currentStatus.status ? currentStatus.status : 200,
                statusText: "OK",
                rateLimitRemaining: currentStatus.rateLimitRemaining,
              }),
            );
          } else {
            if (currentStatus && currentStatus.status)
              dispatch(
                statusUpdateActions.updateStatus({
                  status: 200,
                  statusText: "OK. Saving to Browser Storage.",
                  rateLimitRemaining: currentStatus.rateLimitRemaining,
                }),
              );
          }
        } else {
          setLocalError({
            active: true,
            message:
              " *** " +
              data +
              `***\n\nIt looks like we can not make a connection. Please refresh the browser plus make sure there is an internet connection and  nothing like a firewall of some sort blocking this request.\n\nIt is also possible that the server's security software detected abnormally high traffic between this IP address and the server.  This is nothing anyone did wrong, just a rare occurrence with a highly-secured server. This will clear itself sometime within the next thirty minutes or so.\n\nPlease contact us if you find you are online and this error does not clear within an hour.\n\nSorry for the trouble. 😢`,
          });
        }
      })
      .catch((err) => {
        console.log(
          "%cGatherToolData: err:",
          "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
          err,
        );
        dispatch(
          statusUpdateActions.updateStatus({
            status: currentStatus.status ? currentStatus.status : 900,
            statusText: "OK",
            rateLimitRemaining: currentStatus.rateLimitRemaining,
          }),
        );
        if (Object.hasOwn(err, "status") && err.status >= 500) {
          setLocalError({
            active: true,
            message:
              " *** " +
              err.statusText +
              `***\n\nIt looks like we can not make a connection. Please refresh the browser plus make sure there is an internet connection and  nothing like a firewall of some sort blocking this request.\n\nIt is also possible that the server's security software detected abnormally high traffic between this IP address and the server.  This is nothing anyone did wrong, just a rare occurrence with a highly-secured server. This will clear itself sometime within the next thirty minutes or so.\n\nPlease contact us if you find you are online and this error does not clear within an hour.\n\nSorry for the trouble. 😢`,
          });
        } else if (Object.hasOwn(err, "status")) {
          console.log(
            "%cGatherToolData: err:",
            "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
            err,
          );
          setLocalError({
            active: true,
            message:
              "Oh no! Something went wrong. Please try again or contact general@glassinteractive.com with the following information if the problem continues -->  " +
              err.status +
              " |" +
              err.statusText +
              " | " +
              err.request.responseURL,
          });
        } else {
          console.log(
            "%cGatherToolData: err:",
            "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
            err,
          );
          if (Object.hasOwn(err, "status")) {
            const responseURL =
              Object.hasOwn(err, "request") &&
              Object.hasOwn(err.request, "responseURL")
                ? err.request.responseURL
                : "";
            setLocalError({
              active: true,
              message:
                "Oh no! Something went wrong. Please try again or contact general@glassinteractive.com with the following information if the problem continues -->  " +
                err.status +
                " |" +
                err.statusText +
                " | " +
                responseURL,
            });
          } else {
            setLocalError({
              active: true,
              message: `It looks like we can not make a connection. Please refresh the browser plus the internet connection and firewall blocking. \n\nSorry for the trouble.`,
            });
          }
        }
      });
    console.log(
      "%c⚪️►►►►►►►►►►►►►►►►►►►►►►►►►►►► %cline:130%crunGatherContentData",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(229, 187, 129);padding:3px;border-radius:2px",
    );
    removeLoadingRequest();
  };
  return runGatherContentData;
};
