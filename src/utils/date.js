import moment from "moment";

export const getPastDate = ({ days = 1 }) => {
  let today = moment();
  let pastDate = today.subtract(days, "days");
  return pastDate.format("YYYY-MM-DD");
};

export const getSystemStandardDateTimeFormat = ({ date }) => {
  const timePart = date.split("T")[1]
  const isTimeZero = timePart === "00:00:00.000Z";
  const momentDate = moment(date);
  return isTimeZero ? momentDate.format("Do MMM YYYY") : momentDate.format('Do MMM YYYY [at] h:mm A');
};

export const getSystemStandardDateFormat = ({ date }) => {
  const momentDate = moment(date);
  return momentDate.format("Do MMMM, YYYY");
};


export const combineDateAndTime = ({date, time}) => {
  const combinedDateTime = moment(`${date} ${time}`);
  return combinedDateTime.format('YYYY-MM-DD HH:mm:ss');
};


export const formatDateTime = (inputDateTime) => {
  const momentObj = moment(inputDateTime);
  const isTimeZero = momentObj.format("HH:mm:ss.SSS") === "00:00:00.000";
  return isTimeZero ? momentObj.format("YYYY-MM-DD") : momentObj.format("YYYY-MM-DD HH:mm:ss");
}
