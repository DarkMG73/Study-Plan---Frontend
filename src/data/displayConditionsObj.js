const displayConditions = {
  formWithPreFilledData: {
    isURL: ["link", "sourceURLbj"],
    isBoolean: ["isDefaultPlaylist", "isFeaturedPlaylist"],
    isDate: ["releaseDate", "createdAt", "updatedAt"],
    protectedHidden: [
      "title",
      "slug",
      "identifier",
      "masterLibraryID",
      "_id",
      "iframeCustomAttributes",
    ],
    protectedVisible: [
      "PROTECT-ALL",
      "title",
      "releaseDate",
      "createdAt",
      "updatedAt",
      "slug",
      "identifier",
      "masterLibraryID",
    ],
  },
  emptyForm: {
    isURL: ["link", "sourceURLbj"],
    isBoolean: ["isDefaultPlaylist", "isFeaturedPlaylist"],
    isDate: ["releaseDate", "createdAt", "updatedAt"],
    protectedHidden: ["identifier"],
    protectedVisible: [],
  },
};

export default displayConditions;
