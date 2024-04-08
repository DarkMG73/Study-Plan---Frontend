import axios from "axios";
import { StorageForSession } from "../storage/storage";

axios.defaults.withCredentials = true;

export async function registerAUser(user, inDemoMode) {
  if (inDemoMode) return;
  const output = await axios
    .post(`/api/users/auth/register/`, user)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(
        "%cERROR:",
        "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
        err,
      );
      const error = err.response ? err.response : err;
      const errorOutput = {};
      if (Object.hasOwn(error, "data")) {
        if (
          Object.hasOwn(error.data, "message") &&
          error.data.message.constructor === String
        ) {
          errorOutput.message = error.data.message;
          errorOutput.status = 400;
        } else if (Object.hasOwn(error.data, "code")) {
          // MongoDB error 11000 is a duplicate error
          if (error.data.code === 11000) {
            let duplicateData = "";
            for (const value of Object.values(error.data.keyValue)) {
              duplicateData =
                duplicateData.length > 0
                  ? duplicateData + " and " + value
                  : value;
            }

            errorOutput.message = `${duplicateData} is already being used in the database. Please use a different email address or login with this email address and the password originally set.`;
            errorOutput.status = 422;
          } else {
            errorOutput.message = `There was a problem talking to the server, but we can not tell exactly what is causing this. Please try again. If the problem continues, please let us know. The error received from the server: ${error.status} | ${error.statusText}`;
            errorOutput.status = 422;
          }
        } else {
          errorOutput.message = `There was a problem talking to the server, but we can not tell exactly what is causing this. Please try again. If the problem continues, please let us know. The error received from the server: ${error.status} | ${error.statusText}`;
          errorOutput.status = 422;
        }
      } else {
        errorOutput.message = `There was a problem talking to the server, but we can not tell exactly what is causing this. Please try again. If the problem continues, please let us know. The error received from the server: ${error.status} | ${error.statusText}`;
        errorOutput.status = 422;
      }

      console.log(
        "%cERROR:",
        "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
        error,
      );

      if (Object.hasOwn(error, "data") && Object.hasOwn(error.data, "message"))
        console.log(
          "%cERROR Message:",
          "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
          error.data.message,
        );

      return errorOutput;
    });

  return output;
}

export async function setUserCookie(user, inDemoMode) {
  if (inDemoMode) return;
  const output = new Promise((resolve) => {
    const cookie = StorageForSession(
      "ADD",
      user,
      "gi-interview-questions-Tool-user",
    );
    let status = 400;
    if (cookie) status = 202;

    resolve({
      data: {
        cookie,
      },
      status,
    });
  });

  return output;
}

export async function deleteUserCookie(inDemoMode) {
  if (inDemoMode) return;
  // SessionStorage used while hosting API on Heroku
  const output = new Promise((resolve) => {
    const cookie = StorageForSession(
      "DELETE",
      {},
      "gi-interview-questions-Tool-user",
    );
    let status = 400;
    if (cookie) status = 202;

    resolve({
      data: {
        cookie,
      },
      status,
    });
  });

  return output;
}

export async function getUserCookie(inDemoMode) {
  if (inDemoMode) return;
  const output = new Promise((resolve) => {
    const cookie = StorageForSession(
      "GET",
      {},
      "gi-interview-questions-Tool-user",
    );

    let status = 400;
    if (cookie) status = 202;

    resolve({
      data: {
        cookie,
      },
      status,
    });
  });

  return output;
}

export async function sign_inAUser(userInfo) {
  const output = await axios
    .post(`/api/users/auth/sign_in/`, userInfo)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      console.log(
        "%cERROR:",
        "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
        error,
      );
      if (Object.hasOwn(error, "data") && Object.hasOwn(error.data, "message"))
        console.log(
          "%cERROR Message:",
          "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
          error.response.data.message,
        );

      return error.response;
    });

  return output;
}

export async function getUserUserByToken(token) {
  const output = await axios
    .get(`/api/users/auth/get_user_by_token/`, {
      headers: {
        Authorization: "JWT " + token,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(
        "%cERROR:",
        "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
        err,
      );
      return err.response;
    });

  return output;
}

/// Add or Update User History/////////////////////////////////////
export async function updateUserHistory(userAndDataObject) {
  const axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "JWT " + userAndDataObject.user.token,
    },
  };
  const dataObj = userAndDataObject.dataObj;
  const response = await axios
    .post(
      `/api/users/auth/updateUserHistory`,
      { dataObj: dataObj },
      axiosConfig,
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(
        "%cERROR:",
        "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
        err,
      );
      return err;
    });
  return response;
}

/// Add or Update User Current Selected Filters /////////////////////////////////////
export async function updateUserCurrentFilters(userAndDataObject) {
  const axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "JWT " + userAndDataObject.user.token,
    },
  };
  const dataObj = userAndDataObject.dataObj;
  const response = await axios
    .post(
      `/api/users/auth/updateUserCurrentFilters`,
      { dataObj: dataObj },
      axiosConfig,
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(
        "%cERROR:",
        "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
        err,
      );
      return err;
    });
  return response;
}
