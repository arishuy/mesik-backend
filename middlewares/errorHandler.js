import httpStatus from "http-status";
import { v4 as uuidv4 } from "uuid";
import logger from "../config/logger.js";

import ApiError from "../utils/ApiError.js";
import { ValidationError } from "yup";

const handler = (err, req, res, next) => {
  const response = {
    statusCode: err.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
    message: err.message || httpStatus[500],
    type: err.type,
    uuid: err.uuid,
  };
  if (!response.uuid) delete response.uuid;

  res.status(response.statusCode).json(response);
};

const converter = (err, req, res, next) => {
  let convertedError = err;
  if (err instanceof ValidationError) {
    let errors;
    if (err.errors) {
      errors = err.errors.map((error) => {
        let s = error.substring(error.lastIndexOf(".") + 1).replace("_", " ");
        return s.charAt(0).toUpperCase() + s.slice(1);
      });
    }
    const message = errors?.join(", ") || "Validations have failed";

    convertedError = new ApiError(
      httpStatus.BAD_REQUEST,
      message,
      "Validation Error"
    );
  } else if (!(err instanceof ApiError)) {
    let uuid = uuidv4();
    logger.error(err);
    convertedError = new ApiError(
      err.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      httpStatus[500],
      "API Error",
      uuid
    );
  }

  return handler(convertedError, req, res, next);
};

const notFound = (req, res, next) => {
  const err = new ApiError(
    httpStatus.NOT_FOUND,
    "This API does not exist",
    "API Not found"
  );

  return handler(err, req, res, next);
};

export default {
  handler,
  converter,
  notFound,
};
