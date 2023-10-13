const displayConditions = {
  formWithPreFilledData: {
    isURL: ["link", "url", "sourceURLbj"],
    isBoolean: ["isDefaultPlaylist", "isFeaturedPlaylist"],
    isDate: ["createdAt", "updatedAt", "start", "acomp"],
    isNumber: ["labTime", "lectureTime"],
    isList: ["author", "method", "platform", "tags"], // List with compiled options.
    isSuggestionsList: ["method", "msup", "asup"], // List with fixed & compiled options.
    isLimitedList: ["type"], // List with no input box and fixed options.
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
    isURL: ["url", "sourceURLbj"],
    isBoolean: ["isDefaultPlaylist", "isFeaturedPlaylist"],
    isDate: ["createdAt", "updatedAt", "start", "acomp"],
    isNumber: ["labTime", "lectureTime", "priority"],
    isList: ["author", "type", "method", "msup", "asup", "platform", "tags"],
    protectedHidden: ["identifier"],
    protectedVisible: [],
  },
};

export default displayConditions;
