import moment from "moment";

const getStartOfToday = () => {
  return moment().utc().startOf("day").toDate();
};

export default {
  getStartOfToday,
};
