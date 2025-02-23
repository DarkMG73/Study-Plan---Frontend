const displayConditions = {
  formWithPreFilledData: {
    isURL: ["url", "demonstratedskillurl"],
    isBoolean: [],
    isDate: ["createdAt", "updatedAt", "start", "acomp"],
    isNumber: {
      labTime: { min: "0", max: "" },
      lectureTime: { min: "0", max: "" },
      status: { min: "0", max: "100" },
    },
    isList: ["author", "platform", "tags"], // List with compiled options.
    isSuggestionsList: { method: ["course", "project", "tutorial"] }, // List with fixed & compiled options.
    isLimitedList: {
      type: ["- Select one -", "step", "goal", "hold"],
      priority: ["0", "10", "9", "8", "7", "6", "5", "4", "3", "2", "1"],
    }, // List with no input box and fixed options.
    isFixedCompiledList: [], // List with no input box and compiled options.
    isOtherKeyFixedCompiledList: {
      msup: { keyToSave: "identifier", keyToDisplay: "name" },
      asup: { keyToSave: "identifier", keyToDisplay: "name" },
    }, // Select with options to display and save different keys & values.
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
    isURL: ["url", "demonstratedskillurl"],
    isBoolean: [],
    isDate: ["createdAt", "updatedAt", "start", "acomp"],
    isNumber: {
      labTime: { min: "0", max: "" },
      lectureTime: { min: "0", max: "" },
      status: { min: "0", max: "100" },
    },
    isList: ["author", "platform", "tags"], // List with compiled options.
    isSuggestionsList: { method: ["course", "project", "tutorial"] }, // List with fixed & compiled options.
    isLimitedList: {
      type: ["- Select one -", "step", "goal", "hold"],
      priority: ["0", "10", "9", "8", "7", "6", "5", "4", "3", "2", "1"],
    }, // List with no input box and fixed options.
    isFixedCompiledList: [], // List with no input box and compiled options.
    isOtherKeyFixedCompiledList: {
      msup: { keyToSave: "identifier", keyToDisplay: "name" },
      asup: { keyToSave: "identifier", keyToDisplay: "name" },
    }, // Select with options to display and save different keys & values.
    protectedHidden: ["identifier"],
    protectedVisible: [],
  },
  jsonUpload: {
    isURL: ["url", "demonstratedskillurl"],
    isBoolean: [],
    isDate: ["createdAt", "updatedAt", "start", "acomp"],
    isNumber: {
      labTime: { min: "0", max: "" },
      lectureTime: { min: "0", max: "" },
      status: { min: "0", max: "100" },
    },
    isList: ["author", "platform", "tags"], // List with compiled options.
    isSuggestionsList: { method: ["course", "project", "tutorial"] }, // List with fixed & compiled options.
    isLimitedList: {
      type: ["- Select one -", "step", "goal", "hold"],
      priority: ["0", "10", "9", "8", "7", "6", "5", "4", "3", "2", "1"],
    }, // List with no input box and fixed options.
    isFixedCompiledList: [], // List with no input box and compiled options.
    isOtherKeyFixedCompiledList: {
      msup: {
        keyToSave: "identifier",
        keyToDisplay: "name",
        groupByField: "type",
      },
      asup: {
        keyToSave: "identifier",
        keyToDisplay: "name",
        groupByField: "type",
      },
    }, // Select with options to display and save different keys & values.
    protectedHidden: ["msup", "asup", "id", "identifier", "createdAt"],
    protectedVisible: [],
  },
};

export default displayConditions;
