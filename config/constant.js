const roles = {
  USER: "USER",
  EXPERT: "EXPERT",
  ADMIN: "ADMIN",
};

const tokenTypes = {
  ACCESS: "access",
  REFRESH: "refresh",
};

const job_request_status = {
  PENDING: "PENDING",
  PROCESSING: "PROCESSING",
  CANCELED: "CANCELED",
  DONE: "DONE",
};

const booking_status = {
  PROCESSING: "PROCESSING",
  CANCELED: "CANCELED",
  DONE: "DONE",
};

const transaction_types = {
  DEPOSIT: "DEPOSIT",
  WITHDRAWAL: "WITHDRAWAL",
  PAYMENT: "PAYMENT",
};

const transaction_status = {
  PROCESSING: "PROCESSING",
  CANCELED: "CANCELED",
  DONE: "DONE",
};

const notification_types = {
  NEW_JOB_REQUEST: "NEW_JOB_REQUEST",
  JOB_REQUEST_ACCEPTED: "JOB_REQUEST_ACCEPTED",
  JOB_REQUEST_CANCELED: "JOB_REQUEST_CANCELED",
  PAYMENT: "PAYMENT",
};

const by_time = {
  day: "DAY",
  month: "MONTH",
  year: "YEAR",
};

export {
  roles,
  tokenTypes,
  booking_status,
  transaction_status,
  transaction_types,
  job_request_status,
  notification_types,
  by_time,
};
