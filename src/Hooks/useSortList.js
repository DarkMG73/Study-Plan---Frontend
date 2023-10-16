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
          (v1, v2) => v2[name] * 1 - v1[name] * 1
        );
      } else {
        sortedArray = Object.values(objectToBeSorted).sort(
          (v1, v2) => v1[name] * 1 - v2[name] * 1
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
        sortedArray = Object.values(objectToBeSorted).sort((v1, v2) => {
          if (v1[name] < v2[name]) {
            return -1;
          }
          if (v1[name] > v2[name]) {
            return 1;
          }
          return 0;
        });
      }
      sortedArray.forEach((item) => {
        outputObj[item._id] = item;
      });

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
    console.log(
      "%c --> %cline:125%cdirection",
      "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
      "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
      "color:#fff;background:rgb(153, 80, 84);padding:3px;border-radius:2px",
      direction
    );
    let sortedGroomedOutput = {};

    if (forNumberSort.includes(sortBy.replace("-reverse", ""))) {
      sortedGroomedOutput = sortNumbers(sortBy, direction);
      console.log(
        "%c --> %cline:136%csortedGroomedOutput",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(254, 67, 101);padding:3px;border-radius:2px",
        sortedGroomedOutput
      );
    } else {
      sortedGroomedOutput = sortWords(sortBy, direction);
    }

    return sortedGroomedOutput;
  };
  return outputFunction;
};

export default useSortList;
