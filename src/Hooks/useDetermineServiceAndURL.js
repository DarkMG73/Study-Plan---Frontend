const useDetermineServiceAndURL = () => {
  return function (obj, serviceSelectedString, defaultServiceAndURL) {
    const URLObj =
      obj && obj.hasOwnProperty("sourceURLObj") ? obj.sourceURLObj : false;
    const adequatePropsProvided =
      URLObj && URLObj.hasOwnProperty(serviceSelectedString);

    if (!URLObj) return;
    if (
      !adequatePropsProvided &
      URLObj.hasOwnProperty(defaultServiceAndURL.serviceName)
    )
      return {
        serviceName: defaultServiceAndURL.serviceName,
        sourceURL: defaultServiceAndURL.sourceURL,
      };

    if (!URLObj[serviceSelectedString])
      return {
        serviceName: defaultServiceAndURL.serviceName,
        sourceURL: defaultServiceAndURL.sourceURL,
      };

    return {
      serviceName: serviceSelectedString,
      sourceURL: URLObj[serviceSelectedString],
    };
  };
};
export default useDetermineServiceAndURL;
