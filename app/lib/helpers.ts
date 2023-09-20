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

export const cleanNumber = (num: string | number) => {
  // remove all . and , from string
  if (typeof num === "number") {
    return num;
  }

  return Number(num.replace(/\.|,/g, ""));
};

export const cleanObject = (obj: Record<string, any>) =>
  Object.entries(obj).reduce((acc, [key, value]) => {
    if (value != null) {
      acc[key] = value;
    }
    return acc;
  }, {});
