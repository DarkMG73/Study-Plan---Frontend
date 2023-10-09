const useSortList = () => {
  const outputFunction = (props) => {
    const { sortMethod, objectToBeSorted } = props;

    console.log(
      "%c --> %cline:3%cobjectToBeSorted",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(254, 67, 101);padding:3px;border-radius:2px",
      objectToBeSorted
    );
    console.log(
      "%c --> %cline:3%csortMethod",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(39, 72, 98);padding:3px;border-radius:2px",
      sortMethod
    );
    if (!objectToBeSorted) return objectToBeSorted;
    const sortBy = sortMethod ? sortMethod : "priority";

    const sortNumbers = (fieldName, direction) => {
      console.log("--------------");
      console.log("----NUMBER---");
      console.log("----" + direction + "---");
      console.log("--------------");
      const outputObj = {};
      let sortedArray = [];
      const name = fieldName.replace("-reverse", "");
      if (direction === "reverse") {
        sortedArray = Object.values(objectToBeSorted).sort(
          (v1, v2) => v1[name] + v2[name]
        );
      } else {
        sortedArray = Object.values(objectToBeSorted).sort(
          (v1, v2) => v1[name] - v2[name]
        );
      }
      sortedArray.forEach((item) => {
        outputObj[item._id] = item;
      });
      return outputObj;
    };

    const sortWords = (fieldName, direction) => {
      console.log("--------------");
      console.log("----WORD---");
      console.log("----" + direction + "---");
      console.log("--------------");
      const outputObj = {};
      let sortedArray = [];
      const name = fieldName.replace("-reverse", "");
      if (direction === "reverse") {
        sortedArray = Object.values(objectToBeSorted).sort((v1, v2) => {
          const name = sortBy.replace("-reverse", "");

          if (v1[name] < v2[name]) {
            return 1;
          }
          if (v1[name] > v2[name]) {
            return -1;
          }
          return 0;
        });
      } else {
        console.log(
          "%c --> %cline:119%cname",
          "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
          "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
          "color:#fff;background:rgb(179, 214, 110);padding:3px;border-radius:2px",
          name
        );
        sortedArray = Object.values(objectToBeSorted).sort((v1, v2) => {
          if (v1[name] < v2[name]) {
            console.log(
              "%c --> %cline:149%cv1[name] < v2[name]",
              "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
              "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
              "color:#fff;background:rgb(89, 61, 67);padding:3px;border-radius:2px",
              v1[name]
            );
            console.log(
              "%c --> %cline:149%cv1[name] < v2[name]",
              "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
              "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
              "color:#fff;background:rgb(89, 61, 67);padding:3px;border-radius:2px",
              v2[name]
            );
            return -1;
          }
          if (v1[name] > v2[name]) {
            console.log(
              "%c --> %cline:153%cv1[name] > v2[name]",
              "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
              "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
              "color:#fff;background:rgb(23, 44, 60);padding:3px;border-radius:2px",
              v1[name] > v2[name]
            );
            return 1;
          }
          return 0;
        });
      }
      sortedArray.forEach((item) => {
        outputObj[item._id] = item;
      });
      console.log(
        "%c --> %cline:150%coutputObj",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(96, 143, 159);padding:3px;border-radius:2px",
        outputObj
      );
      return outputObj;
    };

    const forNumberSort = [
      "priority",
      "status",
      "progressbar",
      "lectureTime",
      "labTime",
    ];

    const direction = sortBy.includes("-reverse") ? "reverse" : "forward";
    let sortedGroomedOutput = {};

    if (forNumberSort.includes(sortBy.replace("-reverse", ""))) {
      sortedGroomedOutput = sortNumbers(sortBy, direction);
    } else {
      sortedGroomedOutput = sortWords(sortBy, direction);
    }

    return sortedGroomedOutput;
  };
  return outputFunction;
};

export default useSortList;
