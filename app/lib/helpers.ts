export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const cleanNumber = (num: string) => {
  // remove all . and , from string
  return Number(num.replace(/\.|,/g, ""));
};
