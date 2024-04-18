import multer from "multer";
import ApiError from "../utils/ApiError.js";
import httpStatus from "http-status";

const storage = new multer.memoryStorage();
const uploadImage = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(
        new ApiError(
          httpStatus.BAD_REQUEST,
          "Only .png, .jpg and .jpeg format allowed!"
        )
      );
    }
  },
});

const uploadDocument = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(
        new ApiError(
          httpStatus.BAD_REQUEST,
          "Only .pdf, .jpg and .jpeg format allowed!"
        )
      );
    }
  },
});

export { uploadImage, uploadDocument };
