import { useDispatch } from "react-redux";
import {
  getUserCookie,
  getUserUserByToken,
  sign_inAUser,
} from "../storage/userDB";
import { authActions } from "../store/authSlice";

export const useUserDataInit = () => {
  const dispatch = useDispatch();
  const userDataInit = (props) => {
    const setLocalError = props.setLocalError;
    const setUserInitComplete = props.setUserInitComplete;

    const finishLogin = (userProfile, token) => {
      dispatch(
        authActions.logIn({
          ...userProfile,
          token,
        }),
      );
      setUserInitComplete({
        ...userProfile,
        token,
      });
    };

    getUserCookie()
      .then((res) => {
        // if no cookie or error
        if (res.status >= 400) {
          // setUser("not logged in");
          setUserInitComplete(true);
        } else {
          if (!props.isDemo)
            getUserUserByToken(res.data.cookie) // data from API.
              .then((userProfile) => {
                console.log(
                  "%c⚪️►►►► %cline:37%cuserProfile",
                  "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
                  "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
                  "color:#fff;background:rgb(248, 214, 110);padding:3px;border-radius:2px",
                  userProfile,
                );
                // User does not exist or has timed out.
                if (userProfile.status >= 400) {
                  // setUser("not logged in");
                } else {
                  // trigger user login & user data setup via useEffect below.
                  // Local state used to avoid following extra useEffect trigger on startup.
                  finishLogin(userProfile, res.data.cookie);
                }
              })
              .catch((err) => {
                console.log(
                  "%cGatherToolData: err:",
                  "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
                  err,
                );
              });

          if (props.isDemo)
            sign_inAUser(props.demoUser) // data from API.
              .then((dbRes) => {
                console.log(
                  "%c⚪️►►►► %cline:57%cuserProfile",
                  "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
                  "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
                  "color:#fff;background:rgb(3, 38, 58);padding:3px;border-radius:2px",
                  dbRes.data,
                );
                // User does not exist or has timed out.
                if (dbRes.status >= 400) {
                  // setUser("not logged in");
                } else {
                  // trigger user login & user data setup via useEffect below.
                  // Local state used to avoid following extra useEffect trigger on startup.
                  finishLogin(dbRes, dbRes.data.token);
                }
              })
              .catch((err) => {
                console.log(
                  "%cGatherToolData: err:",
                  "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
                  err,
                );
              });
        }
      })
      .catch((err) => {
        console.log(
          "%cGatherToolData: err:",
          "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
          err,
        );
        setUserInitComplete(true);
        setLocalError({
          active: true,
          message: " An error: " + err.toString(),
        });
      });
  };

  return userDataInit;
};
