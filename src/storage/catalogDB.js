import axios from "axios";

/// GET THE CATALOG ITEMS /////////////////////////////
export const studyPlanData = async (user) => {
  let axiosConfig = null;

  if (user) {
    axiosConfig = {
      headers: {
        "Content-Type": "text/plain",
        Authorization: "JWT " + user.token,
      },
      timeout: 60000,
    };
  }

  try {
    const res = await axios.post("/api/spt/", user, axiosConfig);
    return res.data;
  } catch (err) {
    console.log(
      "%cERROR:",
      "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
      err
    );
    return [];
  }
};

/// GET ONE CATALOG ITEM /////////////////////////////
export const getQuestionBy_Id = async (user, question_Id) => {
  let axiosConfig = null;

  if (user) {
    axiosConfig = {
      headers: {
        "Content-Type": "text/plain",
        Authorization: "JWT " + user.token,
      },
      timeout: 60000,
    };
  }

  const res = await axios.post("/api/spt/" + question_Id, user, axiosConfig);
  return res.data;
};

/// SAVE ONE /////////////////////////////////////
export async function addDocToDB(userAndDataObject) {
  const axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "JWT " + userAndDataObject.user.token,
    },
  };

  const response = await axios
    .post(`/api/spt/add/`, userAndDataObject, axiosConfig)
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

/// SAVE MANY /////////////////////////////////
export async function saveManyStudyPlanItems(userAndDataObject) {
  const axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "JWT " + userAndDataObject.user.token,
    },
  };

  const response = await axios
    .post(`/api/spt/add-many/`, userAndDataObject, axiosConfig)
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

/// UPDATE //////////////////////////////////
export async function updateAStudyPlanItem(id, dataObj, user) {
  dataObj.identifier = id;
  const axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "JWT " + user.token,
    },
  };

  const response = await axios
    .post(`/api/spt/update/`, { dataObj }, axiosConfig)
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

/// DELETE ////////////////////////////////
export async function deleteDocFromDb(id, user) {
  const axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "JWT " + user.token,
    },
  };
  const response = await axios
    .get(`/api/spt/${id}/delete/`, axiosConfig)
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

/// DELETE ALL ///////////////////////////
export async function deleteAllQuestions(user) {
  const axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "JWT " + user.token,
    },
  };
  const response = await axios
    .get(`/api/spt/deleteAll/`, axiosConfig)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(
        "%cERROR:",
        "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
        err
      );
      console.log(
        "%cERROR:",
        "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
        err
      );
      return err;
    });
  return response;
}

/// GET CATALOG ITEM SCHEMA //////////////
export async function getSchemaForStudyPlanItem() {
  const axiosConfig = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const output = await axios
    .get(`/api/spt/model/`, axiosConfig)
    .then((res) => {
      return res.data.model;
    })
    .catch((err) => {
      const output = { response: { request: {} } };
      console.log(
        "%cERROR:",
        "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
        err
      );

      if (err.code && err.code === "ERR_NETWORK") {
        output.response.status = 500;
        output.response.statusText = err.message;
        output.response.request.responseURL = err.config.baseURL;
      }
      return output.response;
    });

  return output;
}
