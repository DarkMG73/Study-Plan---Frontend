const displayConditions = {
  formWithPreFilledData: {
    isURL: ["url"],
    isBoolean: [],
    isDate: ["createdAt", "updatedAt", "start", "acomp"],
    isNumber: {
      labTime: { min: "0", max: "" },
      lectureTime: { min: "0", max: "" },
      status: { min: "0", max: "100" },
    },
    isList: ["author", "platform", "tags"], // List with compiled options.
    isSuggestionsList: { method: ["corse", "project", "tutorial"] }, // List with fixed & compiled options.
    isLimitedList: {
      type: ["- Select one -", "step", "goal", "hold"],
      priority: ["0", "10", "9", "8", "7", "6", "5", "4", "3", "2", "1"],
    }, // List with no input box and fixed options.
    isFixedCompiledList: ["msup", "asup"], // List with no input box and compiled options.
    forSlideButton: ["markcomplete", "markforreview"],
    protectedHidden: [
      "title",
      "slug",
      "identifier",
      "masterLibraryID",
      "_id",
      "iframeCustomAttributes",
      "id",
      "createdAt",
      "updatedAt",
    ],

    protectedVisible: [
      "PROTECT-ALL",
      "title",
      "createdAt",
      "updatedAt",
      "slug",
      "identifier",
      "masterLibraryID",
    ],
  },
  emptyForm: {
    isURL: ["url"],
    isBoolean: [],
    isDate: ["createdAt", "updatedAt", "start", "acomp"],
    isNumber: {
      labTime: { min: "0", max: "" },
      lectureTime: { min: "0", max: "" },
      status: { min: "0", max: "100" },
    },
    isList: ["author", "platform", "tags"], // List with compiled options.
    isSuggestionsList: { method: ["corse", "project", "tutorial"] }, // List with fixed & compiled options.
    isLimitedList: {
      type: ["- Select one -", "step", "goal", "hold"],
      priority: ["0", "10", "9", "8", "7", "6", "5", "4", "3", "2", "1"],
    }, // List with no input box and fixed options.
    isFixedCompiledList: ["msup", "asup"], // List with no input box and compiled options.
    protectedHidden: ["identifier"],
    protectedVisible: [],
  },
};

export default displayConditions;
