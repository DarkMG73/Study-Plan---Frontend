import axios from "axios";
import { StorageForSession } from "../storage/storage";

axios.defaults.withCredentials = true;

export async function registerAUser(user) {
  const output = await axios
    .post(`/api/users/auth/register/`, user)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(
        "%cERROR:",
        "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
        err
      );
      const error = err.response;
      if (
        error.hasOwnProperty("data") &&
        error.data.hasOwnProperty("message")
      ) {
        if (error.data.message.constructor === String) return error;

        if (error.data.message.hasOwnProperty("code")) {
          // MongoDB error 11000 is a duplicate error
          if (error.data.message.code === 11000) {
            const errorMessage = {
              status: 400,
              message: `${error.data.message.keyValue.email} is already being used in the database. Please use a different email address or login with this email address and the password originally set.`,
            };
            return errorMessage;
          } else {
            return error.message.code;
          }
        }
      }

      console.log(
        "%cERROR:",
        "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
        error
      );

      if (error.hasOwnProperty("data") && error.data.hasOwnProperty("message"))
        console.log(
          "%cERROR Message:",
          "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
          error.data.message
        );
    });

  return output;
}

export async function setUserCookie(user) {
  const output = new Promise((resolve, reject) => {
    const cookie = StorageForSession(
      "ADD",
      user,
      "gi-interview-questions-Tool-user"
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

export async function deleteUserCookie(user) {
  // SessionStorage used while hosting API on Heroku
  const output = new Promise((resolve, reject) => {
    const cookie = StorageForSession(
      "DELETE",
      {},
      "gi-interview-questions-Tool-user"
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

export async function getUserCookie() {
  const output = new Promise((resolve, reject) => {
    const cookie = StorageForSession(
      "GET",
      {},
      "gi-interview-questions-Tool-user"
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

export async function sign_inAUser(token) {
  const output = await axios
    .post(`/api/users/auth/sign_in/`, token)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      console.log(
        "%cERROR:",
        "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
        error
      );
      if (error.hasOwnProperty("data") && error.data.hasOwnProperty("message"))
        console.log(
          "%cERROR Message:",
          "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
          error.response.data.message
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
        err
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
      axiosConfig
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(
        "%cERROR:",
        "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
        err
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
      axiosConfig
    )
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(
        "%cERROR:",
        "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
        err
      );
      return err;
    });
  return response;
}

/// Update Study Notes /////////////////////////////////////
export async function updateStudyNotes(userAndDataObject) {
  const axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "JWT " + userAndDataObject.user.token,
    },
  };
  const { dataObj } = userAndDataObject;
  const response = await axios
    .post(`/api/users/auth/updateStudyNotes`, { dataObj: dataObj }, axiosConfig)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(
        "%cERROR:",
        "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
        err
      );
      return err;
    });
  return response;
}
