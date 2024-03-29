import { useSelector } from "react-redux";
const useDemoCheck = () => {
  const inDemoMode = useSelector((state) => state.auth.inDemoMode);

  const outputFunction = () => {
    const message =
      'Thanks for poking around the demo!\n\nFeel free to test everything out as much as you want without worries of making any changes. Whenever a button is clicked that would usually make an actual change, this little notice will pop up instead.\n\nHave fun and, when you are ready, head back over to the main page and click "Sign Up" to start your own Study Plan!';
    return inDemoMode ? message : false;
  };
  return outputFunction;
};

export default useDemoCheck;
