import axios from "axios";

/// GET THE STUDY PLAN ITEMS /////////////////////////////
export const studyPlanData = async (user) => {
  console.log(
    "%c⚪️►►►► %cline:4%cstudyPlanData",
    "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
    "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
    "color:#fff;background:rgb(179, 214, 110);padding:3px;border-radius:2px",
  );
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
    const res = await axios.post("/api/studyPlan/", user, axiosConfig);
    console.log(
      "%c⚪️►►►► %cline:24%cres",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(178, 190, 126);padding:3px;border-radius:2px",
      res,
    );
    return res.data;
  } catch (err) {
    console.log(
      "%cERROR--->:",
      "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
      err,
    );
    return [];
  }
};

/// GET ONE STUDY PLAN ITEM /////////////////////////////
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

  const res = await axios.post(
    "/api/studyPlan/" + question_Id,
    user,
    axiosConfig,
  );
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
    .post(`/api/studyPlan/add/`, userAndDataObject, axiosConfig)
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

/// SAVE MANY /////////////////////////////////
export async function saveManyStudyPlanItems(userAndDataObject) {
  const axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "JWT " + userAndDataObject.user.token,
    },
  };

  const response = await axios
    .post(`/api/studyPlan/add-many/`, userAndDataObject, axiosConfig)
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

/// UPDATE //////////////////////////////////
export async function updateAStudyPlanItem(dataObj, user) {
  if (!Object.hasOwn(dataObj, "identifier")) {
    throw Error(
      "This item appears to be incomplete. Contact the site admin and provide this error code: SPDB-MIS-IDENT",
    );
  }
  const axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "JWT " + user.token,
    },
  };

  const response = await axios
    .post(`/api/studyPlan/update/`, { dataObj }, axiosConfig)
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

/// DELETE ////////////////////////////////
export async function deleteDocFromDb(id, user) {
  const axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "JWT " + user.token,
    },
  };
  const response = await axios
    .get(`/api/studyPlan/${id}/delete/`, axiosConfig)
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

/// DELETE ALL ///////////////////////////
export async function deleteAllStudyTopics(user) {
  const axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: "JWT " + user.token,
    },
  };
  const response = await axios
    .get(`/api/studyPlan/deleteAll/`, axiosConfig)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(
        "%cERROR:",
        "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
        err,
      );
      console.log(
        "%cERROR:",
        "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
        err,
      );
      return err;
    });
  return response;
}

/// GET STUDY PLAN ITEM SCHEMA //////////////
export async function getSchemaForStudyPlanItem() {
  // alert("Calling for Schema");
  const axiosConfig = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const output = await axios
    .get(`/api/studyPlan/model/`, axiosConfig)
    .then((res) => {
      return res.data.model;
    })
    .catch((err) => {
      const output = { response: { request: {} } };
      console.log(
        "%cERROR:",
        "color:#f0f0ef;background:#ff0000;padding:32px;border-radius:0 25px 25px 0",
        err,
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
