const useSortList = () => {
  const outputFunction = (props) => {
    const { sortMethod, objectToBeSorted } = props;

    if (!objectToBeSorted) return objectToBeSorted;

    const sortBy = sortMethod ? sortMethod : "priority";
    console.log('%c⚪️►►►► %cline:7%csortBy', 'color:#fff;background:#ee6f57;padding:3px;border-radius:2px', 'color:#fff;background:#1f3c88;padding:3px;border-radius:2px', 'color:#fff;background:rgb(3, 38, 58);padding:3px;border-radius:2px', sortBy)

    const sortNumbers = (fieldName, direction) => {
      const outputObj = {};
      let sortedArray = [];
      const name = fieldName.replace("-reverse", "");
      if (direction === "reverse") {
        sortedArray = Object.values(objectToBeSorted).sort(
          (v1, v2) => v1[name] * 1 - v2[name] * 1 
        );
      } else {
        sortedArray = Object.values(objectToBeSorted).sort(
          (v1, v2) => v2[name] * 1 - v1[name] * 1
        );
      }
      sortedArray.forEach((item) => {
        outputObj[item._id] = item;
      });
      return outputObj;
    };

    const sortWords = (fieldName, direction) => {
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
