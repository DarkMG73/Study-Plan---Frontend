import { getUserCookie, getUserUserByToken } from "../storage/userDB";

export const useUserDataInit = (props) => {
  const userDataInit = (props) => {
    const setLocalError = props.setLocalError;
    const setUser = props.setUser;

    getUserCookie()
      .then((res) => {
        // if no cookie or error
        if (res.status >= 400) {
          setUser("not logged in");
        } else {
          getUserUserByToken(res.data.cookie) // data from API.
            .then((userProfile) => {
              // User does not exist or has timed out.
              if (userProfile.status >= 400) {
                setUser("not logged in");
              } else {
                // trigger user login & user data setup via useEffect below.
                // Local state used to avoid following extra useEffect trigger on startup.
                setUser({ ...userProfile, token: res.data.cookie });
              }
            })
            .catch((err) => {
              console.log(
                "%cGatherToolData: err:",
                "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
                err
              );
            });
        }
      })
      .catch((err) => {
        console.log(
          "%cGatherToolData: err:",
          "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
          err
        );
        setLocalError({
          active: true,
          message: " An error: " + err.toString(),
        });
      });
  };

  return userDataInit;
};
